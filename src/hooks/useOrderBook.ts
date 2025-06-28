import { useState, useEffect, useRef } from "react";
import type { Order } from "../types/orderbook";

const ORDER_BOOK_URL = "ws://localhost:4000";
const TOPIC = "snapshotL1:BTCPFC";
interface IOrderBookUpdate {
  type: "snapshot" | "delta";
  asks: [string, string][]; // [price, size]
  bids: [string, string][]; // [price, size]
  seqNum: number;
  prevSeqNum: number;
  timestamp: number;
  symbol: string;
}

export const useOrderBook = () => {
  const ws = useRef<WebSocket | null>(null);
  const [buyOrders, setBuyOrders] = useState<Order[]>([]);
  const [sellOrders, setSellOrders] = useState<Order[]>([]);
  const lastSeqNum = useRef<number | null>(null);

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
        const data = JSON.parse(event.data) as IOrderBookUpdate;
        if (data.type === "snapshot") {
          lastSeqNum.current = data.seqNum;
          setBuyOrders(
            data.bids
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .slice(0, 8)
              .map(([price, size]) => ({
                price: Number(price),
                size: Number(size),
              }))
          );
          setSellOrders(
            data.asks
              .sort((a, b) => Number(a[0]) - Number(b[0]))
              .slice(0, 8)
              .map(([price, size]) => ({
                price: Number(price),
                size: Number(size),
              }))
          );
        } else if (data.type === "delta") {
          if (data.prevSeqNum !== lastSeqNum.current) {
            console.warn("Sequence mismatch. Should refresh snapshot.");
            // TODO: handle resubscribe logic
            return;
          }
          lastSeqNum.current = data.seqNum;
          // TODO: implement incremental update logic
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
  return { buyOrders, sellOrders };
};
