import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  deleteConversation,
  fetchConversationHistory,
  listConversations,
  sendMessageStream,
  stopAgent,
} from './api';
import type { ConversationSummary } from './types';
import { I18nProvider, LangToggle, useT, MessageKeys } from './i18n';
import ConversationSidebar from './components/ConversationSidebar';
import {
  INITIAL_FORM,
  JOB_SEARCH_TASKS,
  JobSearchFormValues,
  JobSearchTask,
  activeTaskMeta,
  buildJobSearchPrompt,
  toolProgressLabel,
  validateJobSearchForm,
} from './jobSearch';
import styles from './App.module.css';

const CONVERSATION_KEY = 'jobsearch_conversation_id';
const USER_KEY = 'jobsearch-user-id';
const PAGE_SIZE = 20;

const STEPS = ['steps.1', 'steps.2', 'steps.3'] as const;

function id(key: string): string {
  const saved = localStorage.getItem(key);
  if (saved) return saved;
  const value = crypto.randomUUID();
  localStorage.setItem(key, value);
  return value;
}

function AppInner() {
  const { t } = useT();
  const [conversationId, setConversationId] = useState(() => id(CONVERSATION_KEY));
  const userId = useRef(id(USER_KEY));
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [nextCursor, setNextCursor] = useState<string>();
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [form, setForm] = useState<JobSearchFormValues>(INITIAL_FORM);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [progress, setProgress] = useState<string[]>([]);
  const [error, setError] = useState('');
  const controller = useRef<AbortController | null>(null);

  const taskMeta = useMemo(() => activeTaskMeta(form.task), [form.task]);

  const refreshConversations = useCallback(async (append = false, cursor?: string) => {
    append ? setLoadingMore(true) : setConversationsLoading(true);
    const response = await listConversations({
      userId: userId.current,
      limit: PAGE_SIZE,
      order: 'desc',
      after: cursor,
    });
    setConversations(previous =>
      append
        ? [...previous, ...response.conversations.filter(item => !previous.some(old => old.id === item.id))]
        : response.conversations,
    );
    setNextCursor(response.nextCursor);
    append ? setLoadingMore(false) : setConversationsLoading(false);
  }, []);

  const loadHistory = useCallback(async (target: string) => {
    setHistoryLoading(true);
    setError('');
    setResult('');
    const messages = await fetchConversationHistory(target, userId.current);
    const assistant = [...messages].reverse().find(message => message.role === 'assistant' && message.content.trim());
    if (assistant) setResult(assistant.content);
    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    void refreshConversations();
    void loadHistory(conversationId);
  }, [conversationId, loadHistory, refreshConversations]);

  const change = <K extends keyof JobSearchFormValues>(key: K, value: JobSearchFormValues[K]) =>
    setForm(current => ({ ...current, [key]: value }));

  const startAnalysis = () => {
    const validation = validateJobSearchForm(form);
    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    setError('');
    setResult('');
    setProgress([t('progress.start')]);
    let streamed = '';
    let failed = false;

    controller.current = sendMessageStream(
      buildJobSearchPrompt(form),
      {
        onTextDelta: delta => {
          streamed += delta;
          setResult(streamed);
        },
        onToolCalled: toolName => {
          const label = toolProgressLabel(toolName);
          setProgress(items => (items.includes(label) ? items : [...items, label]));
        },
        onImage: () => undefined,
        onDone: () => {
          if (failed) {
            setLoading(false);
            return;
          }
          setProgress(items => [...items, t('progress.done')]);
          setLoading(false);
          void refreshConversations();
        },
        onError: reason => {
          failed = true;
          setError(reason.message);
          setLoading(false);
        },
      },
      conversationId,
      { userMsgId: crypto.randomUUID(), botMsgId: crypto.randomUUID() },
      userId.current,
    );
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    startAnalysis();
  };

  const stop = () => {
    controller.current?.abort();
    void stopAgent(conversationId);
    setLoading(false);
    setProgress(items => [...items, t('progress.stopped')]);
  };

  const createConversation = () => {
    if (loading) return;
    const next = crypto.randomUUID();
    localStorage.setItem(CONVERSATION_KEY, next);
    setConversationId(next);
    setResult('');
    setError('');
    setProgress([]);
    setForm(INITIAL_FORM);
  };

  const selectConversation = (target: string) => {
    localStorage.setItem(CONVERSATION_KEY, target);
    setConversationId(target);
  };

  const removeConversation = async (target: string) => {
    if (!window.confirm(t('sidebar.deleteConfirm'))) return;
    await deleteConversation(target, userId.current);
    setConversations(items => items.filter(item => item.id !== target));
    if (target === conversationId) createConversation();
  };

  return (
    <main className={styles.shell}>
      <LangToggle />
      <div className={styles.stage}>
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={conversationId}
          loading={conversationsLoading}
          loadingMore={loadingMore}
          hasMore={Boolean(nextCursor)}
          disabled={loading}
          onSelect={selectConversation}
          onCreate={createConversation}
          onLoadMore={() => void refreshConversations(true, nextCursor)}
          onDelete={target => void removeConversation(target)}
        />

        <section className={styles.main}>
          <header className={styles.hero}>
            <div className={styles.heroText}>
              <div className={styles.brandRow}>
                <span className={styles.logoMark} aria-hidden>JS</span>
                <div>
                  <p className={styles.eyebrow}>{t('app.eyebrow')}</p>
                  <h1>{t('app.title')}</h1>
                </div>
              </div>
              <p className={styles.heroSub}>{t('app.subtitle')}</p>
            </div>
            <div className={styles.heroPills}>
              <span className={styles.pill}>{t('pill.resume')}</span>
              <span className={styles.pill}>{t('pill.match')}</span>
              <span className={styles.pill}>{t('pill.interview')}</span>
            </div>
          </header>

          <div className={styles.steps}>
            {STEPS.map((key, index) => (
              <div key={key} className={styles.step}>
                <span className={styles.stepNum}>{index + 1}</span>
                <span>{t(key as MessageKeys)}</span>
              </div>
            ))}
          </div>

          <div className={styles.layout}>
            <form className={styles.briefPanel} onSubmit={submit}>
              <section className={styles.section}>
                <h2>{t('form.roleSection')}</h2>
                <div className={styles.fieldGrid}>
                  <label className={styles.field}>
                    <span>{t('form.targetRole')}</span>
                    <input
                      value={form.targetRole}
                      onChange={e => change('targetRole', e.target.value)}
                      placeholder={t('form.targetRolePlaceholder')}
                      disabled={loading}
                    />
                  </label>
                  <label className={styles.field}>
                    <span>{t('form.targetCompany')}</span>
                    <input
                      value={form.targetCompany}
                      onChange={e => change('targetCompany', e.target.value)}
                      placeholder={t('form.targetCompanyPlaceholder')}
                      disabled={loading}
                    />
                  </label>
                  <label className={styles.field}>
                    <span>{t('form.industry')}</span>
                    <input
                      value={form.industry}
                      onChange={e => change('industry', e.target.value)}
                      placeholder={t('form.industryPlaceholder')}
                      disabled={loading}
                    />
                  </label>
                </div>
              </section>

              <section className={styles.section}>
                <h2>{t('form.taskSection')}</h2>
                <div className={styles.taskGrid}>
                  {JOB_SEARCH_TASKS.map(task => (
                    <button
                      key={task.id}
                      type="button"
                      className={form.task === task.id ? styles.taskCardActive : styles.taskCard}
                      onClick={() => change('task', task.id as JobSearchTask)}
                      disabled={loading}
                    >
                      <span className={styles.taskIcon} aria-hidden>{task.icon}</span>
                      <strong>{t(task.labelKey as MessageKeys)}</strong>
                      <small>{t(task.descKey as MessageKeys)}</small>
                    </button>
                  ))}
                </div>
              </section>

              <section className={styles.section}>
                <h2>{t('form.materialsSection')}</h2>
                <div className={styles.materialsGrid}>
                  <label className={styles.field}>
                    <span>{t('form.resume')}</span>
                    <textarea
                      value={form.resume}
                      onChange={e => change('resume', e.target.value)}
                      placeholder={t('form.resumePlaceholder')}
                      rows={8}
                      disabled={loading}
                    />
                  </label>
                  <label className={styles.field}>
                    <span>{t('form.jobDescription')}</span>
                    <textarea
                      value={form.jobDescription}
                      onChange={e => change('jobDescription', e.target.value)}
                      placeholder={t('form.jobDescriptionPlaceholder')}
                      rows={8}
                      disabled={loading}
                    />
                  </label>
                </div>
              </section>

              <div className={styles.formActions}>
                <button className={styles.primaryBtn} type="submit" disabled={loading}>
                  {loading ? t('form.submitting') : t('form.submit')}
                </button>
                {loading && (
                  <button className={styles.secondaryBtn} type="button" onClick={stop}>
                    {t('form.stop')}
                  </button>
                )}
              </div>
            </form>

            <aside className={styles.coachPanel} aria-live="polite">
              <div className={styles.coachHeader}>
                <div>
                  <p className={styles.eyebrow}>{t('coach.label')}</p>
                  <h2>{t(taskMeta.labelKey as MessageKeys)}</h2>
                </div>
                {(form.targetRole || form.targetCompany) && (
                  <div className={styles.coachMeta}>
                    {form.targetRole && <span>{form.targetRole}</span>}
                    {form.targetCompany && <span>{form.targetCompany}</span>}
                  </div>
                )}
              </div>

              {progress.length > 0 && (
                <ul className={styles.timeline}>
                  {progress.map((item, index) => (
                    <li key={`${item}-${index}`} className={styles.timelineItem}>
                      <span className={styles.timelineDot}>
                        {index === progress.length - 1 && loading ? <i className={styles.spinner} /> : '●'}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {error && (
                <div className={styles.errorBox}>
                  <strong>{t('result.errorTitle')}</strong>
                  <p>{error}</p>
                  <button type="button" className={styles.secondaryBtn} onClick={startAnalysis}>
                    {t('result.retry')}
                  </button>
                </div>
              )}

              {historyLoading && (
                <div className={styles.placeholder}>
                  <i className={styles.spinner} />
                  <p>{t('result.loading')}</p>
                </div>
              )}

              {!historyLoading && !result && !loading && !error && (
                <div className={styles.placeholder}>
                  <div className={styles.placeholderIcon} aria-hidden>💼</div>
                  <h3>{t('result.emptyTitle')}</h3>
                  <p>{t('result.emptyHint')}</p>
                  <div className={styles.featureRow}>
                    <article><span>📄</span><p>{t('task.review.desc')}</p></article>
                    <article><span>🎯</span><p>{t('task.match.desc')}</p></article>
                    <article><span>🎤</span><p>{t('task.interview.desc')}</p></article>
                  </div>
                </div>
              )}

              {result && (
                <article className={styles.resultBody}>
                  <Markdown remarkPlugins={[remarkGfm]}>{result}</Markdown>
                </article>
              )}
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
}
