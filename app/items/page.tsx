import { Suspense } from "react";
import type { Metadata } from "next";
import SearchBar from "@/components/SearchBar";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
import { listItems } from "@/lib/db/items";
import { itemCategoryFilterSchema, itemTypeFilterSchema } from "@/lib/validation";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Browse Items | Lost & Found",
};

export const dynamic = "force-dynamic";

interface ItemsPageProps {
  searchParams: Promise<{ type?: string; category?: string; q?: string }>;
}

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  const params = await searchParams;
  const typeResult = itemTypeFilterSchema.safeParse(params.type);
  const categoryResult = itemCategoryFilterSchema.safeParse(params.category);
  const type = typeResult.success ? typeResult.data : "all";
  const category = categoryResult.success ? categoryResult.data : "all";
  const q = params.q?.trim() || undefined;

  const items = await listItems({ type, category, q });

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1>Browse Reported Items</h1>
        <p className={styles.subtitle}>Search everything the campus has reported lost or found.</p>

        <Suspense fallback={<div className={styles.searchPlaceholder} />}>
          <SearchBar />
        </Suspense>

        {items.length === 0 ? (
          <EmptyState
            icon="🗂️"
            title="No items found"
            description="Try a different search term or filter, or check back later."
          />
        ) : (
          <div className={styles.grid}>
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
