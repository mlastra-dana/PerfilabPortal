import { ResultDocument } from "@/app/types";
import { isAmplifyConfigured } from "@/services/amplify/config";

export type UploadPayload = {
  file: File;
  document: Omit<ResultDocument, "id" | "createdAt" | "fileUrl">;
};

export async function uploadDocument(payload: UploadPayload): Promise<ResultDocument> {
  if (isAmplifyConfigured()) {
    // TODO: integrar Amplify Storage put/getUrl + persistencia de metadata via API.
    throw new Error("Storage Cognito/S3 aun no conectado en este prototipo");
  }

  return {
    ...payload.document,
    id: `mock-${Date.now()}`,
    createdAt: new Date().toISOString(),
    fileUrl: "/sample-docs/example-result.pdf",
  };
}

export function getStorageStatusMessage() {
  return isAmplifyConfigured()
    ? "Storage configurado en Amplify."
    : "Storage no configurado. Se usa fallback mock local.";
}
