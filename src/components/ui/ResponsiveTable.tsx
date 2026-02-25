import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  mobileTitle: (item: T) => string;
};

export function ResponsiveTable<T>({ data, columns, mobileTitle }: Props<T>) {
  return (
    <>
      <div className="hidden overflow-auto rounded-2xl border border-brand-border bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-surface text-brand-muted">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-3 py-2 font-semibold">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx} className="border-t border-brand-border">
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-2">{col.render(item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {data.map((item, idx) => (
          <Card key={idx}>
            <p className="mb-2 font-semibold">{mobileTitle(item)}</p>
            <div className="space-y-1 text-sm">
              {columns.map((col) => (
                <p key={col.key}><strong>{col.header}:</strong> {col.render(item)}</p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
