"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { GripVertical, ImagePlus, X } from "lucide-react";
import { api } from "@/lib/api";
import { ApiError, isApiConnectionError } from "@/lib/api/http/client";
import { resolveMediaUrl } from "@/lib/media-url";
import { Button } from "@/components/ui/button";

export type GalleryItem = { id: string; url: string };

export function MediaGalleryInput({
  items,
  folder,
  locale,
  onChange,
}: {
  items: GalleryItem[];
  folder: string;
  locale: "ar" | "en";
  onChange: (items: GalleryItem[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError(
        locale === "ar" ? "يرجى اختيار صورة." : "Please choose an image file.",
      );
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const uploaded = await api.cms.media.upload(fd);
      onChange([...items, { id: uploaded.id, url: uploaded.url }]);
    } catch (err) {
      if (isApiConnectionError(err)) {
        setError(
          locale === "ar"
            ? "لا يمكن الاتصال بالـ API — شغّل السيرفر: pnpm --filter @umq/api dev"
            : "Cannot reach API — start: pnpm --filter @umq/api dev",
        );
      } else if (err instanceof ApiError) {
        setError(
          err.status === 403 && locale === "ar"
            ? "ليس لديك صلاحية رفع الصور"
            : err.message,
        );
      } else {
        setError(locale === "ar" ? "فشل رفع الصورة." : "Image upload failed.");
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (from: number, to: number) => {
    if (from < 0 || from >= items.length || to < 0 || to >= items.length)
      return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">
        {locale === "ar" ? "صور المشروع" : "Project images"}
      </label>

      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) => {
            const src = resolveMediaUrl(item.url) ?? item.url;
            return (
              <div
                key={`${item.id}-${index}`}
                className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-border"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="160px"
                  unoptimized={src.startsWith("http")}
                />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex gap-0.5">
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-accent/10 disabled:opacity-30"
                      disabled={index === 0}
                      onClick={() => moveItem(index, index - 1)}
                      aria-label={
                        locale === "ar" ? "تحريك لليسار" : "Move left"
                      }
                    >
                      <GripVertical className="h-3.5 w-3.5 rotate-90" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1 hover:bg-accent/10 disabled:opacity-30"
                      disabled={index === items.length - 1}
                      onClick={() => moveItem(index, index + 1)}
                      aria-label={
                        locale === "ar" ? "تحريك لليمين" : "Move right"
                      }
                    >
                      <GripVertical className="h-3.5 w-3.5 -rotate-90" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="rounded p-1 hover:bg-red-500/10"
                    onClick={() => removeAt(index)}
                    aria-label={locale === "ar" ? "حذف الصورة" : "Remove image"}
                  >
                    <X className="h-3.5 w-3.5 text-red-600" />
                  </button>
                </div>
                {index === 0 && (
                  <span className="absolute bottom-1 start-1 rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-white">
                    {locale === "ar" ? "الغلاف" : "Cover"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex max-w-sm flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface/50 px-4 py-6 text-center">
        <ImagePlus className="h-7 w-7 text-foreground-muted" aria-hidden />
        <p className="text-xs text-foreground-muted">
          {locale === "ar"
            ? "PNG, JPG, WebP — حتى 10MB — يمكنك رفع عدة صور"
            : "PNG, JPG, WebP — up to 10MB — upload multiple images"}
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      <Button
        type="button"
        size="sm"
        variant="secondary"
        loading={uploading}
        onClick={() => fileRef.current?.click()}
      >
        {locale === "ar" ? "إضافة صورة" : "Add image"}
      </Button>
    </div>
  );
}

export function parseGalleryValue(raw: string): GalleryItem[] {
  if (!raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is GalleryItem =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as GalleryItem).id === "string" &&
        typeof (item as GalleryItem).url === "string",
    );
  } catch {
    return [];
  }
}

export function serializeGalleryValue(items: GalleryItem[]): string {
  return JSON.stringify(items);
}
