import type { Catalog, FixtureCorpus, Profile } from './protocol'

export type ResultStatus = 'pass' | 'fail' | 'skipped' | 'unsupported' | 'exception' | 'experimental'

export interface ConformanceReport {
  reportVersion: string
  protocol: { version: string, catalogRevision: number, suiteVersion: string, rfcsRevision: string }
  implementation: { name: string, version: string, revision: string, repository: string, sourceDigest: string }
  execution: {
    startedAt: string
    completedAt: string
    runtime: { name: string, version: string }
    platform: { os: string, architecture: string }
    ci: { provider: string, runUrl: string, artifactUrl: string }
  }
  profileClaim: Profile | null
  results: Array<{ requirementId: string, status: ResultStatus, fixtureId: string | null, evidenceUrl: string | null, durationMs: number, notes?: string }>
  drivers: Array<{ category: string, name: string, version: string, serviceVersion: string | null, topology: string, status: string, evidenceUrl: string | null, prerequisites?: string[] }>
  extensions: Array<{ id: string, status: ResultStatus, evidenceUrl: string | null, notes?: string }>
  exceptions: Array<{ requirementId: string, rfc: string, expiresAt: string, rationale: string }>
  generator: { name: string, version: string, revision: string }
}

const rank: Record<Profile, number> = { Core: 0, Standard: 1, Complete: 2 }

export function validateReport(report: ConformanceReport, catalog: Catalog, corpus: FixtureCorpus, now = new Date()): string[] {
  const errors: string[] = []
  const requirements = new Map(catalog.requirements.map(requirement => [requirement.id, requirement]))
  const fixtures = new Set(corpus.fixtures.map(fixture => fixture.id))
  const results = new Map<string, ConformanceReport['results'][number]>()

  if (report.reportVersion !== '1.0.0-draft.1') errors.push(`unsupported report version '${report.reportVersion}'`)
  if (report.protocol.version !== catalog.protocolVersion) errors.push('protocol version does not match catalog')
  if (report.protocol.catalogRevision !== catalog.catalogRevision) errors.push('catalog revision does not match')
  if (report.protocol.suiteVersion !== corpus.suiteVersion) errors.push('suite version does not match fixture corpus')
  if (!/^[0-9a-f]{40}$/.test(report.protocol.rfcsRevision)) errors.push('RFC revision must be a full commit SHA')
  if (!/^[0-9a-f]{40}$/.test(report.implementation.revision)) errors.push('implementation revision must be a full commit SHA')
  if (!/^sha256:[0-9a-f]{64}$/.test(report.implementation.sourceDigest)) errors.push('source digest must be sha256:<64 lowercase hex>')
  if (Date.parse(report.execution.completedAt) < Date.parse(report.execution.startedAt)) errors.push('execution completed before it started')

  for (const result of report.results) {
    if (results.has(result.requirementId)) errors.push(`${result.requirementId}: duplicate result`)
    results.set(result.requirementId, result)
    if (!requirements.has(result.requirementId)) errors.push(`${result.requirementId}: unknown requirement`)
    if (result.fixtureId && !fixtures.has(result.fixtureId)) errors.push(`${result.requirementId}: unknown fixture ${result.fixtureId}`)
    if (result.status === 'pass' && !result.evidenceUrl) errors.push(`${result.requirementId}: passing result requires evidence URL`)
    if (result.status === 'exception' && !report.exceptions.some(exception => exception.requirementId === result.requirementId))
      errors.push(`${result.requirementId}: exception result has no exception record`)
  }

  for (const requirement of catalog.requirements) {
    if (!results.has(requirement.id)) errors.push(`${requirement.id}: missing result`)
  }

  if (report.profileClaim) {
    for (const requirement of catalog.requirements.filter(requirement => rank[requirement.profile] <= rank[report.profileClaim!])) {
      if (results.get(requirement.id)?.status !== 'pass')
        errors.push(`${report.profileClaim} claim requires ${requirement.id} to pass`)
    }
  }

  for (const exception of report.exceptions) {
    if (!requirements.has(exception.requirementId)) errors.push(`${exception.requirementId}: exception targets unknown requirement`)
    if (Date.parse(exception.expiresAt) <= now.getTime()) errors.push(`${exception.requirementId}: exception is expired`)
    if (!exception.rfc.startsWith('https://')) errors.push(`${exception.requirementId}: exception RFC must be HTTPS`)
  }

  for (const driver of report.drivers) {
    if (driver.status === 'supported' && !driver.evidenceUrl) errors.push(`${driver.category}/${driver.name}: supported driver requires evidence URL`)
    if (driver.status === 'supported' && (!driver.version || !driver.topology)) errors.push(`${driver.category}/${driver.name}: supported driver requires version and topology`)
  }

  return errors
}

export function renderReportSummary(report: ConformanceReport): string {
  const counts = new Map<ResultStatus, number>()
  for (const result of report.results) counts.set(result.status, (counts.get(result.status) || 0) + 1)
  const resultRows = [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([status, count]) => `| ${status} | ${count} |`).join('\n')
  const driverRows = report.drivers.map(driver => `| ${driver.category} | ${driver.name} | ${driver.status} | ${driver.topology} | ${driver.evidenceUrl ? `[evidence](${driver.evidenceUrl})` : '—'} |`).join('\n') || '| — | — | — | — | — |'

  return `# ${report.implementation.name} conformance report

**Profile claim:** ${report.profileClaim || 'Unverified'}  
**Implementation:** \`${report.implementation.revision}\` (${report.implementation.version})  
**Protocol:** ${report.protocol.version}, catalog ${report.protocol.catalogRevision}, suite ${report.protocol.suiteVersion}  
**Runtime/platform:** ${report.execution.runtime.name} ${report.execution.runtime.version} on ${report.execution.platform.os}/${report.execution.platform.architecture}  
**CI:** [run](${report.execution.ci.runUrl}) · [artifact](${report.execution.ci.artifactUrl})

## Results

| Status | Count |
| --- | ---: |
${resultRows}

## Drivers

| Category | Driver | Status | Topology | Evidence |
| --- | --- | --- | --- | --- |
${driverRows}
`
}

