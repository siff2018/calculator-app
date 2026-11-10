"use strict";

const calculatorPanel = document.querySelector("#calculator-panel");
const keypad = document.querySelector(".keypad");
const display = document.querySelector("#result");
const expression = document.querySelector("#expression");
const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

let entry = "0";
let stored = null;
let operator = null;
let replaceEntry = true;
let calculation = "";

function render() {
  display.textContent = entry;
  expression.textContent = calculation;
}

function reset() {
  entry = "0";
  stored = null;
  operator = null;
  replaceEntry = true;
  calculation = "";
}

function evaluate() {
  const left = Number(stored);
  const right = Number(entry);
  calculation = `${stored} ${symbols[operator]} ${entry} =`;
  let result;

  switch (operator) {
    case "+": result = left + right; break;
    case "-": result = left - right; break;
    case "*": result = left * right; break;
    case "/": result = left / right; break;
  }

  if (operator === "/" && right === 0) {
    entry = "Cannot divide by zero";
  } else if (!Number.isFinite(result)) {
    entry = "Result out of range";
  } else {
    entry = String(Number(result.toPrecision(15)));
  }

  stored = null;
  operator = null;
  replaceEntry = true;
}

function handleKey(key) {
  if (key === "Escape") {
    reset();
  } else if (key === "Backspace" && !replaceEntry) {
    entry = entry.slice(0, -1) || "0";
  } else if (/^[0-9.]$/.test(key)) {
    if (replaceEntry) {
      entry = "0";
      replaceEntry = false;
      if (operator === null) calculation = "";
    }

    if (key === ".") {
      if (!entry.includes(".")) entry += ".";
    } else if (entry.replace(".", "").length < 15) {
      entry = entry === "0" ? key : entry + key;
    }
  } else if (Object.hasOwn(symbols, key)) {
    if (operator !== null && !replaceEntry) evaluate();
    if (Number.isFinite(Number(entry))) {
      stored = entry;
      operator = key;
      replaceEntry = true;
      calculation = `${stored} ${symbols[operator]}`;
    }
  } else if (key === "=" && operator !== null && !replaceEntry) {
    evaluate();
  }

  render();
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-key]");
  if (button) handleKey(button.dataset.key);
});

document.addEventListener("keydown", (event) => {
  if (calculatorPanel.hidden || event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented) return;
  if (event.key === "Enter" && event.target instanceof HTMLButtonElement) return;

  const key = event.key === "Enter" ? "=" : event.key;
  if (!/^[0-9.+*/=-]$/.test(key) && key !== "Backspace" && key !== "Escape") return;

  event.preventDefault();
  handleKey(key);
});

const tabs = [...document.querySelectorAll('[role="tab"]')];

function selectTab(selectedTab) {
  for (const tab of tabs) {
    const selected = tab === selectedTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    const targets = {
      ArrowLeft: (index + tabs.length - 1) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1
    };
    if (!Object.hasOwn(targets, event.key)) return;

    event.preventDefault();
    const nextTab = tabs[targets[event.key]];
    selectTab(nextTab);
    nextTab.focus();
  });
});

const category = document.querySelector("#category");
const amount = document.querySelector("#amount");
const fromUnit = document.querySelector("#from-unit");
const toUnit = document.querySelector("#to-unit");
const conversionResult = document.querySelector("#conversion-result");

function updateConversion() {
  const value = amount.valueAsNumber;
  if (!Number.isFinite(value)) {
    conversionResult.textContent = amount.validity.badInput ? "Enter a valid number" : "—";
    return;
  }

  const result = convert(value, category.value, fromUnit.value, toUnit.value);
  const unit = units[category.value].find(({ id }) => id === toUnit.value);
  conversionResult.textContent = Number.isFinite(result)
    ? `${Number(result.toPrecision(12))} ${unit.symbol ?? unit.id}`
    : "Result out of range";
}

function updateUnitOptions() {
  for (const select of [fromUnit, toUnit]) {
    const options = units[category.value].map((unit) => new Option(unit.label, unit.id));
    select.replaceChildren(...options);
  }
  toUnit.selectedIndex = 1;
  updateConversion();
}

category.addEventListener("change", updateUnitOptions);
amount.addEventListener("input", updateConversion);
fromUnit.addEventListener("change", updateConversion);
toUnit.addEventListener("change", updateConversion);
document.querySelector("#swap-units").addEventListener("click", () => {
  [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];
  updateConversion();
});

updateUnitOptions();
