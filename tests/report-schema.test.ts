import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { validateReportSchema } from '../scripts/validate-report'
import { createUnverifiedReport } from '../scripts/report-example'

const root = new URL('..', import.meta.url).pathname.replace(/\/$/, '')
const schema = JSON.parse(readFileSync(`${root}/protocol/1.0-draft/schemas/conformance-report.schema.json`, 'utf8'))

describe('Conformance report JSON Schema', () => {
  it('accepts the generated unverified report', () => {
    expect(validateReportSchema(createUnverifiedReport(root), schema)).toEqual([])
  })

  it('rejects missing source provenance', () => {
    const report = createUnverifiedReport(root) as any
    delete report.implementation.sourceDigest
    expect(validateReportSchema(report, schema).join('\n')).toContain("must have required property 'sourceDigest'")
  })
})

