export function pct(value) {
  return `${Math.round(value * 100)}%`;
}

export function formatSetting(value, format) {
  if (format === "percent") return pct(value);
  if (format === "decimal") return value.toFixed(1);
  return String(value);
}
