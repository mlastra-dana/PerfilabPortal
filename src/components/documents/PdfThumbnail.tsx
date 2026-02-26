import { useMemo, useState } from "react";

type Props = {
  src: string;
  title: string;
};

export function PdfThumbnail({ src, title }: Props) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const previewSrc = useMemo(() => {
    if (!src) return "";
    const joiner = src.includes("?") ? "&" : "?";
    return `${src}${joiner}page=1#page=1&zoom=page-width&view=FitH`;
  }, [src]);

  if (failed || !previewSrc) {
    return (
      <div className="flex h-full items-center justify-center bg-brand-ink/5">
        <div className="text-center">
          <p className="text-3xl">PDF</p>
          <p className="text-xs text-brand-muted">Vista previa</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-brand-surface">
      {loading ? (
        <div className="absolute inset-0 animate-pulse bg-brand-ink/5">
          <div className="flex h-full items-center justify-center text-xs text-brand-muted">Cargando...</div>
        </div>
      ) : null}
      <iframe
        src={previewSrc}
        title={`Vista previa PDF - ${title}`}
        className="h-full w-full"
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setFailed(true);
        }}
      />
    </div>
  );
}

