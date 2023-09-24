// @ts-ignore

export default function formattedDate(timestamp: {
  nanoseconds: number;
  seconds: number;
}) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
  return date.toLocaleString("en-US", options);
}

export function isValidOrFutureDate(dateString: string): boolean {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  // Remove time information for accurate comparison
  inputDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  return inputDate >= currentDate;
}
