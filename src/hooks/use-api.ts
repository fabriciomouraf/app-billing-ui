import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => api.getUsers().then((r) => r.users),
  });
}

export function usePortfolios(userId?: string) {
  return useQuery({
    queryKey: ["portfolios", userId],
    queryFn: () => api.getPortfolios(userId).then((r) => r.portfolios),
  });
}

export function usePortfolio(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["portfolios", id],
    queryFn: () => api.getPortfolio(id!),
    enabled: enabled && !!id,
  });
}

export function useBuckets(portfolioId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ["portfolios", portfolioId, "buckets"],
    queryFn: () => api.getBuckets(portfolioId!).then((r) => r.buckets),
    enabled: enabled && !!portfolioId,
  });
}

export function usePosition(
  portfolioId: string | undefined,
  bucketId: string | undefined,
  enabled = true
) {
  return useQuery({
    queryKey: ["portfolios", portfolioId, "buckets", bucketId, "position"],
    queryFn: () =>
      api.getPosition(portfolioId!, bucketId!),
    enabled: enabled && !!portfolioId && !!bucketId,
  });
}

export function useSnapshots(
  portfolioId: string | undefined,
  bucketId: string | undefined,
  params?: { from?: string; to?: string },
  enabled = true
) {
  return useQuery({
    queryKey: [
      "portfolios",
      portfolioId,
      "buckets",
      bucketId,
      "snapshots",
      params?.from,
      params?.to,
    ],
    queryFn: () =>
      api.getSnapshots(portfolioId!, bucketId!, params).then((r) => r.snapshots),
    enabled: enabled && !!portfolioId && !!bucketId,
  });
}

export function useCreateSnapshot(
  portfolioId: string,
  bucketId: string,
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.createSnapshot>>,
    Error,
    Parameters<typeof api.createSnapshot>[2]
  >
) {
  const qc = useQueryClient();
  const { onSuccess: userOnSuccess, ...restOptions } = options ?? {};
  return useMutation({
    mutationFn: (body: Parameters<typeof api.createSnapshot>[2]) =>
      api.createSnapshot(portfolioId, bucketId, body),
    onSuccess: (data, variables, onMutateResult, context) => {
      qc.invalidateQueries({
        queryKey: ["portfolios", portfolioId, "buckets", bucketId, "snapshots"],
      });
      qc.invalidateQueries({
        queryKey: ["portfolios", portfolioId, "buckets", bucketId, "position"],
      });
      userOnSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}

export function useTransactions(
  portfolioId: string | undefined,
  enabled = true
) {
  return useQuery({
    queryKey: ["portfolios", portfolioId, "transactions"],
    queryFn: () =>
      api.getTransactions(portfolioId!).then((r) => r.transactions),
    enabled: enabled && !!portfolioId,
  });
}

export function useSummaries(
  portfolioId: string | undefined,
  enabled = true
) {
  return useQuery({
    queryKey: ["portfolios", portfolioId, "summaries"],
    queryFn: () =>
      api.getSummaries(portfolioId!).then((r) => r.summaries),
    enabled: enabled && !!portfolioId,
  });
}

export function useSummaryMonth(
  portfolioId: string | undefined,
  month: string,
  enabled = true
) {
  return useQuery({
    queryKey: ["portfolios", portfolioId, "summaries", "month", month],
    queryFn: () => api.getSummaryMonth(portfolioId!, month),
    enabled: enabled && !!portfolioId && !!month,
  });
}

export function useSummaryYear(
  portfolioId: string | undefined,
  year: string,
  enabled = true
) {
  return useQuery({
    queryKey: ["portfolios", portfolioId, "summaries", "year", year],
    queryFn: () => api.getSummaryYear(portfolioId!, year),
    enabled: enabled && !!portfolioId && !!year,
  });
}

export function useCreatePortfolio(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.createPortfolio>>,
    Error,
    Parameters<typeof api.createPortfolio>[0]
  >
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createPortfolio,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portfolios"] }),
    ...options,
  });
}

export function useCreateBucket(
  portfolioId: string,
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.createBucket>>,
    Error,
    Parameters<typeof api.createBucket>[1]
  >
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof api.createBucket>[1]) =>
      api.createBucket(portfolioId, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["portfolios", portfolioId, "buckets"] }),
    ...options,
  });
}

export function useCreateTransaction(
  portfolioId: string,
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.createTransaction>>,
    Error,
    Parameters<typeof api.createTransaction>[1]
  >
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Parameters<typeof api.createTransaction>[1]) =>
      api.createTransaction(portfolioId, body),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: ["portfolios", portfolioId, "transactions"],
      }),
    ...options,
  });
}

export function useFxRates(params: {
  from?: string;
  to?: string;
  date?: string;
  enabled?: boolean;
}) {
  const { from, to, date, enabled = true } = params;
  return useQuery({
    queryKey: ["fx-rates", from, to, date],
    queryFn: async () => {
      const res = date
        ? await api.getFxRates({ date })
        : await api.getFxRates({ from, to });
      let list = res.fxRates;
      if (date && from && to) {
        list = list.filter(
          (fx) => fx.from_currency === from && fx.to_currency === to
        );
      }
      if (list.length === 0 && date && from && to) {
        const fallback = await api.getFxRates({ from, to });
        list = fallback.fxRates;
      }
      return list;
    },
    enabled: enabled && !!(from && to),
  });
}

export function useAllFxRates() {
  return useQuery({
    queryKey: ["fx-rates", "all"],
    queryFn: () => api.getFxRates().then((r) => r.fxRates),
  });
}

export function useCreateFxRate(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.createFxRate>>,
    Error,
    Parameters<typeof api.createFxRate>[0]
  >
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createFxRate,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fx-rates"] }),
    ...options,
  });
}

export function useCreateUser(
  options?: UseMutationOptions<
    Awaited<ReturnType<typeof api.createUser>>,
    Error,
    Parameters<typeof api.createUser>[0]
  >
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
    ...options,
  });
}
