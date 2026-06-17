# Architecture

LabelLab is organized around a complete local training run.

```text
src/components/        Shared UI helpers
src/config/            Default model settings and slider metadata
src/fixtures/          Sample labeled dataset
src/hooks/             Training-run state
src/lib/data/          Dataset validation, distribution, and seeded splits
src/lib/model/         Tokenizer and Multinomial Naive Bayes classifier
src/lib/metrics/       Accuracy, macro F1, confusion matrix, per-label metrics
src/lib/report/        Run assembly and JSON export
```

The app imports rows, validates them, creates a deterministic stratified split, trains a local classifier, evaluates holdout rows, shows feature summaries, and exports the full run.

The main screen is built around a prediction tester and a compact run summary. Dataset samples, diagnostics, and learned features are tucked into drawers so the first screen stays readable.

The old `src/model.js` and `src/dataset.js` files are kept as stable entry points.
