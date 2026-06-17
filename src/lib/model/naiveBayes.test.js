import { describe, expect, it } from "vitest";
import { sampleRows } from "../../fixtures/sampleRows";
import { trainModel, predict, topFeatures } from "./naiveBayes";

describe("naive bayes model", () => {
  it("trains a vocabulary and predicts sorted probabilities", () => {
    const model = trainModel(sampleRows, { alpha: 1, useBigrams: true });
    const prediction = predict(model, "The applicant wants an explanation of the denial.");

    expect(model.labels).toEqual(["risk", "support", "transparency"]);
    expect(model.vocabulary.length).toBeGreaterThan(20);
    expect(prediction[0].probability).toBeGreaterThanOrEqual(prediction[1].probability);
  });

  it("extracts top features per label", () => {
    const model = trainModel(sampleRows, { alpha: 1, useBigrams: false });
    const features = topFeatures(model, 3);

    expect(features).toHaveLength(3);
    expect(features[0].features.length).toBeLessThanOrEqual(3);
  });
});
