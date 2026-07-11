import { ApiError } from "@workspace/api-client-react";

const PLAN_LIMIT_CODES = new Set(["FEATURE_NOT_AVAILABLE", "USAGE_LIMIT_REACHED"]);

export type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
  };
};

export type AppApiError = Error & {
  apiCode?: string;
  status?: number;
};

export function markAppApiError(
  err: Error,
  body: ApiErrorBody | null | undefined,
  status: number,
): AppApiError {
  const marked = err as AppApiError;
  marked.apiCode = body?.error?.code;
  marked.status = status;
  return marked;
}

export function getApiErrorMessage(err: unknown, fallback = "خطا در انجام عملیات"): string {
  if (err instanceof ApiError) {
    const body = err.data as ApiErrorBody | null;
    if (body?.error?.message) return body.error.message;
  }
  if (err instanceof Error && err.message && !err.message.startsWith("HTTP ")) {
    return err.message;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export function isPlanLimitError(err: unknown): boolean {
  if (err instanceof ApiError && err.status === 403) {
    const code = (err.data as ApiErrorBody | null)?.error?.code;
    return !!code && PLAN_LIMIT_CODES.has(code);
  }

  const app = err as AppApiError;
  if (app.status === 403 && app.apiCode && PLAN_LIMIT_CODES.has(app.apiCode)) {
    return true;
  }

  return false;
}
