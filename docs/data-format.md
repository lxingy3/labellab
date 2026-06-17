# Data Format

Imported data should be a JSON array. Each row needs `text` and `label`.

```json
[
  {
    "id": "optional-row-id",
    "text": "The applicant asks for a clearer explanation of the denial.",
    "label": "transparency"
  }
]
```

Rows without text or label are ignored during import. Labels are treated as strings and sorted before training.
