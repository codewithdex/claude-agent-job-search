"""
Login handler — EdgeOne Makers Python cloud function.

POST /auth-login
  Body:    { email, password }
  Returns: { user, token }
  Errors:  400 invalid input · 401 wrong credentials · 500 storage failure

Verifies credentials against the blob-stored user record and issues a
fresh session token. The 401 message is identical for unknown email and
wrong password to avoid account enumeration.
"""

import json
import os
import sys
from http.server import BaseHTTPRequestHandler

_PARENT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _PARENT_DIR not in sys.path:
    sys.path.insert(0, _PARENT_DIR)

from _logger import create_logger  # noqa: E402
from _auth import (  # noqa: E402
    issue_session,
    load_user,
    normalize_email,
    now_ms,
    public_user,
    save_user,
    valid_email,
    verify_password,
)

logger = create_logger("auth-login")

INVALID_MSG = "Invalid email or password."


def _read_body(rfile, headers) -> dict:
    length = int(headers.get("Content-Length") or 0)
    if length <= 0:
        return {}
    try:
        return json.loads(rfile.read(length).decode("utf-8")) or {}
    except (ValueError, UnicodeDecodeError):
        return {}


class handler(BaseHTTPRequestHandler):
    def _write_json(self, status: int, payload: dict) -> None:
        body = json.dumps(payload, ensure_ascii=False, default=str).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=UTF-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        body = _read_body(self.rfile, self.headers)

        email = normalize_email(body.get("email"))
        password = str(body.get("password") or "")
        if not valid_email(email) or not password:
            self._write_json(400, {"status": "error", "message": "Email and password are required."})
            return

        store = self.context.agent.store

        try:
            record = load_user(store, email)
            if not record or not verify_password(password, record.get("salt", ""), record.get("passwordHash", "")):
                self._write_json(401, {"status": "error", "message": INVALID_MSG})
                return

            record["lastLoginAt"] = now_ms()
            save_user(store, record)
            token = issue_session(store, record)
        except Exception as e:  # noqa: BLE001
            logger.error(f"login failed: email={email!r} err={e!r}")
            self._write_json(500, {"status": "error", "message": "Could not sign in. Please try again."})
            return

        logger.log(f"login: {email!r} userId={record['userId']}")
        self._write_json(200, {"user": public_user(record), "token": token})
