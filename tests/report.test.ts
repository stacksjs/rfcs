import { describe, expect, it } from 'bun:test'
import { loadCatalog, loadFixtureCorpus } from '../scripts/protocol'
import { renderReportSummary, validateReport } from '../scripts/report'
import { createUnverifiedReport } from '../scripts/report-example'

const root = new URL('..', import.meta.url).pathname.replace(/\/$/, '')

describe('Conformance report semantics', () => {
  it('accepts the honest unverified example', () => {
    expect(validateReport(createUnverifiedReport(root), loadCatalog(root), loadFixtureCorpus(root))).toEqual([])
  })

  it('rejects a Core claim with skipped requirements', () => {
    const report = createUnverifiedReport(root)
    report.profileClaim = 'Core'
    expect(validateReport(report, loadCatalog(root), loadFixtureCorpus(root)))
      .toContain('Core claim requires CORE-CONV-01 to pass')
  })

  it('rejects duplicate results and passing results without evidence', () => {
    const report = createUnverifiedReport(root)
    report.results[0].status = 'pass'
    report.results.push(report.results[0])
    const errors = validateReport(report, loadCatalog(root), loadFixtureCorpus(root))
    expect(errors).toContain(`${report.results[0].requirementId}: passing result requires evidence URL`)
    expect(errors).toContain(`${report.results[0].requirementId}: duplicate result`)
  })

  it('renders a summary from the same JSON data', () => {
    const summary = renderReportSummary(createUnverifiedReport(root))
    expect(summary).toContain('**Profile claim:** Unverified')
    expect(summary).toContain('| skipped | 47 |')
  })
})

