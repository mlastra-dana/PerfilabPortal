import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ResultFlag } from "@/types/medical";
import { AuthedLayout } from "@/components/layout/AuthedLayout";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";
import { Tabs } from "@/components/ui/Tabs";
import { useAuditStore } from "@/features/audit/useAuditStore";
import { useDemoRoleStore } from "@/features/demo/useDemoRoleStore";
import { ResultFilters, ResultsFilters } from "@/features/results/ResultsFilters";
import { useResultsStore } from "@/features/results/useResultsStore";
import { getPanel, getReferenceText } from "@/mocks/catalog";
import { mockClinicalDocuments } from "@/mocks/clinicalDocuments";
import { mockLabResults, mockLabTrends } from "@/mocks/labResults";
import { mockOrders } from "@/mocks/orders";
import { mockPatients } from "@/mocks/patients";

const patientNav = [
  { to: "/results/overview", label: "Resumen" },
  { to: "/results/labs", label: "Mis Resultados Medicos" },
  { to: "/results/orders", label: "Ordenes y Examenes" },
  { to: "/results/clinical-docs", label: "Documentos Clinicos" },
  { to: "/results/share", label: "Compartir Resultados" },
];

function statusBadge(status: string) {
  if (status === "entregado" || status === "validado") return "ok" as const;
  if (status === "en_proceso") return "warn" as const;
  return "neutral" as const;
}

function formatValue(item: {
  resultType: "numeric" | "qualitative";
  valueNumeric?: number;
  valueText?: string;
  unit?: string;
}) {
  if (item.resultType === "qualitative") return item.valueText || "N/A";
  if (typeof item.valueNumeric !== "number") return "N/A";
  return `${item.valueNumeric} ${item.unit || ""}`.trim();
}

function flagTone(flag: ResultFlag) {
  if (flag === "high") return "bad" as const;
  if (flag === "low") return "warn" as const;
  if (flag === "normal") return "ok" as const;
  return "neutral" as const;
}

function flagLabel(flag: ResultFlag) {
  if (flag === "high") return "ALTO";
  if (flag === "low") return "BAJO";
  if (flag === "normal") return "NORMAL";
  return "-";
}

