# Stacks RFCs

This repository is the public decision record for the Stacks Protocol. It owns
protocol governance, compatibility policy, ratification decisions, and accepted
Requests for Comments. The Stacks.js implementation remains in
[`stacksjs/stacks`](https://github.com/stacksjs/stacks); protocol prose and
implementation behavior only become normative through the process here.

## Start here

- [Governance](GOVERNANCE.md) — authority, review, conflicts, and appeals.
- [Compatibility](COMPATIBILITY.md) — change classes, deprecation, and migration.
- [Ratification](RATIFICATION.md) — Protocol 1.0 evidence and approval procedure.
- [Contributing](CONTRIBUTING.md) — how to propose and shepherd an RFC.
- [Maintainers](MAINTAINERS.md) — current decision makers and disclosure rules.
- [Decision index](decisions/README.md) — accepted, rejected, and superseded RFCs.
- [RFC template](rfcs/0000-template.md) — required proposal structure.

## Repository layout

```text
rfcs/          numbered proposals and accepted protocol decisions
decisions/     generated human-readable decision index
fixtures/      runner-neutral protocol fixtures, when promoted here
.github/       contribution and review templates
```

An RFC starts as an issue, is assigned the next four-digit number when a pull
request is opened, and is never renumbered. Observable behavior cannot be changed
by an editorial pull request.

## Licenses

Specification and governance text use
[CC BY 4.0](LICENSE-SPECIFICATION.md). Conformance fixtures and executable example
data use the [MIT License](LICENSE-FIXTURES.md). Source code in other repositories
retains the license declared by that repository.

