import { FormEventHandler } from "react";
import { Link } from "react-router-dom";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useCompanySession } from "@/features/demo/useCompanySession";

type Props = {
  industryName: string;
  documentId: string;
  onDocumentIdChange: (value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  demoIds: string[];
  error?: string;
  showPolicyField?: boolean;
  policyValue?: string;
  onPolicyChange?: (value: string) => void;
};

const danaField =
  "w-full rounded-md border border-[#cfd3d8] bg-white px-3 py-2 text-sm text-[#2d3138] outline-none focus:border-dana-primary focus:ring-2 focus:ring-dana-primary/20";
const danaButtonPrimary =
  "rounded-pill border border-[rgb(var(--dc-orange))] bg-[rgb(var(--dc-orange))] text-white shadow-none hover:opacity-90";
const danaSolidStyle = { backgroundColor: "rgb(var(--dc-orange))", borderColor: "rgb(var(--dc-orange))", color: "#ffffff" };

export function AccessPageTemplate({
  industryName,
  documentId,
  onDocumentIdChange,
  onSubmit,
  demoIds,
  error,
  showPolicyField = false,
  policyValue = "",
  onPolicyChange,
}: Props) {
  const { exitToSelector } = useCompanySession();

  return (
    <div className="min-h-screen bg-[#efefef] text-[#2d3138]">
      <header className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/multi" aria-label="Volver al inicio multiempresa">
            <img src="/brand/logo-danaconnect-horizontal.png" alt="DanaConnect" className="h-10 w-auto object-contain" />
          </Link>
          <nav className="hidden items-center gap-8 text-[1.04rem] text-[#444b54] lg:flex">
            <a href="#" className="hover:text-[#1f2937]">Platform</a>
            <a href="#" className="hover:text-[#1f2937]">Use Cases</a>
            <a href="#" className="hover:text-[#1f2937]">Services</a>
            <a href="#" className="hover:text-[#1f2937]">Resources</a>
          </nav>
          <Button className={danaButtonPrimary} style={danaSolidStyle} onClick={exitToSelector}>
            Salir
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <Card className="mx-auto w-full max-w-3xl rounded-2xl border border-[#d9dde2] bg-white p-8 shadow-none">
          <h1 className="text-2xl font-bold">Acceso {industryName}</h1>
          <p className="mt-2 text-sm text-brand-muted">Ingresa tus datos para ver tus documentos.</p>

          <form className="mt-5 space-y-3" onSubmit={onSubmit}>
            <div>
              <Label htmlFor="industry-doc">Cédula / Documento</Label>
              <Input
                id="industry-doc"
                value={documentId}
                onChange={(event) => onDocumentIdChange(event.target.value)}
                placeholder="Ej. V-12000001"
                className={danaField}
                required
              />
            </div>

            {showPolicyField ? (
              <div>
                <Label htmlFor="industry-policy">Número de póliza</Label>
                <Input
                  id="industry-policy"
                  value={policyValue}
                  onChange={(event) => onPolicyChange?.(event.target.value)}
                  placeholder="Ej. POL-998100"
                  className={danaField}
                  required
                />
              </div>
            ) : null}

            {error ? <Alert variant="warn">{error}</Alert> : null}

            <Button type="submit" className={danaButtonPrimary} style={danaSolidStyle}>
              Ver mis documentos
            </Button>
          </form>

          <div className="mt-6 rounded-xl border border-brand-border bg-brand-surface p-4 text-sm">
            <p className="font-semibold">Datos de prueba</p>
            <ul className="mt-1 space-y-1 text-brand-muted">
              {demoIds.map((sample) => (
                <li key={sample}>• {sample}</li>
              ))}
            </ul>
          </div>
        </Card>
      </section>
    </div>
  );
}

