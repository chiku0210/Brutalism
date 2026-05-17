import styles from './SectionShell.module.css';

interface SectionShellProps {
  label: string;
  title: string;
  meta?: string;
}

export default function SectionShell({ label, title, meta }: SectionShellProps) {
  return (
    <header className={styles.shell}>
      <p className={styles.label}>{label}</p>
      <div className={styles.row}>
        <h2 className={styles.title}>{title}</h2>
        {meta ? <p className={styles.meta}>{meta}</p> : null}
      </div>
    </header>
  );
}
