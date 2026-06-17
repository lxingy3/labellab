export function splitRows(rows, testRatio = 0.25, seed = 37) {
  const byLabel = rows.reduce((acc, row) => {
    acc[row.label] = acc[row.label] || [];
    acc[row.label].push(row);
    return acc;
  }, {});

  const train = [];
  const test = [];

  Object.values(byLabel).forEach((group) => {
    const shuffled = seededShuffle(group, seed);
    const cutoff = Math.max(1, Math.round(group.length * testRatio));
    shuffled.forEach((row, index) => {
      if (index < cutoff) test.push(row);
      else train.push(row);
    });
  });

  return { train, test };
}

function seededShuffle(rows, seed) {
  return rows
    .map((row, index) => ({ row, sort: hash(`${row.id}-${index}-${seed}`) }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.row);
}

function hash(value) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result += (result << 1) + (result << 4) + (result << 7) + (result << 8) + (result << 24);
  }
  return result >>> 0;
}