function TrendLine({ points, title, reference }: { points: Array<{ date: string; value: number }>; title: string; reference: string }) {
  const max = Math.max(...points.map((p) => p.value), 1);
  return (
    <Card>
      <h4 className="font-semibold">{title}</h4>
      <p className="mb-2 text-xs text-brand-muted">Referencia: {reference}</p>
      <div className="space-y-2">
        {points.map((item) => (
          <div key={item.date} className="flex items-center gap-2">
            <span className="w-20 text-xs text-brand-muted">{item.date}</span>
            <div className="h-2 flex-1 rounded-pill bg-brand-surface">
              <div className="h-2 rounded-pill bg-brand-primary" style={{ width: `${(item.value / max) * 100}%` }} />
            </div>
            <span className="w-16 text-right text-xs font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function formatDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toDateKey(value?: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

function isWithinDateRange(dateKey: string, from: string, to: string) {
  if (!dateKey) return !from && !to;
  if (from && dateKey < from) return false;
  if (to && dateKey > to) return false;
  return true;
}

function useActivePatient() {
  const role = useDemoRoleStore((s) => s.role);
  const patientSession = useDemoRoleStore((s) => s.patientSession);

  return useMemo(() => {
    if (role === "patient" && patientSession) {
      return mockPatients.find((item) => item.id === patientSession.patientId) || mockPatients[0];
    }
    return mockPatients[0];
  }, [role, patientSession]);
}

function useActor() {
  const patientSession = useDemoRoleStore((s) => s.patientSession);
  return patientSession ? `patient:${patientSession.documentId}` : "demo-user";
}

export function PatientOverviewPage() {
  const role = useDemoRoleStore((s) => s.role);
  const [search] = useSearchParams();
  const setBanner = useDemoRoleStore((s) => s.setTokenAccessBanner);
  const patient = useActivePatient();
  const orders = mockOrders.filter((o) => o.patientId === patient.id);

  useEffect(() => {
    const token = search.get("token");
    if (token) {
      setBanner(`Acceso por enlace temporal (demo). Token: ${token}`);
    }
  }, [search, setBanner]);

  return (
    <AuthedLayout title="Resultados Medicos" items={patientNav}>
      <Alert>Nuevo resultado disponible: Perfil lipidico validado.</Alert>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs text-brand-muted">Paciente</p>
          <p className="text-lg font-semibold">{patient.fullName}</p>
          <p className="text-xs text-brand-muted">HC: {patient.historyNumber}</p>
        </Card>
        <Card>
          <p className="text-xs text-brand-muted">Ordenes activas</p>
          <p className="text-2xl font-bold text-brand-primary">{orders.filter((o) => o.status !== "entregado").length}</p>
        </Card>
        <Card>
          <p className="text-xs text-brand-muted">Rol demo</p>
          <p className="text-lg font-semibold">{role}</p>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
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

        <Card>
          <h2 className="mb-2 text-base font-semibold">Consentimientos</h2>
          <div className="space-y-2 text-sm">
            {patient.consents.map((consent) => (
              <div key={consent.id} className="flex items-center justify-between rounded-xl border border-brand-border px-3 py-2">
                <div>
                  <p className="font-medium">{consent.name}</p>
                  <p className="text-xs text-brand-muted">Actualizado: {consent.updatedAt}</p>
                </div>
                <Badge tone={consent.accepted ? "ok" : "warn"}>{consent.accepted ? "Aceptado" : "Pendiente"}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AuthedLayout>
  );
}

export function PatientMedicalResultsPage() {
  const addEvent = useAuditStore((s) => s.addEvent);
  const [searchParams, setSearchParams] = useSearchParams();
  const patient = useActivePatient();
  const actor = useActor();

  const appliedFrom = searchParams.get("from") || "";
  const appliedTo = searchParams.get("to") || "";
  const tokenParam = searchParams.get("token") || "";

  const [fromDate, setFromDate] = useState(appliedFrom);
  const [toDate, setToDate] = useState(appliedTo);

  const orderResults = useMemo(() => mockLabResults.filter((r) => r.patientId === patient.id), [patient.id]);
  const [selectedOrderId, setSelectedOrderId] = useState(orderResults[0]?.orderId || "");

  useEffect(() => {
    setFromDate(appliedFrom);
    setToDate(appliedTo);
  }, [appliedFrom, appliedTo]);

  const filteredOrderResults = useMemo(
    () =>
      orderResults.filter((result) => {
        const orderMeta = mockOrders.find((item) => item.id === result.orderId);
        const filterDate = toDateKey(orderMeta?.resultDate || orderMeta?.requestedAt);
        return isWithinDateRange(filterDate, appliedFrom, appliedTo);
      }),
    [orderResults, appliedFrom, appliedTo],
  );

  useEffect(() => {
    if (!filteredOrderResults.length) {
      setSelectedOrderId("");
      return;
    }

    const selectedExists = filteredOrderResults.some((item) => item.orderId === selectedOrderId);
    if (!selectedExists) {
      setSelectedOrderId(filteredOrderResults[0].orderId);
    }
  }, [filteredOrderResults, selectedOrderId]);

  const selectedOrder = filteredOrderResults.find((r) => r.orderId === selectedOrderId) || filteredOrderResults[0];
  const selectedMeta = mockOrders.find((o) => o.id === selectedOrder?.orderId);
  const patientTrends = mockLabTrends.filter((trend) => trend.patientId === patient.id);

  useEffect(() => {
    if (selectedOrder) {
      addEvent("document_view", actor, `Visualizacion de orden ${selectedOrder.orderId}`);
    }
  }, [selectedOrder?.orderId, addEvent, actor]);

  const applyFilters = (nextFrom: string, nextTo: string) => {
    const next = new URLSearchParams();
    if (tokenParam) next.set("token", tokenParam);
    if (nextFrom) next.set("from", nextFrom);
    if (nextTo) next.set("to", nextTo);
    setSearchParams(next);
  };

  const handleApply = () => {
    applyFilters(fromDate, toDate);
  };

  const handleClear = () => {
    setFromDate("");
    setToDate("");
    applyFilters("", "");
  };

  const applyQuickRange = (days: number) => {
    const to = formatDateInput(new Date());
    const from = formatDateInput(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
    setFromDate(from);
    setToDate(to);
    applyFilters(from, to);
  };

  return (
    <AuthedLayout title="Mis Resultados Medicos" items={patientNav}>
      <Card>
        <div className="grid gap-3 md:grid-cols-5">
          <div>
            <Label htmlFor="labs-from">Desde</Label>
            <Input id="labs-from" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          </div>
          <div>
            <Label htmlFor="labs-to">Hasta</Label>
            <Input id="labs-to" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
          </div>
          <div className="md:col-span-3 md:flex md:items-end md:justify-end">
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" onClick={() => applyQuickRange(30)}>Ultimos 30 dias</Button>
              <Button variant="ghost" onClick={() => applyQuickRange(90)}>Ultimos 90 dias</Button>
              <Button onClick={handleApply}>Aplicar</Button>
              <Button variant="dark" onClick={handleClear}>Limpiar</Button>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-brand-muted">Mostrando {filteredOrderResults.length} de {orderResults.length} resultados</p>
      </Card>

      {!filteredOrderResults.length ? (
        <Card className="mt-4">
          <h2 className="text-lg font-semibold">No hay resultados en ese rango</h2>
          <p className="mt-2 text-sm text-brand-muted">Ajusta fechas o limpia los filtros para ver todo el historial.</p>
          <Button className="mt-4" onClick={handleClear}>Limpiar filtros</Button>
        </Card>
      ) : (
        <>
          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.35fr]">
            <Card>
              <h2 className="mb-3 font-semibold">Ordenes con resultados</h2>
              <div className="space-y-2">
                {filteredOrderResults.map((order) => {
                  const orderInfo = mockOrders.find((o) => o.id === order.orderId);
                  const filterDate = orderInfo?.resultDate || orderInfo?.requestedAt || "pendiente";

                  return (
                    <button
                      key={order.orderId}
                      onClick={() => setSelectedOrderId(order.orderId)}
                      className={`w-full rounded-xl border px-3 py-2 text-left ${selectedOrder?.orderId === order.orderId ? "border-brand-primary bg-brand-primary/10" : "border-brand-border"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold">{orderInfo?.title || order.orderId}</p>
                        <Badge tone={statusBadge(orderInfo?.status || "pendiente")}>{orderInfo?.status || "pendiente"}</Badge>
                      </div>
                      <p className="text-xs text-brand-muted">
                        {order.exams.length} examenes · fecha {filterDate}
                      </p>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card>
              {selectedOrder && selectedMeta ? (
                <>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedMeta.title}</h3>
                      <p className="text-xs text-brand-muted">Validado por {selectedOrder.validatedBy} {selectedOrder.validatedAt ? `el ${new Date(selectedOrder.validatedAt).toLocaleDateString()}` : "(en proceso)"}</p>
                    </div>
                    <Button
                      onClick={() => {
                        addEvent("download_clicked", actor, `Descarga PDF ${selectedOrder.orderId}`);
                        window.open(selectedOrder.pdfKey, "_blank");
                      }}
                    >
                      Descargar PDF
                    </Button>
                  </div>

                  <p className="mb-3 text-sm text-brand-muted">{selectedOrder.notes}</p>

                  <div className="space-y-4">
                    {selectedOrder.exams.map((exam) => (
                      <Card key={exam.panelId} className="p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <p className="font-semibold">{exam.panelName}</p>
                          <Badge tone={statusBadge(exam.status)}>{exam.status}</Badge>
                        </div>
                        <ResponsiveTable
                          data={exam.items}
                          mobileTitle={(item) => item.displayName}
                          columns={[
                            { key: "param", header: "Parametro", render: (item) => item.displayName },
                            { key: "value", header: "Valor", render: (item) => formatValue(item) },
                            { key: "ref", header: "Rango ref", render: (item) => getReferenceText(item.referenceRange, item.unit) },
                            {
                              key: "flag",
                              header: "Estado",
                              render: (item) => <Badge tone={flagTone(item.flag)}>{flagLabel(item.flag)}</Badge>,
                            },
                            { key: "obs", header: "Observaciones", render: (item) => item.observation || "-" },
                          ]}
                        />
                      </Card>
                    ))}
                  </div>

                  <div className="mt-4 overflow-hidden rounded-xl border border-brand-border">
                    <iframe src={selectedOrder.pdfKey} className="h-72 w-full" title="Vista previa PDF" />
                  </div>
                </>
              ) : null}
            </Card>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {patientTrends.map((trend) => (
              <TrendLine
                key={`${trend.patientId}-${trend.parameterId}`}
                title={`${trend.label} (${trend.unit})`}
                reference={getReferenceText(trend.referenceRange, trend.unit)}
                points={trend.points}
              />
            ))}
          </div>
        </>
      )}
    </AuthedLayout>
  );
}

export function PatientOrdersExamsPage() {
  const patient = useActivePatient();
  const orders = mockOrders.filter((item) => item.patientId === patient.id);

  return (
    <AuthedLayout title="Ordenes y Examenes" items={patientNav}>
      <Card>
        <h2 className="mb-3 text-base font-semibold">Historial cronologico de ordenes</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="relative border-l-2 border-brand-primary/40 pl-4">
              <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-brand-primary" />
              <div className="rounded-xl border border-brand-border bg-white p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{order.title}</p>
                  <Badge tone={statusBadge(order.status)}>{order.status.replace("_", " ")}</Badge>
                </div>
                <p className="text-xs text-brand-muted">Solicitante: {order.physician}</p>
                <div className="mt-2 grid gap-1 text-xs text-brand-muted md:grid-cols-3">
                  <p>Fecha solicitud: {order.requestedAt}</p>
                  <p>Fecha muestra: {order.sampleDate || "Pendiente"}</p>
                  <p>Fecha resultado: {order.resultDate || "Pendiente"}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {order.examPanelIds.map((panelId) => (
                    <Badge key={panelId} tone="neutral">{getPanel(panelId)?.displayName || panelId}</Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </AuthedLayout>
  );
}

export function PatientClinicalDocumentsPage() {
  const addEvent = useAuditStore((s) => s.addEvent);
  const actor = useActor();
  const patient = useActivePatient();
  const docs = useResultsStore((s) => s.documents).filter((d) => d.patientId === patient.id);
  const markAsViewed = useResultsStore((s) => s.markAsViewed);
  const [filters, setFilters] = useState<ResultFilters>({ fromDate: "", toDate: "", category: "", site: "", status: "" });
  const [tab, setTab] = useState("asociados");

  const visible = useMemo(
    () =>
      docs.filter((doc) => {
        if (filters.fromDate && doc.studyDate < filters.fromDate) return false;
        if (filters.toDate && doc.studyDate > filters.toDate) return false;
        if (filters.category && doc.category !== filters.category) return false;
        if (filters.site && !doc.site.toLowerCase().includes(filters.site.toLowerCase())) return false;
        if (filters.status && doc.status !== filters.status) return false;
        return true;
      }),
    [docs, filters],
  );

  const associated = mockClinicalDocuments.filter((item) => item.patientId === patient.id);

  return (
    <AuthedLayout title="Documentos Clinicos" items={patientNav}>
      <Tabs
        tabs={[
          { key: "asociados", label: "Documentacion clinica" },
          { key: "resultados", label: "Adjuntos de resultados" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "asociados" ? (
        <div className="mt-3 space-y-3">
          {associated.map((item) => (
            <Card key={item.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-brand-muted">{item.documentType} · {item.date}</p>
                </div>
                <Button variant="ghost" onClick={() => window.open(item.fileUrl, "_blank")}>Ver</Button>
              </div>
              <p className="mt-2 text-sm text-brand-muted">{item.summary}</p>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-3"><ResultsFilters filters={filters} onChange={setFilters} /></div>
          <div className="mt-3 grid gap-3">
            {visible.map((doc) => (
              <Card key={doc.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{doc.studyName}</p>
                    <p className="text-xs text-brand-muted">{doc.category} · {doc.studyDate}</p>
                  </div>
                  <Button
                    onClick={() => {
                      addEvent("download_clicked", actor, `Descarga documento ${doc.id}`);
                      markAsViewed(doc.id);
                      window.open(doc.fileUrl, "_blank");
                    }}
                  >
                    Descargar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </AuthedLayout>
  );
}

export function PatientShareResultsPage() {
  const [token, setToken] = useState<string | null>(null);

  return (
    <AuthedLayout title="Compartir Resultados" items={patientNav}>
      <Card>
        <h2 className="text-base font-semibold">Compartir con mi medico</h2>
        <p className="mt-2 text-sm text-brand-muted">Notificacion tipo WhatsApp (solo UI). Se genera enlace temporal mock.</p>

        <div className="mt-3 rounded-xl border border-whatsapp/30 bg-whatsapp/10 p-3 text-sm">
          Nuevo resultado disponible. Envia un acceso temporal seguro para revision medica.
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              const newToken = `demo-valid-00${Math.floor(Math.random() * 2) + 1}`;
              setToken(newToken);
            }}
          >
            Generar enlace temporal
          </Button>
          {token ? (
            <Link to={`/r/${token}`}>
              <Button variant="dark">Abrir enlace /r/{token}</Button>
            </Link>
          ) : null}
        </div>
      </Card>
    </AuthedLayout>
  );
}
