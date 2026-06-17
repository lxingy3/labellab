const templates = {
  support: [
    "The resident describes clear benefits from the housing support program.",
    "The speaker says the new transit tool helped them reach appointments on time.",
    "The student reports that automated reminders made the process easier to follow.",
    "The applicant says the portal reduced confusion and saved several calls.",
    "The parent describes the school matching system as fair and useful.",
    "The worker says the scheduling model helped balance shifts more evenly.",
    "The patient explains that the triage tool helped them get faster care.",
    "The tenant says the eligibility checker made benefits easier to understand.",
  ],
  risk: [
    "The speaker worries that the scoring system hides important context.",
    "The resident says the automated decision was wrong and hard to appeal.",
    "The applicant describes a denial with no clear explanation.",
    "The student says the ranking model punished missing data.",
    "The worker reports that the scheduling algorithm ignored family constraints.",
    "The parent says the assignment tool created a long commute.",
    "The patient worries that automated triage could miss urgent symptoms.",
    "The tenant says the risk score made the process feel unfair.",
  ],
  transparency: [
    "The commenter asks for a public explanation of how the model works.",
    "The resident wants the city to publish data sources and appeal rules.",
    "The student asks for clearer documentation about ranking factors.",
    "The applicant requests a plain language notice for automated decisions.",
    "The parent asks the school district to share the assignment criteria.",
    "The worker wants a record of when the schedule model changes.",
    "The patient asks for guidance on when a human reviews the tool output.",
    "The tenant requests clearer eligibility rules before applying.",
  ],
};

export const sampleRows = Object.entries(templates).flatMap(([label, rows]) =>
  rows.map((text, index) => ({ id: `${label}-${index + 1}`, text, label }))
);
