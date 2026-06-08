const MEDIA_FILE_RE = /\/media\/files\/([^?#]+)/;
const FALLBACK_API_ORIGIN = "https://umq-api-api.vercel.app";

/** Same-origin path for an uploaded media file. */
export function mediaFilePath(mediaId: string): string {
  const id = mediaId.trim();
  if (!id) return "";
  return `/api/v1/media/files/${encodeURIComponent(id)}`;
}

/** Normalize API media URLs for Next.js Image (same-origin proxy). */
export function resolveMediaUrl(url?: string | null): string | undefined {
  const trimmed = url?.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith("/api/v1/media/files/")) {
    return trimmed;
  }

  if (trimmed.startsWith("/media/files/")) {
    return `/api/v1${trimmed}`;
  }

  if (trimmed.startsWith("api/v1/media/files/")) {
    return `/${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed, "http://local.invalid");
    const match = parsed.pathname.match(MEDIA_FILE_RE);
    if (match?.[1]) {
      return mediaFilePath(decodeURIComponent(match[1]));
    }
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
  } catch {
    /* relative or bare id */
  }

  if (!trimmed.includes("/") && !trimmed.includes("://")) {
    return mediaFilePath(trimmed);
  }

  return trimmed.startsWith("/") ? trimmed : undefined;
}

/** Proxied API media should skip Next image optimizer (rewrite-friendly). */
export function isProxiedMediaUrl(src: string): boolean {
  return src.startsWith("/api/v1/media/");
}

/** Gallery URLs for a project (falls back to single cover). */
export function getProjectImages(project: {
  imageUrls?: string[];
  coverImageUrl?: string;
}): string[] {
  const fromGallery = (project.imageUrls ?? [])
    .map((url) => resolveMediaUrl(url) ?? url)
    .filter(Boolean);
  if (fromGallery.length > 0) return fromGallery;

  const cover = resolveMediaUrl(project.coverImageUrl);
  return cover ? [cover] : [];
}

/** Try same-origin proxy first, then hosted API (helps local dev without media files). */
export function getMediaSrcCandidates(raw: string): string[] {
  const normalized = resolveMediaUrl(raw) ?? raw.trim();
  if (!normalized) return [];

  const candidates = new Set<string>();
  candidates.add(normalized);

  const apiPath = normalized.startsWith("/api/v1/")
    ? normalized
    : (() => {
        try {
          const parsed = new URL(normalized, "http://local.invalid");
          return parsed.pathname.startsWith("/api/v1/")
            ? parsed.pathname
            : null;
        } catch {
          return null;
        }
      })();

  if (apiPath) {
    candidates.add(`${FALLBACK_API_ORIGIN}${apiPath}`);
    if (typeof window !== "undefined") {
      candidates.add(`${window.location.origin}${apiPath}`);
    }
  }

  return Array.from(candidates);
}
