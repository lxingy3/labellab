# Model Notes

LabelLab uses Multinomial Naive Bayes because it is fast, local, and easy to inspect.

## Features

The tokenizer removes a small stopword list, keeps lowercase alphanumeric tokens, and can add bigram features. Bigrams are useful when short phrases carry label meaning, such as "automated decision" or "clear explanation".

## Split

The train/test split is stratified by label and deterministic by seed. This makes a run repeatable while still avoiding the earlier fixed-order split.

## Metrics

The app reports accuracy, macro F1, per-label precision, recall, F1, and a confusion matrix. It also lists holdout mistakes so a user can decide whether labels, examples, or features need work.

## Feature inspection

Top feature lists come from per-label token counts. They are not causal explanations, but they are useful for checking whether the model learned the right vocabulary.
