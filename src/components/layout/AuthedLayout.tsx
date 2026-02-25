import { ReactNode, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Alert } from "@/components/ui/Alert";
import { RoleSwitch } from "@/components/layout/RoleSwitch";
import { useAuditStore } from "@/features/audit/useAuditStore";
import { useDemoRoleStore } from "@/features/demo/useDemoRoleStore";

type Item = { to: string; label: string };

type Props = {
  title: string;
  items: Item[];
  children: ReactNode;
};

export function AuthedLayout({ title, items, children }: Props) {
  const location = useLocation();
  const addEvent = useAuditStore((s) => s.addEvent);
  const tokenBanner = useDemoRoleStore((s) => s.tokenAccessBanner);

  useEffect(() => {
    addEvent("page_view", "demo-user", `Navegacion a ${location.pathname}`);
  }, [location.pathname, addEvent]);

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="md:flex">
        <aside className="w-full border-r border-brand-ink/20 bg-brand-ink p-4 text-white md:min-h-screen md:w-64">
          <Link to="/" className="mb-4 block text-lg font-bold text-brand-primary2">Resultados Médicos</Link>
          <nav className="no-scrollbar flex gap-2 overflow-x-auto md:block md:space-y-1">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block whitespace-nowrap rounded-xl px-3 py-2 text-sm ${isActive ? "bg-brand-primary text-white" : "text-white/80 hover:bg-brand-ink2"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-20 border-b border-brand-border bg-white/95 px-4 py-3 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-brand-muted">Resultados Médicos / {location.pathname}</p>
                <h1 className="text-lg font-semibold">{title}</h1>
              </div>
              <RoleSwitch />
            </div>
          </header>

          <div className="space-y-3 p-4">
            <Alert>Modo demostración</Alert>
            {tokenBanner ? <Alert>{tokenBanner}</Alert> : null}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
