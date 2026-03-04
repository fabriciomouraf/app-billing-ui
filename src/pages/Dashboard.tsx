import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

const monthLabels = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function formatMonthLabel(value: string) {
  const [year, month] = value.split("-").map(Number);
  return monthFormatter.format(new Date(year, month - 1, 1));
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
    <div className="flex flex-col gap-8">
      <div className="relative z-20 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="grid w-full grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] gap-3 sm:flex sm:w-auto sm:flex-wrap">
            <MonthPicker value={month} onChange={setMonth} />
            <label className="flex min-w-0 items-center gap-3 rounded-[1.35rem] border border-white/80 bg-white/74 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_10px_20px_rgba(15,23,42,0.04)] backdrop-blur-[32px] backdrop-saturate-150 transition hover:bg-white/82">
              <span className="shrink-0 text-sm font-semibold text-slate-700">Ano</span>
              <input
                type="number"
                min={2020}
                max={2030}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none"
              />
            </label>
          </div>
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

function MonthPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => Number(value.slice(0, 4)));
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedMonth = Number(value.slice(5, 7)) - 1;

  useEffect(() => {
    setViewYear(Number(value.slice(0, 4)));
  }, [value]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative min-w-0 ${open ? "z-50" : "z-10"}`}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full min-w-0 items-center justify-between gap-3 rounded-[1.35rem] border border-white/80 bg-white/74 px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.96),0_10px_20px_rgba(15,23,42,0.04)] backdrop-blur-[32px] backdrop-saturate-150 transition hover:bg-white/82"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/85 bg-white/90 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.98)]">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Selecione
            </span>
            <span className="block truncate text-sm font-semibold capitalize text-slate-900">
              {formatMonthLabel(value)}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-600 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Selecionar mês"
          className="absolute left-0 top-[calc(100%+0.75rem)] z-50 w-[min(20rem,calc(100vw-3rem))] overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/[0.78] p-4 shadow-[0_18px_42px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.32)] backdrop-blur-[56px] backdrop-saturate-160 sm:left-auto sm:right-0"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.54),rgba(255,255,255,0.26)_35%,rgba(255,255,255,0.14)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.44),transparent_55%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.24),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.14),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-y-8 left-[34%] w-10 rounded-full bg-white/36 blur-xl" />
          <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-white/95" />

          <div className="relative flex items-center justify-between pb-4">
            <button
              type="button"
              onClick={() => setViewYear((current) => current - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/[0.72] text-slate-600 shadow-[0_10px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-[30px] backdrop-saturate-160 transition hover:bg-white/[0.82] hover:text-slate-900"
              aria-label="Ano anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm font-semibold text-slate-900">{viewYear}</div>
            <button
              type="button"
              onClick={() => setViewYear((current) => current + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/[0.72] text-slate-600 shadow-[0_10px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-[30px] backdrop-saturate-160 transition hover:bg-white/[0.82] hover:text-slate-900"
              aria-label="Próximo ano"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="relative grid grid-cols-3 gap-2">
            {monthLabels.map((label, index) => {
              const isSelected = viewYear === Number(value.slice(0, 4)) && index === selectedMonth;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    onChange(`${viewYear}-${String(index + 1).padStart(2, "0")}`);
                    setOpen(false);
                  }}
                  className={`rounded-[1rem] px-3 py-3 text-sm font-medium transition ${
                    isSelected
                      ? "border border-white/75 bg-white/[0.78] text-slate-950 shadow-[0_10px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.34)] backdrop-blur-[30px]"
                      : "text-slate-700 hover:bg-white/[0.48] hover:text-slate-950"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
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
  const { data: monthly, isLoading: monthlyLoading } = useSummaryMonth(portfolio.id, month);
  const { data: yearly, isLoading: yearlyLoading } = useSummaryYear(portfolio.id, year);
  const { data: summaries } = useSummaries(portfolio.id, chartOpen);

  const values = monthly?.values_brl_real;
  const pnlYear = yearly?.pnl_accumulated_brl_real;
  const summaryLoading = monthlyLoading || yearlyLoading;

  return (
    <>
      <Link to={`/portfolios/${portfolio.id}`} className="group block">
        <Card className="relative overflow-hidden rounded-[20px] border border-white/35 bg-white/[0.14] shadow-[0_10px_30px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-[24px] backdrop-saturate-150 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:bg-white/[0.18] group-hover:shadow-[0_14px_38px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.22)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.24),rgba(255,255,255,0.08)_35%,rgba(255,255,255,0.03)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.22),transparent_55%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.08),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-y-6 left-[34%] w-10 rounded-full bg-white/22 blur-xl" />
          <div className="pointer-events-none absolute inset-y-8 left-[37%] w-3 rounded-full bg-white/36 blur-md" />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/70" />
          <div className="pointer-events-none absolute left-6 top-5 h-14 w-20 rounded-full bg-white/12 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 right-8 h-10 w-24 rounded-full bg-white/10 blur-2xl" />
          <CardHeader className="pr-12">
            <CardTitle className="text-slate-900">{portfolio.name}</CardTitle>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setChartOpen(true);
              }}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/35 bg-white/[0.16] text-slate-600 shadow-[0_10px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-[18px] backdrop-saturate-150 transition hover:bg-white/[0.22] hover:text-emerald-600"
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
          <CardContent className="relative flex flex-col gap-4">
          {summaryLoading ? (
            <div className="grid grid-cols-2 gap-3 text-sm animate-pulse">
              <div>
                <div className="h-4 w-24 rounded bg-white/70" />
                <div className="mt-1 h-6 w-28 rounded bg-white/70" />
              </div>
              <div>
                <div className="h-4 w-24 rounded bg-white/70" />
                <div className="mt-1 h-6 w-28 rounded bg-white/70" />
              </div>
              <div>
                <div className="h-4 w-28 rounded bg-white/70" />
                <div className="mt-1 h-6 w-24 rounded bg-white/70" />
              </div>
              <div>
                <div className="h-4 w-20 rounded bg-white/70" />
                <div className="mt-1 h-6 w-24 rounded bg-white/70" />
              </div>
              <div className="col-span-2 border-t border-white/45 pt-3">
                <div className="h-3 w-32 rounded bg-white/70" />
                <div className="mt-2 h-6 w-28 rounded bg-white/70" />
              </div>
            </div>
          ) : values ? (
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
          {!summaryLoading && pnlYear !== undefined ? (
            <div className="border-t border-white/45 pt-3">
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
