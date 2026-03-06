import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ResultDocument } from "@/app/types";
import { DanaLayout } from "@/components/layout/DanaLayout";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuditStore } from "@/features/audit/useAuditStore";
import { useDemoRoleStore } from "@/features/demo/useDemoRoleStore";
import { useResultsStore } from "@/features/results/useResultsStore";
import { mockPatients } from "@/mocks/patients";

type ServiceFilter = "all" | "Laboratorio" | "Imagenología" | "Histopatología" | string;

const danaButtonPrimary = "rounded-pill border border-[rgb(var(--dc-orange))] bg-[rgb(var(--dc-orange))] text-white shadow-none hover:opacity-90";
const danaButtonSecondary = "rounded-pill border border-[rgb(var(--dc-orange))] bg-[rgb(var(--dc-orange))] text-white shadow-none hover:opacity-90";
const danaButtonDark = "rounded-pill border border-[rgb(var(--dc-orange))] bg-[rgb(var(--dc-orange))] text-white shadow-none hover:opacity-90";
const danaSolidStyle = { backgroundColor: "rgb(var(--dc-orange))", borderColor: "rgb(var(--dc-orange))", color: "#ffffff" };
const danaField = "w-full rounded-md border border-[#cfd3d8] bg-white px-3 py-2 text-sm text-[#2d3138] outline-none focus:border-dana-primary focus:ring-2 focus:ring-dana-primary/20";
const danaSelect = "w-full rounded-md border border-[#cfd3d8] bg-white px-3 py-2 text-sm text-[#2d3138] outline-none focus:border-dana-primary focus:ring-2 focus:ring-dana-primary/20";
const danaPanel = "rounded-xl border border-[#d9dde2] bg-white shadow-none";

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

function resolveStatusLabel(status: ResultDocument["status"]) {
  return status === "nuevo" ? "No visto" : "Visto";
}

