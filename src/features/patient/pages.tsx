import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ResultDocument } from "@/app/types";
import { AuthedLayout } from "@/components/layout/AuthedLayout";
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
type ServiceFilter = "all" | "Laboratorio" | "Imagenología" | "Histopatología" | string;

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

function resolveDocumentService(doc: ResultDocument) {
  if (doc.service) return doc.service;
  if (doc.category === "Laboratorio") return "Laboratorio";
  if (doc.category === "Rayos X" || doc.category === "Mamografias") return "Imagenología";
  return doc.category;
}

function resolveDownloadName(doc: ResultDocument) {
  if (doc.fileName) return doc.fileName;
  const url = resolveDocumentUrl(doc);
  const cleanPath = url.split("?")[0];
  const fromPath = cleanPath.split("/").pop();
  return fromPath ? decodeURIComponent(fromPath) : `${doc.id}.${resolveDocumentType(doc) === "pdf" ? "pdf" : "jpg"}`;
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
  const addEvent = useAuditStore((s) => s.addEvent);
  const markAsViewed = useResultsStore((s) => s.markAsViewed);
  const getDocumentsForPatient = useResultsStore((s) => s.getDocumentsForPatient);
  const actor = useActor();
  const patient = useActivePatient();

  const [queryInput, setQueryInput] = useState("");
  const [typeInput, setTypeInput] = useState<DocumentTypeFilter>("all");
  const [serviceInput, setServiceInput] = useState<ServiceFilter>("all");
  const [fromDateInput, setFromDateInput] = useState("");
  const [toDateInput, setToDateInput] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    query: "",
    type: "all" as DocumentTypeFilter,
    service: "all" as ServiceFilter,
    from: "",
    to: "",
  });
  const [selectedDoc, setSelectedDoc] = useState<ResultDocument | null>(null);
  const [shareDoc, setShareDoc] = useState<ResultDocument | null>(null);

  const docs = useMemo(() => {
    if (!patient) return [];
    return getDocumentsForPatient(patient.id, {
      documentId: patient.documentId,
      query: appliedFilters.query,
      type: appliedFilters.type,
      service: appliedFilters.service,
      from: appliedFilters.from,
      to: appliedFilters.to,
    });
  }, [patient, getDocumentsForPatient, appliedFilters]);

  const patientDocs = useMemo(() => {
    if (!patient) return [];
    return getDocumentsForPatient(patient.id, { documentId: patient.documentId });
  }, [patient, getDocumentsForPatient]);

  const serviceOptions = useMemo(() => {
    const base = ["Laboratorio", "Imagenología", "Histopatología"];
    const extras = Array.from(new Set(patientDocs.map((doc) => resolveDocumentService(doc))))
      .filter((item) => !base.includes(item))
      .sort();
    return ["all", ...base, ...extras];
  }, [patientDocs]);

  const onSelectService = (option: ServiceFilter) => {
    setServiceInput(option);
    setAppliedFilters((prev) => ({
      ...prev,
      service: option,
    }));
  };

  const applyFilters = () => {
    setAppliedFilters({
      query: queryInput,
      type: typeInput,
      service: serviceInput,
      from: fromDateInput,
      to: toDateInput,
    });
  };

  const clearFilters = () => {
    setQueryInput("");
    setTypeInput("all");
    setServiceInput("all");
    setFromDateInput("");
    setToDateInput("");
    setAppliedFilters({
      query: "",
      type: "all",
      service: "all",
      from: "",
      to: "",
    });
  };

  const openDocument = (doc: ResultDocument) => {
    setSelectedDoc(doc);
    markAsViewed(doc.id);
    addEvent("document_view", actor, `Visualizacion de documento ${doc.id}`);
  };

  const openShareModal = (doc: ResultDocument) => {
    setShareDoc(doc);
  };

  const downloadDocument = async (doc: ResultDocument) => {
    addEvent("download_clicked", actor, `Descarga documento ${doc.id}`);
    const url = resolveDocumentUrl(doc);
    const fileName = resolveDownloadName(doc);

    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error("download_failed");

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName;
      anchor.rel = "noopener noreferrer";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      // Fallback para navegadores moviles que bloquean download por blob.
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      anchor.rel = "noopener noreferrer";
      anchor.target = "_blank";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    }
  };

  return (
    <AuthedLayout title="Resultados Médicos" items={patientNav}>
      <PatientInfoCard />

      <Card className="mt-4">
        <h2 className="mb-3 text-base font-semibold">Mis Resultados</h2>
        <div className="mb-4 overflow-auto rounded-xl border border-brand-border bg-brand-surface/70 p-2">
          <div className="flex min-w-max gap-2">
            {serviceOptions.map((option) => {
              const active = serviceInput === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSelectService(option as ServiceFilter)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active ? "bg-brand-primary text-white" : "bg-white text-brand-text hover:bg-brand-primary/10"
                  }`}
                >
                  {option === "all" ? "Todos" : option}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          <div className="md:col-span-2">
            <Label htmlFor="search-doc">Buscar documento</Label>
            <Input
              id="search-doc"
              placeholder="Nombre del estudio o archivo"
              value={queryInput}
              onChange={(event) => setQueryInput(event.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="type-doc">Tipo</Label>
            <select
              id="type-doc"
              value={typeInput}
              onChange={(event) => setTypeInput(event.target.value as DocumentTypeFilter)}
              className="w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm"
            >
              <option value="all">Todos</option>
              <option value="pdf">PDF</option>
              <option value="image">Imagen</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2 md:col-span-2">
            <div>
              <Label htmlFor="from-doc">Desde</Label>
              <Input id="from-doc" type="date" value={fromDateInput} onChange={(event) => setFromDateInput(event.target.value)} />
            </div>
            <div>
              <Label htmlFor="to-doc">Hasta</Label>
              <Input id="to-doc" type="date" value={toDateInput} onChange={(event) => setToDateInput(event.target.value)} />
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <Button variant="ghost" onClick={clearFilters}>Limpiar</Button>
          <Button onClick={applyFilters}>Buscar</Button>
        </div>

        <p className="mt-3 text-sm text-brand-muted">
          {docs.length === 1
            ? "Mostrado último 1 documento"
            : `Mostrados últimos ${docs.length} documentos`}
        </p>
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
            <Button onClick={clearFilters}>Limpiar filtros</Button>
          </div>
        </Card>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-brand-border bg-white">
          <div className="hidden overflow-auto md:block">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-brand-surface text-brand-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nombre del estudio</th>
                  <th className="px-4 py-3 font-semibold">Tipo/Servicio</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => {
                  const typeLabel = resolveDocumentService(doc);
                  const dateLabel = (doc.createdAt || doc.date || doc.studyDate || "").replace("T", " ").slice(0, 16);

                  return (
                    <tr key={doc.id} className="border-t border-brand-border align-middle">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{doc.title || doc.studyName}</p>
                        <p className="text-xs text-brand-muted">{doc.fileName}</p>
                      </td>
                      <td className="px-4 py-3">{typeLabel}</td>
                      <td className="px-4 py-3">{dateLabel}</td>
                      <td className="px-4 py-3">
                        <Badge tone={doc.status === "nuevo" ? "warn" : "neutral"}>{doc.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="ghost" onClick={() => openDocument(doc)}>
                            <span className="mr-1 inline-flex" aria-hidden="true">
                              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 5c-5.5 0-9.6 4.6-10.8 6.3a1.2 1.2 0 0 0 0 1.4C2.4 14.4 6.5 19 12 19s9.6-4.6 10.8-6.3a1.2 1.2 0 0 0 0-1.4C21.6 9.6 17.5 5 12 5Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" /></svg>
                            </span>
                            Ver
                          </Button>
                          <Button onClick={() => downloadDocument(doc)}>Descargar</Button>
                          <Button variant="dark" onClick={() => openShareModal(doc)}>Compartir</Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-3 md:hidden">
            {docs.map((doc) => {
              const typeLabel = resolveDocumentService(doc);
              const dateLabel = (doc.createdAt || doc.date || doc.studyDate || "").replace("T", " ").slice(0, 16);

              return (
                <div key={doc.id} className="rounded-xl border border-brand-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{doc.title || doc.studyName}</p>
                      <p className="text-xs text-brand-muted">{typeLabel} · {dateLabel}</p>
                    </div>
                    <Badge tone={doc.status === "nuevo" ? "warn" : "neutral"}>{doc.status}</Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="ghost" onClick={() => openDocument(doc)}>
                      <span className="mr-1 inline-flex" aria-hidden="true">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M12 5c-5.5 0-9.6 4.6-10.8 6.3a1.2 1.2 0 0 0 0 1.4C2.4 14.4 6.5 19 12 19s9.6-4.6 10.8-6.3a1.2 1.2 0 0 0 0-1.4C21.6 9.6 17.5 5 12 5Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" /></svg>
                      </span>
                      Ver
                    </Button>
                    <Button onClick={() => downloadDocument(doc)}>Descargar</Button>
                    <Button variant="dark" onClick={() => openShareModal(doc)}>Compartir</Button>
                  </div>
                </div>
              );
            })}
          </div>
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
