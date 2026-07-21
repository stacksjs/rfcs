---
number: "0001"
title: Stacks Protocol governance and change control
status: Accepted
authors:
  - chrisbbreuer
sponsor: chrisbbreuer
created: 2026-07-21
review-start: 2026-07-21
review-end: 2026-07-21
decision-date: 2026-07-21
protocol-version: "1.0-draft"
requires: []
supersedes: []
superseded-by: []
implementation-issues:
  - https://github.com/stacksjs/rfcs/issues/1
  - https://github.com/stacksjs/stacks/issues/2053
---

# Summary

Adopt the public governance, compatibility, ratification, licensing, and RFC
process in this repository as the decision system for the Stacks Protocol.

# Motivation

Protocol 1.0 cannot be ratified through undocumented maintainer consensus. A
contributor needs a complete path from problem statement through review, appeal,
implementation evidence, and an attributable decision.

# Normative specification

The repository documents named in the Summary MUST govern protocol decisions.
Behavioral and breaking changes MUST use numbered RFCs. Editorial changes MUST
NOT alter observable behavior. Ratification MUST follow `RATIFICATION.md`.

# Profiles and compatibility

This RFC establishes process and does not change runtime profiles. Future changes
are classified by `COMPATIBILITY.md`.

# Conformance evidence

Repository checks validate RFC metadata and decision indexing. Implementation
evidence remains tracked by the Protocol 1.0 program.

# Migration and rollback

Open protocol decisions move to this repository. Existing implementation issues
remain valid and link to their governing RFC when one is required.

# Security and privacy

Security embargoes are permitted only for active exploit details and must produce
a public record on the timetable in `GOVERNANCE.md`.

# Alternatives

Keeping decisions solely in the implementation repository was rejected because
it conflates one implementation's APIs with language-neutral protocol contracts.

# Unresolved questions

The maintainer group should grow beyond its inaugural member before Protocol 1.0
ratification. The published small-group safeguards apply until then.

# Decision record

Accepted as the repository bootstrap by the inaugural maintainer. Because no
prior governance process existed, this bootstrap decision is explicitly subject
to the normal appeal and superseding-RFC paths it creates.