function displayServiceLabel(value: string) {
  return value === "Laboratorio" ? "Servicios médicos" : value;
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
      <Card className={`max-h-[90vh] w-full max-w-5xl overflow-hidden p-0 ${danaPanel}`}>
        <div className="flex flex-col gap-3 border-b border-brand-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{document.title || document.studyName}</p>
            <p className="text-xs text-brand-muted">{(document.date || document.studyDate || "").slice(0, 10)}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className={`w-full sm:w-auto ${danaButtonSecondary}`} style={danaSolidStyle} onClick={() => onDownload(document)}>Descargar</Button>
            <Button className={`w-full sm:w-auto ${danaButtonDark}`} style={danaSolidStyle} onClick={onClose}>Cerrar</Button>
          </div>
        </div>

        <div className="h-[60vh] bg-brand-surface p-3 sm:h-[72vh] sm:p-4">
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
  return `https://demo.danaconnect.com/r/${documentId}`;
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
  const message = `Hola, te comparto mi documento: ${shareUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const mailtoUrl = `mailto:?subject=${encodeURIComponent("Documento DanaConnect")}&body=${encodeURIComponent(`Te comparto mi documento: ${shareUrl}`)}`;

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
      <Card className={`w-full max-w-xl ${danaPanel}`}>
        <h3 className="text-lg font-semibold">Compartir documento</h3>
        <p className="mt-1 text-sm text-brand-muted">{document.title || document.studyName}</p>

        <div className="mt-4">
          <Label htmlFor="secure-link">Enlace seguro</Label>
          <Input id="secure-link" value={shareUrl} readOnly className={danaField} />
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Button className={`w-full ${danaButtonSecondary}`} style={danaSolidStyle} onClick={onCopy}>{copied ? "Copiado" : "Copiar enlace"}</Button>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <Button className={`w-full ${danaButtonPrimary}`} style={danaSolidStyle}>WhatsApp</Button>
          </a>
          <a href={mailtoUrl}>
            <Button className={`w-full ${danaButtonDark}`} style={danaSolidStyle}>Correo</Button>
          </a>
        </div>

        <div className="mt-4 flex justify-end">
          <Button className={`w-full sm:w-auto ${danaButtonSecondary}`} style={danaSolidStyle} onClick={onClose}>Cerrar</Button>
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
  const [serviceInput, setServiceInput] = useState<ServiceFilter>("all");
  const [fromDateInput, setFromDateInput] = useState("");
  const [toDateInput, setToDateInput] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    query: "",
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

  const applyFilters = () => {
    setAppliedFilters({
      query: queryInput,
      service: serviceInput,
      from: fromDateInput,
      to: toDateInput,
    });
  };

  const clearFilters = () => {
    setQueryInput("");
    setServiceInput("all");
    setFromDateInput("");
    setToDateInput("");
    setAppliedFilters({
      query: "",
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
    <DanaLayout>
      <section className="mx-auto max-w-7xl px-4 py-8">
        <Card className={danaPanel}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-xl font-bold">Documentos SERVICIOS MEDICOS</h1>
            <span className="rounded-pill bg-brand-surface px-3 py-1 text-xs font-semibold text-brand-muted">
              Documento: {patient?.documentId || "N/A"}
            </span>
          </div>
        </Card>

        {!patient ? (
          <Card className={`mt-4 ${danaPanel}`}>
            <Alert variant="warn">No hay resultados para esta cédula.</Alert>
            <Link to="/access" className="mt-4 inline-block">
              <Button className={danaButtonPrimary} style={danaSolidStyle}>Ingresar cédula</Button>
            </Link>
          </Card>
        ) : (
          <>
            <Card className={`mt-4 ${danaPanel}`}>
              <h2 className="mb-2 text-base font-semibold">Información del cliente</h2>
              <div className="grid gap-2 text-sm md:grid-cols-2">
                <p><strong>Nombre:</strong> {patient.fullName}</p>
                <p><strong>Documento:</strong> {patient.documentId}</p>
                <p><strong>Correo:</strong> {patient.email}</p>
                <p><strong>Organización:</strong> {patient.company}</p>
                <p><strong>Perfil:</strong> Paciente</p>
                <p><strong>Fecha de nacimiento:</strong> {patient.birthDate}</p>
              </div>
            </Card>

            <Card className={`mt-4 ${danaPanel}`}>
              <div className="grid gap-3 md:grid-cols-12">
                <div className="md:col-span-5">
                  <Label htmlFor="search-doc">Buscar</Label>
                  <Input
                    id="search-doc"
                    placeholder="Nombre del documento"
                    value={queryInput}
                    onChange={(event) => setQueryInput(event.target.value)}
                    className={danaField}
                  />
                </div>

                <div className="md:col-span-3">
                  <Label htmlFor="service-doc">Servicio/Tipo</Label>
                  <select
                    id="service-doc"
                    value={serviceInput}
                    onChange={(event) => setServiceInput(event.target.value as ServiceFilter)}
                    className={danaSelect}
                  >
                    {serviceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option === "all" ? "Todos" : displayServiceLabel(option)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="from-doc">Desde</Label>
                  <Input id="from-doc" type="date" value={fromDateInput} onChange={(event) => setFromDateInput(event.target.value)} className={danaField} />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="to-doc">Hasta</Label>
                  <Input id="to-doc" type="date" value={toDateInput} onChange={(event) => setToDateInput(event.target.value)} className={danaField} />
                </div>
              </div>

              <div className="mt-4 flex flex-col justify-end gap-2 sm:flex-row">
                <Button className={`w-full sm:w-auto ${danaButtonSecondary}`} style={danaSolidStyle} onClick={clearFilters}>Limpiar</Button>
                <Button className={`w-full sm:w-auto ${danaButtonPrimary}`} style={danaSolidStyle} onClick={applyFilters}>Buscar</Button>
              </div>
            </Card>

            {docs.length === 0 ? (
              <Card className={`mt-4 ${danaPanel}`}>
                <Alert variant="warn">No hay resultados para ese filtro.</Alert>
              </Card>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-[#d9dde2] bg-white">
                <div className="hidden overflow-auto md:block">
                  <table className="w-full min-w-[900px] text-left text-sm">
                    <thead className="bg-[#f3f4f6] text-[#616773]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Nombre</th>
                        <th className="px-4 py-3 font-semibold">Servicio</th>
                        <th className="px-4 py-3 font-semibold">Fecha</th>
                        <th className="px-4 py-3 font-semibold">Estado</th>
                        <th className="px-4 py-3 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docs.map((doc) => {
                        const typeLabel = displayServiceLabel(resolveDocumentService(doc));
                        const dateLabel = (doc.createdAt || doc.date || doc.studyDate || "").replace("T", " ").slice(0, 16);

                        return (
                          <tr key={doc.id} className="border-t border-[#e3e6eb]">
                            <td className="px-4 py-3">
                              <p className="font-semibold">{doc.title || doc.studyName}</p>
                              <p className="text-xs text-brand-muted">{doc.fileName}</p>
                            </td>
                            <td className="px-4 py-3">{typeLabel}</td>
                            <td className="px-4 py-3">{dateLabel}</td>
                            <td className="px-4 py-3">{resolveStatusLabel(doc.status)}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-2">
                                <Button className={danaButtonSecondary} style={danaSolidStyle} onClick={() => openDocument(doc)}>Ver</Button>
                                <Button className={danaButtonPrimary} style={danaSolidStyle} onClick={() => downloadDocument(doc)}>Descargar</Button>
                                <Button className={danaButtonDark} style={danaSolidStyle} onClick={() => setShareDoc(doc)}>Compartir</Button>
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
                    const typeLabel = displayServiceLabel(resolveDocumentService(doc));
                    const dateLabel = (doc.createdAt || doc.date || doc.studyDate || "").slice(0, 10);

                    return (
                      <div key={doc.id} className="rounded-md border border-[#d9dde2] p-3">
                        <p className="font-semibold">{doc.title || doc.studyName}</p>
                        <p className="text-xs text-brand-muted">{typeLabel} · {dateLabel}</p>
                        <p className="mt-1 text-xs text-brand-muted">{resolveStatusLabel(doc.status)}</p>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                          <Button className={`w-full sm:w-auto ${danaButtonSecondary}`} style={danaSolidStyle} onClick={() => openDocument(doc)}>Ver</Button>
                          <Button className={`w-full sm:w-auto ${danaButtonPrimary}`} style={danaSolidStyle} onClick={() => downloadDocument(doc)}>Descargar</Button>
                          <Button className={`w-full sm:w-auto ${danaButtonDark}`} style={danaSolidStyle} onClick={() => setShareDoc(doc)}>Compartir</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <DocumentPreviewModal document={selectedDoc} onClose={() => setSelectedDoc(null)} onDownload={downloadDocument} />
      <ShareDocumentModal document={shareDoc} onClose={() => setShareDoc(null)} />
    </DanaLayout>
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
