import { normalizePhone } from "@/lib/phone";

export function toMailtoHref(email: string): string {
  return `mailto:${encodeURIComponent(email.trim())}`;
}

/** Gmail compose — works in the browser when no desktop mail app is configured. */
export function toGmailComposeHref(email: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email.trim())}`;
}

export function toTelHref(phone: string): string {
  return `tel:${normalizePhone(phone)}`;
}

export function toWhatsAppHref(phone: string): string {
  return `https://wa.me/${normalizePhone(phone).replace(/\D/g, "")}`;
}

export function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/** Prefer Gmail web for @gmail.com addresses; otherwise mailto. */
export function emailActionHref(email: string): string {
  const trimmed = email.trim();
  if (trimmed.toLowerCase().endsWith("@gmail.com")) {
    return toGmailComposeHref(trimmed);
  }
  return toMailtoHref(trimmed);
}

/** tel: on mobile; WhatsApp web on desktop (no phone app on PC). */
export function phoneActionHref(phone: string): string {
  if (isMobileDevice()) return toTelHref(phone);
  return toWhatsAppHref(phone);
}

export function isExternalHref(href: string): boolean {
  return href.startsWith("http");
}

export function openEmailCompose(email: string): void {
  const href = emailActionHref(email);
  if (isExternalHref(href)) {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }
  window.location.href = href;
}

export function openPhoneDialer(phone: string): void {
  const href = phoneActionHref(phone);
  if (isExternalHref(href)) {
    window.open(href, "_blank", "noopener,noreferrer");
    return;
  }
  window.location.href = href;
}
