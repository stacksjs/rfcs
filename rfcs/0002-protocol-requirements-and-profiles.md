---
number: "0002"
title: Protocol 1.0 requirements, profiles, and result semantics
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
  - "0001"
supersedes: []
superseded-by: []
implementation-issues:
  - https://github.com/stacksjs/rfcs/issues/2
  - https://github.com/stacksjs/stacks/issues/2050
---

# Summary

Freeze the first complete machine-readable catalog for Core, Standard, Complete,
and independent extension evidence in Protocol 1.0 draft.

# Motivation

Normative prose without unique identifiers cannot be executed, reported, or
migrated reliably. Profiles also need explicit inheritance and result semantics
so a skipped or experimental result cannot be presented as conformance.

# Normative specification

`protocol/1.0-draft/catalog.json` is the proposed normative catalog. IDs MUST be
unique and permanent. Standard inherits every Core requirement; Complete inherits
every Standard and Core requirement. Pass is the only result that satisfies a
required profile entry. Exceptions, unsupported, skipped, failed, and experimental
results MUST NOT satisfy a profile claim.

# Profiles and compatibility

Security requirements are a baseline in Core rather than a separate badge.
Extension badges are independent and require their own passing evidence. The
catalog's compatibility block and `COMPATIBILITY.md` govern directories, error
envelopes, driver contracts, and generated schemas.

# Conformance evidence

Repository checks validate ID uniqueness, schema shape, profile prefixes,
inheritance order, result vocabulary, and generated matrix freshness. RFC 0003
will bind behavioral requirements to runner-neutral fixtures.

# Migration and rollback

Existing whitepaper IDs retain their meaning. Newly identified statements gain
IDs. Any later meaning change requires a superseding behavioral RFC; IDs are
never recycled.

# Security and privacy

Security is non-optional for all profiles. Reports must state trust boundaries
and cannot substitute configuration presence for tested behavior.

# Alternatives

A security certification layer was rejected for 1.0 because it would permit a
profile claim without the minimum query, rendering, CSRF, encryption, password,
comparison, and trust-boundary behavior.

# Unresolved questions

Reviewers should confirm whether any normative whitepaper sentence is absent or
whether a requirement should be split before the review window closes.

# Decision record

Proposed on 2026-07-21 for a 30-day public review under the small-maintainer
safeguard. Votes and objection dispositions will be recorded after 2026-08-20.

