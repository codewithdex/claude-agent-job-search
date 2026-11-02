"""
Profile handler — EdgeOne Makers Python cloud function.

POST /profile
  Body:    { token, name? }
  Returns: { user }
  Errors:  401 invalid/expired session · 404 account gone · 500 storage failure

Resolves the session token to the user's profile. If a non-empty `name`
is supplied, the display name is updated first (basic profile editing).
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
    clean_name,
    load_user,
    public_user,
    resolve_session,
    save_user,
)

logger = create_logger("profile")


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
        token = str(body.get("token") or "")

        store = self.context.agent.store

        try:
            session = resolve_session(store, token)
            if not session:
                self._write_json(401, {"status": "error", "message": "Session expired. Please sign in again."})
                return

            record = load_user(store, session["email"])
            if not record:
                self._write_json(404, {"status": "error", "message": "Account not found."})
                return

            new_name = clean_name(body.get("name"), fallback="")
            if new_name and new_name != record.get("name"):
                record["name"] = new_name
                save_user(store, record)
                logger.log(f"profile updated: {record['email']!r}")
        except Exception as e:  # noqa: BLE001
            logger.error(f"profile failed: err={e!r}")
            self._write_json(500, {"status": "error", "message": "Could not load profile. Please try again."})
            return

        self._write_json(200, {"user": public_user(record)})
