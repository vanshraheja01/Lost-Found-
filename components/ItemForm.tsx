"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "./FormField";
import CameraCapture from "./CameraCapture";
import Dropdown from "./Dropdown";
import StatusBanner from "./StatusBanner";
import { lostItemSchema, foundItemSchema, type CreateItemPayload } from "@/lib/validation";
import { ITEM_CATEGORIES } from "@/types/item";
import type { ApiErrorResponse, Item, ItemType } from "@/types/item";
import styles from "./ItemForm.module.css";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

interface ItemFormProps {
  type: ItemType;
}

export default function ItemForm({ type }: ItemFormProps) {
  const router = useRouter();
  const schema = type === "lost" ? lostItemSchema : foundItemSchema;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<CreateItemPayload>({
    resolver: zodResolver(schema),
    defaultValues: { type },
  });

  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<"camera" | "upload">("camera");
  const [imageError, setImageError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError("Image is too large (max 2MB).");
      return;
    }

    setImageError(null);
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function onSubmit(values: CreateItemPayload) {
    setStatus(null);

    const payload =
      values.type === "found" ? { ...values, imageDataUrl: imageDataUrl ?? undefined } : values;

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const err = data as ApiErrorResponse;
        setStatus({ kind: "error", message: err.message || "Something went wrong." });
        if (err.fieldErrors) {
          Object.entries(err.fieldErrors).forEach(([field, message]) => {
            setError(field as keyof CreateItemPayload, { message });
          });
        }
        return;
      }

      const item = data as Item;
      reset();
      setImageDataUrl(null);
      router.push(`/items/${item.id}`);
    } catch {
      setStatus({ kind: "error", message: "Unable to connect to the server. Please try again." });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      {status && <StatusBanner variant={status.kind}>{status.message}</StatusBanner>}

      <FormField label="Item Name" htmlFor="itemName" required error={errors.itemName?.message}>
        <input
          id="itemName"
          className={styles.input}
          placeholder={type === "lost" ? "Example: Car Keys" : "Example: Black Wallet"}
          {...register("itemName")}
        />
      </FormField>

      <FormField label="Category" htmlFor="category" required error={errors.category?.message}>
        <Controller
          name="category"
          control={control}
          defaultValue={undefined}
          render={({ field }) => (
            <Dropdown
              id="category"
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              options={ITEM_CATEGORIES}
              placeholder="Select category"
              invalid={!!errors.category}
            />
          )}
        />
      </FormField>

      <FormField label="Color" htmlFor="color" required={type === "lost"} error={errors.color?.message}>
        <input id="color" className={styles.input} placeholder="Example: Black" {...register("color")} />
      </FormField>

      <FormField label="Description" htmlFor="description" required error={errors.description?.message}>
        <textarea
          id="description"
          className={styles.textarea}
          placeholder={type === "lost" ? "Describe your item..." : "Describe what you found..."}
          spellCheck
          autoCorrect="on"
          autoCapitalize="sentences"
          {...register("description")}
        />
      </FormField>

      <FormField
        label={type === "lost" ? "Location Lost" : "Location Found"}
        htmlFor="location"
        error={errors.location?.message}
      >
        <input
          id="location"
          className={styles.input}
          placeholder={type === "lost" ? "Example: Library" : "Example: College Library"}
          {...register("location")}
        />
      </FormField>

      <FormField label={type === "lost" ? "Date Lost" : "Date Found"} htmlFor="date" error={errors.date?.message}>
        <input id="date" type="date" className={styles.input} {...register("date")} />
      </FormField>

      {type === "found" && (
        <div className={styles.imageSection}>
          <h2 className={styles.sectionTitle}>Item Image</h2>

          <div className={styles.imageTabs} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={imageMode === "camera"}
              className={imageMode === "camera" ? styles.tabActive : styles.tab}
              onClick={() => setImageMode("camera")}
            >
              Camera
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={imageMode === "upload"}
              className={imageMode === "upload" ? styles.tabActive : styles.tab}
              onClick={() => setImageMode("upload")}
            >
              Upload
            </button>
          </div>

          {imageMode === "camera" ? (
            <CameraCapture
              capturedImage={imageDataUrl}
              onCapture={setImageDataUrl}
              onRetake={() => setImageDataUrl(null)}
            />
          ) : (
            <FormField label="Upload Image" htmlFor="image" error={imageError ?? undefined}>
              <input id="image" type="file" accept="image/*" className={styles.fileInput} onChange={handleFileChange} />
              {imageDataUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- runtime data URL preview
                <img src={imageDataUrl} alt="Selected item" className={styles.uploadPreview} />
              )}
            </FormField>
          )}
        </div>
      )}

      <h2 className={styles.sectionTitle}>Contact Information</h2>

      <FormField label="Your Name" htmlFor="contactName" required error={errors.contactName?.message}>
        <input id="contactName" className={styles.input} {...register("contactName")} />
      </FormField>

      <FormField label="Email" htmlFor="email" required error={errors.email?.message}>
        <input id="email" type="email" className={styles.input} {...register("email")} />
      </FormField>

      <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
        <input id="phone" type="tel" className={styles.input} {...register("phone")} />
      </FormField>

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting && <span className={styles.buttonSpinner} aria-hidden="true" />}
        {isSubmitting ? "Submitting…" : type === "lost" ? "Report Lost Item" : "Report Found Item"}
      </button>
    </form>
  );
}
