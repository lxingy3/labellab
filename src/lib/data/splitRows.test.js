import { describe, expect, it } from "vitest";
import { sampleRows } from "../../fixtures/sampleRows";
import { splitRows } from "./splitRows";

describe("splitRows", () => {
  it("keeps every label represented in the test split", () => {
    const split = splitRows(sampleRows, 0.25, 37);
    const testLabels = new Set(split.test.map((row) => row.label));

    expect(testLabels).toEqual(new Set(["risk", "support", "transparency"]));
    expect(split.train.length + split.test.length).toBe(sampleRows.length);
  });

  it("is deterministic for the same seed", () => {
    const first = splitRows(sampleRows, 0.25, 5).test.map((row) => row.id);
    const second = splitRows(sampleRows, 0.25, 5).test.map((row) => row.id);

    expect(first).toEqual(second);
  });
});
