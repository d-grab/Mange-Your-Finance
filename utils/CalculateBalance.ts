import { useSelector } from "react-redux";
import { useFirestore } from "../firebase/useFirestore";
import { RootState } from "../store";
import calculateSavingsByMonth from "./Savings";

export const CalculateBalance = async () => {
  const user = useSelector((state: RootState) => state.user);
  const { getDocument: getTransactionDocument } = useFirestore(
    "transactions",
    user.uid!
  );
  const { getDocument: getPlanDocument } = useFirestore("plans", user.uid!);
  const { getDocument: getSavings } = useFirestore("savings", user.uid!);

  let incomeBalance = 0;
  let outcomeBalance = 0;
  let currentBalance = 0;

  const d = await getTransactionDocument();
  const plans = await getPlanDocument();
  const savings = await getSavings();
  const { currentAmount } = calculateSavingsByMonth(savings?.docs);

  d?.forEach((doc: any) => {
    if (doc._data.category === "#income") {
      incomeBalance += parseFloat(doc._data.amount);
    } else {
      if (doc._data.plan === "no-plan") {
        outcomeBalance += parseFloat(doc._data.amount);
      }
    }
  });

  currentBalance = incomeBalance - outcomeBalance;
  currentBalance -= currentAmount;

  plans?.forEach((plan: any) => {
    currentBalance -= parseFloat(plan._data.budgetAmount);
    outcomeBalance += parseFloat(plan._data.budgetAmount);
  });

  return {
    incomeBalance: incomeBalance.toFixed(2),
    outcomeBalance: outcomeBalance.toFixed(2),
    currentBalance: currentBalance.toFixed(2),
  };
};

export function calculatePercentageIncrease(
  initialIncome: number,
  increaseAmount: number
) {
  const percentageIncrease = (increaseAmount / initialIncome) * 100;

  return percentageIncrease;
}

export function calculatePercentageSpent(
  totalIncome: number,
  spentAmount: number
) {
  // Calculate the percentage spent
  const percentageSpent = (spentAmount / totalIncome) * 100;

  return percentageSpent;
}
