---
number: "0006"
title: Classify every SHOULD and MAY statement in Protocol 1.0 Part I
status: Draft
authors:
  - chrisbbreuer
sponsor: unassigned
created: 2026-10-07
review-start: null
review-end: null
decision-date: null
protocol-version: "1.0-draft"
requires:
  - "0002"
  - "0004"
supersedes: []
superseded-by: []
implementation-issues:
  - https://github.com/stacksjs/stacks/issues/2050
---

# Summary

Every SHOULD, SHOULD NOT and MAY in Part I of the whitepaper becomes either a
catalog requirement with a stable ID or an entry in a new `informative` list,
each with a written reason. Six become SHOULD requirements, one is raised to
the MUST that RFC 0004's report schema already enforces, and sixteen are
recorded as informative. A SHOULD result is reported but never gates a profile.

# Motivation

Catalog revision 1 carries 47 requirements, all MUST or MUST NOT. Part I uses
the RFC 2119 keywords 90 times: 55 MUST, 12 MUST NOT, 10 SHOULD, 1 SHOULD NOT
and 12 MAY (white-paper `bun run normative`, which counts every keyword on a
line since white-paper 086a4bf; it previously counted only the first and
reported 65 uses and no SHOULD NOT). The 23 SHOULD/SHOULD NOT/MAY uses are
neither catalogued nor marked informative, so the first acceptance criterion of
stacksjs/stacks#2050 - "every normative statement is mapped to a stable ID or
made informative" - cannot be met, and two conforming implementations can read
the same SHOULD differently.

One of them also contradicts the machine contract: Part I §16 says reports
SHOULD link to CI logs and the exact suite revision, while RFC 0004's report
schema already requires `execution.ci.runUrl`, `protocol.suiteVersion` and
`protocol.rfcsRevision`.

# Normative specification

## Result semantics for SHOULD

A SHOULD or SHOULD NOT requirement is run and reported like any other, with the
same `pass`, `fail`, `skipped`, `unsupported`, `exception` and `experimental`
results. Its result never gates a profile claim: a profile is satisfied by its
MUST and MUST NOT requirements alone. A report MUST still list every SHOULD
requirement of the claimed profile with its result, so an unmet
recommendation is visible rather than absent. `unsupported` is the expected
result for a statically-typed-host SHOULD in a dynamic host, with its reason.

## New requirements

| ID | Profile | Level | Area | Evidence | Statement | Part I |
| --- | --- | --- | --- | --- | --- | --- |
| `CORE-ROUTE-03` | Core | SHOULD | routing | behavior | Resource-route expansion and route parameter constraints are supported. | §4.1, line 412 |
| `STD-GEN-01` | Standard | SHOULD | generation | inspection | A typed or schema-bearing Model definition drives at least one related artifact: migrations, validation, types, or an API description. | §2.2, line 290 |
| `STD-TYPE-02` | Standard | SHOULD | types | inspection | In a statically typed host, a validation schema exposes an inferred type. | §4.3, line 448 |
| `STD-TYPE-03` | Standard | SHOULD | types | inspection | In a statically typed host, configuration is checked against declared types. | §4.5, line 475 |
| `STD-API-02` | Standard | SHOULD | api | behavior | A machine-readable description such as OpenAPI is generated from registered routes and schemas. | §4.8, line 516 |
| `STD-QUEUE-02` | Standard | SHOULD | queue | behavior | Delayed dispatch and recurring schedules are supported. | §5.1, line 524 |

`STD-API-02` sits below `COMP-API-01`, which already requires a generated
description, when there is one, to be fresh and non-placeholder at Complete.
Standard recommends generating one; Complete requires what is generated to be
real.

## Raised to MUST

| ID | Profile | Level | Area | Evidence | Statement | Part I |
| --- | --- | --- | --- | --- | --- | --- |
| `CORE-REPORT-01` | Core | MUST | reporting | inspection | A conformance report links its CI run and names the exact suite and RFC revisions it ran. | §16, line 1412 |

This adds no obligation: RFC 0004's schema already rejects a report without
those fields. The prose is aligned with the schema, and §16's bullet changes
from SHOULD to MUST. A `reporting` source section pointing at §16 is added to
`sourceSections`.

## Informative

Each is recorded in a new `informative` array in the catalog, with the Part I
line, the keyword, and the reason. Where a statement carries a condition, the
condition's requirement is named, so the permission is informative and the
constraint is not.

