import { AuditEvent } from "@/app/types";

export const initialAuditEvents: AuditEvent[] = [
  {
    id: "a-001",
    type: "page_view",
    actor: "demo-user",
    message: "Navegacion a /results/overview",
    timestamp: "2026-02-25T13:05:00Z",
  },
  {
    id: "a-002",
    type: "document_view",
    actor: "demo-user",
    message: "Visualizacion de resultado lr-001",
    timestamp: "2026-02-25T13:20:00Z",
  },
  {
    id: "a-003",
    type: "download_clicked",
    actor: "demo-user",
    message: "Click descarga PDF lr-001",
    timestamp: "2026-02-25T13:40:00Z",
  },
];
