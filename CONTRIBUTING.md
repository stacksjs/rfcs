# Contributing an RFC

1. Search existing issues and RFCs.
2. Open an issue using the RFC template. State the observable problem and link
   implementation evidence; do not begin with a preferred API alone.
3. Find a maintainer sponsor. Sponsorship means the question deserves review, not approval.
4. Copy `rfcs/0000-template.md` to the next unclaimed four-digit number.
5. Open a pull request and keep its status `Draft` until every required section is complete.
6. The sponsor changes status to `Proposed` and records the review start/end dates.
7. Address objections in the RFC's decision log. Do not resolve threads by deleting rationale.
8. After a decision, update `decisions/README.md` in the same commit.

Normative terms MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY follow RFC 2119/8174
only when capitalized. Every normative statement names stable requirement IDs or
defines how existing IDs change.

Pull requests must pass link, metadata, numbering, status, and license checks.
Implementation pull requests belong in their implementation repository and link
back to the accepted RFC.

