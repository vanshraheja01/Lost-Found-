import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import styles from "./page.module.css";

export default function ItemNotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/items" className={styles.back}>
          ← Back to all items
        </Link>
        <EmptyState icon="❓" title="Item not found" description="This item may have been removed, or the link is incorrect." />
      </div>
    </main>
  );
}
