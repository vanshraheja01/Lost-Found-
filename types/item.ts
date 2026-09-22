export const ITEM_TYPES = ["lost", "found"] as const;
export type ItemType = (typeof ITEM_TYPES)[number];

export const ITEM_CATEGORIES = [
  "Electronics",
  "Documents",
  "Keys",
  "Wallet",
  "Books",
  "Clothing",
  "Other",
] as const;
export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export interface Item {
  id: string;
  type: ItemType;
  itemName: string;
  category: ItemCategory;
  color: string | null;
  description: string;
  location: string | null;
  date: string | null;
  imageDataUrl: string | null;
  contactName: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

/** Shape of the JSON body POSTed to /api/items. */
export interface CreateItemInput {
  type: ItemType;
  itemName: string;
  category: ItemCategory;
  color?: string;
  description: string;
  location?: string;
  date?: string;
  imageDataUrl?: string;
  contactName: string;
  email: string;
  phone?: string;
}

export interface ItemListResponse {
  items: Item[];
  total: number;
}

export interface ApiErrorResponse {
  message: string;
  fieldErrors?: Partial<Record<keyof CreateItemInput, string>>;
}

export interface ItemFilters {
  type?: ItemType | "all";
  category?: ItemCategory | "all";
  q?: string;
}
