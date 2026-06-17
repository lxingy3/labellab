import { predict } from "../model/naiveBayes";

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
  const perLabel = labels.map((label) => summarizeLabel(label, labels, matrix));
  const macroF1 =
    perLabel.reduce((sum, item) => sum + item.f1, 0) / Math.max(perLabel.length, 1);

  return {
    accuracy: correct / Math.max(rows.length, 1),
    macroF1,
    matrix,
    predictions,
    perLabel,
  };
}

function summarizeLabel(label, labels, matrix) {
  const tp = matrix[label][label];
  const fp = labels.reduce((sum, actual) => sum + (actual === label ? 0 : matrix[actual][label]), 0);
  const fn = labels.reduce(
    (sum, predicted) => sum + (predicted === label ? 0 : matrix[label][predicted]),
    0
  );
  const precision = tp / Math.max(tp + fp, 1);
  const recall = tp / Math.max(tp + fn, 1);
  const f1 = (2 * precision * recall) / Math.max(precision + recall, 1e-12);

  return { label, precision, recall, f1 };
}
