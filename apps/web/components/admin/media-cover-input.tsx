"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { api } from "@/lib/api";
import { ApiError, isApiConnectionError } from "@/lib/api/http/client";
import { resolveMediaUrl } from "@/lib/media-url";
import { fileWithSafeName } from "@/lib/safe-upload-filename";
import { Button } from "@/components/ui/button";

export function MediaCoverInput({
  mediaId,
  previewUrl,
  folder,
  locale,
  onChange,
}: {
  mediaId: string;
  previewUrl?: string;
  folder: string;
  locale: "ar" | "en";
  onChange: (mediaId: string, previewUrl: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displaySrc = previewUrl
    ? (resolveMediaUrl(previewUrl) ?? previewUrl)
    : undefined;

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
      fd.append("file", fileWithSafeName(file));
      fd.append("folder", folder);
      const uploaded = await api.cms.media.upload(fd);
      onChange(uploaded.id, uploaded.url);
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

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {locale === "ar" ? "صورة الغلاف" : "Cover image"}
      </label>
      {displaySrc ? (
        <div className="relative aspect-[16/10] max-w-sm overflow-hidden rounded-xl border border-border">
          <Image
            src={displaySrc}
            alt=""
            fill
            className="object-cover"
            sizes="320px"
            unoptimized={displaySrc.startsWith("http")}
          />
          <button
            type="button"
            className="absolute end-2 top-2 rounded-lg bg-background/90 p-1.5 shadow-sm hover:bg-background"
            onClick={() => onChange("", "")}
            aria-label={locale === "ar" ? "إزالة الصورة" : "Remove image"}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex max-w-sm flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface/50 px-4 py-8 text-center">
          <ImagePlus className="h-8 w-8 text-foreground-muted" aria-hidden />
          <p className="text-xs text-foreground-muted">
            {locale === "ar"
              ? "PNG, JPG, WebP — حتى 10MB"
              : "PNG, JPG, WebP — up to 10MB"}
          </p>
        </div>
      )}
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
      {mediaId && (
        <p className="text-xs text-foreground-muted">
          {locale === "ar" ? "معرّف الوسائط:" : "Media ID:"} {mediaId}
        </p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button
        type="button"
        size="sm"
        variant="secondary"
        loading={uploading}
        onClick={() => fileRef.current?.click()}
      >
        {displaySrc
          ? locale === "ar"
            ? "تغيير الصورة"
            : "Change image"
          : locale === "ar"
            ? "رفع صورة"
            : "Upload image"}
      </Button>
    </div>
  );
}
