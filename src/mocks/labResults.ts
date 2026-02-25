import { getCatalogItem, getPanel, resolveNumericFlag, resolveQualitativeFlag } from "@/mocks/catalog";
import { LabOrderResult, ResultItem, TrendSeries } from "@/types/medical";

function numericItem(parameterId: string, value: number, observation?: string): ResultItem {
  const cfg = getCatalogItem(parameterId);
  if (!cfg || cfg.resultType !== "numeric") {
    throw new Error(`Parametro numerico no encontrado: ${parameterId}`);
  }

  return {
    parameterId,
    displayName: cfg.displayName,
    resultType: cfg.resultType,
    unit: cfg.unit,
    referenceRange: cfg.referenceRange,
    valueNumeric: value,
    flag: resolveNumericFlag(value, cfg.referenceRange),
    observation,
  };
}

function qualitativeItem(parameterId: string, value: string, observation?: string): ResultItem {
  const cfg = getCatalogItem(parameterId);
  if (!cfg || cfg.resultType !== "qualitative") {
    throw new Error(`Parametro cualitativo no encontrado: ${parameterId}`);
  }

  return {
    parameterId,
    displayName: cfg.displayName,
    resultType: cfg.resultType,
    unit: cfg.unit,
    referenceRange: cfg.referenceRange,
    valueText: value,
    flag: resolveQualitativeFlag(value, cfg.referenceRange.text),
    observation,
  };
}

export const mockLabResults: LabOrderResult[] = [
  {
    orderId: "ord-001",
    patientId: "p-001",
    validatedBy: "Dra. Helena Ruiz",
    validatedAt: "2026-01-14T10:35:00Z",
    notes: "Glucosa y LDL por encima del objetivo. Sugerir control nutricional.",
    pdfKey: "/sample-docs/result-demo-bioquimica.pdf",
    exams: [
      {
        panelId: "metabolico",
        panelName: getPanel("metabolico")!.displayName,
        category: "Bioquimica",
        status: "entregado",
        items: [numericItem("glu", 108), numericItem("bun", 18), numericItem("crea", 1.05), numericItem("ua", 6.8)],
      },
      {
        panelId: "perfil-lipidico",
        panelName: getPanel("perfil-lipidico")!.displayName,
        category: "Bioquimica",
        status: "entregado",
        items: [numericItem("chol", 222), numericItem("hdl", 42), numericItem("ldl", 144, "LDL elevado"), numericItem("tg", 165)],
      },
      {
        panelId: "tiroides",
        panelName: getPanel("tiroides")!.displayName,
        category: "Tiroides",
        status: "entregado",
        items: [numericItem("tsh", 4.8, "Ligeramente alta"), numericItem("ft4", 1.02)],
      },
    ],
  },
  {
    orderId: "ord-002",
    patientId: "p-001",
    validatedBy: "Dr. Roberto Salinas",
    validatedAt: "2026-02-12T09:20:00Z",
    notes: "Hemograma en rango general. EGO con trazas de proteinas.",
    pdfKey: "/sample-docs/result-demo-hemograma.pdf",
    exams: [
      {
        panelId: "hemograma",
        panelName: getPanel("hemograma")!.displayName,
        category: "Hematologia",
        status: "validado",
        items: [numericItem("wbc", 7.4), numericItem("rbc", 4.9), numericItem("hgb", 13.9), numericItem("hct", 41.5), numericItem("plt", 275)],
      },
      {
        panelId: "orina",
        panelName: getPanel("orina")!.displayName,
        category: "Orina",
        status: "validado",
        items: [
          qualitativeItem("ur-color", "Amarillo paja"),
          qualitativeItem("ur-aspect", "Claro"),
          numericItem("ur-ph", 6.2),
          numericItem("ur-density", 1.02),
          qualitativeItem("ur-protein", "TRAZAS", "Controlar hidratacion"),
          qualitativeItem("ur-glu", "NEG"),
        ],
      },
    ],
  },
  {
    orderId: "ord-003",
    patientId: "p-002",
    validatedBy: "Dra. Nora Baez",
    notes: "Orden en proceso. Pendiente validacion final de panel metabolico.",
    pdfKey: "/sample-docs/result-demo-bioquimica.pdf",
    exams: [
      {
        panelId: "metabolico",
        panelName: getPanel("metabolico")!.displayName,
        category: "Bioquimica",
        status: "en_proceso",
        items: [numericItem("glu", 126, "Hiperglucemia"), numericItem("bun", 19), numericItem("crea", 1.18), numericItem("ua", 7.1)],
      },
      {
        panelId: "tiroides",
        panelName: getPanel("tiroides")!.displayName,
        category: "Tiroides",
        status: "en_proceso",
        items: [numericItem("tsh", 2.2), numericItem("ft4", 1.2)],
      },
    ],
  },
  {
    orderId: "ord-004",
    patientId: "p-002",
    validatedBy: "Dr. Samuel Vera",
    validatedAt: "2026-01-22T11:05:00Z",
    notes: "PCR con elevacion leve. Perfil lipidico con LDL sobre meta.",
    pdfKey: "/sample-docs/result-demo-lipidico.pdf",
    exams: [
      {
        panelId: "perfil-lipidico",
        panelName: getPanel("perfil-lipidico")!.displayName,
        category: "Bioquimica",
        status: "entregado",
        items: [numericItem("chol", 208), numericItem("hdl", 48), numericItem("ldl", 132), numericItem("tg", 140)],
      },
      {
        panelId: "inflamacion",
        panelName: getPanel("inflamacion")!.displayName,
        category: "Serologia",
        status: "entregado",
        items: [numericItem("crp", 6.4, "Elevacion leve")],
      },
    ],
  },
  {
    orderId: "ord-005",
    patientId: "p-003",
    validatedBy: "Dra. Elena Duarte",
    validatedAt: "2026-02-16T08:40:00Z",
    notes: "Hemograma normal. Glucosa en limite alto, vigilar control dietario.",
    pdfKey: "/sample-docs/result-demo-orina.pdf",
    exams: [
      {
        panelId: "hemograma",
        panelName: getPanel("hemograma")!.displayName,
        category: "Hematologia",
        status: "validado",
        items: [numericItem("wbc", 6.1), numericItem("rbc", 4.6), numericItem("hgb", 12.8), numericItem("hct", 38.7), numericItem("plt", 310)],
      },
      {
        panelId: "metabolico",
        panelName: getPanel("metabolico")!.displayName,
        category: "Bioquimica",
        status: "validado",
        items: [numericItem("glu", 100), numericItem("bun", 15), numericItem("crea", 0.84), numericItem("ua", 5.3)],
      },
      {
        panelId: "orina",
        panelName: getPanel("orina")!.displayName,
        category: "Orina",
        status: "validado",
        items: [qualitativeItem("ur-color", "Amarillo paja"), qualitativeItem("ur-aspect", "Claro"), numericItem("ur-ph", 5.8), numericItem("ur-density", 1.016), qualitativeItem("ur-protein", "NEG"), qualitativeItem("ur-glu", "NEG")],
      },
    ],
  },
  {
    orderId: "ord-006",
    patientId: "p-003",
    validatedBy: "Dra. Elena Duarte",
    notes: "Orden pendiente. Resultados aun no disponibles.",
    pdfKey: "/sample-docs/result-demo-tiroides.pdf",
    exams: [
      {
        panelId: "tiroides",
        panelName: getPanel("tiroides")!.displayName,
        category: "Tiroides",
        status: "pendiente",
        items: [numericItem("tsh", 5.6, "Sospecha de hipotiroidismo subclinico"), numericItem("ft4", 0.88)],
      },
    ],
  },
];

