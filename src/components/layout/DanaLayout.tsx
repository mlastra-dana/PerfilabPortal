import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useCompanySession } from "@/features/demo/useCompanySession";

const danaButtonPrimary = "rounded-pill border border-[rgb(var(--dc-orange))] bg-[rgb(var(--dc-orange))] text-white shadow-none hover:opacity-90";
const danaSolidStyle = { backgroundColor: "rgb(var(--dc-orange))", borderColor: "rgb(var(--dc-orange))", color: "#ffffff" };

type Props = {
  children: ReactNode;
};

export function DanaLayout({ children }: Props) {
  const location = useLocation();
  const { exitToSelector } = useCompanySession();
  const showExit = location.pathname !== "/" && location.pathname !== "/multi";

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#2d3138]">
      <header className="border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link to="/" aria-label="Volver al inicio multiempresa">
            <img src="/brand/logo-danaconnect-horizontal.png" alt="DANAconnect" className="h-10 w-auto max-w-[190px] object-contain sm:max-w-none" />
          </Link>
          <div className="hidden items-center gap-6 text-sm text-[#5b6068] md:flex">
            <span>Platform</span>
            <span>Use Cases</span>
            <span>Services</span>
            <span>Resources</span>
          </div>
          <div className="flex items-center gap-3">
            {showExit ? (
              <Button className={`w-full sm:w-auto ${danaButtonPrimary}`} style={danaSolidStyle} onClick={exitToSelector}>
                Salir
              </Button>
            ) : null}
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