| Part I | Keyword | Statement | Why informative |
| --- | --- | --- | --- |
| §2.1, line 259 | MAY | A Model MAY declare capabilities such as generated CRUD routes, search indexing, ... | Defines what a Model can contain; constrains nothing. |
| §2.1, line 265 | MAY | A View MAY contain presentation logic | Defines what a View can contain. |
| §2.1, line 265 | SHOULD NOT | A View SHOULD NOT own authorization, persistence, or multi-step business rules | Architecture guidance an outside observer cannot test. Its observable part, that rendering preserves authorization boundaries, is `COMP-VIEW-01`. |
| §2.1, line 271 | MAY | An implementation MAY support inline handlers and controllers | A permission. |
| §2.1, line 271 | SHOULD | Behavior reused across transports SHOULD live in an Action | Placement guidance; the observable part is `CORE-MVA-01`. |
| §3.1, line 329 | MAY | Language-idiomatic casing or extensions MAY be used | A permission; the documented mapping it requires is `CORE-CONV-01`. |
| §3.1, line 353 | MAY | Controllers, resources, policies, broadcasts and notifications MAY be additional roles | Defines optional roles. |
| §3.3, line 368 | MAY | An implementation MAY ship default application behavior | A permission; the precedence it requires is `CORE-CONV-02`. |
| §3.4, line 389 | MAY | Defaults MAY be overridden explicitly | A permission; override precedence is `CORE-CONFIG-01`. |
| §4.1, line 412 | MAY | Action references MAY be strings, functions, objects or symbols | A permission; deterministic resolution is `CORE-ROUTE-01` and `CORE-CONV-03`. |
| §4.2, line 433 | MAY | An implementation MAY combine internal phases | A permission; the preserved guarantees are `CORE-LIFE-01`. |
| §5.3, line 542 | MAY | One notification channel MAY be database storage | Clarifies `COMP-NOTIFY-01`. |
| §5.7, line 578 | MAY | Shape evidence MAY use the listed forms | Lists acceptable evidence for `STD-TYPE-01`. |
| §5.8, line 591 | MAY | An implementation MAY report extension badges | Badges are governed by the catalog's `extensions` block. |
| §15, line 1334 | SHOULD | The conformance suite SHOULD encode at least the following requirements | An obligation on the protocol project, not on implementations. Met by the catalog. |
| §15, line 1366 | SHOULD | The protocol repository SHOULD publish fixtures, expected outputs and a runner-neutral description | An obligation on the protocol project. Met by stacksjs/protocol. |

That is 16 keyword uses on 14 lines: lines 265 and 271 each permit one thing
and recommend another in the same sentence.

## Traceability both ways

Each catalog requirement gains an optional `sourceLines` array, and each
`informative` entry carries its line. White-paper's `normative:check` then
fails unless every keyword use in Part I is accounted for by exactly one
requirement or informative entry, replacing the bare count it checks today.

# Profiles and compatibility

Behavioral, under RFC 0001: it adds SHOULD requirements and defines their
result semantics. It adds no MUST that a conforming implementation can fail,
since `CORE-REPORT-01` restates the report schema. No existing profile claim
changes.

# Conformance evidence

- Fixtures for `CORE-ROUTE-03`, `STD-API-02` and `STD-QUEUE-02`, which are
  behavioral. The others are inspection, reported from the implementation's
  evidence.
- Stacks evidence: resource routes and parameter constraints in its router;
  models driving migrations, validation and the OpenAPI document; `buddy
  generate:openapi`; typed config; delayed and scheduled jobs.
- The catalog schema gains `informative` and `sourceLines`, and `check`
  validates that informative lines and requirement source lines do not overlap.

# Migration and rollback

Existing reports stay valid: SHOULD results are new entries, and the report
schema is unchanged. An implementation adds the new SHOULD results the next
time it runs the suite. Rolling back removes the seven entries and the
`informative` array with no effect on any profile claim.

# Security and privacy

None of the new requirements touch a trust boundary. Classifying a SHOULD NOT
as informative does not weaken security: the observable authorization
boundary it describes is already the MUST `COMP-VIEW-01`.

# Alternatives

- **Every SHOULD becomes a requirement.** Lines 1334 and 1366 bind the protocol
  project, not implementations, and lines 265 and 271 cannot be observed from
  outside an implementation.
- **SHOULD failures gate profiles.** That would make a SHOULD a MUST in all but
  name.
- **Leave SHOULD and MAY uncatalogued.** That fails #2050's first acceptance
  criterion, and leaves the §16 prose contradicting the report schema.

# Unresolved questions

- Whether `STD-GEN-01` belongs at Core. A dynamic host may have no
  schema-bearing Model at all, which argues for Standard.
- Whether the 55 MUST and 12 MUST NOT uses should get the same line-level
  traceability in this RFC or a follow-up. 67 keyword uses map onto 47
  requirements, because a list's lead-in MUST covers its items; `sourceLines`
  makes that explicit.

# Decision record

Not yet reviewed.
