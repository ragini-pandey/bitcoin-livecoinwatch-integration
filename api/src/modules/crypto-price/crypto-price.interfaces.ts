export interface CryptoDetails {
  name: string;
  symbol: string;
  rank: number;
  age: number;
  color: string;
  png32: string;
  png64: string;
  webp32: string;
  webp64: string;
  exchanges: number;
  markets: number;
  pairs: number;
  categories: string[];
  allTimeHighUSD: number;
  circulatingSupply: number;
  totalSupply: number;
  maxSupply: null;
  links: Links;
  rate: number;
  volume: number;
  cap: number;
  liquidity: number;
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

export interface Links {
  website: string;
  whitepaper: string;
  twitter: string;
  reddit: string;
  telegram: null;
  discord: string;
  medium: null;
  instagram: null;
  tiktok: null;
  youtube: null;
  linkedin: null;
  twitch: null;
  spotify: null;
  naver: null;
  wechat: null;
  soundcloud: null;
}
