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
      <div className={styles.atmosphere} aria-hidden />
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

        <section className={styles.workspace}>
          <header className={styles.masthead}>
            <div className={styles.brandBlock}>
              <span className={styles.mark} aria-hidden>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 18 L12 4 L20 18" />
                  <path d="M8 18h8" />
                </svg>
              </span>
              <div>
                <p className={styles.kicker}>{t('app.eyebrow')}</p>
                <h1 className={styles.brand}>{t('app.title')}</h1>
              </div>
            </div>
            <p className={styles.lede}>{t('app.subtitle')}</p>
          </header>

          <div className={styles.board}>
            <form className={styles.brief} onSubmit={submit}>
              <div className={styles.briefHead}>
                <h2>{t('form.roleSection')}</h2>
                <p>{t('form.hint')}</p>
              </div>

              <div className={styles.fieldRow}>
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

              <div className={styles.taskBlock}>
                <h3>{t('form.taskSection')}</h3>
                <div className={styles.taskRail}>
                  {JOB_SEARCH_TASKS.map(task => (
                    <button
                      key={task.id}
                      type="button"
                      className={form.task === task.id ? styles.taskActive : styles.task}
                      onClick={() => change('task', task.id as JobSearchTask)}
                      disabled={loading}
                    >
                      <span className={styles.taskMark}>{task.mark}</span>
                      <span className={styles.taskCopy}>
                        <strong>{t(task.labelKey as MessageKeys)}</strong>
                        <small>{t(task.descKey as MessageKeys)}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.materials}>
                <label className={styles.field}>
                  <span>{t('form.resume')}</span>
                  <textarea
                    value={form.resume}
                    onChange={e => change('resume', e.target.value)}
                    placeholder={t('form.resumePlaceholder')}
                    rows={9}
                    disabled={loading}
                  />
                </label>
                <label className={styles.field}>
                  <span>{t('form.jobDescription')}</span>
                  <textarea
                    value={form.jobDescription}
                    onChange={e => change('jobDescription', e.target.value)}
                    placeholder={t('form.jobDescriptionPlaceholder')}
                    rows={9}
                    disabled={loading}
                  />
                </label>
              </div>

              <div className={styles.actions}>
                <button className={styles.primary} type="submit" disabled={loading}>
                  {loading ? t('form.submitting') : t('form.submit')}
                </button>
                {loading && (
                  <button className={styles.ghost} type="button" onClick={stop}>
                    {t('form.stop')}
                  </button>
                )}
              </div>
            </form>

            <aside className={styles.canvas} aria-live="polite">
              <div className={styles.canvasHead}>
                <div>
                  <p className={styles.kicker}>{t('coach.label')}</p>
                  <h2>{t(taskMeta.labelKey as MessageKeys)}</h2>
                </div>
                {(form.targetRole || form.targetCompany) && (
                  <div className={styles.meta}>
                    {form.targetRole && <span>{form.targetRole}</span>}
                    {form.targetCompany && <span>{form.targetCompany}</span>}
                  </div>
                )}
              </div>

              {progress.length > 0 && (
                <ol className={styles.progress}>
                  {progress.map((item, index) => (
                    <li key={`${item}-${index}`}>
                      <span className={styles.progressMark}>
                        {index === progress.length - 1 && loading ? <i className={styles.spinner} /> : index + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              )}

              {error && (
                <div className={styles.error}>
                  <strong>{t('result.errorTitle')}</strong>
                  <p>{error}</p>
                  <button type="button" className={styles.ghost} onClick={startAnalysis}>
                    {t('result.retry')}
                  </button>
                </div>
              )}

              {historyLoading && (
                <div className={styles.empty}>
                  <i className={styles.spinner} />
                  <p>{t('result.loading')}</p>
                </div>
              )}

              {!historyLoading && !result && !loading && !error && (
                <div className={styles.empty}>
                  <div className={styles.emptyMark} aria-hidden>
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M4 18 L12 4 L20 18" />
                      <path d="M8 18h8" />
                    </svg>
                  </div>
                  <h3>{t('result.emptyTitle')}</h3>
                  <p>{t('result.emptyHint')}</p>
                </div>
              )}

              {result && (
                <article className={styles.result}>
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
