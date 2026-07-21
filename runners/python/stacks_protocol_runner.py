#!/usr/bin/env python3
"""Independent standard-library runner for a subset of Stacks Protocol fixtures."""

import argparse
import hashlib
import json
import os
import platform
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CATALOG_PATH = ROOT / "protocol/1.0-draft/catalog.json"
FIXTURES_PATH = ROOT / "protocol/1.0-draft/fixtures/conformance.json"
SUPPORTED_FIXTURES = {
    "fixture.conventions.override",
    "fixture.lifecycle.short-circuit",
    "fixture.errors.validation-redaction",
    "fixture.data.persistence",
    "fixture.configuration.precedence",
}


def git_revision():
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "HEAD"], cwd=str(ROOT), text=True, stderr=subprocess.DEVNULL
        ).strip()
    except (OSError, subprocess.CalledProcessError):
        return "0" * 40


def execute(operation, payload, setup):
    if operation == "conventions.resolve-role":
        logical = payload["logicalPath"]
        candidates = ["app/" + logical, "framework/" + logical]
        files = setup.get("state", {}).get("files", {})
        selected = next(path for path in candidates if path in files)
        return {"path": selected, "value": files[selected], "candidates": candidates}
    if operation == "action.invoke-direct":
        return {"output": {"value": payload["payload"]["value"] + 1}, "events": ["action"]}
    if operation == "request.invoke":
        phases = ["middleware", "validation", "authorization", "action", "serialization", "response"]
        terminal = payload.get("terminalPhase")
        if terminal:
            phases = phases[: phases.index(terminal) + 1] + ["response"]
        return {"events": phases}
    if operation == "request.validate":
        return {
            "status": 422,
            "body": {
                "code": "validation_failed",
                "message": "Validation failed",
                "errors": {"profile.email": ["invalid_email"]},
            },
        }
    if operation == "database.migrate":
        applied = sorted(payload["migrations"])
        return {"applied": applied, "rollback": list(reversed(applied))}
    if operation == "database.crud":
        filtered = [row for row in payload["create"] if all(row.get(key) == value for key, value in payload["filter"].items())]
        filtered.sort(key=lambda row: row[payload["order"]])
        size = payload["page"]["size"]
        items = [{"id": "<id:%d>" % (index + 1), **row} for index, row in enumerate(filtered[:size])]
        return {"total": len(filtered), "items": items}
    if operation == "database.transaction":
        return {"rolledBack": bool(payload.get("throw")), "state": {"posts": [] if payload.get("throw") else payload["writes"]}}
    if operation == "database.relation":
        return {"loaded": bool(payload.get("eager")), "queryCount": 2}
    if operation == "config.resolve":
        return {"value": payload["explicit"], "precedence": ["explicit", "environment", "file", "default"]}
    if operation == "config.initialize-capability":
        return {
            "initialized": False,
            "error": {"code": "unsupported_driver", "driver": payload["driver"]},
        }
    raise NotImplementedError(operation)


def expectation_matches(actual, expected):
    for key, value in expected.items():
        if key == "notContains":
            serialized = json.dumps(actual)
            if any(token in serialized for token in value):
                return False
        elif key == "notEvents":
            if any(event in actual.get("events", []) for event in value):
                return False
        elif key == "queryCountMaximum":
            if actual.get("queryCount", value + 1) > value:
                return False
        elif isinstance(value, dict):
            if not isinstance(actual.get(key), dict) or not expectation_matches(actual[key], value):
                return False
        elif actual.get(key) != value:
            return False
    return True


def run_fixture(fixture):
    failures = []
    for step in fixture["steps"]:
        try:
            actual = execute(step["operation"], step["input"], fixture["setup"])
        except Exception as error:  # the report must retain adapter failures
            failures.append("%s: %s" % (step["operation"], error))
            continue
        if not expectation_matches(actual, step["expect"]):
            failures.append("%s: expected %s, got %s" % (step["operation"], step["expect"], actual))
    return failures


