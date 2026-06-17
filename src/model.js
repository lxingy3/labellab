const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "them",
  "to",
  "was",
  "with",
]);

export function tokenize(text, useBigrams = true) {
  const words = (text.toLowerCase().match(/[a-z0-9]+/g) || []).filter(
    (token) => !STOPWORDS.has(token)
  );
  if (!useBigrams) return words;
  const bigrams = [];
  for (let index = 0; index < words.length - 1; index += 1) {
    bigrams.push(`${words[index]} ${words[index + 1]}`);
  }
  return [...words, ...bigrams];
}

export function splitRows(rows, testRatio = 0.25) {
  const byLabel = rows.reduce((acc, row) => {
    acc[row.label] = acc[row.label] || [];
    acc[row.label].push(row);
    return acc;
  }, {});

  const train = [];
  const test = [];
  Object.values(byLabel).forEach((group) => {
    group.forEach((row, index) => {
      const cutoff = Math.max(1, Math.round(group.length * testRatio));
      if (index < cutoff) test.push(row);
      else train.push(row);
    });
  });

  return { train, test };
}

export function trainModel(rows, options) {
  const labels = [...new Set(rows.map((row) => row.label))].sort();
  const vocabulary = new Set();
  const labelStats = Object.fromEntries(
    labels.map((label) => [
      label,
      { docs: 0, terms: 0, counts: new Map() },
    ])
  );

  rows.forEach((row) => {
    const stats = labelStats[row.label];
    stats.docs += 1;
    tokenize(row.text, options.useBigrams).forEach((token) => {
      vocabulary.add(token);
      stats.terms += 1;
      stats.counts.set(token, (stats.counts.get(token) || 0) + 1);
    });
  });

  return {
    labels,
    vocabulary: [...vocabulary],
    labelStats,
    totalDocs: rows.length,
    alpha: options.alpha,
    useBigrams: options.useBigrams,
  };
}

export function predict(model, text) {
  const tokens = tokenize(text, model.useBigrams);
  const vocabSize = Math.max(model.vocabulary.length, 1);
  const rawScores = model.labels.map((label) => {
    const stats = model.labelStats[label];
    let score = Math.log(stats.docs / Math.max(model.totalDocs, 1));
    tokens.forEach((token) => {
      const count = stats.counts.get(token) || 0;
      score += Math.log((count + model.alpha) / (stats.terms + model.alpha * vocabSize));
    });
    return { label, score };
  });

  const max = Math.max(...rawScores.map((item) => item.score));
  const withProb = rawScores.map((item) => ({ ...item, exp: Math.exp(item.score - max) }));
  const sum = withProb.reduce((total, item) => total + item.exp, 0);
  return withProb
    .map((item) => ({
      label: item.label,
      probability: item.exp / Math.max(sum, 1e-12),
    }))
    .sort((a, b) => b.probability - a.probability);
}

export function evaluate(model, rows) {
  const labels = model.labels;
  const matrix = Object.fromEntries(
    labels.map((actual) => [actual, Object.fromEntries(labels.map((predicted) => [predicted, 0]))])
  );

  const predictions = rows.map((row) => {
    const scores = predict(model, row.text);
    const predicted = scores[0]?.label || labels[0];
    matrix[row.label][predicted] += 1;
    return { ...row, predicted, scores, correct: predicted === row.label };
  });

  const correct = predictions.filter((row) => row.correct).length;
  const perLabel = labels.map((label) => {
    const tp = matrix[label][label];
    const fp = labels.reduce((sum, actual) => sum + (actual === label ? 0 : matrix[actual][label]), 0);
    const fn = labels.reduce((sum, predicted) => sum + (predicted === label ? 0 : matrix[label][predicted]), 0);
    const precision = tp / Math.max(tp + fp, 1);
    const recall = tp / Math.max(tp + fn, 1);
    const f1 = (2 * precision * recall) / Math.max(precision + recall, 1e-12);
    return { label, precision, recall, f1 };
  });

  return {
    accuracy: correct / Math.max(rows.length, 1),
    matrix,
    predictions,
    perLabel,
  };
}

export function classDistribution(rows) {
  return rows.reduce((acc, row) => {
    acc[row.label] = (acc[row.label] || 0) + 1;
    return acc;
  }, {});
}
