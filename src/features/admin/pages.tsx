import { ReactNode, useState } from "react";
import { AuthedLayout } from "@/components/layout/AuthedLayout";
import { RestrictedAccess } from "@/components/layout/RestrictedAccess";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";
import { AuditLog } from "@/features/audit/AuditLog";
import { useDemoRoleStore } from "@/features/demo/useDemoRoleStore";
import { UploadForm } from "@/features/documents/UploadForm";
import { mockPatients } from "@/mocks/patients";

const adminNav = [
  { to: "/admin/patients", label: "Pacientes" },
  { to: "/admin/uploads", label: "Carga de Resultados" },
  { to: "/admin/audit", label: "Auditoria" },
];

function AdminGuard({ children }: { children: ReactNode }) {
  const role = useDemoRoleStore((s) => s.role);

  if (role === "patient") {
    return <RestrictedAccess message="Tu rol actual es patient. Esta area es para staff o admin." />;
  }

  return <>{children}</>;
}

export function AdminPatientsPage() {
  const [query, setQuery] = useState("");
  const rows = mockPatients.filter((p) => `${p.fullName} ${p.documentId}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <AuthedLayout title="Admin · Pacientes" items={adminNav}>
      <AdminGuard>
        <Card>
          <Label htmlFor="search-patient">Buscar paciente</Label>
          <Input id="search-patient" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nombre o documento" />
        </Card>

        <div className="mt-3">
          <ResponsiveTable
            data={rows}
            mobileTitle={(row) => row.fullName}
            columns={[
              { key: "name", header: "Nombre", render: (row) => row.fullName },
              { key: "document", header: "Documento", render: (row) => row.documentId },
              { key: "history", header: "Historia", render: (row) => row.historyNumber },
              { key: "email", header: "Correo", render: (row) => row.email },
              { key: "insurer", header: "Aseguradora", render: (row) => `${row.insurer} / ${row.plan}` },
            ]}
          />
        </div>
      </AdminGuard>
    </AuthedLayout>
  );
}

export function AdminUploadsPage() {
  const role = useDemoRoleStore((s) => s.role);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(mockPatients[0]?.id || "");
  const rows = mockPatients.filter((p) => `${p.fullName} ${p.documentId}`.toLowerCase().includes(query.toLowerCase()));
  const selected = rows.find((row) => row.id === selectedId);

  return (
    <AuthedLayout title="Admin · Carga de Resultados" items={adminNav}>
      <AdminGuard>
        <Alert>Sube resultados médicos con metadatos. Persistencia real pendiente (modo demostración).</Alert>

        <Card className="mt-3">
          <Label htmlFor="search-upload">Buscar paciente</Label>
          <Input id="search-upload" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nombre o documento" />
        </Card>

        <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
          <ResponsiveTable
            data={rows}
            mobileTitle={(row) => row.fullName}
            columns={[
              { key: "name", header: "Nombre", render: (row) => row.fullName },
              { key: "document", header: "Documento", render: (row) => row.documentId },
              { key: "site", header: "Sede", render: (row) => row.site },
              {
                key: "action",
                header: "Accion",
                render: (row) => (
                  <Button variant={selectedId === row.id ? "dark" : "ghost"} onClick={() => setSelectedId(row.id)}>
                    Seleccionar
                  </Button>
                ),
              },
            ]}
          />
          <UploadForm patient={selected} actor={`${role}@demo.local`} />
        </div>
      </AdminGuard>
    </AuthedLayout>
  );
}

export function AdminAuditPage() {
  return (
    <AuthedLayout title="Admin · Auditoria" items={adminNav}>
      <AdminGuard>
        <Card>
          <h2 className="text-base font-semibold">Trazabilidad de Resultados Médicos</h2>
          <p className="mt-2 text-sm text-brand-muted">Eventos demo: role_changed, page_view, document_view, download_clicked.</p>
        </Card>
        <div className="mt-3">
          <AuditLog />
        </div>
      </AdminGuard>
    </AuthedLayout>
  );
}
