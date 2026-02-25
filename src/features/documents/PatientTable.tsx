import { Patient } from "@/app/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Props = {
  patients: Patient[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function PatientTable({ patients, selectedId, onSelect }: Props) {
  return (
    <Card>
      <h3 className="mb-4 text-base font-semibold">Pacientes</h3>

      <div className="hidden overflow-auto md:block">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-2">Nombre</th>
              <th className="pb-2">Documento</th>
              <th className="pb-2">Sede</th>
              <th className="pb-2">Accion</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-t">
                <td className="py-2">{patient.fullName}</td>
                <td className="py-2">{patient.documentId}</td>
                <td className="py-2">{patient.site}</td>
                <td className="py-2">
                  <Button
                    variant={selectedId === patient.id ? "secondary" : "ghost"}
                    onClick={() => onSelect(patient.id)}
                  >
                    Seleccionar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {patients.map((patient) => (
          <div key={patient.id} className="rounded-xl border p-3">
            <p className="font-semibold">{patient.fullName}</p>
            <p className="text-xs text-slate-500">{patient.documentId}</p>
            <p className="text-xs text-slate-500">{patient.site}</p>
            <Button
              className="mt-2 w-full"
              variant={selectedId === patient.id ? "secondary" : "ghost"}
              onClick={() => onSelect(patient.id)}
            >
              Seleccionar
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
