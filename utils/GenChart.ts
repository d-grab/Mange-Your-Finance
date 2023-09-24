import { removeLeadingZeros } from "./Savings";

export function incomeByMonth(transactions: Array<any> | undefined) {
  const currentYear = new Date().getFullYear();
  const incomeByMonth: any = {};

  transactions?.forEach((transaction) => {
    const date = new Date(transaction._data.createdAt.seconds * 1000);

    // Check if the transaction year matches the current year
    if (
      date.getFullYear() === currentYear &&
      transaction._data.category === "#income"
    ) {
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!incomeByMonth[yearMonth]) {
        incomeByMonth[yearMonth] = { total: 0, count: 0 };
      }

      incomeByMonth[yearMonth].total += parseFloat(transaction._data.amount); // Ensure amount is a number
      incomeByMonth[yearMonth].count++;
    }
  });

  const response = new Array(12).fill(0);

  // Calculate average spending for each month
  for (const month in incomeByMonth) {
    const monthIndex = parseFloat(month.split("-")[1]) - 1;
    response[monthIndex] = incomeByMonth[month].total;
  }

  return response;
}

export function spendingByMonth(transactions: Array<any> | undefined) {
  const currentYear = new Date().getFullYear();
  const spendingByMonth: any = {};

  transactions?.forEach((transaction) => {
    const date = new Date(transaction._data.createdAt.seconds * 1000);

    // Check if the transaction year matches the current year
    if (
      date.getFullYear() === currentYear &&
      transaction._data.category !== "#income"
    ) {
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!spendingByMonth[yearMonth]) {
        spendingByMonth[yearMonth] = { total: 0, count: 0 };
      }

      spendingByMonth[yearMonth].total += parseFloat(transaction._data.amount); // Ensure amount is a number
      spendingByMonth[yearMonth].count++;
    }
  });

  const response = new Array(12).fill(0);

  // Calculate average spending for each month
  for (const month in spendingByMonth) {
    const monthIndex = parseFloat(month.split("-")[1]) - 1;
    response[monthIndex] = spendingByMonth[month].total;
  }

  return response;
}

export function spendingByYear(transactions: Array<any> | undefined) {
  if (!transactions || transactions.length === 0) {
    return {
      data: [],
      years: [],
    };
  }

  const currentYear = new Date().getFullYear(); // Get the current year

  const spendingDataByYear: any = {};
  const years: any = [];

  transactions.forEach((transaction) => {
    const date = new Date(transaction._data.createdAt.seconds * 1000);
    const year = date.getFullYear().toString();

    if (+year === currentYear && transaction._data.category !== "#income") {
      if (!spendingDataByYear[year]) {
        spendingDataByYear[year] = 0;
        years.push(year);
      }
      spendingDataByYear[year] += transaction._data.amount;
    }
  });

  const data = years.map(
    (year: any) => removeLeadingZeros(spendingDataByYear[year]) || 0
  );

  return {
    data: data,
    years: years,
  };
}
