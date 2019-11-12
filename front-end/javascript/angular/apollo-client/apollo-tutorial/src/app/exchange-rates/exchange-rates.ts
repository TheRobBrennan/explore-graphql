export interface ExchangeRate {
  currency: string;
  rate: string;
}

export interface ExchangeRatesQuery {
  rates: [ExchangeRate];
}
