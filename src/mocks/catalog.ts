import {
  ExamCatalogItem,
  ExamPanel,
  ReferenceRange,
  ResultFlag,
} from "@/types/medical";

// Rangos de referencia tipicos en adultos. Ajustable por laboratorio.
export const examCatalog: ExamCatalogItem[] = [
  { id: "wbc", displayName: "Leucocitos (WBC)", category: "Hematologia", unit: "x10^3/uL", resultType: "numeric", referenceRange: { min: 4.0, max: 11.0 } },
  { id: "rbc", displayName: "Eritrocitos (RBC)", category: "Hematologia", unit: "x10^6/uL", resultType: "numeric", referenceRange: { min: 4.0, max: 5.8 } },
  { id: "hgb", displayName: "Hemoglobina (HGB)", category: "Hematologia", unit: "g/dL", resultType: "numeric", referenceRange: { min: 12.0, max: 17.5 } },
  { id: "hct", displayName: "Hematocrito (HCT)", category: "Hematologia", unit: "%", resultType: "numeric", referenceRange: { min: 36, max: 52 } },
  { id: "plt", displayName: "Plaquetas (PLT)", category: "Hematologia", unit: "x10^3/uL", resultType: "numeric", referenceRange: { min: 150, max: 450 } },

  { id: "glu", displayName: "Glucosa en ayunas", category: "Bioquimica", unit: "mg/dL", resultType: "numeric", referenceRange: { min: 70, max: 99 } },
  { id: "bun", displayName: "Urea (BUN)", category: "Bioquimica", unit: "mg/dL", resultType: "numeric", referenceRange: { min: 7, max: 20 } },
  { id: "crea", displayName: "Creatinina", category: "Bioquimica", unit: "mg/dL", resultType: "numeric", referenceRange: { min: 0.6, max: 1.3 } },
  { id: "ua", displayName: "Acido urico", category: "Bioquimica", unit: "mg/dL", resultType: "numeric", referenceRange: { min: 3.4, max: 7.0 } },
  { id: "chol", displayName: "Colesterol total", category: "Bioquimica", unit: "mg/dL", resultType: "numeric", referenceRange: { min: 125, max: 200, text: "Deseable <200" } },
  { id: "hdl", displayName: "HDL", category: "Bioquimica", unit: "mg/dL", resultType: "numeric", referenceRange: { min: 40, text: "Deseable >40" } },
  { id: "ldl", displayName: "LDL", category: "Bioquimica", unit: "mg/dL", resultType: "numeric", referenceRange: { max: 100, text: "Deseable <100" } },
  { id: "tg", displayName: "Trigliceridos", category: "Bioquimica", unit: "mg/dL", resultType: "numeric", referenceRange: { max: 150, text: "Deseable <150" } },

  { id: "tsh", displayName: "TSH", category: "Tiroides", unit: "uIU/mL", resultType: "numeric", referenceRange: { min: 0.4, max: 4.0 } },
  { id: "ft4", displayName: "T4 libre", category: "Tiroides", unit: "ng/dL", resultType: "numeric", referenceRange: { min: 0.8, max: 1.8 } },

  { id: "ur-color", displayName: "Orina - Color", category: "Orina", resultType: "qualitative", referenceRange: { text: "Amarillo paja" } },
  { id: "ur-aspect", displayName: "Orina - Aspecto", category: "Orina", resultType: "qualitative", referenceRange: { text: "Claro" } },
  { id: "ur-ph", displayName: "Orina - pH", category: "Orina", resultType: "numeric", referenceRange: { min: 4.5, max: 8.0 } },
  { id: "ur-density", displayName: "Orina - Densidad", category: "Orina", resultType: "numeric", referenceRange: { min: 1.005, max: 1.03 } },
  { id: "ur-protein", displayName: "Orina - Proteinas", category: "Orina", resultType: "qualitative", referenceRange: { text: "NEG" } },
  { id: "ur-glu", displayName: "Orina - Glucosa", category: "Orina", resultType: "qualitative", referenceRange: { text: "NEG" } },

  { id: "crp", displayName: "Proteina C Reactiva (PCR/CRP)", category: "Serologia", unit: "mg/L", resultType: "numeric", referenceRange: { max: 5 } },
];

export const examPanels: ExamPanel[] = [
  { id: "hemograma", displayName: "Hemograma completo", category: "Hematologia", parameterIds: ["wbc", "rbc", "hgb", "hct", "plt"] },
  { id: "perfil-lipidico", displayName: "Perfil lipidico", category: "Bioquimica", parameterIds: ["chol", "hdl", "ldl", "tg"] },
  { id: "metabolico", displayName: "Panel metabolico basico", category: "Bioquimica", parameterIds: ["glu", "bun", "crea", "ua"] },
  { id: "tiroides", displayName: "Perfil tiroideo", category: "Tiroides", parameterIds: ["tsh", "ft4"] },
  { id: "orina", displayName: "Examen general de orina", category: "Orina", parameterIds: ["ur-color", "ur-aspect", "ur-ph", "ur-density", "ur-protein", "ur-glu"] },
  { id: "inflamacion", displayName: "PCR (inflamacion)", category: "Serologia", parameterIds: ["crp"] },
];

const catalogMap = new Map(examCatalog.map((item) => [item.id, item]));
const panelMap = new Map(examPanels.map((panel) => [panel.id, panel]));

export function getCatalogItem(id: string) {
  return catalogMap.get(id);
}

export function getPanel(id: string) {
  return panelMap.get(id);
}

export function getReferenceText(range: ReferenceRange, unit?: string) {
  if (range.text) return range.text;
  if (typeof range.min === "number" && typeof range.max === "number") {
    return `${range.min} - ${range.max}${unit ? ` ${unit}` : ""}`;
  }
  if (typeof range.min === "number") return `>= ${range.min}${unit ? ` ${unit}` : ""}`;
  if (typeof range.max === "number") return `<= ${range.max}${unit ? ` ${unit}` : ""}`;
  return "No aplica";
}

export function resolveNumericFlag(value: number, range: ReferenceRange): ResultFlag {
  if (typeof range.min === "number" && value < range.min) return "low";
  if (typeof range.max === "number" && value > range.max) return "high";
  return "normal";
}

export function resolveQualitativeFlag(value: string, expected?: string): ResultFlag {
  if (!expected) return "na";
  if (value.trim().toUpperCase() === expected.trim().toUpperCase()) return "normal";
  return "high";
}
