export function it(description, body_of_test) {
  const result = document.createElement("p");
  result.classList.add("test-result");

  try {
    body_of_test();
    result.classList.add("success");
    result.innerHTML = description;
  } catch (error) {
    result.classList.add("failure");
    result.innerHTML = `${description}<br/><pre>${error}</pre>`;
  }

  document.body.appendChild(result);
}

export function assertEqual(x, y) {
  if (
    x === y ||
    (typeof x === "object" &&
      typeof y === "object" &&
      x.length === y.length &&
      x.every((element, index) => element === y[index]))
  ) {
    return;
  } else {
    throw new Error(`${x} != ${y}`);
  }
}

export function assertTrue(x) {
  assertEqual(x, true);
}

export function assertFalse(x) {
  assertEqual(x, false);
}
