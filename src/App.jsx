import {
  Beaker,
  ChevronDown,
  Download,
  FlaskConical,
  Gauge,
  Layers3,
  Microscope,
  SlidersHorizontal,
  Upload,
} from "lucide-react";
import React from "react";
import { settingControls } from "./config/defaults";
import { downloadJson } from "./components/downloadJson";
import { formatSetting, pct } from "./components/format";
import { normalizeRows } from "./lib/data/validateRows";
import { useTrainingRun } from "./hooks/useTrainingRun";

function App() {
  const training = useTrainingRun();
  const mistakes = training.run.evaluation.predictions.filter((row) => !row.correct);
  const topPrediction = training.run.livePrediction[0];

  function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = JSON.parse(String(reader.result || "[]"));
      const result = normalizeRows(parsed);
      if (result.rows.length) training.setRows(result.rows);
    };
    reader.readAsText(file);
  }

  return (
    <main className="lab-shell">
      <header className="lab-header">
        <div className="brand">
          <span className="brand-mark">
            <Beaker size={24} />
          </span>
          <div>
            <h1>LabelLab</h1>
            <p>Train a small classifier, inspect its behavior, and test new text locally.</p>
          </div>
        </div>
        <div className="header-actions">
          <label className="ghost-button">
            <Upload size={16} />
            Import rows
            <input type="file" accept=".json" onChange={importJson} />
          </label>
          <button className="solid-button" onClick={() => downloadJson("labellab-report.json", training.report)}>
            <Download size={16} />
            Export
          </button>
        </div>
      </header>

      <section className="lab-hero">
        <article className="specimen-card">
          <span className="eyebrow">
            <Microscope size={15} />
            prediction tester
          </span>
          <textarea
            value={training.inputText}
            onChange={(event) => training.setInputText(event.target.value)}
            aria-label="Text to classify"
          />
          <div className="prediction-result">
            <span>Top label</span>
            <strong>{topPrediction?.label || "none"}</strong>
            <small>{topPrediction ? pct(topPrediction.probability) : "0%"}</small>
          </div>
        </article>

        <section className="run-card">
          <span className="eyebrow">
            <FlaskConical size={15} />
            active run
          </span>
          <div className="run-metrics">
            <Metric label="Accuracy" value={pct(training.run.evaluation.accuracy)} />
            <Metric label="Macro F1" value={pct(training.run.evaluation.macroF1)} />
            <Metric label="Labels" value={training.run.model.labels.length} />
          </div>
          <div className="confidence-orbit">
            {training.run.livePrediction.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <i style={{ width: `${item.probability * 100}%` }} />
                <strong>{pct(item.probability)}</strong>
              </div>
            ))}
          </div>
        </section>

        <aside className="control-card">
          <span className="eyebrow">
            <SlidersHorizontal size={15} />
            model controls
          </span>
          {Object.entries(settingControls).map(([key, control]) => (
            <label className="control" key={key}>
              <span>{control.label}</span>
              <strong>{formatSetting(training.settings[key], control.format)}</strong>
              <input
                type="range"
                min={control.min}
                max={control.max}
                step={control.step}
                value={training.settings[key]}
                onChange={(event) => training.updateSetting(key, event.target.value)}
              />
            </label>
          ))}
          <label className="toggle">
            <input
              type="checkbox"
              checked={training.settings.useBigrams}
              onChange={(event) => training.toggleBigrams(event.target.checked)}
            />
            Use bigrams
          </label>
        </aside>
      </section>

      <section className="lab-drawers">
        <LabDrawer icon={<Layers3 size={17} />} title="Dataset">
          <div className="dataset-sample">
            <div className="dataset-counts">
              <strong>{training.rows.length}</strong>
              <span>rows</span>
              <strong>{training.run.model.vocabulary.length}</strong>
              <span>tokens</span>
            </div>
            {training.rows.slice(0, 8).map((row) => (
              <article key={row.id}>
                <strong>{row.label}</strong>
                <p>{row.text}</p>
              </article>
            ))}
          </div>
        </LabDrawer>

        <LabDrawer icon={<Gauge size={17} />} title="Diagnostics">
          <div className="diagnostic-grid">
            <ConfusionMatrix labels={training.run.model.labels} matrix={training.run.evaluation.matrix} />
            <div className="mistake-list">
              <h3>Holdout mistakes</h3>
              {mistakes.length ? (
                mistakes.map((row) => (
                  <article key={row.id}>
                    <strong>{row.label}</strong>
                    <span>predicted {row.predicted}</span>
                    <p>{row.text}</p>
                  </article>
                ))
              ) : (
                <p>No mistakes in this split.</p>
              )}
            </div>
          </div>
        </LabDrawer>

        <LabDrawer icon={<Microscope size={17} />} title="Learned features">
          <div className="feature-grid">
            {training.run.topFeatures.map((group) => (
              <article key={group.label}>
                <strong>{group.label}</strong>
                <div>
                  {group.features.slice(0, 8).map((feature) => (
                    <span key={feature.token}>{feature.token}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </LabDrawer>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <article>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function LabDrawer({ icon, title, children }) {
  return (
    <details className="lab-drawer">
      <summary>
        <span>
          {icon}
          {title}
        </span>
        <ChevronDown size={17} />
      </summary>
      <div className="drawer-body">{children}</div>
    </details>
  );
}

function ConfusionMatrix({ labels, matrix }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Actual</th>
          {labels.map((label) => (
            <th key={label}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {labels.map((actual) => (
          <tr key={actual}>
            <th>{actual}</th>
            {labels.map((predicted) => (
              <td key={predicted}>{matrix[actual][predicted]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
