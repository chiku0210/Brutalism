import styles from './SiteHeader.module.css';

export default function SiteHeader() {
  return (
    <nav className={styles.header} aria-label="Site header">
      <div className={styles.mark}>NIELLESS</div>
      <div className={styles.nav}>
        <a href="#darkroom">DARKROOM</a>
        <a href="#blueprint">BLUEPRINT</a>
        <a href="#contact">CONTACT</a>
      </div>
    </nav>
  );
}
