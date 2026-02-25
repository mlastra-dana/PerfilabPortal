import { FormEvent, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuditStore } from "@/features/audit/useAuditStore";
import { useDemoRoleStore } from "@/features/demo/useDemoRoleStore";
import { mockPatients } from "@/mocks/patients";
import { validateDemoToken } from "@/services/mock/tokenValidator";

export function LandingPage() {
  return <Navigate to="/access" replace />;
}

export function AccessPage() {
  const navigate = useNavigate();
  const setPatientSession = useDemoRoleStore((s) => s.setPatientSession);
  const [documentId, setDocumentId] = useState("");
  const [error, setError] = useState("");

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
    <PublicLayout>
      <section className="mx-auto max-w-xl px-4 py-16">
        <Card>
          <div className="mb-4 flex justify-center">
            <img src="/brand/perfilab-logo.png" alt="Perfilab" className="h-8 w-auto object-contain sm:h-10" />
          </div>
          <h1 className="text-center text-2xl font-bold">Portal de Resultados Médicos</h1>
          <p className="mt-2 text-center text-sm text-brand-muted">Ingrese su cédula para ver sus resultados</p>
          <form className="mt-5 space-y-3" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="document-id">Cedula / Documento</Label>
              <Input
                id="document-id"
                value={documentId}
                onChange={(event) => setDocumentId(event.target.value)}
                placeholder="Ej. V-12000001"
                required
              />
            </div>
            {error ? <Alert variant="warn">{error}</Alert> : null}
            <Button type="submit" className="w-full sm:w-auto">
              Consultar mis Resultados Medicos
            </Button>
          </form>
        </Card>
      </section>
    </PublicLayout>
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

    setBanner(`Acceso por enlace temporal (demo). Expira: ${result.expiresAt}`);
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
          <p className="mt-2 text-brand-muted">La pagina no existe en la plataforma de Resultados Médicos.</p>
          <Link to="/" className="mt-4 inline-block">
            <Button>Volver al inicio</Button>
          </Link>
        </Card>
      </div>
    </PublicLayout>
  );
}
