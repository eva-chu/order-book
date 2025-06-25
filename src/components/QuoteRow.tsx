import { type Order } from "@/types/orderbook";

interface QuoteRowProps {
  orders: Order[];
  isBuy: boolean;
}

const QuoteRow = ({ orders, isBuy }: QuoteRowProps) => {
  return orders.map((order, index) => (
    <tr
      key={index}
      className="hover:bg-[#1E3059] transition-all"
      style={{ textAlign: "right" }}
    >
      <td
        className={`text-left ${isBuy ? "text-[#00b15d]" : "text-[#FF5B5A]"}`}
      >
        {Number(order.price).toLocaleString()}
      </td>
      <td>{order.size}</td>
      <td></td>
    </tr>
  ));
};
export default QuoteRow;
