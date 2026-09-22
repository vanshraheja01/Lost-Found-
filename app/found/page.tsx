import type { Metadata } from "next";
import Link from "next/link";
import ItemForm from "@/components/ItemForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Report Found Item | Lost & Found",
};

export default function FoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <Link href="/" className={styles.back}>
            ← Back
          </Link>

          <h1>Report Found Item</h1>
          <p className={styles.subtitle}>Upload a picture so the owner can identify it.</p>

          <ItemForm type="found" />
        </div>
      </div>
    </main>
  );
}
