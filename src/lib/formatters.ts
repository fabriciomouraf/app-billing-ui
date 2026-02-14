// Hoisted formatters (skill: js-hoist-intl)
const currencyBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const currencyUSD = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "USD",
});

const dateShort = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
});

const dateMedium = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "medium",
});

const numberCompact = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function formatCurrencyBRL(value: number) {
  return currencyBRL.format(value / 100);
}

export function formatCurrencyUSD(value: number) {
  return currencyUSD.format(value / 100);
}

export function formatCurrency(value: number, currency: "BRL" | "USD") {
  return currency === "BRL" ? formatCurrencyBRL(value) : formatCurrencyUSD(value);
}

export function formatDate(value: string) {
  return dateShort.format(new Date(value));
}

export function formatDateMedium(value: string) {
  return dateMedium.format(new Date(value));
}

export function formatMonthYear(monthStr: string) {
  const [year, month] = monthStr.split("-");
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1).toLocaleDateString(
    "pt-BR",
    { month: "long", year: "numeric" }
  );
}

export function formatNumber(value: number) {
  return numberCompact.format(value);
}

/** Valores já em reais (ex: values_brl_real da API) */
export function formatCurrencyFromReal(value: number) {
  return currencyBRL.format(value);
}

/**
 * Converte string de valor no formato pt-BR (ex: "6.788,42") em número.
 * Aceita ponto como separador de milhares e vírgula como decimal.
 */
export function parseCurrencyInput(value: string): number {
  const normalized = value.trim().replace(/\./g, "").replace(",", ".");
  return parseFloat(normalized) || 0;
}
