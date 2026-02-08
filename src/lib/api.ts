import type {
  Bucket,
  CreateBucketBody,
  CreateFxRateBody,
  CreatePortfolioBody,
  CreateTransactionBody,
  CreateUserBody,
  FxRate,
  Portfolio,
  Position,
  Transaction,
  UpdateBucketBody,
  User,
  UserWithPassword,
} from "@/types/api";

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { message?: string }).message ?? `HTTP ${res.status}`
    );
  }

  return res.json() as Promise<T>;
}

export const api = {
  getHealth: () => fetchApi<{ ok: boolean }>("/health"),

  // Auth
  login: (email: string, password: string) =>
    fetchApi<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // Users
  getUsers: () => fetchApi<{ users: User[] }>("/users"),
  getUser: (id: string) => fetchApi<User>(`/users/${id}`),
  getUserByEmail: (email: string) =>
    fetchApi<UserWithPassword>(`/users?email=${encodeURIComponent(email)}`),
  createUser: (body: CreateUserBody) =>
    fetchApi<User>("/users", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Portfolios
  getPortfolios: (userId?: string) => {
    const q = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    return fetchApi<{ portfolios: Portfolio[] }>(`/portfolios${q}`);
  },
  getPortfolio: (id: string) => fetchApi<Portfolio>(`/portfolios/${id}`),
  createPortfolio: (body: CreatePortfolioBody) =>
    fetchApi<Portfolio>("/portfolios", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Buckets
  getBuckets: (portfolioId: string) =>
    fetchApi<{ buckets: Bucket[] }>(
      `/portfolios/${portfolioId}/buckets`
    ),
  getBucket: (portfolioId: string, bucketId: string) =>
    fetchApi<Bucket>(`/portfolios/${portfolioId}/buckets/${bucketId}`),
  createBucket: (portfolioId: string, body: CreateBucketBody) =>
    fetchApi<Bucket>(`/portfolios/${portfolioId}/buckets`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateBucket: (
    portfolioId: string,
    bucketId: string,
    body: UpdateBucketBody
  ) =>
    fetchApi<Bucket>(
      `/portfolios/${portfolioId}/buckets/${bucketId}`,
      { method: "PATCH", body: JSON.stringify(body) }
    ),

  // Position
  getPosition: (portfolioId: string, bucketId: string) =>
    fetchApi<Position>(
      `/portfolios/${portfolioId}/buckets/${bucketId}/position`
    ),

  // Transactions
  getTransactions: (portfolioId: string) =>
    fetchApi<{ transactions: Transaction[] }>(
      `/portfolios/${portfolioId}/transactions`
    ),
  createTransaction: (
    portfolioId: string,
    body: CreateTransactionBody
  ) =>
    fetchApi<Transaction>(
      `/portfolios/${portfolioId}/transactions`,
      { method: "POST", body: JSON.stringify(body) }
    ),

  // Summaries
  getSummaries: (portfolioId: string) =>
    fetchApi<{ summaries: import("@/types/api").Summary[] }>(
      `/portfolios/${portfolioId}/summaries`
    ),
  getSummaryMonth: (portfolioId: string, month: string) =>
    fetchApi<import("@/types/api").MonthlySummaryResponse>(
      `/portfolios/${portfolioId}/summaries?month=${encodeURIComponent(month)}`
    ),
  getSummaryYear: (portfolioId: string, year: string) =>
    fetchApi<import("@/types/api").YearSummaryResponse>(
      `/portfolios/${portfolioId}/summaries?year=${encodeURIComponent(year)}`
    ),

  // FX Rates
  getFxRates: (params?: { date?: string; from?: string; to?: string }) => {
    const search = new URLSearchParams();
    if (params?.date) search.set("date", params.date);
    if (params?.from) search.set("from", params.from);
    if (params?.to) search.set("to", params.to);
    const q = search.toString() ? `?${search}` : "";
    return fetchApi<{ fxRates: FxRate[] }>(
      `/fx-rates${q}`
    );
  },
  createFxRate: (body: CreateFxRateBody) =>
    fetchApi<FxRate>("/fx-rates", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
