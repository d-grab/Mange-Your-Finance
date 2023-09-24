import { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

const { width, height } = Dimensions.get("window");

interface ExpenseSummaryItem {
  color: string;
  expense: number;
  legendFontColor: string;
  legendFontSize: number;
  name: string;
}

const initialExpenseSummary: ExpenseSummaryItem[] = [
  {
    color: "#45DCCC",
    expense: 0,
    legendFontColor: "#7F7F7F",
    legendFontSize: 13,
    name: "Shopping",
  },
];

export const PieGraph = ({
  transactions,
}: {
  transactions: Array<any> | undefined;
}) => {
  const [chartData, setChartData] = useState<Array<ExpenseSummaryItem>>(
    initialExpenseSummary
  );
  useEffect(() => {
    let categoryExpenses: any = {};

    transactions?.forEach((transaction) => {
      if (transaction._data.category !== "#income") {
        // handling plans
        if (
          transaction._data.plan != "no-plan" &&
          transaction._data.plan.trim().length > 0
        ) {
          if (transaction._data.plan in categoryExpenses) {
            categoryExpenses[transaction._data.plan] +=
              transaction._data.amount;
          } else {
            categoryExpenses[transaction._data.plan] = transaction._data.amount;
          }
        }

        //
        if (transaction._data.category.trim().length > 0) {
          if (transaction._data.category in categoryExpenses) {
            categoryExpenses[transaction._data.category] +=
              transaction._data.amount;
          } else {
            categoryExpenses[transaction._data.category] =
              transaction._data.amount;
          }
        }
      }
    });

    const expenseSummary = Object.keys(categoryExpenses).map((category) => ({
      name: category,
      expense: categoryExpenses[category],
      color: getNextColor(),
      legendFontColor: "#7F7F7F",
      legendFontSize: 13,
    }));

    setChartData(expenseSummary);
  }, [transactions]);

  return (
    <PieChart
      data={chartData.length === 0 ? data : chartData}
      width={width}
      height={height / 3.3}
      chartConfig={chartConfig}
      accessor={"expense"}
      backgroundColor={"transparent"}
      paddingLeft={"15"}
    />
  );
};
const chartConfig = {
  backgroundGradientFrom: "#1E2923",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

const data = [
  {
    name: "No Expense",
    expense: 100,
    color: "#50c878",
    legendFontColor: "#7F7F7F",
    legendFontSize: 13,
  },
];

let currentIndex = 0;

function getNextColor() {
  if (currentIndex >= colorCodes.length) {
    currentIndex = 0; // Reset to the beginning when all colors have been shown
  }

  const color = colorCodes[currentIndex];
  currentIndex++;
  return color;
}

const colorCodes = [
  "#50c878",
  "#00a86b",
  "#004225",
  "#77dd77",
  "#40826d",
  "#addfad",
  "#29ab87",
  "#21421e",
];
