import importlib.util
import unittest
from pathlib import Path

RUNNER_PATH = Path(__file__).resolve().parents[1] / "stacks_protocol_runner.py"
SPEC = importlib.util.spec_from_file_location("stacks_protocol_runner", RUNNER_PATH)
RUNNER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(RUNNER)


class RunnerTest(unittest.TestCase):
    def test_override_resolution_prefers_application(self):
        setup = {"state": {"files": {"app/actions/Greet": "app", "framework/actions/Greet": "default"}}}
        actual = RUNNER.execute("conventions.resolve-role", {"logicalPath": "actions/Greet"}, setup)
        self.assertEqual(actual["path"], "app/actions/Greet")

    def test_validation_short_circuits_action(self):
        actual = RUNNER.execute("request.invoke", {"terminalPhase": "validation"}, {})
        self.assertEqual(actual["events"], ["middleware", "validation", "response"])
        self.assertNotIn("action", actual["events"])

    def test_transaction_rolls_back(self):
        actual = RUNNER.execute("database.transaction", {"writes": [{"title": "x"}], "throw": True}, {})
        self.assertTrue(actual["rolledBack"])
        self.assertEqual(actual["state"]["posts"], [])

    def test_report_is_honest_and_partial(self):
        report = RUNNER.build_report()
        self.assertIsNone(report["profileClaim"])
        statuses = {result["status"] for result in report["results"]}
        self.assertIn("pass", statuses)
        self.assertIn("unsupported", statuses)
        self.assertFalse(any(result["status"] == "fail" for result in report["results"]))


if __name__ == "__main__":
    unittest.main()

