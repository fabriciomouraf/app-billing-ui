import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { HideValuesProvider } from "@/contexts/HideValuesContext";
import { Layout } from "@/components/Layout";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Portfolios } from "@/pages/Portfolios";
import { PortfolioDetail } from "@/pages/PortfolioDetail";
import { BucketDetail } from "@/pages/BucketDetail";
import { FxRates } from "@/pages/FxRates";
import { Users } from "@/pages/Users";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
    },
  },
});

function ProtectedRoutes() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="portfolios" element={<Portfolios />} />
        <Route
          path="portfolios/:portfolioId"
          element={<PortfolioDetail />}
        />
        <Route
          path="portfolios/:portfolioId/buckets/:bucketId"
          element={<BucketDetail />}
        />
        <Route path="cotacoes" element={<FxRates />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HideValuesProvider>
          <BrowserRouter>
            <ProtectedRoutes />
          </BrowserRouter>
        </HideValuesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
