import _data from "../dataSource.json";
type Market = "US" | "CH" | "EU" | "IN";
type ItemType = "PRIVATE" | "OFFCHAIN" | "ONCHAIN";

export const searchMethodFeatureFlag: 'FullNameIndex' | 'PartialNameIndex' = "PartialNameIndex";

export interface Model {
  id: number;
  i: {
    type: ItemType;
    price: {
      high: number;
      low: number;
      lastTradedPrevious: number;
      lastTraded: number;
    };
    lotSize: "10" | "100" | "1";
    currency: string;
    name: string;
  };
  market: Market;
}

export const data = _data as Model[];

export const marketPriority: Record<Market, number> = {
  US: 1,
  CH: 2,
  EU: 3,
  IN: 4
};


