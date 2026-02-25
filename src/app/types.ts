export type Role = "admin" | "staff" | "patient";

export type ResultCategory = "Laboratorio" | "Rayos X" | "Mamografias";
export type ResultStatus = "nuevo" | "visto";

export type ResultDocument = {
  id: string;
  patientId: string;
  category: ResultCategory;
  studyName: string;
  studyDate: string;
  site: string;
  status: ResultStatus;
  fileName: string;
  fileUrl: string;
  fileType: "pdf" | "image";
  createdAt: string;
  tags?: string[];
};

export type Patient = {
  id: string;
  fullName: string;
  documentId: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  historyNumber: string;
  insurer: string;
  plan: string;
  site: string;
  consents: Array<{
    id: string;
    name: string;
    accepted: boolean;
    updatedAt: string;
  }>;
};

export type OrderStatus = "pendiente" | "en_proceso" | "validado" | "entregado";

export type ExamOrder = {
  id: string;
  patientId: string;
  examName: string;
  area: "Laboratorio" | "Imagen" | "Especializado";
  status: OrderStatus;
  requestedAt: string;
  sampleDate?: string;
  resultDate?: string;
  physician: string;
};

export type LabMeasurement = {
  code: string;
  name: string;
  value: number;
  unit: string;
  refMin: number;
  refMax: number;
  observation?: string;
};

export type LabReport = {
  id: string;
  patientId: string;
  orderId: string;
  panelName: string;
  collectedAt: string;
  validatedAt: string;
  validatedBy: string;
  notes?: string;
  pdfUrl: string;
  measurements: LabMeasurement[];
};

export type TrendPoint = {
  date: string;
  value: number;
};

export type LabTrend = {
  patientId: string;
  parameterCode: string;
  parameterName: string;
  unit: string;
  points: TrendPoint[];
};

export type ClinicalDocument = {
  id: string;
  patientId: string;
  title: string;
  documentType: "informe" | "adjunto" | "recomendacion" | "indicacion";
  date: string;
  summary: string;
  fileUrl: string;
};

export type AuditEventType =
  | "role_changed"
  | "page_view"
  | "document_view"
  | "download_clicked"
  | "upload";

export type AuditEvent = {
  id: string;
  type: AuditEventType;
  actor: string;
  message: string;
  timestamp: string;
};
