import type { Metadata } from "next";
import Link from "next/link";
import ItemForm from "@/components/ItemForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Report Lost Item | Lost & Found",
};

export default function LostPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <Link href="/" className={styles.back}>
            ← Back
          </Link>

          <h1>Report Lost Item</h1>
          <p className={styles.subtitle}>Tell us about the item you lost.</p>

          <ItemForm type="lost" />
        </div>
      </div>
    </main>
  );
}
