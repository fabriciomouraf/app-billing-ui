import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Portfolios } from "@/pages/Portfolios";
import { PortfolioDetail } from "@/pages/PortfolioDetail";
import { BucketDetail } from "@/pages/BucketDetail";
import { Users } from "@/pages/Users";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
