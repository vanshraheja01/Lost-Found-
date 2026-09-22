import Link from "next/link";
import type { Item } from "@/types/item";
import styles from "./ItemCard.module.css";

interface ItemCardProps {
  item: Item;
}

const CATEGORY_ICONS: Record<string, string> = {
  Electronics: "🔌",
  Documents: "📄",
  Keys: "🔑",
  Wallet: "👛",
  Books: "📚",
  Clothing: "👕",
  Other: "📦",
};

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/items/${item.id}`} className={styles.card}>
      <div className={styles.thumb}>
        {item.imageDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- stored as a data URL, not a static asset
          <img src={item.imageDataUrl} alt={item.itemName} className={styles.thumbImage} />
        ) : (
          <span className={styles.thumbIcon}>{CATEGORY_ICONS[item.category] ?? "📦"}</span>
        )}
        <span className={item.type === "lost" ? styles.badgeLost : styles.badgeFound}>
          {item.type === "lost" ? "Lost" : "Found"}
        </span>
      </div>

      <div className={styles.body}>
        <h3>{item.itemName}</h3>
        <p className={styles.meta}>
          {item.category}
          {item.location ? ` · ${item.location}` : ""}
        </p>
        <p className={styles.description}>{item.description}</p>
      </div>
    </Link>
  );
}
