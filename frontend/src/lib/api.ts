import axios from "axios";

function resolveBaseURL(): string {
  const explicit = import.meta.env.VITE_API_BASE_URL;
  if (explicit) return explicit;
  return ""; // same-origin (Vercel serverless functions in /api)
}

export const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 15_000,
});

/** No-op for standalone marketing site */
export async function ensureCsrf(): Promise<void> {
  return;
}

