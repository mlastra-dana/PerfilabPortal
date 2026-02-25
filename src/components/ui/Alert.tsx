import { HTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

type Variant = "info" | "warn" | "bad" | "warning" | "danger";

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  info: "border-brand-primary/25 bg-brand-primary/10 text-brand-text",
  warn: "border-state-warn/25 bg-state-warn/10 text-brand-ink",
  bad: "border-state-bad/25 bg-state-bad/10 text-brand-ink",
  warning: "border-state-warn/25 bg-state-warn/10 text-brand-ink",
  danger: "border-state-bad/25 bg-state-bad/10 text-brand-ink",
};

export function Alert({ className, variant = "info", ...props }: Props) {
  return (
    <div
      className={cn("rounded-2xl border px-4 py-3 text-sm", variants[variant], className)}
      {...props}
    />
  );
}
