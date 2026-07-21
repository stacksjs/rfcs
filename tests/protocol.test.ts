import { describe, expect, it } from 'bun:test'
import { loadCatalog, renderCatalog, validateCatalog } from '../scripts/protocol'

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
})

