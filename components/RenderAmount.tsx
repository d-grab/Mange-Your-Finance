import getCurrencySymbol from "../utils/CurrencySymbols";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function RenderAmount({ amount }: { amount: number }) {
  const code = useSelector((state: RootState) => state.currency.code);

  return `${amount} ${getCurrencySymbol(code)}`;
}
