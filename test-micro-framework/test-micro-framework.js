export function it(description, body_of_test) {
  const result = document.createElement("p");
  result.classList.add("test-result");

  try {
    body_of_test();
    result.classList.add("success");
    result.innerHTML = `<strong>${description}</strong>`;
  } catch (error) {
    result.classList.add("failure");
    result.innerHTML = `<strong>${description}</strong><br/><pre>${error}</pre>`;
  }

  document.body.appendChild(result);
}

function isObject(x) {
  return typeof x === "object" && x !== null;
}

function shallowEqual(x, y) {
  // Top-level match
  if (x === y) return true;

  // Guard clause; exit if either a or b is not an object, or is null
  if (!isObject(x) || !isObject(y)) return false;

  // Shallow compare objects by checking keys & values
  const aKeys = Object.keys(x);
  const bKeys = Object.keys(y);
  if (aKeys.length !== bKeys.length) return false;

  return aKeys.every(
    (k) => Object.prototype.hasOwnProperty.call(y, k) && x[k] === y[k]
  );
}

export function assertEqual(x, y) {
  if (shallowEqual(x, y)) {
    return;
  } else {
    throw new Error(`${JSON.stringify(x)} != ${JSON.stringify(y)}`);
  }
}

export function assertTrue(x) {
  assertEqual(x, true);
}

export function assertFalse(x) {
  assertEqual(x, false);
}
