import { useEffect, useRef } from 'react';
import type { Message } from '../types';
import { useT, MessageKeys } from '../i18n';
import ChatBubble from './ChatBubble';
import styles from './ChatWindow.module.css';

interface Props {
  messages: Message[];
  loading: boolean;
}

const EMPTY_CARDS = [
  { icon: '📄', titleKey: 'empty.card.resume', descKey: 'empty.card.resumeDesc' },
  { icon: '✏️', titleKey: 'empty.card.tailor', descKey: 'empty.card.tailorDesc' },
  { icon: '🎯', titleKey: 'empty.card.interview', descKey: 'empty.card.interviewDesc' },
  { icon: '📋', titleKey: 'empty.card.track', descKey: 'empty.card.trackDesc' },
] as const;

export default function ChatWindow({ messages, loading }: Props) {
  const windowRef = useRef<HTMLDivElement>(null);
  const { t } = useT();

  useEffect(() => {
    if (messages.length === 0 && !loading) return;
    const el = windowRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: loading ? 'instant' : 'smooth' });
  }, [messages, loading]);

  return (
    <div ref={windowRef} className={styles.window}>
      {messages.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyHero}>
            <span className={styles.emptyIcon} aria-hidden>💼</span>
            <p className={styles.emptyTitle}>{t('empty.title')}</p>
            <p className={styles.emptyHint}>{t('empty.hint')}</p>
          </div>
          <div className={styles.emptyGrid}>
            {EMPTY_CARDS.map(({ icon, titleKey, descKey }) => (
              <div key={titleKey} className={styles.emptyCard}>
                <span className={styles.emptyCardIcon} aria-hidden>{icon}</span>
                <p className={styles.emptyCardTitle}>{t(titleKey as MessageKeys)}</p>
                <p className={styles.emptyCardDesc}>{t(descKey as MessageKeys)}</p>
              </div>
            ))}
          </div>
          <p className={styles.emptyFeatures}>{t('empty.features')}</p>
        </div>
      )}

      {messages.map(msg => (
        <ChatBubble key={msg.id} message={msg} />
      ))}

      {loading && !(messages.length > 0 && messages[messages.length - 1].role === 'assistant' && (messages[messages.length - 1].content.length > 0 || messages[messages.length - 1].activity)) && (
        <div className={styles.typingRow}>
          <div className={styles.avatar} aria-hidden>💼</div>
          <div className={styles.typing}>
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
    </div>
  );
}
