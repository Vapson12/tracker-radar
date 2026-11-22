// Privacy grade A–F from the tracker companies found on a page.
// Each company costs points depending on what it does.

const PENALTY = { mining: 30, recording: 15, ads: 8, social: 5, analytics: 4 };

export const GRADE_COLORS = { A: '#2a9d8f', B: '#8ac926', C: '#f7b801', D: '#f4a261', F: '#e63946' };

// Each fingerprinting technique (canvas, WebGL, audio, fonts) found on the page.
const FINGERPRINT_PENALTY = 10;

/**
 * @param {string[]} categories one category per tracker company
 * @param {string[]} fingerprinting techniques detected on the page
 */
export function privacyScore(categories, fingerprinting = []) {
  const penalty = categories.reduce((sum, c) => sum + (PENALTY[c] ?? 4), 0)
    + fingerprinting.length * FINGERPRINT_PENALTY;
  return Math.max(0, 100 - penalty);
}

export function gradeFor(score) {
  if (score >= 90) return 'A';
  if (score >= 75) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}
