/**
 * Membership client — register / login / logout / profile.
 *
 * The session token is persisted in localStorage so the user stays
 * signed in across reloads. The account's userId doubles as the
 * conversation user_id, so chat sessions follow the account across
 * browsers and devices (backed by blob storage server-side).
 */

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  createdAt: number | null;
  lastLoginAt: number | null;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

const AUTH_KEY = 'jobsearch-auth';

export function loadAuth(): AuthSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.token || !parsed?.user?.userId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAuth(session: AuthSession | null): void {
  if (session) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

async function post<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as (T & { message?: string }) | null;
  if (!res.ok) {
    throw new Error(data?.message || `Request failed (HTTP ${res.status})`);
  }
  if (!data) throw new Error('Empty response from server');
  return data;
}

export async function registerAccount(email: string, password: string, name?: string): Promise<AuthSession> {
  return post<AuthSession>('/auth-register', { email, password, name });
}

export async function loginAccount(email: string, password: string): Promise<AuthSession> {
  return post<AuthSession>('/auth-login', { email, password });
}

export async function logoutAccount(token: string): Promise<void> {
  // Best-effort: the token is discarded locally regardless of the outcome.
  try {
    await post<{ ok: boolean }>('/auth-logout', { token });
  } catch {
    /* ignore */
  }
}

export async function fetchProfile(token: string): Promise<AuthUser> {
  const data = await post<{ user: AuthUser }>('/profile', { token });
  return data.user;
}

export async function updateProfileName(token: string, name: string): Promise<AuthUser> {
  const data = await post<{ user: AuthUser }>('/profile', { token, name });
  return data.user;
}
