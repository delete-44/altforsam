import {
  CORRECT_KEY,
  DOUBLE_HINT_KEY,
  GENERATOR_LINK,
  HINT_KEY,
  MISTAKE_KEY,
  SOURCE_LINK,
} from "./consts.js";
import { ResultLine } from "./ResultLine.js";

/**
 * @typedef {Object} ResultMetaItem
 * @property {string} label
 * @property {string} [suffix] Optional suffix for pluralization
 */

/**
 * @typedef {Record<typeof CORRECT_KEY | typeof MISTAKE_KEY | typeof HINT_KEY | typeof DOUBLE_HINT_KEY, number>} TResultTotalsItem
 * ie { correct: 1, mistake: 16, hint: 2, doubleHint: 1 }
 */

/**
 * Visualisation metadata for each of the result types
 *
 * @type {Record<string, ResultMetaItem>}
 */
const resultsMeta = {
  [CORRECT_KEY]: { label: "correct guess", suffix: "es" },
  [MISTAKE_KEY]: { label: "mistake" },
  [HINT_KEY]: { label: "hint" },
  [DOUBLE_HINT_KEY]: { label: "double hint" },
};

/**
 * Pluralise a string with an optional suffix
 *
 * @param {number} count
 * @param {string} noun
 * @param {string} [suffix="s"]
 * @returns {string}
 */
export function pluralise(count, noun, suffix = "s") {
  return `${noun}${count !== 1 ? suffix : ""}`;
}

/**
 * Convert a TResultTotalsItem object into a readable string
 *
 * @param {TResultTotalsItem} resultsTotals
 * @returns {string}
 */
export function parseResults(resultsTotals) {
  if (resultsTotals[CORRECT_KEY] === 20) {
    return "Clean sweep! All correct with no mistakes or hints.";
  }

  let parsedString = "";

  [CORRECT_KEY, MISTAKE_KEY, HINT_KEY, DOUBLE_HINT_KEY].forEach((key) => {
    if (resultsTotals[key]) {
      parsedString += `${resultsTotals[key]} ${pluralise(
        resultsTotals[key],
        resultsMeta[key].label,
        resultsMeta[key].suffix
      )}. `;
    }
  });

  return parsedString.trim();
}

/**
 * Count one row  of results into accumulator "resultTotals"
 * * mutates accumulator.
 *
 * @param {TResultTotalsItem} [resultTotals={}]
 * * @param {TResultTotalsItem} resultCounts A counts object returned from ResultLine#counts
 * @returns {TResultTotalsItem} The modified TResultTotalsItem with updated counts
 */
export function mergeCounts(resultTotals = {}, counts) {
  return Object.keys({ ...resultTotals, ...counts }).reduce((acc, k) => {
    acc[k] = (resultTotals[k] || 0) + (counts[k] || 0);
    return acc;
  }, {});
}

/**
 * Takes input and splits it down for processing
 * Expected format:
 * > "I solved the daily Clues by Sam, Nov 17th 2025 (Easy), in 02:50\n🟩🟩🟩🟩\n🟩🟩🟩🟩\n🟩🟩🟩🟨\n🟩🟩🟩🟩\n🟩🟩🟩🟩\nhttps://cluesbysam.com"

 * @param {string} results
 * @returns {{ preamble: string; body: string; link: string; }}
 */
export const generateAltText = function (results) {
  let preamble = "";
  let link = "";
  const unknownLines = [];
  let resultTotals = {
    [CORRECT_KEY]: 0,
    [MISTAKE_KEY]: 0,
    [HINT_KEY]: 0,
    [DOUBLE_HINT_KEY]: 0,
  };
  let rawResultLines = [];

  results.split("\n").forEach((rawLine) => {
    const line = new ResultLine(rawLine);

    if (line.isPreamble()) {
      // prefer first preamble found
      if (!preamble) preamble = rawLine;
      return;
    }

    if (line.isResultRow()) {
      resultTotals = mergeCounts(resultTotals, line.counts());
      rawResultLines.push(rawLine);
      return;
    }

    if (line.isIgnoredLine()) {
      return;
    }

    if (rawLine.trim() !== "") unknownLines.push(rawLine);
  });

  const body = parseResults(resultTotals);

  // build output: preamble (if any), body, unknown lines (preserved), link (if any)
  // keep original ordering: simplest is preamble, body, unknowns, link
  const parts = [];
  if (preamble) parts.push(preamble);
  if (body) parts.push(body);
  if (unknownLines.length) parts.push(...unknownLines);

  parts.push("\nQuick Links:");
  parts.push("Clues By Sam: " + SOURCE_LINK);
  parts.push("Alt For Sam: " + GENERATOR_LINK);

  if (rawResultLines.length) {
    parts.push("\nFull Results:");
    parts.push(...rawResultLines);
  }

  return parts.join("\n");
};
