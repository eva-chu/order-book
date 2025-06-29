import { useState, useEffect, useRef } from "react";
import type { TOrder } from "../types/orderbook";

const ORDER_BOOK_URL = "ws://localhost:4000";
const TOPIC = "update:BTCPFC";

interface IOrderBookUpdate {
  type: "snapshot" | "delta";
  asks: [string, string][];
  bids: [string, string][];
  seqNum: number;
  prevSeqNum: number;
  timestamp: number;
  symbol: string;
}

export const useOrderBook = () => {
  const ws = useRef<WebSocket | null>(null);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const [buyOrders, setBuyOrders] = useState<TOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<TOrder[]>([]);
  const lastSeqNum = useRef<number | null>(null);

  const bidMap = useRef<Map<number, number>>(new Map());
  const askMap = useRef<Map<number, number>>(new Map());

  const updateOrderViews = () => {
    const newBuyOrders = Array.from(bidMap.current.entries())
      .map(([price, size]) => ({ price, size }))
      .sort((a, b) => b.price - a.price)
      .slice(0, 8);

    const newSellOrders = Array.from(askMap.current.entries())
      .map(([price, size]) => ({ price, size }))
      .sort((a, b) => a.price - b.price)
      .slice(0, 8);

    setBuyOrders(newBuyOrders);
    setSellOrders(newSellOrders);
  };

  useEffect(() => {
    ws.current = new WebSocket(ORDER_BOOK_URL);
    ws.current.onopen = () => {
      console.log("Connected");
      ws.current?.send(
        JSON.stringify({
          op: "subscribe",
          args: [TOPIC],
        })
      );
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as {
          topic: string;
          data: IOrderBookUpdate;
        };
        const data = message.data;

        if (data.type === "snapshot") {
          lastSeqNum.current = data.seqNum;
          bidMap.current.clear();
          askMap.current.clear();

          data.bids.forEach(([priceStr, sizeStr]) => {
            bidMap.current.set(Number(priceStr), Number(sizeStr));
          });
          data.asks.forEach(([priceStr, sizeStr]) => {
            askMap.current.set(Number(priceStr), Number(sizeStr));
          });

          updateOrderViews();
          setHasInitialized(true);
        } else if (data.type === "delta") {
          if (data.prevSeqNum !== lastSeqNum.current) {
            console.warn("Sequence mismatch. Should refresh snapshot.");
            bidMap.current.clear();
            askMap.current.clear();
            setBuyOrders([]);
            setSellOrders([]);
            lastSeqNum.current = null;

            const unsubscribeMsg = JSON.stringify({
              op: "unsubscribe",
              args: [TOPIC],
            });
            const subscribeMsg = JSON.stringify({
              op: "subscribe",
              args: [TOPIC],
            });

            ws.current?.send(unsubscribeMsg);
            setTimeout(() => {
              ws.current?.send(subscribeMsg);
            }, 300);
            return;
          }

          lastSeqNum.current = data.seqNum;
          data.bids.forEach(([priceStr, sizeStr]) => {
            const price = Number(priceStr);
            const size = Number(sizeStr);
            if (size === 0) bidMap.current.delete(price);
            else bidMap.current.set(price, size);
          });
          data.asks.forEach(([priceStr, sizeStr]) => {
            const price = Number(priceStr);
            const size = Number(sizeStr);
            if (size === 0) askMap.current.delete(price);
            else askMap.current.set(price, size);
          });

          updateOrderViews();
        }
      } catch (err) {
        console.error("Failed to parse WS data", err);
      }
    };

    ws.current.onclose = (e) => {
      console.warn("WebSocket closed", e.reason || e.code);
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return { buyOrders, sellOrders, hasInitialized };
};