export const mockLabTrends: TrendSeries[] = [
  {
    patientId: "p-001",
    parameterId: "glu",
    label: "Glucosa en ayunas",
    unit: "mg/dL",
    referenceRange: getCatalogItem("glu")!.referenceRange,
    points: [
      { date: "2025-09-12", value: 96 },
      { date: "2025-12-10", value: 103 },
      { date: "2026-01-13", value: 108 },
      { date: "2026-02-25", value: 104 },
    ],
  },
  {
    patientId: "p-001",
    parameterId: "ldl",
    label: "LDL",
    unit: "mg/dL",
    referenceRange: getCatalogItem("ldl")!.referenceRange,
    points: [
      { date: "2025-09-12", value: 118 },
      { date: "2025-12-10", value: 131 },
      { date: "2026-01-13", value: 144 },
    ],
  },
  {
    patientId: "p-001",
    parameterId: "tsh",
    label: "TSH",
    unit: "uIU/mL",
    referenceRange: getCatalogItem("tsh")!.referenceRange,
    points: [
      { date: "2025-09-12", value: 3.4 },
      { date: "2025-12-10", value: 4.1 },
      { date: "2026-01-13", value: 4.8 },
    ],
  },
  {
    patientId: "p-002",
    parameterId: "glu",
    label: "Glucosa en ayunas",
    unit: "mg/dL",
    referenceRange: getCatalogItem("glu")!.referenceRange,
    points: [
      { date: "2025-10-01", value: 98 },
      { date: "2026-01-21", value: 112 },
      { date: "2026-02-06", value: 126 },
    ],
  },
  {
    patientId: "p-002",
    parameterId: "ldl",
    label: "LDL",
    unit: "mg/dL",
    referenceRange: getCatalogItem("ldl")!.referenceRange,
    points: [
      { date: "2025-10-01", value: 106 },
      { date: "2026-01-21", value: 119 },
      { date: "2026-02-06", value: 132 },
    ],
  },
  {
    patientId: "p-003",
    parameterId: "tsh",
    label: "TSH",
    unit: "uIU/mL",
    referenceRange: getCatalogItem("tsh")!.referenceRange,
    points: [
      { date: "2025-09-20", value: 3.1 },
      { date: "2025-12-22", value: 4.4 },
      { date: "2026-03-02", value: 5.6 },
    ],
  },
];
