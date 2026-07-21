---
number: "0004"
title: Protocol 1.0 conformance report format
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
  - "0003"
supersedes: []
superseded-by: []
implementation-issues:
  - https://github.com/stacksjs/rfcs/issues/4
  - https://github.com/stacksjs/stacks/issues/2052
---

# Summary

Adopt the versioned JSON Schema and semantic validation rules under
`protocol/1.0-draft` for attributable implementation conformance reports.

# Motivation

A profile label without exact source, suite, runtime, platform, driver, and CI
evidence is not reproducible. JSON Schema alone also cannot enforce inheritance
or exact requirement coverage.

# Normative specification

A report MUST contain exactly one result for every catalog requirement. Only
pass satisfies a claimed profile. Passing results and supported drivers MUST link
to evidence. Revisions MUST be immutable full commit identifiers. Exceptions
MUST name an unexpired public RFC and do not satisfy profiles.

# Profiles and compatibility

Core, Standard, and Complete claims include all inherited requirements. Adding an
optional report field is compatible; changing required metadata, status meaning,
or profile validation is behavioral and requires an RFC.

# Conformance evidence

The repository publishes schema, semantic validator, negative tests, an honest
unverified example, and a Markdown summary renderer driven by the same JSON.

# Migration and rollback

Report consumers pin `reportVersion`. A new incompatible format receives a new
version and keeps old schema/validator artifacts addressable.

# Security and privacy

Reports link evidence rather than embedding credentials, environment values, or
personal data. Source and artifact digests use SHA-256; signing/attestation is an
implementation CI responsibility recorded by its artifact provider.

# Alternatives

A badge-only format and a schema without semantic validation were rejected
because both permit invalid higher-profile claims.

# Unresolved questions

Independent runner experience may require additional platform or compiler fields
before the review window closes.

# Decision record

Proposed on 2026-07-21 for a 30-day public review with RFCs 0002 and 0003 as dependencies.

