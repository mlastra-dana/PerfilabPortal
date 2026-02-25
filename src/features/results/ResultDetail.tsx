import { ResultDocument } from "@/app/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Props = {
  document: ResultDocument | null;
  onDownload: (doc: ResultDocument) => void;
};

export function ResultDetail({ document, onDownload }: Props) {
  if (!document) {
    return <Card>Selecciona un resultado para ver detalle y preview.</Card>;
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{document.studyName}</h3>
          <p className="text-sm text-slate-600">{document.category}</p>
        </div>
        <Badge tone={document.status === "nuevo" ? "warning" : "success"}>
          {document.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-2 text-sm text-slate-700 md:grid-cols-2">
        <p>
          <strong>Fecha de estudio:</strong> {document.studyDate}
        </p>
        <p>
          <strong>Sede:</strong> {document.site}
        </p>
        <p>
          <strong>Archivo:</strong> {document.fileName}
        </p>
        <p>
          <strong>Etiquetas:</strong> {document.tags?.join(", ") || "Sin etiquetas"}
        </p>
      </div>

      <Button onClick={() => onDownload(document)}>Descargar resultado</Button>

      <div className="overflow-hidden rounded-xl border">
        {document.fileType === "pdf" ? (
          <iframe
            src={document.fileUrl}
            title={document.fileName}
            className="h-[380px] w-full bg-white"
          />
        ) : (
          <img src={document.fileUrl} alt={document.studyName} className="h-[380px] w-full object-contain bg-white" />
        )}
      </div>
    </Card>
  );
}
