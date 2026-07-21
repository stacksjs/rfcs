import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { loadCatalog, loadFixtureCorpus, renderCatalog, validateCatalog, validateFixtures } from '../scripts/protocol'

const root = new URL('..', import.meta.url).pathname.replace(/\/$/, '')

describe('Protocol requirement catalog', () => {
  it('has unique, profile-correct, source-linked requirement IDs', () => {
    expect(validateCatalog(loadCatalog(root))).toEqual([])
  })

  it('renders every requirement and extension into the matrix', () => {
    const catalog = loadCatalog(root)
    const rendered = renderCatalog(catalog)
    for (const requirement of catalog.requirements) expect(rendered).toContain(requirement.id)
    for (const extension of catalog.extensions) expect(rendered).toContain(extension.id)
  })

  it('rejects duplicate requirement IDs', () => {
    const catalog = structuredClone(loadCatalog(root))
    catalog.requirements.push(catalog.requirements[0])
    expect(validateCatalog(catalog)).toContain(`${catalog.requirements[0].id}: duplicate requirement ID`)
  })

  it('covers every behavioral requirement with deterministic fixtures', () => {
    const catalog = loadCatalog(root)
    const contracts = JSON.parse(readFileSync(`${root}/protocol/1.0-draft/driver-contracts.json`, 'utf8'))
    expect(validateFixtures(catalog, loadFixtureCorpus(root), contracts)).toEqual([])
  })

  it('rejects an unknown requirement in a fixture', () => {
    const catalog = loadCatalog(root)
    const corpus = structuredClone(loadFixtureCorpus(root))
    corpus.fixtures[0].requirements.push('CORE-UNKNOWN-99')
    const contracts = JSON.parse(readFileSync(`${root}/protocol/1.0-draft/driver-contracts.json`, 'utf8'))
    expect(validateFixtures(catalog, corpus, contracts)).toContain(`${corpus.fixtures[0].id}: unknown requirement CORE-UNKNOWN-99`)
  })
})
