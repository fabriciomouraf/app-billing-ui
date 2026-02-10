import { useState } from "react";
import { Link } from "react-router-dom";
import {
  usePortfolios,
  useSummaries,
  useSummaryMonth,
  useSummaryYear,
} from "@/hooks/use-api";
import { useHideValues, maskValue } from "@/contexts/HideValuesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { SummaryChart } from "@/components/SummaryChart";
import { ChartModal } from "@/components/ChartModal";
import { formatCurrencyFromReal } from "@/lib/formatters";

function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getCurrentYear() {
  return String(new Date().getFullYear());
}

export function Dashboard() {
  const [month, setMonth] = useState(getCurrentMonth);
  const [year, setYear] = useState(getCurrentYear);

  const { data: portfolios, isLoading, error } = usePortfolios();

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-32 rounded bg-slate-200" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 rounded bg-slate-200" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent>
          <p className="text-red-700">
            Erro ao carregar portfólios: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  const list = portfolios ?? [];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Mês:</span>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Ano:</span>
            <input
              type="number"
              min={2020}
              max={2030}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </div>

      {list.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-slate-600">
              Nenhum portfólio cadastrado.{" "}
              <Link to="/portfolios" className="text-emerald-600 hover:underline">
                Criar portfólio
              </Link>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PortfolioSummaryCard
              key={p.id}
              portfolio={p}
              month={month}
              year={year}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PortfolioSummaryCard({
  portfolio,
  month,
  year,
}: {
  portfolio: { id: string; name: string };
  month: string;
  year: string;
}) {
  const [chartOpen, setChartOpen] = useState(false);
  const { hideValues } = useHideValues();
  const { data: monthly } = useSummaryMonth(portfolio.id, month);
  const { data: yearly } = useSummaryYear(portfolio.id, year);
  const { data: summaries } = useSummaries(portfolio.id, chartOpen);

  const values = monthly?.values_brl_real;
  const pnlYear = yearly?.pnl_accumulated_brl_real;

  return (
    <>
      <Link to={`/portfolios/${portfolio.id}`}>
        <Card className="relative transition-shadow hover:shadow-md">
          <CardHeader className="pr-12">
            <CardTitle>{portfolio.name}</CardTitle>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setChartOpen(true);
              }}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-emerald-600"
              title="Ver gráfico"
              aria-label="Ver gráfico"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
          {values ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Início do mês</p>
                <p className="font-medium text-slate-900">
                  {maskValue(formatCurrencyFromReal(values.start_value), hideValues)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Fim do mês</p>
                <p className="font-medium text-slate-900">
                  {maskValue(formatCurrencyFromReal(values.end_value), hideValues)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Contribuição líquida</p>
                <p className="font-medium text-slate-900">
                  {maskValue(formatCurrencyFromReal(values.net_contribution), hideValues)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">PnL do mês</p>
                <p
                  className={`font-medium ${
                    values.pnl >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {maskValue(formatCurrencyFromReal(values.pnl), hideValues)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Sem dados do mês</p>
          )}
          {pnlYear !== undefined ? (
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-500">PnL acumulado no ano</p>
              <p
                className={`text-lg font-semibold ${
                  pnlYear >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {maskValue(formatCurrencyFromReal(pnlYear), hideValues)}
              </p>
            </div>
          ) : null}
          </CardContent>
        </Card>
      </Link>
      {chartOpen ? (
        <ChartModal
          title={`${portfolio.name} — Evolução`}
          onClose={() => setChartOpen(false)}
        >
          <SummaryChart
            summaries={summaries ?? []}
            portfolioName={portfolio.name}
            hideValues={hideValues}
          />
        </ChartModal>
      ) : null}
    </>
  );
}
