import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useHideValues } from "@/contexts/HideValuesContext";
import { Button } from "@/components/ui/Button";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/portfolios", label: "Portfólios" },
  { to: "/cotacoes", label: "Cotações" },
  { to: "/users", label: "Usuários" },
];

export function Layout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { hideValues, toggleHideValues } = useHideValues();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-xl font-bold text-emerald-700 hover:text-emerald-800"
          >
            Billing
          </Link>
          <nav className="flex items-center gap-6">
                {navItems.map((item) => {
              const isActive =
                item.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
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
            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
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
              <Button variant="ghost" size="sm" onClick={logout}>
                Sair
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
