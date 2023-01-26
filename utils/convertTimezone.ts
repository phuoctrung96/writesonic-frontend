export default function convertTimezone(
  date: string,
  locale: string,
  hideTime?: boolean
) {
  if (date === null) {
    return "None";
  }
  const localDate = new Date(date.replace(/ UTC/g, "Z").replace(/\s/, "T"));
  const yaer = localDate.toLocaleString("us-en", { year: "numeric" });
  const month = localDate.toLocaleString(locale, { month: "long" });
  const day = localDate.toLocaleString("us-en", { day: "2-digit" });
  const time = localDate.toLocaleString("us-en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return !hideTime
    ? `${month} ${day}, ${yaer} @ ${time}`
    : `${month} ${day}, ${yaer}`;
}
