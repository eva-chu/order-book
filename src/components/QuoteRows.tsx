import { useEffect, useRef } from "react";
import { type TOrder } from "@/types/orderbook";
import { formatPrice, formatSize, formatTotal } from "../utils/format";
import { calculateAccumulativeOrders } from "../utils/accumulateUtils";

interface QuoteRowProps {
  orders: TOrder[];
  isBuy: boolean;
}

const QuoteRows = ({ orders, isBuy }: QuoteRowProps) => {
  const prevOrdersMap = useRef<Map<number, number>>(new Map());
  const processedOrders = calculateAccumulativeOrders(orders);
  const grandTotal = processedOrders[processedOrders.length - 1]?.total || 1;

  const renderOrders = isBuy ? processedOrders : [...processedOrders].reverse();

  useEffect(() => {
    renderOrders.forEach(({ price, size }) => {
      prevOrdersMap.current.set(price, size);
    });
  }, [renderOrders]);

  return renderOrders.map(({ price, size, total }) => {
    const prevSize = prevOrdersMap.current.get(price);
    const sizeChange =
      prevSize !== undefined
        ? size > prevSize
          ? "UP"
          : size < prevSize
          ? "DOWN"
          : ""
        : "NEW";

    const percent = (total / grandTotal) * 100;

    return (
      <tr
        key={price}
        className={`transition-all text-right ${
          sizeChange === "NEW"
            ? isBuy
              ? "animate-flash-green"
              : "animate-flash-red"
            : ""
        } hover:bg-[#1E3059]`}
      >
        <td
          className={`text-left ${isBuy ? "text-[#00b15d]" : "text-[#FF5B5A]"}`}
        >
          {formatPrice(price)}
        </td>
        <td
          className={`relative z-10 ${
            sizeChange === "UP"
              ? "animate-flash-green"
              : sizeChange === "DOWN"
              ? "animate-flash-red"
              : ""
          }`}
        >
          {formatSize(size)}
        </td>
        <td className="relative z-10">
          {formatTotal(total)}
          <div
            className="absolute top-0 right-0 h-full z-0"
            style={{
              width: `${percent}%`,
              backgroundColor: isBuy
                ? "rgba(16, 186, 104, 0.12)"
                : "rgba(255, 90, 90, 0.12)",
            }}
          />
        </td>
      </tr>
    );
  });
};

export default QuoteRows;
