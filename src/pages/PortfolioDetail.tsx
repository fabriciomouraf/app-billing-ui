import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Landmark,
  Layers3,
  Plus,
  ReceiptText,
} from "lucide-react";
import {
  usePortfolio,
  useBuckets,
  useCreateBucket,
  useTransactions,
} from "@/hooks/use-api";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
} from "@/components/ui";
import { useHideValues, maskValue } from "@/contexts/HideValuesContext";
import {
  formatCurrencyBRL,
  formatCurrencyUSD,
  formatDate,
} from "@/lib/formatters";
import type { Bucket, BucketType, Currency } from "@/types/api";

const bucketTypeOptions: { value: BucketType; label: string }[] = [
  { value: "FIXED_INCOME", label: "Renda fixa" },
  { value: "US_STOCKS", label: "Ações EUA" },
  { value: "BITCOIN", label: "Bitcoin" },
  { value: "OTHER", label: "Outros" },
];

const currencyOptions: { value: Currency; label: string }[] = [
  { value: "BRL", label: "BRL" },
  { value: "USD", label: "USD" },
];

const transactionTypeLabels: Record<string, string> = {
  CONTRIBUTION: "Contribuição",
  WITHDRAWAL: "Resgate",
  INCOME: "Rendimento",
  FEE: "Taxa",
  TAX: "Imposto",
  ADJUSTMENT: "Ajuste",
};

function formatValue(value: number, currency: string) {
  return currency === "BRL" ? formatCurrencyBRL(value) : formatCurrencyUSD(value);
}

