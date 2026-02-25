import { InputHTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm placeholder:text-brand-muted",
        className,
      )}
      {...props}
    />
  );
}
