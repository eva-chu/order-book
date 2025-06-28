import QuoteRow from "./QuoteRow";
import { useOrderBook } from "../hooks/useOrderBook";

export default function OrderBook() {
  const { buyOrders, sellOrders } = useOrderBook();

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
            <QuoteRow orders={sellOrders} isBuy={false} />
            <tr>
              <td colSpan={2} className="text-center py-1">
                -----
              </td>
            </tr>
            <QuoteRow orders={buyOrders} isBuy={true} />
          </tbody>
        </table>
      </div>
    </div>
  );
}
