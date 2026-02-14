import { useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  CardHeader,
  CardTitle,
  Input,
  Select,
} from "@/components/ui";
import { useHideValues, maskValue } from "@/contexts/HideValuesContext";
import { formatCurrencyBRL, formatCurrencyUSD, formatDate } from "@/lib/formatters";
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
  const { data: portfolio, isLoading: loadingPortfolio, error } = usePortfolio(portfolioId);
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
    return <p className="text-slate-600">Carregando...</p>;
  }

  if (error ?? !portfolio) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent>
          <p className="text-red-700">
            {error?.message ?? "Portfólio não encontrado"}
          </p>
          <Link to="/portfolios" className="mt-4 inline-block text-emerald-600 hover:underline">
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
      <Link
        to="/portfolios"
        className="text-sm text-slate-600 hover:text-slate-900"
      >
        ← Voltar
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">{portfolio.name}</h1>
        <p className="text-sm text-slate-500">
          Moeda base: {portfolio.base_currency}
        </p>
      </div>

      {/* Buckets */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Buckets</h2>
          <Button
            onClick={() => setShowBucketForm((v) => !v)}
            variant="secondary"
            size="sm"
          >
            {showBucketForm ? "Cancelar" : "Novo bucket"}
          </Button>
        </div>

        {showBucketForm ? (
          <Card>
            <CardContent>
              <form onSubmit={handleCreateBucket} className="flex flex-col gap-4 max-w-md">
                <Input
                  label="Nome"
                  value={bucketName}
                  onChange={(e) => setBucketName(e.target.value)}
                  placeholder="Ex: CDB"
                  required
                  disabled={createBucket.isPending}
                />
                <Select
                  label="Tipo"
                  value={bucketType}
                  onChange={(e) => setBucketType(e.target.value as BucketType)}
                  options={bucketTypeOptions}
                  disabled={createBucket.isPending}
                />
                <Select
                  label="Moeda"
                  value={bucketCurrency}
                  onChange={(e) => setBucketCurrency(e.target.value as Currency)}
                  options={currencyOptions}
                  disabled={createBucket.isPending}
                />
                {createBucket.error ? (
                  <p className="text-sm text-red-600">{createBucket.error.message}</p>
                ) : null}
                <Button type="submit" disabled={createBucket.isPending}>
                  {createBucket.isPending ? "Criando..." : "Criar bucket"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : null}

        {loadingBuckets ? (
          <p className="text-slate-600">Carregando buckets...</p>
        ) : bucketList.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-slate-600">Nenhum bucket neste portfólio.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bucketList.map((b) => (
              <BucketCard
                key={b.id}
                bucket={b}
                portfolioId={portfolioId}
              />
            ))}
          </div>
        )}
      </section>

      {/* Transactions */}
      <section className="flex flex-col gap-4">
        <h2 className="font-semibold text-slate-800">
          Transações recentes
        </h2>
        {txList.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-slate-600">Nenhuma transação.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-right font-medium text-slate-700">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Descrição
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {txList.slice(0, 10).map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-3 text-slate-600">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-6 py-3 text-slate-700">
                        {transactionTypeLabels[tx.type] ?? tx.type}
                      </td>
                      <td
                        className={`px-6 py-3 text-right font-medium ${
                          tx.type === "CONTRIBUTION" || tx.type === "INCOME"
                            ? "text-emerald-600"
                            : "text-slate-900"
                        }`}
                      >
                        {maskValue(formatValue(tx.amount, tx.currency), hideValues)}
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {tx.description ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>
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
    <Link to={`/portfolios/${portfolioId}/buckets/${bucket.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle>{bucket.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">
            {bucket.type} · {bucket.reference_currency}
          </p>
          {bucket.active === 0 ? (
            <p className="mt-2 text-sm text-amber-600">Inativo</p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
