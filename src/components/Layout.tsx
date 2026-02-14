import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
            className={`text-sm font-medium transition-colors ${
              isActive
                ? "text-emerald-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <div className="flex items-center gap-3 border-l border-slate-200 pl-6 md:border-l">
        <button
          type="button"
          onClick={toggleHideValues}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
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
        <span className="text-sm text-slate-600">{user?.name}</span>
        <Button variant="ghost" size="sm" onClick={() => { onNavClick?.(); logout(); }}>
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
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-xl font-bold text-emerald-700 hover:text-emerald-800"
          >
            Billing
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex md:items-center md:gap-6">
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
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay + panel */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-slate-900/50 md:hidden"
            aria-hidden="true"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside
            className="fixed right-0 top-0 z-40 flex h-full min-h-screen w-72 flex-col gap-6 overflow-y-auto border-l border-slate-200 bg-white px-6 pt-4 pb-6 shadow-xl md:hidden"
            role="dialog"
            aria-label="Menu de navegação"
          >
            <div className="flex shrink-0 items-center justify-end">
              <button
                type="button"
                className="-mr-2 rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Fechar menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
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
                    className={`rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto flex flex-col gap-3 border-t border-slate-200 pt-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleHideValues}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
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
                <span className="text-sm text-slate-600">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" className="justify-start" onClick={() => { setMobileMenuOpen(false); logout(); }}>
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
