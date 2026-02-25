import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg">
      <header className="border-b border-brand-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/brand/perfilab-logo.png"
              alt="Perfilab"
              className="h-8 w-auto max-w-[180px] object-contain sm:max-w-[220px]"
            />
            <p className="text-sm font-semibold text-brand-text sm:text-base">Resultados Médicos</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm text-brand-muted md:flex">
            <a href="#nosotros">Nosotros</a>
            <a href="#servicios">Servicios</a>
            <a href="#blog">Blog</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-pill bg-brand-primary2 px-4 py-2 text-xs font-semibold text-brand-ink2 sm:inline-flex">
              0212.819.47.50
            </span>
            <Link to="/access">
              <Button>Resultados Médicos</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <section className="mt-16 bg-brand-ink py-12 text-white" id="contacto">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4">
          <img src="/brand/perfilab-logo.png" alt="Perfilab" className="h-8 w-auto object-contain" />
          <p className="text-lg font-semibold">Perfilab</p>
          <p className="text-sm text-white/75">Siguenos en nuestras redes</p>
        </div>
      </section>
    </div>
  );
}
