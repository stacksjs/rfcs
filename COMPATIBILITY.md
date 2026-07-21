# Compatibility, Deprecation, and Migration

## Compatibility contract

Compatibility is evaluated from an implementation consumer's observable input,
output, ordering, failure, and persistence behavior. Source-level similarity is
not sufficient.

The following are protocol surfaces when declared by a profile requirement:

- directory and module resolution precedence;
- lifecycle ordering, cancellation, and short-circuit behavior;
- validation and error-envelope shapes;
- configuration names, defaults, and precedence;
- driver capability and unsupported-result semantics;
- generated schemas when advertised as protocol evidence; and
- persisted migration state and transaction behavior.

Additive data is compatible only when consumers are required to ignore unknown
fields. Changing a default, precedence rule, error category, ordering edge, or
previously accepted input is behavioral even if types still compile.

## Deprecation

A normative behavior can be deprecated only by an accepted RFC that names:

1. the affected requirement IDs and profiles;
2. the replacement and automated detection path;
3. the first protocol version that warns;
4. the earliest protocol version that may remove it;
5. fixture changes for old and new behavior; and
6. migration and rollback guidance.

Removal cannot occur in the same protocol minor version as deprecation. Security
exceptions must document the active exploit and least-disruptive mitigation.

## Versioning

Protocol versions use `MAJOR.MINOR`:

- `MAJOR` changes may intentionally break conforming implementations.
- `MINOR` changes are additive or compatible and cannot weaken an existing MUST.
- Editorial revisions append a source revision and do not change the protocol version.

An implementation reports the exact protocol version, suite revision, source
revision, and supported profile. Version ranges alone are not conformance evidence.

## Migration evidence

Every behavioral or breaking RFC includes before/after examples, affected
fixtures, an upgrade procedure, rollback conditions, and a statement about data
or security impact. The decision index links that guidance before the RFC can be
marked Implemented.

