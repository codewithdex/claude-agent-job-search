"""
Shared auth helpers for the membership cloud functions.

Storage layout (blob storage via context.agent.store raw KV):
  auth:user:{email}     → JSON user record (credentials + profile)
  auth:session:{token}  → JSON session (token → userId)

Passwords are hashed with PBKDF2-HMAC-SHA256 (stdlib only) with a
per-user salt; sessions are opaque random tokens. Raw blob keys have
no TTL on this platform, so sessions live until explicit logout.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import re
import secrets
import time
import uuid

USER_PREFIX = "auth:user:"
SESSION_PREFIX = "auth:session:"
PBKDF2_ITERATIONS = 120_000
MIN_PASSWORD_LEN = 8
MAX_NAME_LEN = 80

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def normalize_email(email: object) -> str:
    return str(email or "").strip().lower()


def valid_email(email: str) -> bool:
    return bool(_EMAIL_RE.match(email)) and len(email) <= 254


def hash_password(password: str, salt_hex: str) -> str:
    return hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), bytes.fromhex(salt_hex), PBKDF2_ITERATIONS
    ).hex()


def verify_password(password: str, salt_hex: str, expected_hex: str) -> bool:
    return hmac.compare_digest(hash_password(password, salt_hex), expected_hex)


def new_salt() -> str:
    return secrets.token_hex(16)


def new_token() -> str:
    return secrets.token_hex(24)


def now_ms() -> int:
    return int(time.time() * 1000)


def public_user(record: dict) -> dict:
    """Shape returned to the frontend — never exposes hash/salt."""
    return {
        "userId": record.get("userId"),
        "email": record.get("email"),
        "name": record.get("name"),
        "createdAt": record.get("createdAt"),
        "lastLoginAt": record.get("lastLoginAt"),
    }


def build_user_record(email: str, password: str, name: str) -> dict:
    salt = new_salt()
    created = now_ms()
    return {
        "userId": str(uuid.uuid4()),
        "email": email,
        "name": name,
        "passwordHash": hash_password(password, salt),
        "salt": salt,
        "createdAt": created,
        "lastLoginAt": created,
    }


# ─── Blob helpers (store = context.agent.store sync proxy) ───


def load_user(store, email: str) -> dict | None:
    raw = store.get(USER_PREFIX + email)
    if not raw:
        return None
    try:
        record = json.loads(raw)
    except (TypeError, ValueError):
        return None
    return record if isinstance(record, dict) else None


def save_user(store, record: dict) -> None:
    store.set(USER_PREFIX + record["email"], json.dumps(record, ensure_ascii=False))


def issue_session(store, record: dict) -> str:
    token = new_token()
    payload = {
        "userId": record["userId"],
        "email": record["email"],
        "createdAt": now_ms(),
    }
    store.set(SESSION_PREFIX + token, json.dumps(payload, ensure_ascii=False))
    return token


def resolve_session(store, token: str) -> dict | None:
    """Return the session payload for a valid token, else None."""
    token = str(token or "").strip()
    if not token:
        return None
    raw = store.get(SESSION_PREFIX + token)
    if not raw:
        return None
    try:
        payload = json.loads(raw)
    except (TypeError, ValueError):
        return None
    return payload if isinstance(payload, dict) and payload.get("userId") else None


def revoke_session(store, token: str) -> None:
    token = str(token or "").strip()
    if token:
        store.delete_key(SESSION_PREFIX + token)


def clean_name(name: object, fallback: str) -> str:
    """Trim a display name to a safe length; fall back when empty."""
    cleaned = str(name or "").strip()
    if not cleaned:
        cleaned = fallback
    return cleaned[:MAX_NAME_LEN]
