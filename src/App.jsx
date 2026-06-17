import React, { useMemo, useState } from "react";
import {
  BarChart3,
  Brain,
  Download,
  FlaskConical,
  Search,
  Settings2,
  Table2,
} from "lucide-react";
import { sampleRows } from "./dataset";
import { classDistribution, evaluate, predict, splitRows, trainModel } from "./model";

const defaults = {
  testRatio: 0.25,
  alpha: 1,
  useBigrams: true,
};

function pct(value) {
  return `${Math.round(value * 100)}%`;
}

function downloadJson(name, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [rows, setRows] = useState(sampleRows);
  const [settings, setSettings] = useState(defaults);
  const [inputText, setInputText] = useState(
    "The applicant wants a clearer explanation of the automated denial."
  );

  const split = useMemo(() => splitRows(rows, settings.testRatio), [rows, settings.testRatio]);
  const model = useMemo(
    () => trainModel(split.train, settings),
    [split.train, settings.alpha, settings.useBigrams]
  );
  const evaluation = useMemo(() => evaluate(model, split.test), [model, split.test]);
  const livePrediction = useMemo(() => predict(model, inputText), [model, inputText]);
  const distribution = classDistribution(rows);
  const mistakes = evaluation.predictions.filter((row) => !row.correct);

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = JSON.parse(String(reader.result || "[]"));
      const clean = parsed
        .filter((row) => row.text && row.label)
        .map((row, index) => ({
          id: row.id || `row-${index + 1}`,
          text: String(row.text),
          label: String(row.label),
        }));
      if (clean.length) setRows(clean);
    };
    reader.readAsText(file);
  }

  const exportPayload = {
    settings,
    distribution,
    labels: model.labels,
    metrics: evaluation.perLabel,
    accuracy: evaluation.accuracy,
    confusionMatrix: evaluation.matrix,
    predictions: evaluation.predictions,
  };

  return (
    <main className="shell">
      <aside className="panel dataset-panel">
        <div className="brand">
          <div className="brand-mark">
            <Brain size={22} />
          </div>
          <div>
            <h1>LabelLab</h1>
            <p>Local text classifier</p>
          </div>
        </div>

        <label className="import-box">
          <Table2 size={18} />
          <span>Import JSON rows</span>
          <input type="file" accept=".json" onChange={importJson} />
        </label>

        <section className="dataset-list">
          <div className="list-heading">
            <span>{rows.length} rows</span>
            <span>{model.labels.length} labels</span>
          </div>
          {rows.map((row) => (
            <article className="data-row" key={row.id}>
              <strong>{row.label}</strong>
              <p>{row.text}</p>
            </article>
          ))}
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar panel">
          <div>
            <h2>Training run</h2>
            <p>
              {split.train.length} train rows, {split.test.length} test rows,{" "}
              {model.vocabulary.length} tokens
            </p>
          </div>
          <button onClick={() => downloadJson("labellab-report.json", exportPayload)}>
            <Download size={17} />
            Export report
          </button>
        </header>

        <section className="metric-grid">
          <article className="metric-card panel">
            <span>Accuracy</span>
            <strong>{pct(evaluation.accuracy)}</strong>
          </article>
          <article className="metric-card panel">
            <span>Train split</span>
            <strong>{split.train.length}</strong>
          </article>
          <article className="metric-card panel">
            <span>Test split</span>
            <strong>{split.test.length}</strong>
          </article>
          <article className="metric-card panel">
            <span>Vocabulary</span>
            <strong>{model.vocabulary.length}</strong>
          </article>
        </section>

        <section className="main-grid">
          <article className="panel matrix-panel">
            <div className="panel-title">
              <BarChart3 size={18} />
              <h3>Confusion matrix</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Actual</th>
                  {model.labels.map((label) => (
                    <th key={label}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {model.labels.map((actual) => (
                  <tr key={actual}>
                    <th>{actual}</th>
                    {model.labels.map((predicted) => (
                      <td key={predicted}>{evaluation.matrix[actual][predicted]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </article>

          <article className="panel distribution-panel">
            <div className="panel-title">
              <FlaskConical size={18} />
              <h3>Label distribution</h3>
            </div>
            {Object.entries(distribution).map(([label, count]) => (
              <div className="bar-row" key={label}>
                <span>{label}</span>
                <div>
                  <i style={{ width: `${(count / rows.length) * 100}%` }} />
                </div>
                <strong>{count}</strong>
              </div>
            ))}
          </article>
        </section>

        <section className="panel">
          <div className="panel-title">
            <Search size={18} />
            <h3>Misclassified rows</h3>
          </div>
          <div className="mistake-list">
            {mistakes.length ? (
              mistakes.map((row) => (
                <article className="mistake" key={row.id}>
                  <div>
                    <strong>{row.label}</strong>
                    <span>predicted {row.predicted}</span>
                  </div>
                  <p>{row.text}</p>
                </article>
              ))
            ) : (
              <p className="empty">No mistakes in this split.</p>
            )}
          </div>
        </section>
      </section>

      <aside className="panel inspector">
        <div className="panel-title">
          <Settings2 size={18} />
          <h3>Model settings</h3>
        </div>

        <label className="control">
          <span>Test split</span>
          <strong>{pct(settings.testRatio)}</strong>
          <input
            type="range"
            min="0.15"
            max="0.45"
            step="0.05"
            value={settings.testRatio}
            onChange={(event) =>
              setSettings((current) => ({ ...current, testRatio: Number(event.target.value) }))
            }
          />
        </label>

        <label className="control">
          <span>Smoothing</span>
          <strong>{settings.alpha.toFixed(1)}</strong>
          <input
            type="range"
            min="0.2"
            max="2"
            step="0.2"
            value={settings.alpha}
            onChange={(event) =>
              setSettings((current) => ({ ...current, alpha: Number(event.target.value) }))
            }
          />
        </label>

        <label className="toggle">
          <input
            type="checkbox"
            checked={settings.useBigrams}
            onChange={(event) =>
              setSettings((current) => ({ ...current, useBigrams: event.target.checked }))
            }
          />
          Use bigrams
        </label>

        <div className="prediction-box">
          <h3>Prediction tester</h3>
          <textarea value={inputText} onChange={(event) => setInputText(event.target.value)} />
          <div className="confidence-list">
            {livePrediction.map((item) => (
              <div className="confidence" key={item.label}>
                <span>{item.label}</span>
                <div>
                  <i style={{ width: `${item.probability * 100}%` }} />
                </div>
                <strong>{pct(item.probability)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="metrics-list">
          <h3>Per-label metrics</h3>
          {evaluation.perLabel.map((item) => (
            <article key={item.label}>
              <strong>{item.label}</strong>
              <span>precision {pct(item.precision)}</span>
              <span>recall {pct(item.recall)}</span>
              <span>f1 {pct(item.f1)}</span>
            </article>
          ))}
        </div>
      </aside>
    </main>
  );
}

export default App;
