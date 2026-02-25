import { AuditEvent, ResultDocument } from "@/app/types";

export async function saveDocumentMetadata(_document: ResultDocument) {
  // TODO: conectar API REST/GraphQL (Lambda/AppSync) para metadata y trazabilidad.
  return true;
}

export async function pushAuditEvent(_event: AuditEvent) {
  // TODO: enviar auditoria a API segura para cumplimiento.
  return true;
}
