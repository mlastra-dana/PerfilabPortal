import { useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { ResultDocument } from "@/app/types";
import { AuthedLayout } from "@/components/layout/AuthedLayout";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuditStore } from "@/features/audit/useAuditStore";
import { useDemoRoleStore } from "@/features/demo/useDemoRoleStore";
import { useResultsStore } from "@/features/results/useResultsStore";
import { mockOrders } from "@/mocks/orders";
import { mockPatients } from "@/mocks/patients";

const patientNav = [
  { to: "/results/overview", label: "Resultados Medicos" },
  { to: "/results/labs", label: "Mis Resultados" },
];

const roleLabel: Record<string, string> = {
  patient: "Paciente",
  staff: "Staff",
  admin: "Admin",
};

type DocumentTypeFilter = "all" | "pdf" | "image";

function useActivePatient() {
  const role = useDemoRoleStore((s) => s.role);
  const patientSession = useDemoRoleStore((s) => s.patientSession);

  return useMemo(() => {
    if (role === "patient") {
      if (!patientSession) return null;
      return mockPatients.find((item) => item.id === patientSession.patientId) || null;
    }
    return mockPatients[0] || null;
  }, [role, patientSession]);
}

function useActor() {
  const patientSession = useDemoRoleStore((s) => s.patientSession);
  return patientSession ? `patient:${patientSession.documentId}` : "demo-user";
}

function useOverviewData() {
  const patient = useActivePatient();
  const role = useDemoRoleStore((s) => s.role);

  return useMemo(() => {
    if (!patient) return null;
    const activeOrders = mockOrders.filter((o) => o.patientId === patient.id && o.status !== "entregado").length;

    return {
      patient,
      activeOrders,
      roleText: roleLabel[role] || role,
    };
  }, [patient, role]);
}

function SummaryBlocks() {
  const summary = useOverviewData();

  if (!summary) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">No hay resultados para esta cédula</h2>
        <p className="mt-2 text-sm text-brand-muted">Verifica el documento e intenta nuevamente.</p>
      </Card>
    );
  }

  const { patient, activeOrders, roleText } = summary;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs text-brand-muted">Paciente</p>
          <p className="text-lg font-semibold">{patient.fullName}</p>
          <p className="text-xs text-brand-muted">HC: {patient.historyNumber}</p>
        </Card>
        <Card>
          <p className="text-xs text-brand-muted">Ordenes activas</p>
          <p className="text-2xl font-bold text-brand-primary">{activeOrders}</p>
        </Card>
        <Card>
          <p className="text-xs text-brand-muted">Rol demo</p>
          <p className="text-lg font-semibold">{roleText}</p>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="mb-2 text-base font-semibold">Informacion general del paciente</h2>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <p><strong>Nombre:</strong> {patient.fullName}</p>
          <p><strong>Documento:</strong> {patient.documentId}</p>
          <p><strong>Fecha de nacimiento:</strong> {patient.birthDate}</p>
          <p><strong>Telefono:</strong> {patient.phone}</p>
          <p><strong>Correo:</strong> {patient.email}</p>
          <p><strong>Direccion:</strong> {patient.address}</p>
          <p><strong>Historia clinica:</strong> {patient.historyNumber}</p>
          <p><strong>Aseguradora:</strong> {patient.insurer}</p>
          <p><strong>Plan:</strong> {patient.plan}</p>
        </div>
      </Card>
    </>
  );
}

function resolveDocumentUrl(doc: ResultDocument) {
  return doc.url || doc.fileUrl;
}

function resolveDocumentType(doc: ResultDocument): "pdf" | "image" {
  return doc.type || doc.fileType;
}

function DocumentPreviewModal({
  document,
  onClose,
  onDownload,
}: {
  document: ResultDocument | null;
  onClose: () => void;
  onDownload: (doc: ResultDocument) => void;
}) {
  if (!document) return null;

  const url = resolveDocumentUrl(document);
  const docType = resolveDocumentType(document);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <Card className="max-h-[90vh] w-full max-w-4xl overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
          <div>
            <p className="font-semibold">{document.title || document.studyName}</p>
            <p className="text-xs text-brand-muted">{(document.date || document.studyDate || "").slice(0, 10)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => onDownload(document)}>Descargar</Button>
            <Button variant="dark" onClick={onClose}>Cerrar</Button>
          </div>
        </div>

        <div className="h-[70vh] bg-brand-surface p-4">
          {docType === "image" ? (
            <img src={url} alt={document.title || document.studyName} className="h-full w-full rounded-xl object-contain" />
          ) : (
            <iframe src={url} title={document.title || document.studyName} className="h-full w-full rounded-xl bg-white" />
          )}
        </div>
      </Card>
    </div>
  );
}

