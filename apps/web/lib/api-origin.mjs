/** Hosted NestJS API (Vercel). Override with API_INTERNAL_URL in .env. */
export const PRODUCTION_API_ORIGIN = "https://umq-api-api.vercel.app";

export function getApiOrigin() {
  const fromEnv = process.env.API_INTERNAL_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL) return PRODUCTION_API_ORIGIN;
  return `http://127.0.0.1:${process.env.API_PORT ?? "4001"}`;
}
