# Stacks Protocol Governance

## Scope and principles

This process governs the observable, language-neutral contracts called the
Stacks Protocol. It does not govern day-to-day implementation choices that
preserve those contracts.

Protocol decisions are public, attributable, reversible through a later RFC,
and based on interoperable behavior and evidence. Package count, popularity,
implementation convenience, and undocumented maintainer consensus are not
protocol evidence.

## Change paths

| Class | Examples | Required path | Minimum review |
| --- | --- | --- | --- |
| Editorial | spelling, links, non-normative clarification | Pull request | 3 days |
| Compatible | additive optional field, new fixture with existing semantics | Issue + pull request | 7 days |
| Behavioral | new or changed MUST/SHOULD, result semantics, profile membership | RFC | 14 days |
| Breaking | removed behavior, incompatible envelope/schema, changed requirement meaning | RFC + protocol-version decision + migration plan | 30 days |
| Ratification | freezing a protocol version or profile | Ratification proposal and evidence bundle | 30 days |

An editorial or compatible change is reclassified immediately if a reviewer
shows that two conforming implementations could observe different behavior.

## RFC lifecycle

1. **Draft** — an issue establishes the problem, scope, alternatives, and owner.
2. **Proposed** — a numbered RFC pull request is complete and enters its review window.
3. **Final** — the review window ended and blocking questions have written dispositions.
4. **Accepted** or **Rejected** — maintainers record the decision and rationale.
5. **Implemented** — linked implementations and conformance evidence satisfy the RFC.
6. **Superseded** — a later accepted RFC replaces some or all of the decision.
7. **Withdrawn** — the author stops the proposal before a decision.

Accepted and rejected RFCs are immutable except for clearly marked errata and
link repairs. Semantic changes require a superseding RFC.

## Decision rules

- Editorial changes require one non-author maintainer approval when one is available.
- Compatible changes require a simple majority of non-conflicted maintainers.
- Behavioral changes require two-thirds of non-conflicted maintainers.
- Breaking and ratification decisions require two-thirds approval, no unresolved
  security objection, a migration plan, and the extended rules in
  [MAINTAINERS.md](MAINTAINERS.md) while the maintainer group has fewer than three members.
- Silence is not approval. Every deciding maintainer records approve, reject, or abstain.
- The proposal author may be a maintainer but may not be the sole reviewer once a
  second maintainer exists.

The exact vote, abstentions, conflict disclosures, minority rationale, and
evidence links are committed with the decision.

## Quorum and stalled decisions

Quorum is two-thirds of non-conflicted maintainers, rounded up, with at least one
vote while the project has one maintainer and at least two votes thereafter. If
conflicts make quorum impossible, the proposal remains Final and the maintainers
must nominate temporary reviewers through a 14-day public issue.

A proposal with no substantive update for 90 days may be marked Dormant. It may
return to Draft without losing its number.

## Conflicts and conduct

Reviewers discuss observable contracts and evidence, not individuals. The
project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
Harassment, retaliation, undisclosed conflicts, or attempts to bypass public
review are grounds to pause a decision.

## Appeals

An appeal is a new issue filed within 30 days of a decision. It must identify a
process violation, material evidence that was unavailable, or a concrete
interoperability/security defect; disagreement alone is insufficient.

1. The original deciding maintainers publish the record within 7 days.
2. Non-conflicted maintainers appoint an appeal panel of at least two people,
   including one person who did not approve the original decision when available.
3. The appeal remains open for at least 14 days.
4. The panel may uphold, remand, or require a superseding RFC. It cannot silently
   rewrite an accepted RFC.

When no independent panel can be formed, the decision is stayed until one can be
formed, except for a documented emergency security mitigation.

## Emergency security changes

A maintainer may embargo exploitable details and land a minimal mitigation. The
public record must be opened as soon as disclosure is safe and no later than 30
days after release unless a written extension explains continuing risk. Any
lasting protocol behavior change still requires an RFC.

