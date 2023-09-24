import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import getCurrencySymbol from "../utils/CurrencySymbols";

export const LineGraph = ({
  _labels,
  _data,
}: {
  _labels: string[];
  _data: number[];
}) => {
  const code = useSelector((state: RootState) => state.currency.code);
  return (
    <LineChart
      data={{
        labels: _labels,
        datasets: [
          {
            data: _data,
          },
        ],
      }}
      width={Dimensions.get("window").width} // from react-native
      height={220}
      yAxisLabel={`${getCurrencySymbol(code)} `}
      yAxisSuffix=""
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        backgroundColor: "#3b7250",
        backgroundGradientFrom: "#3b7250",
        backgroundGradientTo: "#3b7250",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16,
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#3b7250",
        },
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 8,
      }}
    />
  );
};
