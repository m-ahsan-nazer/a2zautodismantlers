import json
import os
import sys
import types
from unittest import mock

import pytest

# Stub boto3 so tests never touch AWS.
fake_boto3 = types.ModuleType("boto3")
fake_ses = mock.MagicMock()
fake_boto3.client = lambda _name: fake_ses
sys.modules["boto3"] = fake_boto3
os.environ.setdefault("TO_EMAIL", "to@example.com")
os.environ.setdefault("FROM_EMAIL", "from@example.com")
sys.path.insert(0, os.path.dirname(__file__))
import handler  # noqa: E402


def ev(body, method="POST"):
    return {"requestContext": {"http": {"method": method}}, "body": json.dumps(body) if not isinstance(body, str) else body}


@pytest.fixture(autouse=True)
def reset():
    fake_ses.reset_mock()
    fake_ses.send_email.side_effect = None


def test_sends_valid_request():
    r = handler.handler(ev({"phone": "021 123 4567", "plate": "abc 123", "email": "a@b.co.nz", "message": "Corolla"}), None)
    assert r["statusCode"] == 200
    args = fake_ses.send_email.call_args.kwargs
    assert args["ReplyToAddresses"] == ["a@b.co.nz"]
    assert "ABC123" in args["Message"]["Body"]["Text"]["Data"]


def test_never_sets_cors_headers():
    r = handler.handler(ev({"phone": "021 123 4567"}), None)
    assert not any(k.lower().startswith("access-control") for k in r["headers"])


def test_rejects_missing_phone():
    r = handler.handler(ev({"message": "hi"}), None)
    assert r["statusCode"] == 422
    fake_ses.send_email.assert_not_called()


def test_rejects_bad_json():
    assert handler.handler(ev("{not json"), None)["statusCode"] == 400
    assert handler.handler(ev("[1,2]"), None)["statusCode"] == 400


def test_honeypot_is_silently_dropped():
    r = handler.handler(ev({"phone": "021 123 4567", "company": "bot"}), None)
    assert r["statusCode"] == 200
    fake_ses.send_email.assert_not_called()


def test_reports_ses_failure():
    fake_ses.send_email.side_effect = RuntimeError("boom")
    assert handler.handler(ev({"phone": "021 123 4567"}), None)["statusCode"] == 502


def test_rejects_get():
    assert handler.handler(ev({}, "GET"), None)["statusCode"] == 405
