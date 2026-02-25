import { create } from "zustand";
import { ResultDocument } from "@/app/types";
import { mockDocuments } from "@/mocks/documents";

type ResultsState = {
  documents: ResultDocument[];
  addDocument: (doc: ResultDocument) => void;
  markAsViewed: (id: string) => void;
};

export const useResultsStore = create<ResultsState>((set) => ({
  documents: mockDocuments,
  addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
  markAsViewed: (id) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, status: "visto" } : doc,
      ),
    })),
}));
