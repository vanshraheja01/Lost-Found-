"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DeleteItemButton.module.css";

interface DeleteItemButtonProps {
  itemId: string;
  itemName: string;
}

export default function DeleteItemButton({ itemId, itemName }: DeleteItemButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirmedDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/items/${itemId}`, { method: "DELETE" });

      if (!response.ok) {
        setError("Could not delete this item. Please try again.");
        setIsDeleting(false);
        setConfirming(false);
        return;
      }

      router.push("/items");
      router.refresh();
    } catch {
      setError("Unable to connect to the server. Please try again.");
      setIsDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.confirmText}>Delete &ldquo;{itemName}&rdquo;? This can&apos;t be undone.</p>
        <div className={styles.confirmRow}>
          <button type="button" onClick={handleConfirmedDelete} disabled={isDeleting} className={styles.confirmDeleteButton}>
            {isDeleting ? "Deleting…" : "Yes, delete it"}
          </button>
          <button type="button" onClick={() => setConfirming(false)} disabled={isDeleting} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button type="button" onClick={() => setConfirming(true)} className={styles.deleteButton}>
        Delete this report
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
