export interface ICryptoPrice {
  cryptoId: string
}

export interface ICrypto {
  name: string;
  rate: number;
}

export interface ICoinListResponse {
  code: string;
  rate: number;
  volume: number;
  cap: number;
  delta: Delta;
}

export interface Delta {
  hour: number;
  day: number;
  week: number;
  month: number;
  quarter: number;
  year: number;
}
