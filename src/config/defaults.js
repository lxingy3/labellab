export const defaultSettings = {
  testRatio: 0.25,
  alpha: 1,
  useBigrams: true,
  seed: 37,
};

export const settingControls = {
  testRatio: { label: "Test split", min: 0.15, max: 0.45, step: 0.05, format: "percent" },
  alpha: { label: "Smoothing", min: 0.2, max: 2, step: 0.2, format: "decimal" },
  seed: { label: "Split seed", min: 1, max: 99, step: 1, format: "integer" },
};
