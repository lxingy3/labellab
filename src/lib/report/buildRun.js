import { classDistribution } from "../data/validateRows";
import { splitRows } from "../data/splitRows";
import { evaluate } from "../metrics/evaluate";
import { predict, topFeatures, trainModel } from "../model/naiveBayes";

export function buildTrainingRun(rows, settings, inputText) {
  const split = splitRows(rows, settings.testRatio, settings.seed);
  const model = trainModel(split.train, settings);
  const evaluation = evaluate(model, split.test);

  return {
    split,
    model,
    evaluation,
    distribution: classDistribution(rows),
    topFeatures: topFeatures(model),
    livePrediction: predict(model, inputText),
  };
}

export function buildRunReport(rows, settings, run) {
  return {
    generatedAt: new Date().toISOString(),
    settings,
    rows: rows.length,
    distribution: run.distribution,
    labels: run.model.labels,
    vocabularySize: run.model.vocabulary.length,
    topFeatures: run.topFeatures,
    metrics: run.evaluation.perLabel,
    accuracy: run.evaluation.accuracy,
    macroF1: run.evaluation.macroF1,
    confusionMatrix: run.evaluation.matrix,
    predictions: run.evaluation.predictions,
  };
}
