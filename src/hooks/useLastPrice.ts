import { useState, useEffect, useRef } from "react";

const ORDER_BOOK_URL = "ws://localhost:4000";
const TOPIC = "tradeHistoryApi:BTCPFC";

interface ILastPrice {
  symbol: string;
  side: "Trade Side" | "BUY" | "SELL";
  size: number;
  price: number;
  tradeId: number;
  timestamp: number;
}

export const useLastPrice = () => {
  const ws = useRef<WebSocket | null>(null);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const prevPriceRef = useRef<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);

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
          data: ILastPrice[];
        };
        const data = message.data;
        if (message.topic === TOPIC && data[0]) {
          const currPrice = data[0].price;
          if (currPrice !== undefined) {
            setPrevPrice(prevPriceRef.current);
            prevPriceRef.current = currPrice;
            setLastPrice(currPrice);
          }
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

  return { lastPrice, prevPrice };
};
