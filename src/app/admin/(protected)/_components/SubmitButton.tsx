"use client";

import { useFormStatus } from "react-dom";
import { buttonPrimaryClass } from "./ui";

export default function SubmitButton({
  children,
  className,
  pendingLabel = "Kaydediliyor...",
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className ?? buttonPrimaryClass}>
      {pending ? pendingLabel : children}
    </button>
  );
}
