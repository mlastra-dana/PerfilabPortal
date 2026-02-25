import { HTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

type Tone = "neutral" | "ok" | "warn" | "bad" | "default" | "success" | "warning";

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
};

const tones: Record<Tone, string> = {
  neutral: "bg-brand-surface text-brand-text",
  ok: "bg-state-ok/15 text-state-ok",
  warn: "bg-state-warn/15 text-state-warn",
  bad: "bg-state-bad/15 text-state-bad",
  default: "bg-brand-surface text-brand-text",
  success: "bg-state-ok/15 text-state-ok",
  warning: "bg-state-warn/15 text-state-warn",
};

export function Badge({ className, tone = "neutral", ...props }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
