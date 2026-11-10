"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { convert, units } = require("./converter.js");

const cases = {
  length: [
    ["km", "m", 1, 1000],
    ["km", "mi", 1.609344, 1],
    ["m", "mi", 1609.344, 1]
  ],
  weight: [
    ["kg", "g", 1, 1000],
    ["kg", "lb", 0.45359237, 1],
    ["g", "lb", 453.59237, 1]
  ],
  temperature: [
    ["C", "F", 0, 32],
    ["C", "K", -273.15, 0],
    ["F", "K", 32, 273.15],
    ["F", "C", -40, -40],
    ["K", "F", 373.15, 212]
  ]
};

for (const [category, conversions] of Object.entries(cases)) {
  for (const [from, to, value, expected] of conversions) {
    test(`${category}: ${value} ${from} and ${expected} ${to} convert both ways`, () => {
      assert.ok(Math.abs(convert(value, category, from, to) - expected) < 1e-10);
      assert.ok(Math.abs(convert(expected, category, to, from) - value) < 1e-10);
    });
  }

  for (const { id } of units[category]) {
    test(`${category}: converting ${id} to itself preserves the input`, () => {
      assert.equal(convert(12.345, category, id, id), 12.345);
    });
  }
}

test("preserves very small nonzero results", () => {
  const result = convert(1e-20, "length", "km", "m");
  assert.ok(Math.abs(result / 1e-17 - 1) < 1e-12);
});
