import { FormEvent, ReactNode, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ResultDocument } from "@/app/types";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useCompanySession } from "@/features/demo/useCompanySession";
import { useDemoRoleStore } from "@/features/demo/useDemoRoleStore";
import { InsurerDocument, insurerDocuments } from "@/mocks/aseguradora/documents";
import { rrhhDocuments } from "@/mocks/rrhh/documents";
import { universityDocuments } from "@/mocks/universidad/documents";

type Industry = "laboratorio" | "universidad" | "rrhh" | "aseguradora";

const industries: Array<{ key: Industry; label: string }> = [
  { key: "laboratorio", label: "Laboratorio" },
  { key: "universidad", label: "Universidad" },
  { key: "rrhh", label: "RRHH" },
  { key: "aseguradora", label: "Aseguradora" },
];

const danaButtonPrimary = "rounded-pill border border-dana-primary bg-dana-primary text-white shadow-none hover:opacity-90";
const danaButtonSecondary = "rounded-pill border border-dana-primary bg-dana-primary text-white shadow-none hover:opacity-90";
const danaButtonDark = "rounded-pill border border-dana-primary bg-dana-primary text-white shadow-none hover:opacity-90";
const danaField = "w-full rounded-md border border-[#cfd3d8] bg-white px-3 py-2 text-sm text-[#2d3138] outline-none focus:border-dana-primary focus:ring-2 focus:ring-dana-primary/20";
const danaSelect = "w-full rounded-md border border-[#cfd3d8] bg-white px-3 py-2 text-sm text-[#2d3138] outline-none focus:border-dana-primary focus:ring-2 focus:ring-dana-primary/20";
const danaPanel = "rounded-xl border border-[#d9dde2] bg-white shadow-none";

const industrySamples: Record<Exclude<Industry, "laboratorio">, string[]> = {
  universidad: ["V-12000001", "V-22010001", "V-22010002"],
  rrhh: ["V-12000001", "V-33020001", "V-33020002"],
  aseguradora: ["V-12000001 / POL-12000001", "V-44030001 / POL-998100", "V-44030002 / POL-998200"],
};

type IndustryProfile = {
  fullName: string;
  documentId: string;
  email: string;
  organization: string;
  roleLabel: string;
  policyNumber?: string;
};

const industryProfiles: Record<Exclude<Industry, "laboratorio">, Record<string, IndustryProfile>> = {
  universidad: {
    "V-12000001": {
      fullName: "Andrea Castillo",
      documentId: "V-12000001",
      email: "andrea.castillo@campus-demo.edu",
      organization: "Universidad Demo Metropolitana",
      roleLabel: "Estudiante",
    },
    "V-22010001": {
      fullName: "Laura Méndez",
      documentId: "V-22010001",
      email: "laura.mendez@campus-demo.edu",
      organization: "Universidad Demo Central",
      roleLabel: "Estudiante",
    },
    "V-22010002": {
      fullName: "Diego Rosales",
      documentId: "V-22010002",
      email: "diego.rosales@campus-demo.edu",
      organization: "Universidad Demo Norte",
      roleLabel: "Estudiante",
    },
  },
  rrhh: {
    "V-12000001": {
      fullName: "Andrea Castillo",
      documentId: "V-12000001",
      email: "andrea.castillo@empresa-demo.com",
      organization: "Empresa Demo Central",
      roleLabel: "Colaborador",
    },
    "V-33020001": {
      fullName: "Mariana Paredes",
      documentId: "V-33020001",
      email: "mariana.paredes@empresa-demo.com",
      organization: "Empresa Demo Global",
      roleLabel: "Colaborador",
    },
    "V-33020002": {
      fullName: "Carlos Ibarra",
      documentId: "V-33020002",
      email: "carlos.ibarra@empresa-demo.com",
      organization: "Empresa Demo Regional",
      roleLabel: "Colaborador",
    },
  },
  aseguradora: {
    "V-12000001": {
      fullName: "Andrea Castillo",
      documentId: "V-12000001",
      email: "andrea.castillo@cliente-demo.com",
      organization: "Seguros Demo Plus",
      roleLabel: "Asegurada",
      policyNumber: "POL-12000001",
    },
    "V-44030001": {
      fullName: "Rosa Villalba",
      documentId: "V-44030001",
      email: "rosa.villalba@cliente-demo.com",
      organization: "Seguros Demo Vida",
      roleLabel: "Asegurada",
      policyNumber: "POL-998100",
    },
    "V-44030002": {
      fullName: "Jorge Molina",
      documentId: "V-44030002",
      email: "jorge.molina@cliente-demo.com",
      organization: "Seguros Demo Salud",
      roleLabel: "Asegurado",
      policyNumber: "POL-998200",
    },
  },
};

function DanaLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { exitToSelector } = useCompanySession();
  const showExit = location.pathname !== "/" && location.pathname !== "/multi";

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#2d3138]">
      <header className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" aria-label="Volver al inicio multiempresa">
            <img src="/brand/logo-danaconnect-horizontal.png" alt="DANAconnect" className="h-10 w-auto object-contain" />
          </Link>
          <div className="hidden items-center gap-6 text-sm text-[#5b6068] md:flex">
            <span>Platform</span>
            <span>Use Cases</span>
            <span>Services</span>
            <span>Resources</span>
          </div>
          <div className="flex items-center gap-3">
            {showExit ? (
              <Button className={danaButtonPrimary} onClick={exitToSelector}>
                Salir
              </Button>
            ) : null}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

function isIndustry(value: string | undefined): value is Industry {
  return value === "laboratorio" || value === "universidad" || value === "rrhh" || value === "aseguradora";
}

function resolveUrl(doc: ResultDocument) {
  return doc.url || doc.fileUrl;
}

function resolveType(doc: ResultDocument): "pdf" | "image" {
  return doc.type || doc.fileType;
}

function resolveName(doc: ResultDocument) {
  if (doc.fileName) return doc.fileName;
  return `${doc.id}.${resolveType(doc) === "pdf" ? "pdf" : "jpg"}`;
}

function statusLabel(status: ResultDocument["status"]) {
  return status === "nuevo" ? "No visto" : "Visto";
}

function DocumentPreviewModal({
  document,
  onClose,
}: {
  document: ResultDocument | null;
  onClose: () => void;
}) {
  if (!document) return null;
  const url = resolveUrl(document);
  const type = resolveType(document);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <Card className={`max-h-[90vh] w-full max-w-5xl overflow-hidden p-0 ${danaPanel}`}>
        <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
          <div>
            <p className="font-semibold">{document.title || document.studyName}</p>
            <p className="text-xs text-brand-muted">{(document.date || document.studyDate || "").slice(0, 10)}</p>
          </div>
          <Button className={danaButtonDark} onClick={onClose}>Cerrar</Button>
        </div>
        <div className="h-[72vh] bg-brand-surface p-4">
          {type === "image" ? (
            <img src={url} alt={document.title || document.studyName} className="h-full w-full rounded-xl object-contain" />
          ) : (
            <iframe src={url} title={document.title || document.studyName} className="h-full w-full rounded-xl bg-white" />
          )}
        </div>
      </Card>
    </div>
  );
}

