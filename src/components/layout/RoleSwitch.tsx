import { Role } from "@/app/types";
import { Button } from "@/components/ui/Button";
import { useCompanySession } from "@/features/demo/useCompanySession";
import { useDemoRoleStore } from "@/features/demo/useDemoRoleStore";

const roles: Role[] = ["patient", "staff", "admin"];

export function RoleSwitch({ compact = true }: { compact?: boolean }) {
  const { exitToSelector } = useCompanySession();
  const { role, patientSession, setRole, rolePickerOpen, openRolePicker, closeRolePicker } = useDemoRoleStore();
  const label = role === "patient" && patientSession ? `Paciente: ${patientSession.documentId}` : `Rol: ${role}`;

  return (
    <div className="relative">
      <Button variant="ghost" className="text-xs" onClick={openRolePicker}>
        {label}
      </Button>

      {(rolePickerOpen || !compact) && (
        <div className="absolute right-0 top-11 z-40 w-44 rounded-2xl border border-brand-border bg-white p-2 shadow-soft">
          {roles.map((item) => (
            <button
              key={item}
              onClick={() => setRole(item)}
              className={`block w-full rounded-xl px-3 py-2 text-left text-sm ${role === item ? "bg-brand-primary text-white" : "hover:bg-brand-surface"}`}
            >
              {item}
            </button>
          ))}
          <button
            className="mt-1 w-full rounded-xl px-3 py-2 text-left text-xs text-brand-muted hover:bg-brand-surface"
            onClick={exitToSelector}
          >
            Salir
          </button>
          <button className="mt-1 w-full rounded-xl px-3 py-2 text-xs text-brand-muted hover:bg-brand-surface" onClick={closeRolePicker}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
