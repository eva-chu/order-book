import type { TOrder } from "../types/orderbook";

export type TAccumulativeOrder = TOrder & {
  total: number;
};

export const calculateAccumulativeOrders = (
  orders: TOrder[]
): TAccumulativeOrder[] => {
  let runningTotal = 0;
  return orders.map(({ price, size }) => {
    runningTotal += size;
    return { price, size, total: runningTotal };
  });
};
