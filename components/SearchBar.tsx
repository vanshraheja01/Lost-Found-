"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ITEM_CATEGORIES } from "@/types/item";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/items?${params.toString()}`);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    updateParam("q", query.trim());
  }

  return (
    <div className={styles.bar}>
      <form onSubmit={handleSubmit} className={styles.searchForm}>
        <input
          type="search"
          placeholder="Search by item name, description, or location…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className={styles.input}
          aria-label="Search items"
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>

      <div className={styles.filters}>
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            defaultValue={searchParams.get("type") ?? "all"}
            onChange={(event) => updateParam("type", event.target.value)}
            aria-label="Filter by type"
          >
            <option value="all">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>

        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            defaultValue={searchParams.get("category") ?? "all"}
            onChange={(event) => updateParam("category", event.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {ITEM_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
