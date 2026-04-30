"use client";

import { AlertTriangle } from "lucide-react";

type AdminErrorBannerProps = {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export function AdminErrorBanner({
  message,
  onRetry,
  retryLabel = "Tentar novamente",
}: AdminErrorBannerProps) {
  return (
    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
      <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
      <p className="text-sm font-medium text-red-700">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="ml-auto text-xs font-bold text-red-600 underline hover:no-underline"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}
