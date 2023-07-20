import _data from "../dataSource";
type Market = "US" | "CH" | "EU" | "IN";
type ItemType = "PRIVATE" | "OFFCHAIN" | "ONCHAIN";

interface Model {
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

const data = _data as Model[];

const marketPriority: Record<number, Market> = {
  1: "US",
  2: "CH",
  3: "EU",
  4: "IN"
};
