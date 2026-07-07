import { useT, MessageKeys } from '../i18n';
import styles from './CareerHubPanel.module.css';

const FEATURE_KEYS = [
  { icon: '📄', titleKey: 'hub.feature.resume.title', descKey: 'hub.feature.resume.desc' },
  { icon: '✏️', titleKey: 'hub.feature.tailor.title', descKey: 'hub.feature.tailor.desc' },
  { icon: '🎯', titleKey: 'hub.feature.interview.title', descKey: 'hub.feature.interview.desc' },
  { icon: '📋', titleKey: 'hub.feature.track.title', descKey: 'hub.feature.track.desc' },
] as const;

const STEP_KEYS = ['hub.step.1', 'hub.step.2', 'hub.step.3', 'hub.step.4'] as const;

export default function CareerHubPanel() {
  const { t } = useT();

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <div className={styles.headerIcon}>💼</div>
        <div>
          <h2 className={styles.headerTitle}>{t('hub.title')}</h2>
          <p className={styles.headerSub}>{t('hub.subtitle')}</p>
        </div>
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionLabel}>{t('hub.capabilities')}</h3>
        <div className={styles.grid}>
          {FEATURE_KEYS.map(({ icon, titleKey, descKey }) => (
            <article key={titleKey} className={styles.card}>
              <span className={styles.cardIcon} aria-hidden>{icon}</span>
              <h4 className={styles.cardTitle}>{t(titleKey as MessageKeys)}</h4>
              <p className={styles.cardDesc}>{t(descKey as MessageKeys)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionLabel}>{t('hub.workflow')}</h3>
        <ol className={styles.steps}>
          {STEP_KEYS.map((key, i) => (
            <li key={key} className={styles.step}>
              <span className={styles.stepNum}>{i + 1}</span>
              <span className={styles.stepText}>{t(key as MessageKeys)}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionLabel}>{t('hub.workspace')}</h3>
        <div className={styles.paths}>
          <code className={styles.path}>workspace/resume/</code>
          <code className={styles.path}>workspace/applications/</code>
          <code className={styles.path}>workspace/research/</code>
          <code className={styles.path}>workspace/tracker.json</code>
        </div>
        <p className={styles.workspaceHint}>{t('hub.workspaceHint')}</p>
      </section>
    </div>
  );
}
