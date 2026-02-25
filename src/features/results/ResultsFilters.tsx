import { ChangeEvent } from "react";
import { Input } from "@/components/ui/Input";

export type ResultFilters = {
  fromDate: string;
  toDate: string;
  category: string;
  site: string;
  status: string;
};

type Props = {
  filters: ResultFilters;
  onChange: (next: ResultFilters) => void;
};

export function ResultsFilters({ filters, onChange }: Props) {
  const update = (field: keyof ResultFilters) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    onChange({ ...filters, [field]: e.target.value });

  return (
    <div className="grid gap-3 md:grid-cols-5">
      <label className="text-sm">
        Desde
        <Input type="date" value={filters.fromDate} onChange={update("fromDate")} />
      </label>
      <label className="text-sm">
        Hasta
        <Input type="date" value={filters.toDate} onChange={update("toDate")} />
      </label>
      <label className="text-sm">
        Tipo
        <select
          value={filters.category}
          onChange={update("category")}
          className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="Laboratorio">Laboratorio</option>
          <option value="Rayos X">Rayos X</option>
          <option value="Mamografias">Mamografias</option>
        </select>
      </label>
      <label className="text-sm">
        Sede
        <Input placeholder="Ej. Sede Central" value={filters.site} onChange={update("site")} />
      </label>
      <label className="text-sm">
        Estado
        <select
          value={filters.status}
          onChange={update("status")}
          className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="nuevo">Nuevo</option>
          <option value="visto">Visto</option>
        </select>
      </label>
    </div>
  );
}
