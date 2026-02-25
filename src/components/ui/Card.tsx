import { HTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

type Props = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-brand-border bg-white p-5 shadow-soft",
        className,
      )}
      {...props}
    />
  );
}
