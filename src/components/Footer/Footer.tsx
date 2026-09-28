import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.notice}>
          No logins required. Sessions are not recorded. Zoom links are shared with
          registered attendees only &mdash; passwords are not published here.
        </p>
        <p className={styles.meta}>
          &copy; {new Date().getFullYear()} CETL AI Symposium. Held at the Pitman
          Center.
        </p>
      </div>
    </footer>
  )
}
