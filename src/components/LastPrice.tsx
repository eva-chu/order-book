import { useLastPrice } from "../hooks/useLastPrice";
import ArrowIcon from "./ArrowIcon";
import { formatPrice } from "../utils/format";

const LastPrice = () => {
  const { lastPrice, prevPrice } = useLastPrice();

  const getLastPriceColor = () => {
    if (lastPrice === null || prevPrice === null)
      return {
        textColor: "#F0F4F8",
        bgColor: "rgba(134, 152, 170, 0.12)",
        change: "",
      };
    if (lastPrice > prevPrice) {
      return {
        textColor: "#00b15d",
        bgColor: "rgba(16, 186, 104, 0.12)",
        change: "UP",
      };
    } else if (lastPrice < prevPrice) {
      return {
        textColor: "#FF5B5A",
        bgColor: "rgba(255, 90, 90, 0.12)",
        change: "DOWN",
      };
    } else {
      return {
        textColor: "#F0F4F8",
        bgColor: "rgba(134, 152, 170, 0.12)",
        change: "",
      };
    }
  };

  const { textColor, bgColor, change } = getLastPriceColor();

  return (
    <tr>
      <td
        colSpan={3}
        className={`text-center py-1 text-[${textColor}]`}
        style={{ backgroundColor: bgColor }}
      >
        {lastPrice !== null ? formatPrice(lastPrice) : "--"}
        {(change === "UP" || change === "DOWN") && (
          <ArrowIcon direction={change} color={textColor} />
        )}
      </td>
    </tr>
  );
};
export default LastPrice;
