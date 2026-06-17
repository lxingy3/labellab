import { describe, expect, it } from "vitest";
import { defaultSettings } from "../../config/defaults";
import { sampleRows } from "../../fixtures/sampleRows";
import { buildRunReport, buildTrainingRun } from "./buildRun";

describe("training run report", () => {
  it("builds model, metrics, feature summaries, and predictions", () => {
    const run = buildTrainingRun(sampleRows, defaultSettings, "The resident wants a clear explanation.");
    const report = buildRunReport(sampleRows, defaultSettings, run);

    expect(run.model.labels).toHaveLength(3);
    expect(run.topFeatures).toHaveLength(3);
    expect(run.livePrediction).toHaveLength(3);
    expect(report.vocabularySize).toBeGreaterThan(20);
    expect(report.macroF1).toBeGreaterThanOrEqual(0);
  });
});
