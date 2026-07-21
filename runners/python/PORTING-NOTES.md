# Python porting notes and ambiguity log

## Confirmed portable contracts

- logical-path precedence needs no TypeScript module semantics;
- Actions can be represented as plain callables independent of transport;
- lifecycle ordering and terminal phases are observable event sequences;
- nested validation errors and stable envelopes map naturally to dictionaries;
- configuration precedence is language-neutral;
- CRUD, rollback, relation loading, and migration order can be exercised with an
  in-memory persistence model before binding to a database library.

## Ambiguities found

| Topic | Observation | Disposition |
| --- | --- | --- |
| Path casing | “Language-idiomatic” needs a declared canonical logical path before physical mapping. | RFC 0002 uses logical roles and RFC 0003 normalizes only declared path fields. |
| Field errors | A list per dotted field is more portable than implementation-specific exception objects. | Fixture uses `profile.email -> [invalid_email]`; review in RFC 0003. |
| Migration order | Lexical ordering is insufficient when names do not use a sortable prefix. | Fixture requires deterministic IDs and explicit applied order; implementations document their ordering key. |
| Inspection evidence | A behavior runner cannot prove source-only claims such as secret exclusion from client bundles. | Reports retain inspection requirements as skipped unless a separate inspection adapter supplies evidence. |
| In-memory persistence | It demonstrates transaction semantics but is not provider-contract evidence for a production database. | Driver status names the in-memory topology and does not generalize to another database. |

No Stacks.js-only API was required. Any change to the dispositions above goes
through RFC 0002 or 0003 review rather than being hidden in runner code.