export function PortfolioDetail() {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const [showBucketForm, setShowBucketForm] = useState(false);
  const [bucketName, setBucketName] = useState("");
  const [bucketType, setBucketType] = useState<BucketType>("FIXED_INCOME");
  const [bucketCurrency, setBucketCurrency] = useState<Currency>("BRL");

  const { hideValues } = useHideValues();
  const {
    data: portfolio,
    isLoading: loadingPortfolio,
    error,
  } = usePortfolio(portfolioId);
  const { data: buckets, isLoading: loadingBuckets } = useBuckets(portfolioId);
  const { data: transactions } = useTransactions(portfolioId);
  const createBucket = useCreateBucket(portfolioId ?? "", {
    onSuccess: () => {
      setShowBucketForm(false);
      setBucketName("");
    },
  });

  const handleCreateBucket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bucketName.trim() || !portfolioId) return;
    createBucket.mutate({
      type: bucketType,
      name: bucketName.trim(),
      referenceCurrency: bucketCurrency,
      active: true,
    });
  };

  if (loadingPortfolio || !portfolioId) {
    return (
      <div className="grid gap-5 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card
            key={item}
            className="glass-panel animate-pulse border-0 bg-transparent shadow-none"
          >
            <CardContent className="space-y-4 p-6">
              <div className="h-4 w-28 rounded-full bg-white/65" />
              <div className="h-10 w-40 rounded-full bg-white/65" />
              <div className="h-24 rounded-[1.4rem] bg-white/65" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error ?? !portfolio) {
    return (
      <Card className="glass-panel border border-red-200/80 bg-red-50/80 shadow-none">
        <CardContent className="space-y-4 p-6">
          <p className="text-red-700">
            {error?.message ?? "Portfólio não encontrado"}
          </p>
          <Link
            to="/portfolios"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar aos portfólios
          </Link>
        </CardContent>
      </Card>
    );
  }

  const bucketList = buckets ?? [];
  const txList = transactions ?? [];

  return (
    <div className="flex flex-col gap-8">
      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-4">
            <Link
              to="/portfolios"
              className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/72 px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para portfólios
            </Link>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/72 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                <Landmark className="h-3.5 w-3.5" />
                Portfolio
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                  {portfolio.name}
                </h1>
                <p className="mt-2 text-sm text-slate-600 sm:text-base">
                  Acompanhe buckets e transações em uma mesma visão operacional.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MetricChip label="Moeda base" value={portfolio.base_currency} />
            <MetricChip label="Buckets" value={String(bucketList.length)} />
            <MetricChip label="Transações" value={String(txList.length)} />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Buckets
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Organize as classes de ativos dentro do portfólio.
            </p>
          </div>
          <Button
            onClick={() => setShowBucketForm((v) => !v)}
            variant="secondary"
            size="sm"
            className="h-11 rounded-full border border-white/75 bg-white/72 px-5 text-slate-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.94)] hover:bg-white/84"
          >
            <Plus className="h-4 w-4" />
            {showBucketForm ? "Cancelar" : "Novo bucket"}
          </Button>
        </div>

        {showBucketForm ? (
          <Card className="glass-panel border-0 bg-transparent shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                Novo bucket
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Defina o tipo, nome e moeda de referência.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleCreateBucket}
                className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.7fr)_auto]"
              >
                <Input
                  label="Nome"
                  value={bucketName}
                  onChange={(e) => setBucketName(e.target.value)}
                  placeholder="Ex: CDB"
                  required
                  disabled={createBucket.isPending}
                  className="glass-input"
                />
                <Select
                  label="Tipo"
                  value={bucketType}
                  onChange={(e) => setBucketType(e.target.value as BucketType)}
                  options={bucketTypeOptions}
                  disabled={createBucket.isPending}
                  className="glass-input"
                />
                <Select
                  label="Moeda"
                  value={bucketCurrency}
                  onChange={(e) =>
                    setBucketCurrency(e.target.value as Currency)
                  }
                  options={currencyOptions}
                  disabled={createBucket.isPending}
                  className="glass-input"
                />
                <div className="flex flex-col justify-end gap-2">
                  <Button
                    type="submit"
                    disabled={createBucket.isPending}
                    className="h-12 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
                  >
                    {createBucket.isPending ? "Criando..." : "Criar bucket"}
                  </Button>
                </div>
              </form>
              {createBucket.error ? (
                <p className="mt-4 text-sm text-red-600">
                  {createBucket.error.message}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        {loadingBuckets ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                className="glass-panel animate-pulse border-0 bg-transparent shadow-none"
              >
                <CardContent className="space-y-4 p-6">
                  <div className="h-5 w-24 rounded-full bg-white/65" />
                  <div className="h-8 w-40 rounded-full bg-white/65" />
                  <div className="h-16 rounded-[1.2rem] bg-white/65" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : bucketList.length === 0 ? (
          <Card className="glass-panel border-0 bg-transparent shadow-none">
            <CardContent className="flex flex-col items-start gap-3 p-8">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-white/70 bg-white/70 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]">
                <Layers3 className="h-6 w-6" />
              </span>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-950">
                  Nenhum bucket neste portfólio.
                </h3>
                <p className="text-sm text-slate-600">
                  Crie o primeiro bucket para começar a estruturar os ativos.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {bucketList.map((bucket) => (
              <BucketCard
                key={bucket.id}
                bucket={bucket}
                portfolioId={portfolioId}
              />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-5">
        <div>
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            Transações recentes
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Últimos movimentos consolidados do portfólio.
          </p>
        </div>

        {txList.length === 0 ? (
          <Card className="glass-panel border-0 bg-transparent shadow-none">
            <CardContent className="flex flex-col items-start gap-3 p-8">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-white/70 bg-white/70 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]">
                <ReceiptText className="h-6 w-6" />
              </span>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-950">
                  Nenhuma transação.
                </h3>
                <p className="text-sm text-slate-600">
                  As movimentações do portfólio aparecerão aqui.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-panel border-0 bg-transparent shadow-none">
            <CardContent className="p-0">
              <div className="glass-table-shell overflow-x-auto">
                <table className="w-full min-w-[42rem] text-sm">
                  <thead>
                    <tr className="border-b border-white/65 bg-white/55">
                      <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Data
                      </th>
                      <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Tipo
                      </th>
                      <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Valor
                      </th>
                      <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Descrição
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {txList.slice(0, 10).map((tx) => (
                      <tr
                        key={tx.id}
                        className="border-b border-white/55 last:border-b-0 hover:bg-white/42"
                      >
                        <td className="px-5 py-4 text-slate-600">
                          {formatDate(tx.date)}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full border border-white/70 bg-white/72 px-3 py-1.5 font-medium text-slate-800">
                            {transactionTypeLabels[tx.type] ?? tx.type}
                          </span>
                        </td>
                        <td
                          className={`px-5 py-4 text-right text-base font-semibold tracking-[-0.03em] ${
                            tx.type === "CONTRIBUTION" || tx.type === "INCOME"
                              ? "text-emerald-600"
                              : "text-slate-950"
                          }`}
                        >
                          {maskValue(formatValue(tx.amount, tx.currency), hideValues)}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {tx.description ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.35rem] border border-white/70 bg-white/70 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]">
      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      <span className="mt-2 block text-2xl font-semibold tracking-[-0.05em] text-slate-950">
        {value}
      </span>
    </div>
  );
}

function BucketCard({
  bucket,
  portfolioId,
}: {
  bucket: Bucket;
  portfolioId: string;
}) {
  return (
    <Link to={`/portfolios/${portfolioId}/buckets/${bucket.id}`} className="group">
      <Card className="glass-panel h-full border-0 bg-transparent shadow-none transition duration-300 group-hover:-translate-y-1">
        <CardContent className="flex h-full flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex rounded-full border border-white/75 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {bucket.reference_currency}
              </span>
              <h3 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                {bucket.name}
              </h3>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/75 bg-white/72 text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] transition group-hover:text-blue-600">
              <ArrowRight className="h-5 w-5" />
            </span>
          </div>

          <div className="rounded-[1.25rem] border border-white/70 bg-white/65 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Tipo
            </span>
            <span className="mt-2 block text-sm font-medium text-slate-800">
              {bucket.type}
            </span>
          </div>

          {bucket.active === 0 ? (
            <span className="inline-flex w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              Inativo
            </span>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
