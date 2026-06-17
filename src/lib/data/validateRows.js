export function normalizeRows(rawRows) {
  if (!Array.isArray(rawRows)) return { rows: [], rejected: 1 };

  const rows = [];
  let rejected = 0;

  rawRows.forEach((row, index) => {
    const text = String(row?.text || "").trim();
    const label = String(row?.label || "").trim();
    if (!text || !label) {
      rejected += 1;
      return;
    }
    rows.push({
      id: row.id || `row-${index + 1}`,
      text,
      label,
    });
  });

  return { rows, rejected };
}

export function classDistribution(rows) {
  return rows.reduce((acc, row) => {
    acc[row.label] = (acc[row.label] || 0) + 1;
    return acc;
  }, {});
}
