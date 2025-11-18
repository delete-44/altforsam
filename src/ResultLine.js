import { iconMap } from "./consts.js";

/**
 * @typedef {Record<typeof CORRECT_KEY | typeof MISTAKE_KEY | typeof HINT_KEY | typeof DOUBLE_HINT_KEY, number>} TResultTotalsItem
 * ie { correct: 1, mistake: 16, hint: 2, doubleHint: 1 }
 */

/**
 * Regex to match the first line of text
 * To match:
 * * "I solved the daily Clues by Sam, Nov 17th 2025 (Easy), in 02:50"
 * * "I solved the daily Clues by Sam (Nov 14th 2025) in less than 17 minutes"
 *
 * @type {RegExp}
 */
const PREAMBLE_REGEX = /^(I solved the daily )?Clues by Sam.*/;

/**
 * Regex to match the URL at the end of the results output
 * To match, well:
 * * "https://cluesbysam.com"
 *
 * @type {RegExp}
 */
const LINK_REGEX = /https:\/\/cluesbysam.com/;

/**
 * To match the results as declared in cluesbysam:
 * > 🟩 means you correctly identified the person
 * > 🟨 means you made at least one mistake identifying the person
 * > 🟡 means you used a hint to identify the person
 * > 🟠 means you used a double hint to identify the person
 * We match 8 as there are 4 per row, and the emojis count as two characters each
 *
 * @type {RegExp}
 */
const RESULT_REGEX = /[🟩🟨🟡🟠]{8}/;

export class ResultLine {
  constructor(text) {
    this.text = text || "";
  }

  /**
   * Utility function for test PREAMBLE_REGEX
   *
   * @returns {boolean}
   */
  isPreamble() {
    return PREAMBLE_REGEX.test(this.text);
  }

  /**
   * Utility function for test LINK_REGEX
   *
   * @returns {boolean}
   */
  isLink() {
    return LINK_REGEX.test(this.text);
  }

  /**
   * Utility function for test RESULT_REGEX
   *
   * @returns {boolean}
   */
  isResultRow() {
    // match even if there is surrounding whitespace
    return RESULT_REGEX.test(this.text);
  }

  /**
   * returns an object with counts for this line (may be empty)
   *
   * @returns {TResultTotalsItem}
   */
  counts() {
    const totals = {};
    if (this.isPreamble() || this.isLink()) return totals;
    for (const ch of this.text) {
      const key = iconMap[ch];

      if (!key) continue;

      totals[key] = (totals[key] || 0) + 1;
    }
    return totals;
  }
}
