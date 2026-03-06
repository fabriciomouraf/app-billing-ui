import { useState } from "react";
import { ArrowUpDown, BadgeDollarSign, CalendarClock, TrendingUp } from "lucide-react";
import { useAllFxRates, useCreateFxRate } from "@/hooks/use-api";
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

  const latestRate = fxRates.reduce<(typeof fxRates)[number] | undefined>(
    (latest, current) => {
      if (!latest) return current;
      return new Date(current.date) > new Date(latest.date) ? current : latest;
    },
    undefined
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/72 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              <BadgeDollarSign className="h-3.5 w-3.5" />
              Câmbio
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Cadastre e acompanhe cotações com leitura imediata.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                A nova tela destaca o par de moedas, o histórico recente e o
                formulário operacional no mesmo contexto visual.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard
              icon={ArrowUpDown}
              label="Par ativo"
              value={`${from}/${to}`}
            />
            <MetricCard
              icon={TrendingUp}
              label="Registros"
              value={String(fxRates.length)}
            />
            <MetricCard
              icon={CalendarClock}
              label="Cotação atual"
              value={
                latestRate
                  ? `${latestRate.from_currency}/${latestRate.to_currency}: ${maskValue(
                      latestRate.rate.toFixed(4),
                      hideValues
                    )}`
                  : "--"
              }
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)]">
        <Card className="glass-panel border-0 bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Nova cotação
            </CardTitle>
            <CardDescription className="text-sm text-slate-600">
              Preencha a data, o par e a origem da taxa de câmbio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <Input
                label="Data"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={createFxRate.isPending}
                className="glass-input"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="De"
                  value={from}
                  onChange={(e) => setFrom(e.target.value as Currency)}
                  options={currencyOptions}
                  disabled={createFxRate.isPending}
                  className="glass-input"
                />
                <Select
                  label="Para"
                  value={to}
                  onChange={(e) => setTo(e.target.value as Currency)}
                  options={currencyOptions}
                  disabled={createFxRate.isPending}
                  className="glass-input"
                />
              </div>
              <Input
                label={`Taxa (1 ${from} = ? ${to})`}
                type="text"
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="5,1234"
                required
                disabled={createFxRate.isPending}
                className="glass-input"
              />
              <Select
                label="Origem"
                value={source}
                onChange={(e) => setSource(e.target.value as FxRateSource)}
                options={fxRateSourceOptions}
                disabled={createFxRate.isPending}
                className="glass-input"
              />
              {from === to ? (
                <p className="text-sm text-amber-600">
                  O par deve usar moedas diferentes.
                </p>
              ) : null}
              {createFxRate.error ? (
                <p className="text-sm text-red-600">
                  {createFxRate.error.message}
                </p>
              ) : null}
              <Button
                type="submit"
                disabled={createFxRate.isPending || from === to || !rate.trim()}
                className="h-12 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
              >
                {createFxRate.isPending ? "Salvando..." : "Cadastrar cotação"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glass-panel border-0 bg-transparent shadow-none">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                Histórico de cotações
              </CardTitle>
              <CardDescription className="text-sm text-slate-600">
                Visualize o comportamento das taxas registradas.
              </CardDescription>
            </div>
            {latestRate ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/72 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Último par: {latestRate.from_currency}/{latestRate.to_currency}
              </div>
            ) : null}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-16 animate-pulse rounded-[1.2rem] bg-white/65"
                  />
                ))}
              </div>
            ) : fxRates.length === 0 ? (
              <div className="rounded-[1.5rem] border border-white/70 bg-white/62 p-6 text-sm text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.94)]">
                Nenhuma cotação cadastrada.
              </div>
            ) : (
              <div className="glass-table-shell overflow-x-auto">
                <table className="w-full min-w-[38rem] text-sm">
                  <thead>
                    <tr className="border-b border-white/65 bg-white/55">
                      <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Data
                      </th>
                      <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Par
                      </th>
                      <th className="px-5 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Taxa
                      </th>
                      <th className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Origem
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {fxRates.map((fx) => (
                      <tr
                        key={fx.id}
                        className="border-b border-white/55 last:border-b-0 hover:bg-white/42"
                      >
                        <td className="px-5 py-4 text-slate-600">
                          {formatDate(fx.date)}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/72 px-3 py-1.5 font-medium text-slate-800">
                            {fx.from_currency} <span className="text-slate-400">→</span>{" "}
                            {fx.to_currency}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right text-base font-semibold tracking-[-0.03em] text-slate-950">
                          {maskValue(fx.rate.toFixed(4), hideValues)}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          <span className="inline-flex rounded-full border border-white/70 bg-white/62 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                            {fx.source === "MANUAL" ? "Manual" : "API"}
                          </span>
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
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.35rem] border border-white/70 bg-white/70 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className="h-4 w-4" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-slate-950">
        {value}
      </div>
    </div>
  );
}
