"""Quote form handler: Lambda Function URL -> Amazon SES email.

CORS is configured on the Function URL itself (allowed origin = the site), so this
handler never sets CORS headers (doubling them makes browsers block the response).

Environment variables:
  TO_EMAIL    address that receives quote requests (verified in SES)
  FROM_EMAIL  verified SES sender, e.g. website@a2zautodismantlers.nz
"""

import json
import os
import re

import boto3

ses = boto3.client("ses")

NZ_PHONE = re.compile(r"^(\+?64|0)[2-9]\d{6,9}$")
EMAIL = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]{2,}$")
PLATE = re.compile(r"^[A-Z0-9]{1,6}$")
LIMITS = {"phone": 30, "plate": 10, "address": 200, "email": 200, "message": 2000, "page": 200}


def _resp(status, body):
    return {"statusCode": status, "headers": {"Content-Type": "application/json"}, "body": json.dumps(body)}


def validate(data):
    """Returns (clean_fields, errors). Mirrors lib/validate.ts."""
    clean = {k: str(data.get(k) or "").strip()[: LIMITS[k]] for k in LIMITS}
    errors = {}
    phone = re.sub(r"[\s().-]", "", clean["phone"])
    if not phone:
        errors["phone"] = "required"
    elif not NZ_PHONE.match(phone):
        errors["phone"] = "invalid"
    plate = re.sub(r"[\s-]", "", clean["plate"]).upper()
    if plate and not PLATE.match(plate):
        errors["plate"] = "invalid"
    if clean["email"] and not EMAIL.match(clean["email"]):
        errors["email"] = "invalid"
    if len(str(data.get("message") or "")) > LIMITS["message"]:
        errors["message"] = "too long"
    clean["plate"] = plate
    return clean, errors


def handler(event, _context):
    method = (event.get("requestContext", {}).get("http", {}) or {}).get("method", "POST")
    if method == "OPTIONS":
        return {"statusCode": 204}
    if method != "POST":
        return _resp(405, {"ok": False, "error": "method not allowed"})
    try:
        data = json.loads(event.get("body") or "{}")
    except (TypeError, ValueError):
        return _resp(400, {"ok": False, "error": "invalid json"})
    if not isinstance(data, dict):
        return _resp(400, {"ok": False, "error": "invalid json"})
    if str(data.get("company") or "").strip():
        return _resp(200, {"ok": True})  # honeypot: pretend success to bots only

    clean, errors = validate(data)
    if errors:
        return _resp(422, {"ok": False, "errors": errors})

    lines = [
        "New quote request from a2zautodismantlers.nz",
        "",
        f"Contact Number: {clean['phone']}",
        f"License Plate Number: {clean['plate'] or '-'}",
        f"Address: {clean['address'] or '-'}",
        f"Email Address: {clean['email'] or '-'}",
        "",
        "Message:",
        clean["message"] or "-",
        "",
        f"Sent from page: {clean['page'] or '-'}",
    ]
    params = {
        "Source": os.environ["FROM_EMAIL"],
        "Destination": {"ToAddresses": [os.environ["TO_EMAIL"]]},
        "Message": {
            "Subject": {"Data": f"Quote request: {clean['plate'] or 'vehicle'} ({clean['phone']})"},
            "Body": {"Text": {"Data": "\n".join(lines)}},
        },
    }
    if clean["email"]:
        params["ReplyToAddresses"] = [clean["email"]]
    try:
        ses.send_email(**params)
    except Exception as exc:  # noqa: BLE001 - report failure to the browser, never fake success
        print(f"SES send failed: {exc}")
        return _resp(502, {"ok": False, "error": "send failed"})
    return _resp(200, {"ok": True})
