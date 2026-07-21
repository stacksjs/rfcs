import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, normalize, resolve } from 'node:path'

export const RFC_STATUSES = new Set([
  'Draft',
  'Proposed',
  'Final',
  'Accepted',
  'Implemented',
  'Rejected',
  'Withdrawn',
  'Dormant',
  'Superseded',
])

const DECISION_STATUSES = new Set(['Accepted', 'Implemented', 'Rejected', 'Superseded'])
const REQUIRED_METADATA = ['number', 'title', 'status', 'authors', 'sponsor', 'created']

export interface RfcMetadata {
  number?: string
  title?: string
  status?: string
  [key: string]: string | undefined
}

export function parseFrontMatter(source: string): RfcMetadata {
  if (!source.startsWith('---\n')) return {}
  const end = source.indexOf('\n---\n', 4)
  if (end === -1) return {}

  const metadata: RfcMetadata = {}
  for (const line of source.slice(4, end).split('\n')) {
    const match = line.match(/^([a-z][a-z-]*):\s*(.*)$/)
    if (!match) continue
    const rawValue = match[2].trim()
    const value = (rawValue || (match[1] === 'authors' ? '[list]' : '')).replace(/^(["'])(.*)\1$/, '$2')
    metadata[match[1]] = value
  }
  return metadata
}

export function validateRfc(filename: string, source: string): string[] {
  const errors: string[] = []
  const match = filename.match(/^(\d{4})-[a-z0-9][a-z0-9-]*\.md$/)
  if (!match) errors.push('filename must be NNNN-lowercase-kebab-case.md')

  const metadata = parseFrontMatter(source)
  for (const key of REQUIRED_METADATA) {
    if (!metadata[key]) errors.push(`missing metadata: ${key}`)
  }
  if (match && metadata.number !== match[1])
    errors.push(`metadata number '${metadata.number || ''}' does not match filename '${match[1]}'`)
  if (metadata.status && !RFC_STATUSES.has(metadata.status))
    errors.push(`unknown status '${metadata.status}'`)

  for (const heading of [
    '# Summary',
    '# Motivation',
    '# Normative specification',
    '# Profiles and compatibility',
    '# Conformance evidence',
    '# Migration and rollback',
    '# Security and privacy',
    '# Alternatives',
    '# Unresolved questions',
    '# Decision record',
  ]) {
    if (!source.includes(`\n${heading}\n`)) errors.push(`missing section: ${heading}`)
  }

  return errors
}

function markdownFiles(root: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue
    const path = join(root, entry.name)
    if (entry.isDirectory()) files.push(...markdownFiles(path))
    else if (entry.name.endsWith('.md')) files.push(path)
  }
  return files
}

function validateLocalLinks(root: string, file: string, source: string): string[] {
  const errors: string[] = []
  const links = source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)
  for (const [, rawTarget] of links) {
    const target = rawTarget.trim().split('#', 1)[0]
    if (!target || /^(https?:|mailto:)/.test(target)) continue
    const resolved = normalize(resolve(dirname(file), decodeURIComponent(target)))
    if (!resolved.startsWith(root) || !existsSync(resolved))
      errors.push(`${file.slice(root.length + 1)}: broken local link '${rawTarget}'`)
  }
  return errors
}

export function checkRepository(root: string): string[] {
  const errors: string[] = []
  const seen = new Set<string>()
  const decisions = readFileSync(join(root, 'decisions/README.md'), 'utf8')
  const rfcDir = join(root, 'rfcs')

  for (const filename of readdirSync(rfcDir).filter(name => name !== '0000-template.md' && name.endsWith('.md'))) {
    const source = readFileSync(join(rfcDir, filename), 'utf8')
    const metadata = parseFrontMatter(source)
    for (const error of validateRfc(filename, source)) errors.push(`rfcs/${filename}: ${error}`)
    if (metadata.number) {
      if (seen.has(metadata.number)) errors.push(`duplicate RFC number: ${metadata.number}`)
      seen.add(metadata.number)
      if (metadata.status && DECISION_STATUSES.has(metadata.status) && !decisions.includes(`[${metadata.number}]`))
        errors.push(`rfcs/${filename}: decided RFC missing from decision index`)
    }
  }

  for (const file of markdownFiles(root)) {
    const source = readFileSync(file, 'utf8')
    errors.push(...validateLocalLinks(root, file, source))
  }

  if (!readFileSync(join(root, 'LICENSE-SPECIFICATION.md'), 'utf8').includes('SPDX-License-Identifier: CC-BY-4.0'))
    errors.push('specification license must declare CC-BY-4.0')
  if (!readFileSync(join(root, 'LICENSE-FIXTURES.md'), 'utf8').includes('SPDX-License-Identifier: MIT'))
    errors.push('fixture license must declare MIT')

  return errors
}

if (import.meta.main) {
  const root = resolve(import.meta.dir, '..')
  const errors = checkRepository(root)
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error}`)
    process.exit(1)
  }
  console.log(`RFC repository checks passed (${readdirSync(join(root, 'rfcs')).length - 1} numbered RFC)`)
}
