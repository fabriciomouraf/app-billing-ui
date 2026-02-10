import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  usePortfolio,
  useBuckets,
  usePosition,
  useSnapshots,
  useCreateSnapshot,
  useTransactions,
  useCreateTransaction,
  useFxRates,
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
import { formatCurrencyBRL, formatCurrencyUSD, formatDate } from "@/lib/formatters";
import type { TransactionType, Currency } from "@/types/api";

const transactionTypeOptions: { value: TransactionType; label: string }[] = [
  { value: "CONTRIBUTION", label: "Contribuição" },
  { value: "WITHDRAWAL", label: "Retirada" },
];

export function BucketDetail() {
  const { portfolioId, bucketId } = useParams<{
    portfolioId: string;
    bucketId: string;
  }>();
  const [showTxForm, setShowTxForm] = useState(false);
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [type, setType] = useState<TransactionType>("CONTRIBUTION");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFxRateId, setSelectedFxRateId] = useState("");
  const [showSnapshotForm, setShowSnapshotForm] = useState(false);
  const [snapshotDate, setSnapshotDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [snapshotTotalValue, setSnapshotTotalValue] = useState("");

  const { data: portfolio } = usePortfolio(portfolioId);
  const { data: buckets } = useBuckets(portfolioId);
  const bucket = buckets?.find((b) => b.id === bucketId);
  const { data: position } = usePosition(portfolioId, bucketId);
  const { data: snapshots = [] } = useSnapshots(portfolioId, bucketId);
  const createSnapshot = useCreateSnapshot(portfolioId ?? "", bucketId ?? "", {
    onSuccess: () => {
      setShowSnapshotForm(false);
      setSnapshotTotalValue("");
    },
  });
  const { data: transactions } = useTransactions(portfolioId);
  const isUsdBucket = bucket?.reference_currency === "USD";
  const { data: fxRates = [], isLoading: fxRatesLoading } = useFxRates({
    from: "USD",
    to: "BRL",
    date: isUsdBucket && showTxForm ? date : undefined,
    enabled: isUsdBucket && showTxForm,
  });
  const createTx = useCreateTransaction(portfolioId ?? "", {
    onSuccess: () => {
      setShowTxForm(false);
      setAmount("");
      setDescription("");
      setSelectedFxRateId("");
    },
  });

  const handleSubmitSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bucket || !snapshotTotalValue.trim()) return;
    const valueNum = Math.round(
      parseFloat(snapshotTotalValue.replace(",", ".")) * 100
    );
    if (Number.isNaN(valueNum) || valueNum < 0) return;
    createSnapshot.mutate({
      date: snapshotDate,
      totalValue: valueNum,
      currency: bucket.reference_currency as "BRL" | "USD",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioId || !bucket || !amount.trim()) return;
    const amountNum = Math.round(parseFloat(amount.replace(",", ".")) * 100);
    if (Number.isNaN(amountNum) || amountNum <= 0) return;

    const currency = bucket.reference_currency as Currency;
    const baseBody = {
      bucketId: bucket.id,
      date,
      type,
      amount: amountNum,
      currency,
      description: description.trim() || undefined,
    };

    if (currency === "BRL") {
      createTx.mutate(baseBody);
      return;
    }

    if (currency === "USD") {
      if (!selectedFxRateId.trim()) return;
      createTx.mutate({ ...baseBody, fxRateId: selectedFxRateId });
      return;
    }

    createTx.mutate(baseBody as never);
  };

  if (!portfolioId || !bucketId) {
    return <p className="text-slate-600">Parâmetros inválidos</p>;
  }

  if (!portfolio) {
    return <p className="text-slate-600">Carregando...</p>;
  }

  if (!bucket) {
    return (
      <Card>
        <CardContent>
          <p className="text-red-600">Bucket não encontrado</p>
          <Link
            to={`/portfolios/${portfolioId}`}
            className="mt-4 inline-block text-emerald-600 hover:underline"
          >
            Voltar ao portfólio
          </Link>
        </CardContent>
      </Card>
    );
  }

  const formatFn =
    bucket.reference_currency === "BRL" ? formatCurrencyBRL : formatCurrencyUSD;
  const txList = transactions?.filter((t) => t.bucket_id === bucketId) ?? [];

  return (
    <div>
      <div className="mb-6">
        <Link
          to={`/portfolios/${portfolioId}`}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Voltar ao portfólio
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{bucket.name}</h1>
        <p className="text-sm text-slate-500">
          {bucket.type} · {bucket.reference_currency}
        </p>
      </div>

      {/* Position */}
      {position ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Posição atual</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-8">
            <div>
              <p className="text-sm text-slate-500">Valor atual</p>
              <p className="text-xl font-semibold text-slate-900">
                {formatFn(position.current_value)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Valor investido (BRL)</p>
              <p className="text-xl font-semibold text-slate-900">
                {formatCurrencyBRL(position.invested_value_brl)}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Snapshots */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Snapshots</h2>
        <Button
          onClick={() => setShowSnapshotForm((v) => !v)}
          variant="primary"
          size="sm"
        >
          {showSnapshotForm ? "Cancelar" : "Novo snapshot"}
        </Button>
      </div>

      {showSnapshotForm ? (
        <Card className="mb-6">
          <CardContent>
            <form
              onSubmit={handleSubmitSnapshot}
              className="flex flex-col gap-4 max-w-md"
            >
              <Input
                label="Data"
                type="date"
                value={snapshotDate}
                onChange={(e) => setSnapshotDate(e.target.value)}
                required
                disabled={createSnapshot.isPending}
              />
              <Input
                label="Valor total"
                type="text"
                inputMode="decimal"
                value={snapshotTotalValue}
                onChange={(e) => setSnapshotTotalValue(e.target.value)}
                placeholder="0,00"
                required
                disabled={createSnapshot.isPending}
              />
              {createSnapshot.error ? (
                <p className="text-sm text-red-600">
                  {createSnapshot.error.message}
                </p>
              ) : null}
              <Button
                type="submit"
                disabled={createSnapshot.isPending}
              >
                {createSnapshot.isPending ? "Salvando..." : "Salvar snapshot"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {snapshots.length === 0 ? (
        <Card className="mb-8">
          <CardContent>
            <p className="text-slate-600">Nenhum snapshot neste bucket.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8">
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
                    Valor total
                  </th>
                </tr>
              </thead>
              <tbody>
                {snapshots.map((snap) => (
                  <tr
                    key={snap.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-3 text-slate-600">
                      {formatDate(snap.date)}
                    </td>
                                        <td className="px-6 py-3 text-slate-700">
                      {snap.type === "MANUAL"
                        ? "Manual"
                        : snap.type === "CONTRIBUTION"
                          ? "Contribuição"
                          : snap.type === "WITHDRAWAL"
                            ? "Retirada"
                            : snap.type}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-slate-900">
                      {formatFn(snap.total_value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* New transaction */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Transações</h2>
        <Button
          onClick={() => setShowTxForm((v) => !v)}
          variant="primary"
          size="sm"
        >
          {showTxForm ? "Cancelar" : "Nova transação"}
        </Button>
      </div>

      {showTxForm ? (
        <Card className="mb-8">
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
              <Input
                label="Data"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={createTx.isPending}
              />
              <Select
                label="Tipo"
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                options={transactionTypeOptions}
                disabled={createTx.isPending}
              />
              <Input
                label="Valor"
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                required
                disabled={createTx.isPending}
              />
              {isUsdBucket ? (
                <div className="space-y-2">
                  <Select
                    label="Taxa de câmbio (USD → BRL)"
                    value={selectedFxRateId}
                    onChange={(e) => setSelectedFxRateId(e.target.value)}
                    options={[
                      { value: "", label: fxRatesLoading ? "Carregando..." : "Selecione a taxa" },
                      ...fxRates.map((fx) => ({
                        value: fx.id,
                        label: `${formatDate(fx.date)} — 1 USD = ${fx.rate.toFixed(4)} BRL`,
                      })),
                    ]}
                    disabled={createTx.isPending || fxRatesLoading}
                    required
                  />
                  <Link
                    to="/cotacoes"
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    Cadastrar nova cotação
                  </Link>
                </div>
              ) : null}
              <Input
                label="Descrição"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opcional"
                disabled={createTx.isPending}
              />
              {createTx.error ? (
                <p className="text-sm text-red-600">{createTx.error.message}</p>
              ) : null}
              <Button
                type="submit"
                disabled={
                  createTx.isPending ||
                  (isUsdBucket && !selectedFxRateId) ||
                  fxRatesLoading
                }
              >
                {createTx.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {/* Transactions list */}
      {txList.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-slate-600">Nenhuma transação neste bucket.</p>
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
                {txList.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-3 text-slate-600">
                      {formatDate(tx.date)}
                    </td>
                                        <td className="px-6 py-3 text-slate-700">
                      {tx.type === "CONTRIBUTION"
                        ? "Contribuição"
                        : tx.type === "WITHDRAWAL"
                          ? "Retirada"
                          : tx.type}
                    </td>
                    <td
                      className={`px-6 py-3 text-right font-medium ${
                        tx.type === "CONTRIBUTION" || tx.type === "INCOME"
                          ? "text-emerald-600"
                          : "text-slate-900"
                      }`}
                    >
                      {formatFn(tx.amount)}
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
    </div>
  );
}
