import { useMemo, useState } from "react";
import { defaultSettings } from "../config/defaults";
import { sampleRows } from "../fixtures/sampleRows";
import { buildRunReport, buildTrainingRun } from "../lib/report/buildRun";

export function useTrainingRun() {
  const [rows, setRows] = useState(sampleRows);
  const [settings, setSettings] = useState(defaultSettings);
  const [inputText, setInputText] = useState(
    "The applicant wants a clearer explanation of the automated denial."
  );

  const run = useMemo(() => buildTrainingRun(rows, settings, inputText), [rows, settings, inputText]);
  const report = useMemo(() => buildRunReport(rows, settings, run), [rows, settings, run]);

  function updateSetting(key, value) {
    setSettings((current) => ({ ...current, [key]: Number(value) }));
  }

  function toggleBigrams(value) {
    setSettings((current) => ({ ...current, useBigrams: value }));
  }

  return {
    rows,
    setRows,
    settings,
    updateSetting,
    toggleBigrams,
    inputText,
    setInputText,
    run,
    report,
  };
}
