// Privacy grade A–F from the tracker companies found on a page.
// Each company costs points depending on what it does.

const PENALTY = { recording: 15, ads: 8, social: 5, analytics: 4 };

export const GRADE_COLORS = { A: '#2a9d8f', B: '#8ac926', C: '#f7b801', D: '#f4a261', F: '#e63946' };

/** @param {string[]} categories one category per tracker company */
export function privacyScore(categories) {
  const penalty = categories.reduce((sum, c) => sum + (PENALTY[c] ?? 4), 0);
  return Math.max(0, 100 - penalty);
}

export function gradeFor(score) {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}
