import type { ReactNode } from "react";

type Tone = "pending" | "accepted" | "rejected" | "cancelled" | "category" | "neutral";

type Props = {
  tone: Tone;
  children: ReactNode;
};

const TONE_CLASS: Record<Tone, string> = {
  pending: "bg-reuse-status-pending-bg text-reuse-status-pending",
  accepted: "bg-reuse-status-accepted-bg text-reuse-status-accepted",
  rejected: "bg-reuse-status-rejected-bg text-reuse-status-rejected",
  cancelled: "bg-reuse-status-cancelled-bg text-reuse-status-cancelled",
  category: "bg-reuse-avatar-bg text-reuse-green-dark",
  neutral: "bg-reuse-surface-muted text-reuse-text-secondary",
};

export default function Badge({ tone, children }: Props) {
  return (
    <span
      className={`inline-block w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  );
}
