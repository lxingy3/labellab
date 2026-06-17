# LabelLab

LabelLab is a browser-based text classification workbench. It trains a small local model on labeled text rows and shows the evaluation results in the same screen.

The app runs in the browser and does not require an API key.

## What it does

- Loads a sample labeled dataset.
- Imports custom JSON rows with `text` and `label` fields.
- Trains a Multinomial Naive Bayes text classifier.
- Supports unigram and bigram features.
- Shows accuracy, class distribution, per-label metrics, and a confusion matrix.
- Lists misclassified rows.
- Tests a new text input with confidence scores.
- Exports the run report as JSON.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
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
src/App.jsx       UI and state
src/model.js      tokenizer, train/test split, Naive Bayes, metrics
src/dataset.js    sample labeled rows
src/styles.css    layout and visual system
```

## Notes

This is a small baseline model. It is useful for debugging data, labels, and evaluation before moving to a larger model.
