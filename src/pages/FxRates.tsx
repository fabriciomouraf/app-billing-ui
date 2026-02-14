import { useState } from "react";
import {
  useAllFxRates,
  useCreateFxRate,
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
import { formatDate } from "@/lib/formatters";
import type { Currency, FxRateSource } from "@/types/api";

const currencyOptions: { value: Currency; label: string }[] = [
  { value: "BRL", label: "BRL" },
  { value: "USD", label: "USD" },
];

const fxRateSourceOptions: { value: FxRateSource; label: string }[] = [
  { value: "MANUAL", label: "Manual" },
  { value: "API", label: "API" },
];

export function FxRates() {
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [from, setFrom] = useState<Currency>("USD");
  const [to, setTo] = useState<Currency>("BRL");
  const [rate, setRate] = useState("");
  const [source, setSource] = useState<FxRateSource>("MANUAL");

  const { hideValues } = useHideValues();
  const { data: fxRates = [], isLoading } = useAllFxRates();
  const createFxRate = useCreateFxRate({
    onSuccess: () => {
      setRate("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(rate.replace(",", "."));
    if (Number.isNaN(rateNum) || rateNum <= 0) return;
    if (from === to) return;
    createFxRate.mutate({
      date,
      from,
      to,
      rate: rateNum,
      source,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-900">Cotações</h1>
        <p className="text-sm text-slate-600">
          Cadastre e consulte as taxas de câmbio usadas nas transações e resumos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nova cotação</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap items-end gap-4"
          >
            <Input
              label="Data"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              disabled={createFxRate.isPending}
            />
            <Select
              label="De"
              value={from}
              onChange={(e) => setFrom(e.target.value as Currency)}
              options={currencyOptions}
              disabled={createFxRate.isPending}
            />
            <Select
              label="Para"
              value={to}
              onChange={(e) => setTo(e.target.value as Currency)}
              options={currencyOptions}
              disabled={createFxRate.isPending}
            />
            <Input
              label={`Taxa (1 ${from} = ? ${to})`}
              type="text"
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="5,1234"
              required
              disabled={createFxRate.isPending}
            />
            <Select
              label="Origem"
              value={source}
              onChange={(e) => setSource(e.target.value as FxRateSource)}
              options={fxRateSourceOptions}
              disabled={createFxRate.isPending}
            />
            <Button
              type="submit"
              disabled={
                createFxRate.isPending ||
                from === to ||
                !rate.trim()
              }
            >
              {createFxRate.isPending ? "Salvando..." : "Cadastrar cotação"}
            </Button>
          </form>
          {createFxRate.error ? (
            <p className="text-sm text-red-600">
              {createFxRate.error.message}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de cotações</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-slate-600">Carregando...</p>
          ) : fxRates.length === 0 ? (
            <p className="text-slate-600">Nenhuma cotação cadastrada.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Par
                    </th>
                    <th className="px-6 py-3 text-right font-medium text-slate-700">
                      Taxa
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">
                      Origem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fxRates.map((fx) => (
                    <tr
                      key={fx.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-3 text-slate-600">
                        {formatDate(fx.date)}
                      </td>
                      <td className="px-6 py-3 text-slate-700">
                        {fx.from_currency} → {fx.to_currency}
                      </td>
                      <td className="px-6 py-3 text-right font-medium text-slate-900">
                        {maskValue(fx.rate.toFixed(4), hideValues)}
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {fx.source === "MANUAL" ? "Manual" : "API"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
