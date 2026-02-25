import { ClinicalDocument } from "@/app/types";

export const mockClinicalDocuments: ClinicalDocument[] = [
  {
    id: "cd-1",
    patientId: "p-001",
    title: "Informe complementario de laboratorio",
    documentType: "informe",
    date: "2026-02-21",
    summary: "Interpretacion clinica preliminar de panel metabolico.",
    fileUrl: "/sample-docs/example-result.pdf",
  },
  {
    id: "cd-2",
    patientId: "p-001",
    title: "Indicaciones tecnicas para proxima toma",
    documentType: "indicacion",
    date: "2026-02-26",
    summary: "Ayuno de 10 horas y suspension de suplementos 24h antes.",
    fileUrl: "/sample-docs/example-result.pdf",
  },
  {
    id: "cd-3",
    patientId: "p-001",
    title: "Recomendaciones post examen",
    documentType: "recomendacion",
    date: "2026-02-26",
    summary: "Mantener hidratacion y seguimiento con medico tratante.",
    fileUrl: "/sample-docs/example-result.pdf",
  },
];
