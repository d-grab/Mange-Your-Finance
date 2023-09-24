export default function calculateSavingsByMonth(
  elements: any[] | undefined,
  targetMonth?: number
): {
  month: string;
  currentAmount: number;
  targetAmount: number;
  totalSavings: number;
} {
  if (elements !== undefined) {
    const now = new Date();
    const currentMonth =
      targetMonth !== undefined ? targetMonth : now.getMonth();
    const year = now.getFullYear();
    const startOfMonth = new Date(year, currentMonth, 1);
    const endOfMonth = new Date(year, currentMonth + 1, 0, 23, 59, 59, 999);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const filteredElements = elements?.filter((element) => {
      const elementDate = new Date(
        element._data.createdAt.seconds * 1000 +
          element._data.createdAt.nanoseconds / 1000000
      );
      return elementDate >= startOfMonth && elementDate <= endOfMonth;
    });

    const currentAmount = filteredElements?.reduce(
      (total, element) => total + element._data.currentAmount,
      0
    );
    const targetAmount = filteredElements?.reduce(
      (total, element) => total + element._data.targetAmount,
      0
    );
    const totalSavings = filteredElements?.reduce(
      (total, element) => total + element._data.currentAmount,
      0
    );

    const monthWithYear = `${monthNames[currentMonth]} ${year}`;

    return {
      month: monthWithYear,
      currentAmount: removeLeadingZeros(currentAmount),
      totalSavings: removeLeadingZeros(totalSavings),
      targetAmount: removeLeadingZeros(targetAmount),
    };
  } else {
    return {
      month: "",
      totalSavings: 0,
      currentAmount: 0,
      targetAmount: 0,
    };
  }
}

export function removeLeadingZeros(inputNumber: any): number {
  try {
    return inputNumber.replace(/^0+/, "");
  } catch {
    return inputNumber;
  }
}
