"""
Register handler — EdgeOne Makers Python cloud function.

POST /auth-register
  Body:    { email, password, name? }
  Returns: { user, token }   (201 on success)
  Errors:  400 invalid input · 409 account exists · 500 storage failure

Creates a user record in blob storage (auth:user:{email}) and issues a
session token (auth:session:{token}).
"""

import json
import os
import sys
from http.server import BaseHTTPRequestHandler

# EdgeOne loads each index.py as a top-level module without package context,
# so the parent directory must be on sys.path to import sibling helpers.
_PARENT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _PARENT_DIR not in sys.path:
    sys.path.insert(0, _PARENT_DIR)

from _logger import create_logger  # noqa: E402
from _auth import (  # noqa: E402
    MIN_PASSWORD_LEN,
    build_user_record,
    clean_name,
    issue_session,
    load_user,
    normalize_email,
    public_user,
    save_user,
    valid_email,
)

logger = create_logger("auth-register")


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
        if not valid_email(email):
            self._write_json(400, {"status": "error", "message": "A valid email is required."})
            return
        if len(password) < MIN_PASSWORD_LEN:
            self._write_json(400, {
                "status": "error",
                "message": f"Password must be at least {MIN_PASSWORD_LEN} characters.",
            })
            return

        store = self.context.agent.store

        try:
            if load_user(store, email):
                self._write_json(409, {"status": "error", "message": "An account with this email already exists."})
                return

            name = clean_name(body.get("name"), fallback=email.split("@")[0])
            record = build_user_record(email, password, name)
            save_user(store, record)
            token = issue_session(store, record)
        except Exception as e:  # noqa: BLE001
            logger.error(f"register failed: email={email!r} err={e!r}")
            self._write_json(500, {"status": "error", "message": "Could not create account. Please try again."})
            return

        logger.log(f"registered user: {email!r} userId={record['userId']}")
        self._write_json(201, {"user": public_user(record), "token": token})
