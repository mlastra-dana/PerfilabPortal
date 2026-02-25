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
import { mockPatients } from "@/mocks/patients";

const patientNav = [{ to: "/results/labs", label: "Mis Resultados" }];

type DocumentTypeFilter = "all" | "pdf" | "image";

function useActivePatient() {
  const patientSession = useDemoRoleStore((s) => s.patientSession);

  return useMemo(() => {
    if (!patientSession) return null;
    return mockPatients.find((item) => item.id === patientSession.patientId) || null;
  }, [patientSession]);
}

function useActor() {
  const patientSession = useDemoRoleStore((s) => s.patientSession);
  return patientSession ? `patient:${patientSession.documentId}` : "demo-user";
}

function resolveDocumentUrl(doc: ResultDocument) {
  return doc.url || doc.fileUrl;
}

function resolveDocumentType(doc: ResultDocument): "pdf" | "image" {
  return doc.type || doc.fileType;
}

function PatientInfoCard() {
  const patient = useActivePatient();

  if (!patient) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">No hay resultados para esta cédula</h2>
        <p className="mt-2 text-sm text-brand-muted">Ingresa con una cédula válida para consultar documentos.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-2 text-base font-semibold">Información general del paciente</h2>
      <div className="grid gap-2 text-sm md:grid-cols-2">
        <p><strong>Nombre:</strong> {patient.fullName}</p>
        <p><strong>Documento:</strong> {patient.documentId}</p>
        <p><strong>Fecha de nacimiento:</strong> {patient.birthDate}</p>
        <p><strong>Teléfono:</strong> {patient.phone}</p>
        <p><strong>Correo:</strong> {patient.email}</p>
        <p><strong>Empresa:</strong> {patient.company}</p>
      </div>
    </Card>
  );
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

function buildShareUrl(documentId: string) {
  return `https://demo.perfilab.com/r/${documentId}`;
}

function ShareDocumentModal({
  document,
  onClose,
}: {
  document: ResultDocument | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  if (!document) return null;

  const shareUrl = buildShareUrl(document.id);
  const message = `Hola, te comparto mi resultado médico: ${shareUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent("Resultado Médico Perfilab")}&body=${encodeURIComponent(`Te comparto mi resultado: ${shareUrl}`)}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <Card className="w-full max-w-lg">
        <h3 className="text-lg font-semibold">Compartir resultado</h3>
        <p className="mt-1 text-sm text-brand-muted">{document.title || document.studyName}</p>

        <div className="mt-4">
          <Label htmlFor="secure-link">Enlace seguro (demo)</Label>
          <Input id="secure-link" value={shareUrl} readOnly />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Button variant="ghost" onClick={onCopy}>{copied ? "Copiado" : "Copiar enlace"}</Button>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <Button className="w-full">Enviar por WhatsApp</Button>
          </a>
          <a href={mailtoUrl}>
            <Button variant="dark" className="w-full">Enviar por correo</Button>
          </a>
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
}

export function PatientMedicalResultsPage() {
  const [searchParams] = useSearchParams();
  const addEvent = useAuditStore((s) => s.addEvent);
  const markAsViewed = useResultsStore((s) => s.markAsViewed);
  const getDocumentsForPatient = useResultsStore((s) => s.getDocumentsForPatient);
  const actor = useActor();
  const patient = useActivePatient();

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<DocumentTypeFilter>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<ResultDocument | null>(null);
  const [shareDoc, setShareDoc] = useState<ResultDocument | null>(null);

  const docs = useMemo(() => {
    if (!patient) return [];
    return getDocumentsForPatient(patient.id, {
      documentId: patient.documentId,
      query,
      type: typeFilter,
      from: fromDate,
      to: toDate,
    });
  }, [patient, getDocumentsForPatient, query, typeFilter, fromDate, toDate]);

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
    <AuthedLayout title="Resultados Médicos" items={patientNav}>
      <Alert>Modo demostración</Alert>
      {searchParams.get("token") ? <Alert>Acceso por enlace temporal (demo).</Alert> : null}

      <PatientInfoCard />

      <Card className="mt-4">
        <h2 className="mb-3 text-base font-semibold">Mis Resultados</h2>
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

      {!patient ? (
        <Card className="mt-4">
          <h2 className="text-lg font-semibold">No hay resultados para esta cédula</h2>
          <p className="mt-2 text-sm text-brand-muted">Vuelve a ingresar con un documento válido.</p>
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
                    <img src={doc.thumbnailUrl || url} alt={doc.title || doc.studyName} className="h-full w-full object-cover" />
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
                    <Button variant="dark" className="flex-1" onClick={() => setShareDoc(doc)}>Compartir</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <DocumentPreviewModal document={selectedDoc} onClose={() => setSelectedDoc(null)} onDownload={downloadDocument} />
      <ShareDocumentModal document={shareDoc} onClose={() => setShareDoc(null)} />
    </AuthedLayout>
  );
}

export function PatientOverviewPage() {
  return <Navigate to="/results/labs" replace />;
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
