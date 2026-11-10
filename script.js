"use strict";

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
  if (event.ctrlKey || event.metaKey || event.altKey || event.defaultPrevented) return;
  if (event.key === "Enter" && event.target instanceof HTMLButtonElement) return;

  const key = event.key === "Enter" ? "=" : event.key;
  if (!/^[0-9.+*/=-]$/.test(key) && key !== "Backspace" && key !== "Escape") return;

  event.preventDefault();
  handleKey(key);
});
