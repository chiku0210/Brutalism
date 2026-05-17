import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>NIELLESS :: v3.3</div>
      <div className={styles.center}>&quot;Build until it holds.&quot;</div>
      <div className={styles.right}>nielless.com</div>
    </footer>
  );
}
