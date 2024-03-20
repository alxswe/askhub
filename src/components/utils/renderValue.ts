import moment from "moment";

export type renderValueTypes =
  | "string"
  | "str"
  | "tel"
  | "email"
  | "number"
  | "float"
  | "decimal"
  | "phone"
  | "email"
  | "date"
  | "time"
  | "datetime"
  | "pct";

export function renderValue(value: any, as: renderValueTypes = "string") {
  if (["null", "undefined"].includes(String(value))) {
    return "-";
  }

  switch (as) {
    case "phone":
    case "email":
    case "str":
    case "tel":
    case "email":
    case "string":
      return value ? String(value) : "-";
    case "float":
    case "decimal":
    case "number":
      return Number(value);
    case "pct":
      return `${value}%`;
    case "date":
      return value ? moment(value).format("MMM DD, YYYY") : "-";
    case "time":
      return value ? moment(value).format("hh:mm A") : "-";
    case "datetime":
      return value ? moment(value).format("MMM DD, YYYY - hh:mm A") : "-";
    default:
      return value;
  }
}

export function formatNumber(value: number): string | number {
  if (value === null || typeof value === "undefined") {
    return "-";
  }

  let numberValue = Number(value);
  if (numberValue === 0) {
    return String(value);
  }

  const suffixes = ["", "K", "M", "B", "T", "Q"];
  let suffixIndex = 0;

  while (numberValue >= 1000 && suffixIndex < suffixes.length - 1) {
    numberValue /= 1000;
    suffixIndex++;
  }

  if (numberValue < 1000) {
    return parseInt(numberValue.toString());
  }

  return numberValue.toFixed(1) + suffixes[suffixIndex];
}
