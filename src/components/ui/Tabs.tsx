import { ReactNode } from "react";
import { cn } from "@/components/ui/cn";

export type TabItem = {
  key: string;
  label: string;
};

type Props = {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  rightSlot?: ReactNode;
};

export function Tabs({ tabs, value, onChange, className, rightSlot }: Props) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              "rounded-pill px-4 py-2 text-sm font-medium",
              value === tab.key
                ? "bg-brand-primary text-white"
                : "bg-white text-brand-text border border-brand-border",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {rightSlot}
    </div>
  );
}
