# Independent Python fixture runner

This standard-library Python runner is intentionally maintained outside the
Stacks.js implementation repository and imports no Stacks.js package. It consumes
the shared JSON fixture corpus and implements a small, independent behavioral
model for resolver precedence, direct Actions, lifecycle short-circuiting,
validation/error envelopes, configuration, and in-memory persistence.

```sh
python3 runners/python/stacks_protocol_runner.py --output /tmp/report.json
bun run validate:report /tmp/report.json --summary /tmp/report.md
python3 -m unittest discover -s runners/python/tests
```

The report deliberately claims no profile: unsupported and inspection-only
requirements remain visible. Extending this runner means implementing additional
operation adapters, not copying expected fixture output.

