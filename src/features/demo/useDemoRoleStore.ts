import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role } from "@/app/types";
import { useAuditStore } from "@/features/audit/useAuditStore";

type DemoRoleState = {
  role: Role;
  rolePickerOpen: boolean;
  tokenAccessBanner: string | null;
  setRole: (role: Role) => void;
  openRolePicker: () => void;
  closeRolePicker: () => void;
  setTokenAccessBanner: (value: string | null) => void;
};

export const useDemoRoleStore = create<DemoRoleState>()(
  persist(
    (set, get) => ({
      role: "patient",
      rolePickerOpen: false,
      tokenAccessBanner: null,
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
    }),
    { name: "perfilab-demo-role" },
  ),
);
