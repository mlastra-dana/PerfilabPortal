export type ExamCategory =
  | "Hematologia"
  | "Bioquimica"
  | "Tiroides"
  | "Orina"
  | "Serologia";

export type ResultType = "numeric" | "qualitative";

export type ReferenceRange = {
  min?: number;
  max?: number;
  text?: string;
};

export type ResultFlag = "high" | "low" | "normal" | "na";

export type ExamCatalogItem = {
  id: string;
  displayName: string;
  category: ExamCategory;
  unit?: string;
  resultType: ResultType;
  referenceRange: ReferenceRange;
};

export type ExamPanel = {
  id: string;
  displayName: string;
  category: ExamCategory;
  parameterIds: string[];
};

export type PatientProfile = {
  id: string;
  fullName: string;
  documentId: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  company: string;
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

export type MedicalOrder = {
  id: string;
  patientId: string;
  title: string;
  status: OrderStatus;
  requestedAt: string;
  sampleDate?: string;
  resultDate?: string;
  physician: string;
  examPanelIds: string[];
};

export type ResultItem = {
  parameterId: string;
  displayName: string;
  resultType: ResultType;
  unit?: string;
  referenceRange: ReferenceRange;
  valueNumeric?: number;
  valueText?: string;
  flag: ResultFlag;
  observation?: string;
};

export type ExamResult = {
  panelId: string;
  panelName: string;
  category: ExamCategory;
  status: OrderStatus;
  items: ResultItem[];
};

export type LabOrderResult = {
  orderId: string;
  patientId: string;
  validatedBy: string;
  validatedAt?: string;
  notes: string;
  pdfKey: string;
  exams: ExamResult[];
};

export type TrendPoint = {
  date: string;
  value: number;
};

export type TrendSeries = {
  patientId: string;
  parameterId: string;
  label: string;
  unit: string;
  referenceRange: ReferenceRange;
  points: TrendPoint[];
};