export function PatientOverviewPage() {
  const summary = useOverviewData();

  return (
    <AuthedLayout title="Resultados Medicos" items={patientNav}>
      <Alert>Modo demostracion</Alert>
      <SummaryBlocks />
      {summary ? (
        <Card className="mt-4">
          <p className="text-sm text-brand-muted">Accede a todos tus archivos en Mis Resultados.</p>
          <Link to="/results/labs" className="mt-3 inline-block">
            <Button>Ir a Mis Resultados</Button>
          </Link>
        </Card>
      ) : null}
    </AuthedLayout>
  );
}

export function PatientMedicalResultsPage() {
  const [searchParams] = useSearchParams();
  const addEvent = useAuditStore((s) => s.addEvent);
  const markAsViewed = useResultsStore((s) => s.markAsViewed);
  const getDocumentsForPatient = useResultsStore((s) => s.getDocumentsForPatient);
  const actor = useActor();
  const summary = useOverviewData();

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<DocumentTypeFilter>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<ResultDocument | null>(null);

  const docs = useMemo(() => {
    if (!summary) return [];
    return getDocumentsForPatient(summary.patient.id, {
      query,
      type: typeFilter,
      from: fromDate,
      to: toDate,
    });
  }, [summary, getDocumentsForPatient, query, typeFilter, fromDate, toDate]);

  const openDocument = (doc: ResultDocument) => {
    setSelectedDoc(doc);
    markAsViewed(doc.id);
    addEvent("document_view", actor, `Visualizacion de documento ${doc.id}`);
  };

  const downloadDocument = (doc: ResultDocument) => {
    addEvent("download_clicked", actor, `Descarga documento ${doc.id}`);
    window.open(resolveDocumentUrl(doc), "_blank", "noopener,noreferrer");
  };

  return (
    <AuthedLayout title="Mis Resultados" items={patientNav}>
      <Alert>Nuevo resultado disponible. WhatsApp solo notifica.</Alert>
      {searchParams.get("token") ? <Alert>Acceso por enlace temporal (demo).</Alert> : null}

      <SummaryBlocks />

      <Card className="mt-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <Label htmlFor="search-doc">Buscar documento</Label>
            <Input
              id="search-doc"
              placeholder="Nombre del estudio o archivo"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="type-doc">Tipo</Label>
            <select
              id="type-doc"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as DocumentTypeFilter)}
              className="w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm"
            >
              <option value="all">Todos</option>
              <option value="pdf">PDF</option>
              <option value="image">Imagen</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="from-doc">Desde</Label>
              <Input id="from-doc" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="to-doc">Hasta</Label>
              <Input id="to-doc" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-brand-muted">Mostrando {docs.length} documentos</p>
      </Card>

      {!summary ? (
        <Card className="mt-4">
          <h2 className="text-lg font-semibold">No hay resultados para esta cédula</h2>
          <p className="mt-2 text-sm text-brand-muted">Vuelve a ingresar con un documento valido.</p>
          <Link to="/access" className="mt-4 inline-block">
            <Button>Ingresar cédula</Button>
          </Link>
        </Card>
      ) : docs.length === 0 ? (
        <Card className="mt-4">
          <h2 className="text-lg font-semibold">No hay documentos para los filtros seleccionados</h2>
          <p className="mt-2 text-sm text-brand-muted">Limpia los filtros para ver todos los archivos de la cédula actual.</p>
          <div className="mt-4">
            <Button
              onClick={() => {
                setQuery("");
                setTypeFilter("all");
                setFromDate("");
                setToDate("");
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        </Card>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((doc) => {
            const url = resolveDocumentUrl(doc);
            const docType = resolveDocumentType(doc);
            const isImage = docType === "image";

            return (
              <Card key={doc.id} className="p-0">
                <button
                  className="block h-44 w-full overflow-hidden rounded-t-2xl bg-brand-surface"
                  onClick={() => openDocument(doc)}
                >
                  {isImage ? (
                    <img
                      src={doc.thumbnailUrl || url}
                      alt={doc.title || doc.studyName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-brand-ink/5">
                      <div className="text-center">
                        <p className="text-3xl">PDF</p>
                        <p className="text-xs text-brand-muted">Vista previa</p>
                      </div>
                    </div>
                  )}
                </button>

                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-sm font-semibold">{doc.title || doc.studyName}</p>
                    <Badge tone={doc.status === "nuevo" ? "warn" : "neutral"}>{doc.status}</Badge>
                  </div>
                  <p className="text-xs text-brand-muted">{(doc.date || doc.studyDate || "").slice(0, 10)} · {docType.toUpperCase()}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" className="flex-1" onClick={() => openDocument(doc)}>Ver</Button>
                    <Button className="flex-1" onClick={() => downloadDocument(doc)}>Descargar</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <DocumentPreviewModal document={selectedDoc} onClose={() => setSelectedDoc(null)} onDownload={downloadDocument} />
    </AuthedLayout>
  );
}

export function PatientOrdersExamsPage() {
  return <Navigate to="/results/labs" replace />;
}

export function PatientClinicalDocumentsPage() {
  return <Navigate to="/results/labs" replace />;
}

export function PatientShareResultsPage() {
  return <Navigate to="/results/labs" replace />;
}
