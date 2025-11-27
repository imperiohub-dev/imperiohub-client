/**
 * Trading Bot Type Definitions
 * Based on API documentation
 */

// Market Types
export type MarketType = "SPOT" | "MARGIN" | "FUTURES" | "COPY_TRADING_SPOT" | "COPY_TRADING_FUTURES";
export type PositionSide = "LONG" | "SHORT";
export type ApiKeyType = "SPOT" | "MARGIN" | "FUTURES" | "COPY_TRADING_SPOT" | "COPY_TRADING_FUTURES";
export type Broker = "BINANCE";
export type OperationStatus = "OPEN" | "CLOSE";
export type OrderSide = "BUY" | "SELL";
export type OrderType = "MARKET" | "LIMIT";
export type OrderStatus = "NEW" | "FILLED" | "CANCELED" | "REJECTED";
export type OrderRole = "ENTRY" | "EXIT" | "STOP_LOSS" | "TAKE_PROFIT";

// Backtesting Data
export interface BacktestingData {
  winRate?: number;
  profitFactor?: number;
  sharpeRatio?: number;
}

// Product Info
export interface Product {
  id: string;
  name: string;
  price: string;
  vipPrice?: string;
  billingModel: string;
}

// Trading Bot
export interface TradingBot {
  id: string;
  name: string;
  description: string;
  strategyPath: string;
  marketType: MarketType;
  positionSide: PositionSide;
  productId: string;
  backtesting?: BacktestingData;
  product?: Product;
  createdAt: string;
  updatedAt?: string;
}

// User API Key
export interface ApiKey {
  id: string;
  broker: Broker;
  type: ApiKeyType;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
}

// User Trader Bot
export interface UserTraderBot {
  id: string;
  userId: string;
  traderBotId: string;
  apiKeyId?: string;
  alias?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  traderBot?: TradingBot;
  apiKey?: ApiKey;
  traderBotConfiguration?: UserTraderBotConfiguration;
}

// Raw configuration values (as stored in database)
export interface RawBotConfiguration {
  portfolio: number;
  perTradePercent: number;
  maxAmountPerTrade: number;
  maxDrawdownPercent: number;
  maxLeverage: number;
  profitTargetRatio: number;
}

// Processed configuration values (calculated with real balance)
export interface ProcessedBotConfiguration {
  usdtBalance: number;
  portfolio: number;
  perTradePercent: number;
  maxAmountPerTrade: number;
  maxDrawdownPercent: number;
  maxLeverage: number;
  profitTargetRatio: number;
  riskPerTrade: number;
  effectiveRiskPerTrade: number;
}

// Configuration formulas (explanatory text)
export interface ConfigurationFormulas {
  portfolioCalculation: string;
  perTradePercentCalculation: string;
  riskPerTradeCalculation: string;
  maxDrawdownCalculation: string;
}

// Error when processing configuration
export interface ProcessedError {
  message: string;
  code: string;
}

// Bot Configuration
export interface UserTraderBotConfiguration {
  id: string;
  userTraderBotId: string;
  portfolio: string;
  perTradePercent: string;
  maxAmountPerTrade: string;
  maxDrawdownPercent: string;
  profitTargetRatio: string;
  maxLeverage: string;
  createdAt: string;
  updatedAt: string;
  tradingInstances?: TradingInstance[];
  raw?: RawBotConfiguration;
  processed?: ProcessedBotConfiguration;
  processedError?: ProcessedError;
  formulas?: ConfigurationFormulas;
}

// Trading Instance
export interface TradingInstance {
  id: string;
  userTraderBotConfigurationId: string;
  coin: string;
  stableCoin: string;
  symbol: string;
  intervals: string[];
  isActive: boolean;
  currentOpenOperationId?: string;
  createdAt: string;
  updatedAt: string;
}

// Operation Trade Info
export interface OperationOpenInfo {
  price: string;
  quantity: string;
  timestamp: string;
}

export interface OperationTradeInfo {
  exitPrice: string;
  pnl: string;
  pnlPercent: string;
  timestamp: string;
}

// Order
export interface Order {
  id: string;
  binanceOrderId: string;
  side: OrderSide;
  type: OrderType;
  status: OrderStatus;
  role: OrderRole;
  quantity: string;
  executedQuantity: string;
  price: string;
  createdAt: string;
  filledAt?: string;
}

// Operation
export interface UserTraderBotOperation {
  id: string;
  userTraderBotId: string;
  tradingInstanceId: string;
  symbol: string;
  interval: string;
  status: OperationStatus;
  indicatorsState?: any;
  open?: OperationOpenInfo;
  trade?: OperationTradeInfo;
  createdAt: string;
  closedAt?: string;
  orders?: Order[];
}

// API Responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    field?: string;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// API Key Verification Response
export interface ApiKeyVerification {
  isValid: boolean;
  permissions: {
    spot: boolean;
    futures: boolean;
    margin: boolean;
  };
  accountInfo: {
    canTrade: boolean;
    canWithdraw: boolean;
    canDeposit: boolean;
  };
}

// Form Data Types (for react-hook-form)
export interface BotConfigurationFormData {
  portfolio: string;
  perTradePercent: string;
  maxAmountPerTrade: string;
  maxDrawdownPercent: string;
  profitTargetRatio: string;
  maxLeverage: string;
}

export interface TradingInstanceFormData {
  coin: string;
  stableCoin: string;
  intervals: string[];
}

export interface ApiKeyFormData {
  broker: Broker;
  type: ApiKeyType;
  apiKey: string;
  apiSecret: string;
}

export interface UserBotFormData {
  traderBotId: string;
  apiKeyId: string;
  alias?: string;
}
