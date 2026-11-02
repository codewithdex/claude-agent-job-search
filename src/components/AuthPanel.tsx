import { FormEvent, useEffect, useState } from 'react';
import {
  AuthSession,
  AuthUser,
  loginAccount,
  registerAccount,
  updateProfileName,
} from '../auth';
import { useT } from '../i18n';
import styles from './AuthPanel.module.css';

interface AuthPanelProps {
  auth: AuthSession | null;
  onAuth: (session: AuthSession) => void;
  onProfileUpdate: (user: AuthUser) => void;
  onLogout: () => void;
  onClose: () => void;
}

function formatDate(ts: number | null, lang: string): string {
  if (!ts) return '—';
  try {
    return new Date(ts).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default function AuthPanel({ auth, onAuth, onProfileUpdate, onLogout, onClose }: AuthPanelProps) {
  const { t, lang } = useT();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nameDraft, setNameDraft] = useState(auth?.user.name ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setNameDraft(auth?.user.name ?? '');
  }, [auth]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const session =
        mode === 'login'
          ? await loginAccount(email.trim(), password)
          : await registerAccount(email.trim(), password, name.trim() || undefined);
      onAuth(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const saveName = async () => {
    if (!auth || busy || !nameDraft.trim() || nameDraft.trim() === auth.user.name) return;
    setBusy(true);
    setError('');
    try {
      const user = await updateProfileName(auth.token, nameDraft.trim());
      onProfileUpdate(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className={styles.head}>
          <p className={styles.headKicker}>{t('app.title')}</p>
          <h2 className={styles.headTitle}>
            {auth ? t('auth.profileTitle') : mode === 'login' ? t('auth.signIn') : t('auth.register')}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t('auth.close')}>
            ×
          </button>
        </div>

        {auth ? (
          <div className={styles.body}>
            <div className={styles.profileTop}>
              <div className={styles.avatar} aria-hidden>
                {(auth.user.name || auth.user.email).charAt(0).toUpperCase()}
              </div>
              <div>
                <p className={styles.profileName}>{auth.user.name}</p>
                <p className={styles.profileEmail}>{auth.user.email}</p>
              </div>
            </div>

            <div className={styles.nameEdit}>
              <input
                value={nameDraft}
                onChange={e => setNameDraft(e.target.value)}
                placeholder={t('auth.name')}
                disabled={busy}
                maxLength={80}
              />
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => void saveName()}
                disabled={busy || !nameDraft.trim() || nameDraft.trim() === auth.user.name}
              >
                {t('auth.save')}
              </button>
            </div>

            <div className={styles.rows}>
              <div className={styles.row}>
                <span className={styles.rowLabel}>{t('auth.memberSince')}</span>
                <span className={styles.rowValue}>{formatDate(auth.user.createdAt, lang)}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.rowLabel}>{t('auth.lastLogin')}</span>
                <span className={styles.rowValue}>{formatDate(auth.user.lastLoginAt, lang)}</span>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="button" className={styles.logoutBtn} onClick={onLogout} disabled={busy}>
              {t('auth.logout')}
            </button>
          </div>
        ) : (
          <form className={styles.body} onSubmit={submit}>
            <label className={styles.field}>
              <span>{t('auth.email')}</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={busy}
              />
            </label>

            {mode === 'register' && (
              <label className={styles.field}>
                <span>{t('auth.nameOptional')}</span>
                <input
                  type="text"
                  autoComplete="nickname"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={busy}
                  maxLength={80}
                />
              </label>
            )}

            <label className={styles.field}>
              <span>{t('auth.password')}</span>
              <input
                type="password"
                required
                minLength={8}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={busy}
              />
              {mode === 'register' && <small className={styles.hint}>{t('auth.passwordHint')}</small>}
            </label>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.primary} disabled={busy}>
              {busy
                ? mode === 'login'
                  ? t('auth.signingIn')
                  : t('auth.creating')
                : mode === 'login'
                  ? t('auth.signIn')
                  : t('auth.register')}
            </button>

            <button
              type="button"
              className={styles.switch}
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              disabled={busy}
            >
              {mode === 'login' ? t('auth.noAccount') : t('auth.haveAccount')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
