# LabelLab

LabelLab is a local text classification workbench. It trains a small model on labeled rows, evaluates a deterministic holdout split, and shows the weak points in the dataset.

The app runs in the browser and does not require an API key.

## Features

- Loads a sample labeled dataset for public-service text classification.
- Imports custom JSON rows with `text` and `label` fields.
- Validates imported rows before training.
- Uses a deterministic stratified train/test split.
- Trains a Multinomial Naive Bayes text classifier.
- Supports unigram and bigram features.
- Shows accuracy, macro F1, class distribution, per-label metrics, and a confusion matrix.
- Lists misclassified rows.
- Shows top features learned for each label.
- Tests a new text input with confidence scores.
- Exports the run report as JSON.

## Run locally

```bash
npm install
npm run dev
```

## Test and build

```bash
npm test
npm run build
```

## Data format

Custom datasets should be JSON arrays:

```json
[
  {
    "text": "The applicant asks for a clearer explanation of the denial.",
    "label": "transparency"
  }
]
```

## Project structure

```text
src/components/        Shared UI helpers
src/config/            Default settings
src/fixtures/          Sample labeled rows
src/hooks/             Training-run state
src/lib/data/          Validation, distribution, and splitting
src/lib/model/         Tokenizer and Naive Bayes classifier
src/lib/metrics/       Evaluation metrics
src/lib/report/        Run and export assembly
docs/                  Architecture, model notes, and data format
```

## Notes

This is a baseline model, not a hosted AutoML system. The point is to make labels, features, and evaluation behavior visible before moving to a larger model.
