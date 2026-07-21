import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import { loadCatalog, loadFixtureCorpus } from './protocol'
import { type ConformanceReport, renderReportSummary, validateReport } from './report'

export function validateReportSchema(report: unknown, schema: object): string[] {
  const ajv = new Ajv2020({ allErrors: true, strict: false })
  addFormats(ajv)
  const validate = ajv.compile(schema)
  if (validate(report)) return []
  return (validate.errors || []).map(error => `${error.instancePath || '/'} ${error.message || 'is invalid'}`)
}

if (import.meta.main) {
  const root = resolve(import.meta.dir, '..')
  const reportPath = process.argv[2]
  if (!reportPath || reportPath.startsWith('--')) {
    console.error('usage: bun run validate:report <report.json> [--summary <summary.md>]')
    process.exit(2)
  }

  const report = JSON.parse(readFileSync(resolve(reportPath), 'utf8')) as ConformanceReport
  const schema = JSON.parse(readFileSync(resolve(root, 'protocol/1.0-draft/schemas/conformance-report.schema.json'), 'utf8'))
  const errors = [
    ...validateReportSchema(report, schema),
    ...validateReport(report, loadCatalog(root), loadFixtureCorpus(root)),
  ]
  if (errors.length > 0) {
    for (const error of errors) console.error(`error: ${error}`)
    process.exit(1)
  }

  const summaryIndex = process.argv.indexOf('--summary')
  if (summaryIndex !== -1) {
    const summaryPath = process.argv[summaryIndex + 1]
    if (!summaryPath) {
      console.error('error: --summary requires a path')
      process.exit(2)
    }
    writeFileSync(resolve(summaryPath), renderReportSummary(report))
  }
  console.log(`Valid conformance report: ${report.implementation.name} (${report.profileClaim || 'unverified'})`)
}

