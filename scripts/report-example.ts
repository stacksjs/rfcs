import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadCatalog, loadFixtureCorpus } from './protocol'
import { type ConformanceReport, renderReportSummary, validateReport } from './report'

export function createUnverifiedReport(root: string): ConformanceReport {
  const catalog = loadCatalog(root)
  const corpus = loadFixtureCorpus(root)
  const fixtureFor = new Map<string, string>()
  for (const fixture of corpus.fixtures) {
    for (const requirement of fixture.requirements) {
      if (!fixtureFor.has(requirement)) fixtureFor.set(requirement, fixture.id)
    }
  }
  const zeroRevision = '0'.repeat(40)

  return {
    reportVersion: '1.0.0-draft.1',
    protocol: {
      version: catalog.protocolVersion,
      catalogRevision: catalog.catalogRevision,
      suiteVersion: corpus.suiteVersion,
      rfcsRevision: zeroRevision,
    },
    implementation: {
      name: 'Example implementation',
      version: '0.0.0-unverified',
      revision: zeroRevision,
      repository: 'https://example.com/implementation',
      sourceDigest: `sha256:${'0'.repeat(64)}`,
    },
    execution: {
      startedAt: '2026-01-01T00:00:00.000Z',
      completedAt: '2026-01-01T00:00:01.000Z',
      runtime: { name: 'example-runtime', version: '0.0.0' },
      platform: { os: 'example-os', architecture: 'example-arch' },
      ci: {
        provider: 'example-ci',
        runUrl: 'https://example.com/ci/run/1',
        artifactUrl: 'https://example.com/ci/run/1/report.json',
      },
    },
    profileClaim: null,
    results: catalog.requirements.map(requirement => ({
      requirementId: requirement.id,
      status: 'skipped',
      fixtureId: fixtureFor.get(requirement.id) || null,
      evidenceUrl: null,
      durationMs: 0,
      notes: 'Example only; no implementation was executed.',
    })),
    drivers: ['database', 'queue', 'cache', 'storage', 'mail', 'realtime', 'deploy'].map(category => ({
      category,
      name: 'none',
      version: '0.0.0',
      serviceVersion: null,
      topology: 'not configured',
      status: 'unsupported',
      evidenceUrl: null,
      prerequisites: [],
    })),
    extensions: catalog.extensions.map(extension => ({
      id: extension.id,
      status: 'unsupported',
      evidenceUrl: null,
      notes: 'Not evaluated by the example.',
    })),
    exceptions: [],
    generator: { name: '@stacksjs/rfcs-example', version: '1.0.0-draft.1', revision: zeroRevision },
  }
}

if (import.meta.main) {
  const root = resolve(import.meta.dir, '..')
  const report = createUnverifiedReport(root)
  const errors = validateReport(report, loadCatalog(root), loadFixtureCorpus(root))
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error}`)
    process.exit(1)
  }
  const json = `${JSON.stringify(report, null, 2)}\n`
  const markdown = renderReportSummary(report)
  const jsonPath = resolve(root, 'protocol/1.0-draft/examples/unverified-report.json')
  const markdownPath = resolve(root, 'protocol/1.0-draft/examples/unverified-report.md')

  if (process.argv.includes('--write')) {
    writeFileSync(jsonPath, json)
    writeFileSync(markdownPath, markdown)
    console.log('Wrote unverified conformance-report examples')
  }
  else if (process.argv.includes('--check')) {
    if (readFileSync(jsonPath, 'utf8') !== json || readFileSync(markdownPath, 'utf8') !== markdown) {
      console.error('error: conformance report examples are stale; run bun run generate')
      process.exit(1)
    }
    console.log('Conformance report schema and example checks passed')
  }
}

