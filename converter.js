"use strict";

const units = {
  length: [
    { id: "km", label: "Kilometers", factor: 1000 },
    { id: "m", label: "Meters", factor: 1 },
    { id: "mi", label: "Miles", factor: 1609.344 }
  ],
  weight: [
    { id: "kg", label: "Kilograms", factor: 1 },
    { id: "g", label: "Grams", factor: 0.001 },
    { id: "lb", label: "Pounds", factor: 0.45359237 }
  ],
  temperature: [
    { id: "C", label: "Celsius", symbol: "°C" },
    { id: "F", label: "Fahrenheit", symbol: "°F" },
    { id: "K", label: "Kelvin", symbol: "K" }
  ]
};

function convert(value, category, from, to) {
  if (from === to) return value;

  if (category === "temperature") {
    if (from === "F") {
      const celsius = (value - 32) / 1.8;
      return to === "K" ? celsius + 273.15 : celsius;
    }

    const celsius = from === "K" ? value - 273.15 : value;
    return to === "F" ? celsius * 1.8 + 32 : celsius + (to === "K" ? 273.15 : 0);
  }

  const fromFactor = units[category].find((unit) => unit.id === from).factor;
  const toFactor = units[category].find((unit) => unit.id === to).factor;
  return value * (fromFactor / toFactor);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { convert, units };
}
