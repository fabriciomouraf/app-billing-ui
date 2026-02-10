import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
