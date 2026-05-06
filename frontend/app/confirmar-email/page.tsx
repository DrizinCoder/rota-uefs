"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EmailConfirmationScreen } from "@/components/auth/email-confirmation-screen";
import {
  EmailChangeErrorScreen,
  type EmailErrorType,
} from "@/components/auth/email-change-error-screen";
import { Spinner } from "@/components/ui/spinner";

const ERROR_STATUSES: Record<string, EmailErrorType> = {
  email_in_use: "email_in_use",
  invalid_email: "invalid_email",
  expired: "expired",
  error: "error",
};

function ConfirmarEmailContent() {
  const searchParams = useSearchParams();
  const rawStatus = searchParams.get("status") ?? "";
  const message = decodeURIComponent(searchParams.get("message") ?? "");

  if (rawStatus === "success") {
    return <EmailConfirmationScreen message={message} />;
  }

  const errorType: EmailErrorType = ERROR_STATUSES[rawStatus] ?? "error";
  return <EmailChangeErrorScreen errorType={errorType} message={message} />;
}

export default function ConfirmarEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Spinner className="h-12 w-12 text-[#103173]" />
        </div>
      }
    >
      <ConfirmarEmailContent />
    </Suspense>
  );
}
