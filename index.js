import { generateAltText } from "./src/generate-alt.js";

const INERT_TEXT = "📋 Copy alt to clipboard";
const COPIED_TEXT = "✅ Copied!";

/**
 * Event handler for the copy button;
 * * responds to click;
 * * fetches text from the input;
 * * parses it to text using the utls above;
 * * writes it to clipboard
 *
 * @async
 * @returns {*}
 */
const handleCopyButtonClick = async function () {
  const copyButton = document.getElementById("copy-button");
  const resultsInput = document.getElementById("results-input");

  if (!resultsInput || !copyButton) {
    return;
  }

  const altText = generateAltText(resultsInput.value);

  await navigator.clipboard.writeText(altText);
  copyButton.innerText = COPIED_TEXT;

  setTimeout(() => {
    copyButton.innerText = INERT_TEXT;
  }, 1250);
};

/**
 * Event handler for the results input;
 * * responds to change;
 * * generates the alt text
 * * loads it into the preview window
 *
 * @async
 * @returns {*}
 */
const handleResultsInputChange = function () {
  const resultsInput = document.getElementById("results-input");
  const previewInput = document.getElementById("preview-input");

  if (!resultsInput || !previewInput) {
    return;
  }

  const altText = generateAltText(resultsInput.value);

  previewInput.innerHTML = altText;
};

document
  .getElementById("results-input")
  .addEventListener("input", handleResultsInputChange);

document
  .getElementById("copy-button")
  .addEventListener("click", handleCopyButtonClick);
