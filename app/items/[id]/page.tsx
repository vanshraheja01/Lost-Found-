import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemById } from "@/lib/db/items";
import styles from "./page.module.css";

interface ItemDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ItemDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getItemById(id);
  return { title: item ? `${item.itemName} | Lost & Found` : "Item not found | Lost & Found" };
}

export default async function ItemDetailPage({ params }: ItemDetailPageProps) {
  const { id } = await params;
  const item = await getItemById(id);

  if (!item) {
    notFound();
  }

  const dateLabel = item.type === "lost" ? "Date Lost" : "Date Found";
  const locationLabel = item.type === "lost" ? "Location Lost" : "Location Found";

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/items" className={styles.back}>
          ← Back to all items
        </Link>

        <div className={styles.card}>
          <div className={styles.media}>
            {item.imageDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- stored as a data URL, not a static asset
              <img src={item.imageDataUrl} alt={item.itemName} className={styles.image} />
            ) : (
              <div className={styles.noImage}>📦</div>
            )}
            <span className={item.type === "lost" ? styles.badgeLost : styles.badgeFound}>
              {item.type === "lost" ? "Lost" : "Found"}
            </span>
          </div>

          <div className={styles.details}>
            <h1>{item.itemName}</h1>
            <p className={styles.category}>{item.category}</p>

            <p className={styles.description}>{item.description}</p>

            <dl className={styles.factList}>
              {item.color && (
                <div>
                  <dt>Color</dt>
                  <dd>{item.color}</dd>
                </div>
              )}
              {item.location && (
                <div>
                  <dt>{locationLabel}</dt>
                  <dd>{item.location}</dd>
                </div>
              )}
              {item.date && (
                <div>
                  <dt>{dateLabel}</dt>
                  <dd>{item.date}</dd>
                </div>
              )}
              <div>
                <dt>Reported</dt>
                <dd>{new Date(item.createdAt).toLocaleString()}</dd>
              </div>
            </dl>

            <div className={styles.contactBox}>
              <h2>Contact {item.type === "lost" ? "the owner" : "the finder"}</h2>
              <p>
                <strong>{item.contactName}</strong>
              </p>
              <p>
                <a href={`mailto:${item.email}`}>{item.email}</a>
              </p>
              {item.phone && (
                <p>
                  <a href={`tel:${item.phone}`}>{item.phone}</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
