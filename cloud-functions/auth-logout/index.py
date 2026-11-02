"""
Logout handler — EdgeOne Makers Python cloud function.

POST /auth-logout
  Body:    { token }
  Returns: { ok: true }

Revokes the session token. Always succeeds (idempotent) — revoking an
unknown/expired token is not an error.
"""

import json
import os
import sys
from http.server import BaseHTTPRequestHandler

_PARENT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _PARENT_DIR not in sys.path:
    sys.path.insert(0, _PARENT_DIR)

from _logger import create_logger  # noqa: E402
from _auth import revoke_session  # noqa: E402

logger = create_logger("auth-logout")


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

        try:
            revoke_session(self.context.agent.store, token)
        except Exception as e:  # noqa: BLE001
            # Log but still report success — the client discards the token either way.
            logger.error(f"logout revoke failed: err={e!r}")

        self._write_json(200, {"ok": True})
