import { generateAltText } from "./src/generate-alt.js";

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
  const resultsInput = document.getElementById("results-input");

  if (!resultsInput) {
    return;
  }

  const altText = generateAltText(resultsInput.value);

  await navigator.clipboard.writeText(altText);
};

document
  .getElementById("copy-button")
  .addEventListener("click", handleCopyButtonClick);
