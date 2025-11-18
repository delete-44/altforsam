const CORRECT_KEY = "correct";
const MISTAKE_KEY = "mistake";
const HINT_KEY = "hint";
const DOUBLE_HINT_KEY = "doubleHint";

const iconMap = {
  "🟩": CORRECT_KEY,
  "🟨": MISTAKE_KEY,
  "🟡": HINT_KEY,
  "🟠": DOUBLE_HINT_KEY,
};

const resultsMeta = {
  [CORRECT_KEY]: { label: "correct guess", suffix: "es" },
  [MISTAKE_KEY]: { label: "mistake" },
  [HINT_KEY]: { label: "hint" },
  [DOUBLE_HINT_KEY]: { label: "double hint" },
};

// To match:
// * "I solved the daily Clues by Sam, Nov 17th 2025 (Easy), in 02:50"
// * "I solved the daily Clues by Sam (Nov 14th 2025) in less than 17 minutes"
const PREAMBLE_REGEX = /^I solved the daily Clues by Sam.*/;

// To match, well:
// * "https://cluesbysam.com"
const LINK_REGEX = /https:\/\/cluesbysam.com/;

// To match the results as declared in cluesbysam:
// 🟩 means you correctly identified the person
// 🟨 means you made at least one mistake identifying the person
// 🟡 means you used a hint to identify the person
// 🟠 means you used a double hint to identify the person
// We match 8 as there are 4 per row, and the emojis count as two characters each
const RESULT_REGEX = /[🟩🟨🟡🟠]{8}/;

function pluralise(count, noun, suffix = "s") {
  return `${noun}${count !== 1 ? suffix : ""}`;
}

function parseResults(resultsTotals) {
  console.log(resultsTotals);

  if (resultsTotals[CORRECT_KEY] === 20) {
    return "Clean sweep! All correct with no mistakes or hints.";
  }

  let parsedString;

  [CORRECT_KEY, MISTAKE_KEY, HINT_KEY, DOUBLE_HINT_KEY].forEach((key) => {
    if (resultsTotals[key]) {
      parsedString += `; ${resultsTotals[key]} ${pluralise(
        resultsTotals[key],
        resultsMeta[key].label,
        resultsMeta[key].suffix
      )}`;
    }
  });

  return parsedString;
}

// Count one row into accumulator "resultTotals" (mutates accumulator).
function countResults(resultLine, resultTotals = {}) {
  for (const ch of resultLine) {
    const key = iconMap[ch];

    if (!key) continue;

    resultTotals[key] = (resultTotals[key] || 0) + 1;
  }

  return resultTotals;
}

const generateAltText = function (results) {
  let preamble,
    body,
    link,
    resultTotals = {
      correct: 0,
      mistake: 0,
      hint: 0,
      doubleHint: 0,
    };

  results.split("\n").forEach((resultLine) => {
    if (resultLine.match(PREAMBLE_REGEX)) {
      preamble = resultLine;
      return;
    }

    if (resultLine.match(LINK_REGEX)) {
      link = resultLine;
      return;
    }

    if (resultLine.match(RESULT_REGEX)) {
      countResults(resultLine, resultTotals);
      return;
    }

    alert("Failed to process line: ", resultLine);
  });

  body = parseResults(resultTotals);

  return { preamble, body, link };
};

const handleCopyButtonClick = async function () {
  const resultsInput = document.getElementById("results-input");

  if (!resultsInput) {
    return;
  }

  const { preamble, body, link } = generateAltText(resultsInput.value);

  await navigator.clipboard.writeText(`${preamble}\n${body}\n${link}`);
};

window.handleCopyButtonClick = handleCopyButtonClick;
