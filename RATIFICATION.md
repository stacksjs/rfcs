# Protocol Ratification

Ratification freezes a named protocol version; it is not a general endorsement of
the Stacks.js implementation or every optional extension.

## Required evidence bundle

- normative requirement catalog with unique, validated IDs;
- profile and extension matrices with inheritance semantics;
- runner-neutral fixture revision and licenses;
- versioned conformance-report JSON Schema;
- at least one schema-valid reference implementation report;
- one independent runner or implementation report and ambiguity log;
- compatibility and migration review for all behavioral changes since draft;
- driver, security, provenance, and desktop evidence matching published claims;
- open objection register with a disposition for every blocking objection; and
- exact commits, CI runs, artifact digests, and tool/runtime versions.

## Procedure

1. Open a ratification issue and evidence-manifest pull request.
2. Validate the bundle mechanically and publish immutable artifact digests.
3. Hold a minimum 30-day public review.
4. Resolve or explicitly reject every blocking objection with rationale.
5. Record each non-conflicted maintainer vote.
6. Require two-thirds approval and the quorum rules in [GOVERNANCE.md](GOVERNANCE.md).
7. Tag the accepted repository revision and publish the decision record.

Failed or skipped baseline requirements prevent ratifying a claimed profile.
Experimental results and explicitly optional extensions do not block a lower
profile when the report schema permits them.

## Reopening

New interoperability or security evidence may trigger an appeal or erratum. A
change to frozen behavior requires a superseding RFC and protocol-version decision.

