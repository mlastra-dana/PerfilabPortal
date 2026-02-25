import { LabelHTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

type Props = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: Props) {
  return <label className={cn("mb-1 block text-sm font-medium text-brand-text", className)} {...props} />;
}
