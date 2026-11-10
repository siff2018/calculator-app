# Calculator

A responsive calculator built with HTML, CSS, and JavaScript. It runs entirely in the browser and has no dependencies.

## Version 1.2

The Unit Converter tab supports:

- **Length** — kilometers, meters, and miles
- **Weight** — kilograms, grams, and pounds
- **Temperature** — Celsius, Fahrenheit, and Kelvin

Choose a category and enter a number, then select the source and destination units. The result updates as you type or change units. **Swap units** reverses the conversion direction and keeps the entered value. Switch back to the Calculator tab to resume your calculation.

## Getting started

Open `index.html` in a modern browser. You can use the calculator offline.

## Controls

- Add, subtract, multiply, or divide using the keypad or the keyboard keys `+`, `-`, `*`, and `/`.
- Use `=` to calculate. Enter also calculates when focus is outside the keypad. When a button has focus, Enter or Space activates that button.
- Use the decimal point for fractional input, Backspace to delete a digit during entry, and Escape or **AC** to clear.
- Operations chain from left to right. For example, `2 + 3 × 4 =` produces `20`.
- After a result, enter a digit to start over or choose an operator to continue with that result.

## Tests

Run the automated conversion tests with Node.js 18 or later:

```sh
node --test
```

## Files

- `index.html` contains the display and keypad.
- `style.css` controls the layout, colors, and responsive styling.
- `script.js` handles the tabs, calculator, and converter controls.
- `converter.js` defines the units and conversion formulas.
- `converter.test.js` tests the formulas in both directions and checks same-unit conversions.
