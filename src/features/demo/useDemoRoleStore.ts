import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role } from "@/app/types";
import { useAuditStore } from "@/features/audit/useAuditStore";

export type DemoPatientSession = {
  role: "patient";
  patientId: string;
  documentId: string;
  startedAt: string;
};

type DemoRoleState = {
  role: Role;
  rolePickerOpen: boolean;
  tokenAccessBanner: string | null;
  patientSession: DemoPatientSession | null;
  setRole: (role: Role) => void;
  openRolePicker: () => void;
  closeRolePicker: () => void;
  setTokenAccessBanner: (value: string | null) => void;
  setPatientSession: (session: DemoPatientSession) => void;
  clearPatientSession: () => void;
};

export const useDemoRoleStore = create<DemoRoleState>()(
  persist(
    (set, get) => ({
      role: "patient",
      rolePickerOpen: false,
      tokenAccessBanner: null,
      patientSession: null,
      setRole: (role) => {
        const prev = get().role;
        set({ role, rolePickerOpen: false });
        useAuditStore
          .getState()
          .addEvent("role_changed", "demo-user", `Role cambiado de ${prev} a ${role}`);
      },
      openRolePicker: () => set({ rolePickerOpen: true }),
      closeRolePicker: () => set({ rolePickerOpen: false }),
      setTokenAccessBanner: (value) => set({ tokenAccessBanner: value }),
      setPatientSession: (session) => {
        const prevRole = get().role;
        if (typeof window !== "undefined") {
          window.localStorage.setItem("perfilab-demo-session", JSON.stringify(session));
        }
        set({ role: "patient", patientSession: session, rolePickerOpen: false });
        useAuditStore
          .getState()
          .addEvent("role_changed", "demo-user", `Role cambiado de ${prevRole} a patient`);
      },
      clearPatientSession: () => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("perfilab-demo-session");
        }
        set({ patientSession: null, rolePickerOpen: false });
        useAuditStore.getState().addEvent("role_changed", "demo-user", "Sesion demo por documento finalizada");
      },
    }),
    { name: "perfilab-demo-role" },
  ),
);
