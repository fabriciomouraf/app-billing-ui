export type Currency = "BRL" | "USD";

export type BucketType =
  | "FIXED_INCOME"
  | "US_STOCKS"
  | "BITCOIN"
  | "OTHER";

export type TransactionType =
  | "CONTRIBUTION"
  | "WITHDRAWAL"
  | "INCOME"
  | "FEE"
  | "TAX"
  | "ADJUSTMENT";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  base_currency: string;
}

export interface Bucket {
  id: string;
  portfolio_id: string;
  type: string;
  name: string;
  reference_currency: string;
  active: number;
}

export interface Transaction {
  id: string;
  portfolio_id: string;
  bucket_id: string;
  date: string;
  type: string;
  amount: number;
  currency: string;
  fx_rate_id: string | null;
  description: string | null;
}

export interface Summary {
  id: string;
  portfolio_id: string;
  month: string;
  start_value_brl: number;
  end_value_brl: number;
  net_contribution_brl: number;
  pnl_brl: number;
}

export interface Position {
  bucket_id: string;
  current_value: number;
  invested_value_brl: number;
  updated_at: string | null;
}

export interface FxRate {
  id: string;
  date: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  source: string;
}

export interface MonthlySummaryResponse {
  values_brl_real: {
    start_value: number;
    end_value: number;
    net_contribution: number;
    pnl: number;
  };
}

export interface YearSummaryResponse {
  year: number;
  pnl_accumulated_brl: number;
  pnl_accumulated_brl_real: number;
}

export interface CreateUserBody {
  name: string;
  email: string;
}

export interface CreatePortfolioBody {
  name: string;
  baseCurrency: Currency;
  userId: string;
}

export interface CreateBucketBody {
  type: BucketType;
  name: string;
  referenceCurrency: Currency;
  active?: boolean;
}

export interface UpdateBucketBody {
  name?: string;
  referenceCurrency?: Currency;
  active?: boolean;
}

export interface CreateTransactionBody {
  bucketId: string;
  date: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  fxRateId?: string | null;
  description?: string;
}
