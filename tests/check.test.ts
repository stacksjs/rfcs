import { describe, expect, it } from 'bun:test'
import { checkRepository, parseFrontMatter, validateRfc } from '../scripts/check'

const valid = `---
number: "0042"
title: Example decision
status: Draft
authors:
  - example
sponsor: example
created: 2026-07-21
---

# Summary
x
# Motivation
x
# Normative specification
x
# Profiles and compatibility
x
# Conformance evidence
x
# Migration and rollback
x
# Security and privacy
x
# Alternatives
x
# Unresolved questions
x
# Decision record
x
`

describe('RFC repository checks', () => {
  it('parses scalar front matter', () => {
    expect(parseFrontMatter(valid)).toMatchObject({ number: '0042', title: 'Example decision', status: 'Draft' })
  })

  it('accepts a complete numbered RFC', () => {
    expect(validateRfc('0042-example-decision.md', valid)).toEqual([])
  })

  it('rejects mismatched numbers and unknown statuses', () => {
    const invalid = valid.replace('number: "0042"', 'number: "0041"').replace('status: Draft', 'status: Secret')
    expect(validateRfc('0042-example-decision.md', invalid)).toContain("metadata number '0041' does not match filename '0042'")
    expect(validateRfc('0042-example-decision.md', invalid)).toContain("unknown status 'Secret'")
  })

  it('validates the checked-in repository', () => {
    expect(checkRepository(new URL('..', import.meta.url).pathname.replace(/\/$/, ''))).toEqual([])
  })
})

