---
number: "0005"
title: Versioned authenticated environment encryption envelope
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
  - "0002"
supersedes: []
superseded-by: []
implementation-issues:
  - https://github.com/stacksjs/rfcs/issues/6
  - https://github.com/stacksjs/stacks/issues/2058
---

# Summary

Define a versioned environment-secret envelope using ephemeral-static X25519,
HKDF-SHA-256, and AES-256-GCM. New writes use version 2. Reference
implementations may retain a narrowly scoped legacy reader solely for migration.

# Motivation

The Stacks reference implementation's legacy construction hashes random private
bytes to produce a value called a public key, then derives the symmetric key from
that public value. Anyone holding the public value can therefore decrypt. AES-GCM
protects integrity, but the construction does not provide the asymmetric
confidentiality boundary its API names imply.

# Normative specification

Version 2 public keys MUST use `x25519-public:<base64url>` containing X.509 SPKI
DER. Private keys MUST use `x25519-private:<base64url>` containing PKCS#8 DER.

Each encryption MUST generate a fresh ephemeral X25519 key pair, 16-byte random
HKDF salt, and 12-byte random GCM nonce. The sender computes X25519 against the
recipient public key, then derives 32 bytes with HKDF-SHA-256, the random salt,
and UTF-8 info `stacks-env:v2`.

The value MUST be `encrypted:v2:<base64url>`, where the decoded UTF-8 JSON object
has exactly these fields:

```json
{"v":2,"epk":"<SPKI DER>","salt":"<16 bytes>","nonce":"<12 bytes>","ciphertext":"<bytes>","tag":"<16 bytes>"}
```

Binary fields use unpadded base64url. Field order above is canonical for writers.
AES-256-GCM additional authenticated data MUST be the UTF-8 encoding of
`stacks-env:v2;<epk>;<salt>;<nonce>`. Readers MUST reject unknown fields, wrong
types, invalid encodings, incorrect lengths, unsupported versions, wrong keys,
and modified data with one generic authentication-or-format error. Errors and
logs MUST NOT include plaintext, private material, shared secrets, or envelope
contents.

# Profiles and compatibility

This is a behavioral security change affecting `CORE-SEC-05` and
`CORE-SEC-08`. A version 2 pass satisfies authenticated-encryption behavior only
after executable tamper, wrong-key, malformed-input, nonce uniqueness, and key
lifecycle evidence exists. Until ratification and independent review, version 2
implementations are experimental and MUST NOT broaden production claims.

# Conformance evidence

The environment fixture MUST cover round trip, different envelope output for the
same input, wrong recipient key, every truncated component, modified ciphertext,
modified tag, modified ephemeral key, malformed JSON, unknown field, and an
unsupported version. Reports link the exact implementation and test revisions.

# Migration and rollback

New key generation and encryption MUST write version 2. A reference
implementation MAY read its pre-RFC `encrypted:<base64>` values when given a
legacy private key, but MUST identify that path as legacy and MUST provide a
decrypt-then-re-encrypt rotation operation. A version 2 writer MUST reject a
legacy public key rather than silently produce a legacy envelope.

Operators rotate by generating a new version 2 pair, decrypting each old value in
memory, immediately re-encrypting it to the new public key, replacing deployed
private-key secrets atomically, verifying a canary, and revoking the old key.
Rollback restores both the prior ciphertext set and matching private key; mixing
generations is invalid. Lost private keys are not recoverable.

# Security and privacy

Assets are environment secret plaintext and private recipient keys. Trust
boundaries are the developer/CI encryption host, source repository ciphertext,
CI secret store, deployment transport, and runtime process. Version 2 protects
ciphertext from repository readers who do not possess the private key and detects
modification. It does not protect plaintext on a compromised encryption host,
runtime, CI job, deployment host, or from recipients holding the private key. It
does not provide sender authentication, hardware-backed key custody, forward
secrecy after recipient-private-key compromise, secret access audit, or automatic
revocation.

# Alternatives

Symmetric-only encryption was rejected because it requires the encrypting side to
hold the decryption secret. P-256 and secp256k1 were rejected in favor of X25519's
narrow key-agreement interface. A third-party envelope library remains preferable
if review identifies a maintained interoperable format that meets the migration
requirements.

# Unresolved questions

Independent reviewers should confirm the DER serialization choice, authenticated
metadata construction, legacy-reader isolation, and whether a standard envelope
should replace this proposal before acceptance.

# Decision record

Proposed on 2026-07-21 for a 30-day public review under the security/breaking
change rule and small-maintainer safeguard. Acceptance cannot occur before
2026-08-20 and requires documented disposition of security objections. Broad
production recommendation additionally requires independent cryptographic review.
