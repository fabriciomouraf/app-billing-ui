import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useHideValues } from "@/contexts/HideValuesContext";
import { Button } from "@/components/ui";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/portfolios", label: "Portfólios" },
  { to: "/cotacoes", label: "Cotações" },
  { to: "/users", label: "Usuários" },
];

function NavContent({
  location,
  hideValues,
  toggleHideValues,
  user,
  logout,
  onNavClick,
}: {
  location: ReturnType<typeof useLocation>;
  hideValues: boolean;
  toggleHideValues: () => void;
  user: { name?: string } | null;
  logout: () => void;
  onNavClick?: () => void;
}) {
  return (
    <>
      {navItems.map((item) => {
        const isActive =
          item.to === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavClick}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              isActive
                ? "bg-white/70 text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_10px_24px_rgba(255,255,255,0.18)]"
                : "text-slate-700 hover:bg-white/45 hover:text-slate-950"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <div className="ml-2 flex items-center gap-2 border-l border-white/35 pl-4">
        <button
          type="button"
          onClick={toggleHideValues}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-white/45 text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition hover:bg-white/70 hover:text-slate-900"
          title={hideValues ? "Mostrar valores" : "Ocultar valores"}
          aria-label={hideValues ? "Mostrar valores" : "Ocultar valores"}
        >
          {hideValues ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
              <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
              <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
              <path d="m2 2 20 20" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
        <div className="hidden min-w-0 px-2 lg:block">
          <span className="block truncate text-sm font-medium text-slate-700">
            {user?.name}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-11 rounded-full border border-white/60 bg-white/50 px-5 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-white/75"
          onClick={() => {
            onNavClick?.();
            logout();
          }}
        >
          Sair
        </Button>
      </div>
    </>
  );
}

export function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { hideValues, toggleHideValues } = useHideValues();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef3f8_0%,#f8fafc_22%,#f8fafc_100%)]">
      <header className="sticky top-0 z-20 px-3 pt-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/65 bg-white/38 shadow-[0_24px_70px_rgba(148,163,184,0.18)] backdrop-blur-3xl">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-white/90" />
            <div className="pointer-events-none absolute -left-12 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-white/55 blur-2xl" />
            <div className="mx-auto flex h-20 items-center justify-between px-5 sm:px-7">
          <Link
            to="/"
            className="text-2xl font-bold tracking-[-0.05em] text-slate-900 transition hover:text-slate-700"
          >
            Billing
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex md:items-center md:gap-1">
            <NavContent
              location={location}
              hideValues={hideValues}
              toggleHideValues={toggleHideValues}
              user={user}
              logout={logout}
            />
          </nav>

          {/* Hamburger button (mobile) - só ícone de abrir; o X fica dentro do painel */}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/50 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:bg-white/75 hover:text-slate-950 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay + panel */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-slate-900/18 backdrop-blur-sm md:hidden"
            aria-hidden="true"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside
            className="fixed right-3 top-3 z-40 flex h-[calc(100vh-1.5rem)] w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-6 overflow-y-auto rounded-[2rem] border border-white/65 bg-white/42 px-6 pb-6 pt-5 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-3xl md:hidden"
            role="dialog"
            aria-label="Menu de navegação"
          >
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/90" />
            <div className="flex shrink-0 items-center justify-end">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-white/50 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:bg-white/75 hover:text-slate-950"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => {
                const isActive =
                  item.to === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-2xl px-4 py-3 text-base font-semibold transition-all ${
                      isActive
                        ? "border border-white/65 bg-white/70 text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_12px_28px_rgba(255,255,255,0.16)]"
                        : "text-slate-700 hover:bg-white/50 hover:text-slate-950"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto flex flex-col gap-3 border-t border-white/40 pt-5">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleHideValues}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-white/45 text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] transition hover:bg-white/70 hover:text-slate-900"
                  title={hideValues ? "Mostrar valores" : "Ocultar valores"}
                  aria-label={hideValues ? "Mostrar valores" : "Ocultar valores"}
                >
                  {hideValues ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                      <path d="m2 2 20 20" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
                <span className="text-sm font-medium text-slate-700">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-11 justify-start rounded-full border border-white/60 bg-white/50 px-5 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] hover:bg-white/75"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
              >
                Sair
              </Button>
            </div>
          </aside>
        </>
      )}

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
