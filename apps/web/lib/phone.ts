/** E.164: + followed by country code and subscriber number (8–15 digits total). */
const E164_REGEX = /^\+[1-9]\d{7,14}$/;

export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const compact = trimmed.replace(/[\s\-()]/g, "");
  if (compact.startsWith("+")) return compact;
  if (/^\d+$/.test(compact)) return `+${compact}`;
  return compact;
}

export function isValidInternationalPhone(input: string): boolean {
  return E164_REGEX.test(normalizePhone(input));
}
