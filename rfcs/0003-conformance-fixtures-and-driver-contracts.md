---
number: "0003"
title: Runner-neutral conformance fixtures and driver contracts
status: Proposed
authors:
  - chrisbbreuer
sponsor: chrisbbreuer
created: 2026-07-21
review-start: 2026-07-21
review-end: 2026-08-20
decision-date: null
protocol-version: "1.0-draft"
requires:
  - "0002"
supersedes: []
superseded-by: []
implementation-issues:
  - https://github.com/stacksjs/rfcs/issues/3
  - https://github.com/stacksjs/stacks/issues/2051
---

# Summary

Adopt the JSON fixture corpus, normalization rules, and reusable driver contract
kit under `protocol/1.0-draft` as the executable Protocol 1.0 draft suite.

# Motivation

Language-specific tests cannot demonstrate that the protocol is portable.
Independent implementations need the same ordered inputs and expected observable
outputs without sharing Stacks.js internals.

# Normative specification

Runners MUST validate fixture data, reset deterministic setup state, execute steps
in order, apply only declared normalization, and emit one result for every mapped
requirement. Unsupported, skipped, failed, exception, and experimental remain
distinct and MUST NOT be converted to pass. Driver contracts MUST report their
environment and external prerequisites.

# Profiles and compatibility

Every behavioral requirement in catalog revision 1 is covered. Adding a fixture
without changing existing semantics is compatible. Changing an expected output,
normalization rule, operation meaning, or requirement mapping is behavioral.

# Conformance evidence

Repository tests reject duplicate fixture IDs, unknown requirements,
profile-inconsistent mappings, nondeterministic setup, missing expectations, and
uncovered behavioral requirements.

# Migration and rollback

Runners pin a suite version. A later suite revision must document changed fixture
IDs and expected outputs; old published reports retain their original suite pin.

# Security and privacy

Fixture data contains no real credentials or personal data. Redaction and
cryptographic negative assertions cannot be normalized away.

# Alternatives

Publishing only a TypeScript test package was rejected because it would require
other runtimes to adopt implementation language and module semantics.

# Unresolved questions

Independent runner feedback may split operation names or reveal missing
normalization constraints during the review window.

# Decision record

Proposed on 2026-07-21 for a 30-day public review with RFC 0002 as a dependency.