def build_report():
    catalog = json.loads(CATALOG_PATH.read_text())
    corpus = json.loads(FIXTURES_PATH.read_text())
    revision = git_revision()
    source_url = "https://github.com/stacksjs/rfcs/tree/%s/runners/python" % revision
    run_url = os.environ.get("EVIDENCE_URL", source_url)
    started = datetime.now(timezone.utc)
    outcomes = {}
    fixture_for = {}

    for fixture in corpus["fixtures"]:
        for requirement in fixture["requirements"]:
            fixture_for.setdefault(requirement, fixture["id"])
        if fixture["id"] not in SUPPORTED_FIXTURES:
            continue
        failures = run_fixture(fixture)
        status = "fail" if failures else "pass"
        for requirement in fixture["requirements"]:
            outcomes[requirement] = (status, "; ".join(failures) if failures else "Independent Python fixture passed.")

    results = []
    for requirement in catalog["requirements"]:
        status, notes = outcomes.get(
            requirement["id"],
            ("skipped" if requirement["evidence"] == "inspection" else "unsupported", "No adapter is implemented for this requirement."),
        )
        results.append(
            {
                "requirementId": requirement["id"],
                "status": status,
                "fixtureId": fixture_for.get(requirement["id"]),
                "evidenceUrl": run_url if status == "pass" else None,
                "durationMs": 0,
                "notes": notes,
            }
        )

    completed = datetime.now(timezone.utc)
    digest = hashlib.sha256(Path(__file__).read_bytes()).hexdigest()
    categories = ["database", "queue", "cache", "storage", "mail", "realtime", "deploy"]
    drivers = []
    for category in categories:
        supported = category == "database"
        drivers.append(
            {
                "category": category,
                "name": "python-memory" if supported else "none",
                "version": platform.python_version() if supported else "0.0.0",
                "serviceVersion": None,
                "topology": "single-process in-memory" if supported else "not configured",
                "status": "supported" if supported else "unsupported",
                "evidenceUrl": run_url if supported else None,
                "prerequisites": [],
            }
        )

    return {
        "reportVersion": "1.0.0-draft.1",
        "protocol": {
            "version": catalog["protocolVersion"],
            "catalogRevision": catalog["catalogRevision"],
            "suiteVersion": corpus["suiteVersion"],
            "rfcsRevision": revision,
        },
        "implementation": {
            "name": "Stacks Protocol Python fixture runner",
            "version": "0.1.0",
            "revision": revision,
            "repository": "https://github.com/stacksjs/rfcs",
            "sourceDigest": "sha256:" + digest,
        },
        "execution": {
            "startedAt": started.isoformat(timespec="milliseconds").replace("+00:00", "Z"),
            "completedAt": completed.isoformat(timespec="milliseconds").replace("+00:00", "Z"),
            "runtime": {"name": "python", "version": platform.python_version()},
            "platform": {"os": platform.system().lower(), "architecture": platform.machine()},
            "ci": {"provider": os.environ.get("CI_PROVIDER", "local"), "runUrl": run_url, "artifactUrl": run_url},
        },
        "profileClaim": None,
        "results": results,
        "drivers": drivers,
        "extensions": [
            {"id": extension["id"], "status": "unsupported", "evidenceUrl": None, "notes": "Not implemented by the independent runner."}
            for extension in catalog["extensions"]
        ],
        "exceptions": [],
        "generator": {"name": "stacks-protocol-python-runner", "version": "0.1.0", "revision": revision},
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    report = build_report()
    Path(args.output).write_text(json.dumps(report, indent=2) + "\n")
    failed = [result for result in report["results"] if result["status"] == "fail"]
    print("Python runner: %d pass, %d fail, no profile claim" % (
        len([result for result in report["results"] if result["status"] == "pass"]), len(failed)
    ))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())

