import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <main className={styles.hero}>
        <div className={styles.overlay} />

        <div className={styles.heroContent}>
          <h1>Lost Something?</h1>

          <p>Lost or found an item on campus? Help your fellow students find their belongings.</p>

          <div className={styles.choiceContainer}>
            <Link href="/lost" className={styles.choiceCard}>
              <div className={styles.choiceIcon}>🔍</div>
              <h2>I Lost Something</h2>
              <p>Report an item that you have lost.</p>
            </Link>

            <Link href="/found" className={styles.choiceCard}>
              <div className={styles.choiceIcon}>📦</div>
              <h2>I Found Something</h2>
              <p>Report an item that you found.</p>
            </Link>
          </div>

          <Link href="/items" className={styles.browseLink}>
            Browse all reported items →
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          Made by <strong>Vansh Raheja</strong> | HMRITM
        </p>
      </footer>
    </>
  );
}