function ShareModal({
  document,
  onClose,
}: {
  document: ResultDocument | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  if (!document) return null;

  const secureUrl = `${window.location.origin}/r/${document.id}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`Hola, te comparto este documento: ${secureUrl}`)}`;
  const email = `mailto:?subject=${encodeURIComponent("Documento compartido")}&body=${encodeURIComponent(`Te comparto este documento: ${secureUrl}`)}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(secureUrl);
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
          <Label htmlFor="secure-link-multi">Enlace seguro</Label>
          <Input id="secure-link-multi" readOnly value={secureUrl} className={danaField} />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Button className={danaButtonSecondary} onClick={onCopy}>{copied ? "Copiado" : "Copiar enlace"}</Button>
          <a href={whatsapp} target="_blank" rel="noreferrer"><Button className={`w-full ${danaButtonPrimary}`}>WhatsApp</Button></a>
          <a href={email}><Button className={`w-full ${danaButtonDark}`}>Correo</Button></a>
        </div>
        <div className="mt-4 flex justify-end">
          <Button className={danaButtonSecondary} onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
}

function IndustryDocumentsBoard({
  industry,
  allDocuments,
  requiresPolicy = false,
}: {
  industry: Exclude<Industry, "laboratorio">;
  allDocuments: ResultDocument[];
  requiresPolicy?: boolean;
}) {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [service, setService] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [previewDoc, setPreviewDoc] = useState<ResultDocument | null>(null);
  const [shareDoc, setShareDoc] = useState<ResultDocument | null>(null);

  const documentId = (searchParams.get("doc") || "").trim().toUpperCase();
  const policy = (searchParams.get("policy") || "").trim().toUpperCase();
  const profile = industryProfiles[industry][documentId];

  const initial = useMemo(() => {
    if (!documentId) return [];
    const byDocument = allDocuments.filter((doc) => (doc.patientDocument || "").toUpperCase() === documentId);
    if (!requiresPolicy) return byDocument;
    return (byDocument as InsurerDocument[]).filter((doc) => doc.policyNumber.toUpperCase() === policy);
  }, [allDocuments, documentId, policy, requiresPolicy]);

  const serviceOptions = useMemo(() => {
    const values = Array.from(new Set(initial.map((doc) => doc.service || "General"))).sort();
    return ["all", ...values];
  }, [initial]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initial.filter((doc) => {
      const title = (doc.title || doc.studyName || "").toLowerCase();
      const fileName = (doc.fileName || "").toLowerCase();
      const date = (doc.date || doc.studyDate || "").slice(0, 10);
      const docService = doc.service || "General";

      if (q && !title.includes(q) && !fileName.includes(q)) return false;
      if (service !== "all" && docService !== service) return false;
      if (from && date < from) return false;
      if (to && date > to) return false;
      return true;
    });
  }, [initial, query, service, from, to]);

  const onDownload = async (doc: ResultDocument) => {
    const url = resolveUrl(doc);
    const fileName = resolveName(doc);

    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error("download_failed");
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
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
            <h1 className="text-xl font-bold">Documentos {industry.toUpperCase()}</h1>
            <span className="rounded-pill bg-brand-surface px-3 py-1 text-xs font-semibold text-brand-muted">
              Documento: {documentId || "N/A"}
            </span>
          </div>
        </Card>

        {!documentId || (requiresPolicy && !policy) ? (
          <Card className={`mt-4 ${danaPanel}`}>
            <Alert variant="warn">Debes ingresar documento{requiresPolicy ? " y póliza" : ""} para consultar.</Alert>
          </Card>
        ) : (
          <>
            {profile ? (
              <Card className={`mt-4 ${danaPanel}`}>
                <h2 className="mb-2 text-base font-semibold">Información del cliente</h2>
                <div className="grid gap-2 text-sm md:grid-cols-2">
                  <p><strong>Nombre:</strong> {profile.fullName}</p>
                  <p><strong>Documento:</strong> {profile.documentId}</p>
                  <p><strong>Correo:</strong> {profile.email}</p>
                  <p><strong>Organización:</strong> {profile.organization}</p>
                  <p><strong>Perfil:</strong> {profile.roleLabel}</p>
                  {profile.policyNumber ? <p><strong>Póliza:</strong> {profile.policyNumber}</p> : null}
                </div>
              </Card>
            ) : null}

            <Card className={`mt-4 ${danaPanel}`}>
              <div className="grid gap-3 md:grid-cols-12">
                <div className="md:col-span-5">
                  <Label htmlFor={`search-${industry}`}>Buscar</Label>
                  <Input id={`search-${industry}`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nombre del documento" className={danaField} />
                </div>
                <div className="md:col-span-3">
                  <Label htmlFor={`service-${industry}`}>Servicio/Tipo</Label>
                  <select
                    id={`service-${industry}`}
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className={danaSelect}
                  >
                    {serviceOptions.map((item) => (
                      <option key={item} value={item}>{item === "all" ? "Todos" : item}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`from-${industry}`}>Desde</Label>
                  <Input id={`from-${industry}`} type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={danaField} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`to-${industry}`}>Hasta</Label>
                  <Input id={`to-${industry}`} type="date" value={to} onChange={(e) => setTo(e.target.value)} className={danaField} />
                </div>
              </div>
            </Card>

            {filtered.length === 0 ? (
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
                      {filtered.map((doc) => (
                        <tr key={doc.id} className="border-t border-[#e3e6eb]">
                          <td className="px-4 py-3">
                            <p className="font-semibold">{doc.title || doc.studyName}</p>
                            <p className="text-xs text-brand-muted">{doc.fileName}</p>
                          </td>
                          <td className="px-4 py-3">{doc.service || "General"}</td>
                          <td className="px-4 py-3">{(doc.date || doc.studyDate || "").replace("T", " ").slice(0, 16)}</td>
                          <td className="px-4 py-3">{statusLabel(doc.status)}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              <Button className={danaButtonSecondary} onClick={() => setPreviewDoc(doc)}>Ver</Button>
                              <Button className={danaButtonPrimary} onClick={() => onDownload(doc)}>Descargar</Button>
                              <Button className={danaButtonDark} onClick={() => setShareDoc(doc)}>Compartir</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-3 p-3 md:hidden">
                  {filtered.map((doc) => (
                    <div key={doc.id} className="rounded-md border border-[#d9dde2] p-3">
                      <p className="font-semibold">{doc.title || doc.studyName}</p>
                      <p className="text-xs text-brand-muted">{doc.service || "General"} · {(doc.date || doc.studyDate || "").slice(0, 10)}</p>
                      <p className="mt-1 text-xs text-brand-muted">{statusLabel(doc.status)}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button className={danaButtonSecondary} onClick={() => setPreviewDoc(doc)}>Ver</Button>
                        <Button className={danaButtonPrimary} onClick={() => onDownload(doc)}>Descargar</Button>
                        <Button className={danaButtonDark} onClick={() => setShareDoc(doc)}>Compartir</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <DocumentPreviewModal document={previewDoc} onClose={() => setPreviewDoc(null)} />
      <ShareModal document={shareDoc} onClose={() => setShareDoc(null)} />
    </DanaLayout>
  );
}

export function MultiIndustryLandingPage() {
  const navigate = useNavigate();
  const [industry, setIndustry] = useState<Industry>("laboratorio");

  return (
    <DanaLayout>
      <section className="bg-dana-primary">
        <div className="mx-auto max-w-7xl px-4 py-20 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">DANAconnect</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-6xl">Multiempresas de visual/descarga documentos</h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">
            Selecciona tu industria y accede a tus documentos con una experiencia unificada.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 md:grid-cols-4">
          {industries.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setIndustry(item.key)}
              className={`rounded-xl border p-5 text-left transition ${
                industry === item.key
                  ? "border-dana-primary bg-[#fff3ef]"
                  : "border-[#d9dde2] bg-white hover:border-dana-primary/70"
              }`}
            >
              <p className="text-sm uppercase tracking-wide text-[#6b7280]">Industria</p>
              <p className="mt-1 text-xl font-bold">{item.label}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button className={danaButtonPrimary} onClick={() => navigate(`/access/${industry}`)}>
            Continuar
          </Button>
        </div>
      </section>
    </DanaLayout>
  );
}

export function IndustryAccessPage() {
  const navigate = useNavigate();
  const { industry } = useParams();
  const [documentId, setDocumentId] = useState("");
  const [policy, setPolicy] = useState("");
  const [error, setError] = useState("");

  if (!isIndustry(industry)) return <Navigate to="/" replace />;
  if (industry === "laboratorio") return <Navigate to="/access" replace />;

  const isInsurer = industry === "aseguradora";
  const titleMap: Record<Industry, string> = {
    laboratorio: "Acceso Laboratorio",
    universidad: "Acceso Universidad",
    rrhh: "Acceso RRHH",
    aseguradora: "Acceso Aseguradora",
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const doc = documentId.trim().toUpperCase();

    if (!doc) {
      setError("Debe ingresar un documento.");
      return;
    }

    if (isInsurer) {
      const pol = policy.trim().toUpperCase();
      if (!pol) {
        setError("Debe ingresar número de póliza.");
        return;
      }
      navigate(`/documents/${industry}?doc=${encodeURIComponent(doc)}&policy=${encodeURIComponent(pol)}`);
      return;
    }

    navigate(`/documents/${industry}?doc=${encodeURIComponent(doc)}`);
  };

  return (
    <DanaLayout>
      <section className="mx-auto max-w-xl px-4 py-16">
        <Card className={danaPanel}>
          <h1 className="text-2xl font-bold">{titleMap[industry]}</h1>
          <p className="mt-2 text-sm text-brand-muted">Ingresa tus datos para ver tus documentos.</p>

          <form className="mt-5 space-y-3" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="industry-doc">Cédula / Documento</Label>
              <Input
                id="industry-doc"
                value={documentId}
                onChange={(event) => setDocumentId(event.target.value)}
                placeholder="Ej. V-12000001"
                className={danaField}
                required
              />
            </div>
            {isInsurer ? (
              <div>
                <Label htmlFor="industry-policy">Número de póliza</Label>
                <Input
                  id="industry-policy"
                  value={policy}
                  onChange={(event) => setPolicy(event.target.value)}
                  placeholder="Ej. POL-998100"
                  className={danaField}
                  required
                />
              </div>
            ) : null}
            {error ? <Alert variant="warn">{error}</Alert> : null}
            <Button type="submit" className={danaButtonPrimary}>Ver mis documentos</Button>
          </form>

          <div className="mt-4 rounded-xl border border-brand-border bg-brand-surface p-3 text-sm">
            <p className="font-semibold">Datos de prueba</p>
            <ul className="mt-1 space-y-1 text-brand-muted">
              {industrySamples[industry].map((sample) => (
                <li key={sample}>• {sample}</li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </DanaLayout>
  );
}

export function IndustryDocumentsPage() {
  const { industry } = useParams();
  const patientSession = useDemoRoleStore((s) => s.patientSession);

  if (!isIndustry(industry)) return <Navigate to="/" replace />;

  if (industry === "laboratorio") {
    if (!patientSession) return <Navigate to="/access/laboratorio" replace />;
    return <Navigate to="/results/labs" replace />;
  }

  if (industry === "universidad") {
    return <IndustryDocumentsBoard industry="universidad" allDocuments={universityDocuments} />;
  }

  if (industry === "rrhh") {
    return <IndustryDocumentsBoard industry="rrhh" allDocuments={rrhhDocuments} />;
  }

  return <IndustryDocumentsBoard industry="aseguradora" allDocuments={insurerDocuments} requiresPolicy />;
}
