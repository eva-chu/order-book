import { type Order } from "@/types/orderbook";
import QuoteRow from "./QuoteRow";

export default function OrderBook() {
  const dummyBuyOrders: Order[] = [
    { price: 21664.5, size: 591 },
    { price: 21662.0, size: 118 },
    { price: 21650.0, size: 40 },
    { price: 21629.0, size: 461 },
    { price: 21623.5, size: 3691 },
    { price: 21618.0, size: 19838 },
    { price: 21617.0, size: 1177 },
    { price: 21613.5, size: 2730 },
  ];

  const dummySellOrders: Order[] = [
    { price: 21669.0, size: 3691 },
    { price: 21693.5, size: 461 },
    { price: 21680.5, size: 53 },
    { price: 21680.0, size: 836 },
    { price: 21672.0, size: 40 },
    { price: 21669.0, size: 210 },
    { price: 21665.5, size: 331 },
    { price: 21665.0, size: 35 },
  ];

  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-[#131B29] text-[#F0F4F8] px-3 py-1 w-full max-w-2xs m-auto">
        <h2 className="text-m mb-3">Order Book</h2>
        <table className="w-full text-s">
          <thead className="text-[#8698aa]">
            <tr>
              <th className="font-normal text-left w-1/4">Price(USD)</th>
              <th className="font-normal text-right w-1/4">Size</th>
              <th className="font-normal text-right w-1/2">Total</th>
            </tr>
          </thead>
          <tbody>
            <QuoteRow orders={dummySellOrders} isBuy={false} />
            <tr>
              <td colSpan={2} className="text-center py-1">
                -----
              </td>
            </tr>
            <QuoteRow orders={dummyBuyOrders} isBuy={true} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
