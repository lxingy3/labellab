import { tokenize } from "./tokenizer";

export function trainModel(rows, options) {
  const labels = [...new Set(rows.map((row) => row.label))].sort();
  const vocabulary = new Set();
  const labelStats = Object.fromEntries(
    labels.map((label) => [label, { docs: 0, terms: 0, counts: new Map() }])
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
    vocabulary: [...vocabulary].sort(),
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

export function topFeatures(model, limit = 8) {
  return model.labels.map((label) => {
    const stats = model.labelStats[label];
    const features = [...stats.counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, limit)
      .map(([token, count]) => ({ token, count }));

    return { label, features };
  });
}
