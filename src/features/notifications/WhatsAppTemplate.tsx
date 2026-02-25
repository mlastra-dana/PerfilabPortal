import { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type Props = {
  patientName: string;
};

export function WhatsAppTemplate({ patientName }: Props) {
  const token = useMemo(() => crypto.randomUUID().slice(0, 12), []);
  const link = `${window.location.origin}/r/${token}`;
  const message = `Hola ${patientName}, tienes un nuevo resultado disponible. Ingresa a: ${link}`;

  return (
    <Card>
      <h3 className="mb-2 text-base font-semibold">WhatsApp Notification Template (solo UI)</h3>
      <p className="mb-3 text-sm text-slate-600">
        WhatsApp se usa solo como canal de aviso. Los resultados se consultan en el portal.
      </p>
      <pre className="overflow-auto rounded-xl border bg-white p-3 text-xs text-slate-700">{message}</pre>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            navigator.clipboard.writeText(message).catch(() => {});
          }}
        >
          Copiar mensaje
        </Button>
        <Button variant="ghost" onClick={() => window.open(link, "_blank")}>Probar enlace firmado simulado</Button>
      </div>
    </Card>
  );
}
