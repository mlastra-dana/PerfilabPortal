import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { AccessPageTemplate } from "@/components/AccessPageTemplate";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuditStore } from "@/features/audit/useAuditStore";
import { useDemoRoleStore } from "@/features/demo/useDemoRoleStore";
import { mockPatients } from "@/mocks/patients";
import { validateDemoToken } from "@/services/mock/tokenValidator";

export function LandingPage() {
  return (
    <PublicLayout>
      <section className="hero-pattern relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 py-24 text-white">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">Multiempresas de visual/descarga documentos</h1>
          <p className="mt-4 max-w-xl text-base text-white/95 md:text-lg">
            Consulta y descarga tus documentos de forma segura en una experiencia unificada.
          </p>
          <div className="mt-8">
            <Link to="/access">
              <Button variant="dark" className="text-base">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export function AccessPage() {
  const navigate = useNavigate();
  const setPatientSession = useDemoRoleStore((s) => s.setPatientSession);
  const [documentId, setDocumentId] = useState("");
  const [error, setError] = useState("");
  const labDemoIds = ["V-16004539", "V-12000001", "V-12000002", "V-12000003"];

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedDoc = documentId.trim().toUpperCase();
    const patient = mockPatients.find((item) => item.documentId.toUpperCase() === normalizedDoc);

    if (!patient) {
      setError("No hay resultados para esta cédula.");
      return;
    }

    setError("");
    setPatientSession({
      role: "patient",
      patientId: patient.id,
      documentId: patient.documentId,
      startedAt: new Date().toISOString(),
    });
    navigate("/results/labs", { replace: true });
  };

  return (
    <AccessPageTemplate
      industryName="Laboratorio"
      documentId={documentId}
      onDocumentIdChange={setDocumentId}
      onSubmit={onSubmit}
      demoIds={labDemoIds}
      error={error}
    />
  );
}

export function LoginPage() {
  return <Navigate to="/results/overview" replace />;
}

export function TokenAccessPage() {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const setBanner = useDemoRoleStore((s) => s.setTokenAccessBanner);
  const addEvent = useAuditStore((s) => s.addEvent);

  useEffect(() => {
    const result = validateDemoToken(token);
    if (!result.valid) return;

    setBanner(`Acceso por enlace temporal. Expira: ${result.expiresAt}`);
    addEvent("page_view", "demo-user", `Ingreso por token ${token}`);
    navigate(`/results/labs?token=${encodeURIComponent(token)}`, { replace: true });
  }, [token, setBanner, navigate, addEvent]);

  const validation = validateDemoToken(token);
  if (validation.valid) return null;

  return (
    <PublicLayout>
      <div className="mx-auto max-w-xl px-4 py-16">
        <Card>
          <h1 className="text-2xl font-bold">Enlace no valido o expirado</h1>
          <Alert variant="warn" className="mt-3">
            Este acceso temporal no esta disponible. Solicita un nuevo enlace.
          </Alert>
          <Link to="/" className="mt-4 inline-block">
            <Button>Volver al inicio</Button>
          </Link>
        </Card>
      </div>
    </PublicLayout>
  );
}

export function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="mx-auto max-w-xl px-4 py-16">
        <Card>
          <h1 className="text-2xl font-bold">404</h1>
          <p className="mt-2 text-brand-muted">La pagina no existe en la plataforma de documentos.</p>
          <Link to="/" className="mt-4 inline-block">
            <Button>Volver al inicio</Button>
          </Link>
        </Card>
      </div>
    </PublicLayout>
  );
}
