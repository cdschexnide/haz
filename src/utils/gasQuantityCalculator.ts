import convert from "convert-units";

interface CalculateGasQuantityInput {
  psi: number;
  radius: number;
  height: number;
  specificGravity?: number;
  molecularWeight?: number;
}

export interface CalculateGasQuantityOutput {
  lbs: number;
  kgs: number;
}

export function calculateGasQuantity(
  input: CalculateGasQuantityInput
): CalculateGasQuantityOutput {
  const { psi, radius, height, specificGravity, molecularWeight } = input;

  // Validate inputs
  const inputs = [psi, radius, height];
  const hasSG = typeof specificGravity === "number" && !isNaN(specificGravity);
  const hasMW = typeof molecularWeight === "number" && !isNaN(molecularWeight);

  if (inputs.some(v => isNaN(v) || v <= 0) || (!hasSG && !hasMW)) {
    throw new Error(
      "All dimensions must be positive numbers. Provide either specific gravity or molecular weight."
    );
  }

  const volumeCubicFeet = (Math.PI * Math.pow(radius, 2) * height) / 1728;
  let gasLbs: number;

  if (hasSG) {
    gasLbs = 0.00512 * psi * volumeCubicFeet * specificGravity!;
  } else {
    gasLbs = 0.0001744 * psi * volumeCubicFeet * molecularWeight!;
  }

  const gasKgs = convert(gasLbs).from("lb").to("kg");

  return {
    lbs: parseFloat(gasLbs.toFixed(2)),
    kgs: parseFloat(gasKgs.toFixed(2)),
  };
}

/** EXAMPLE 1 **/
// A26.5.1.1. Example 1. Tank measurements:
// Height: 50 inches
// Diameter: 9 inches
// Radius: 4.5 inches
// Tank contents: CO2
// Internal Pressure: 900 psi
// Tank Volume = 1.841 Ft3
// P (pounds of gas) = 0.00512 x A x B x C = {0.00512 in2
// /Ft3
// } x {900 psi} x {1.841 Ft3
// } x
// {1.516}
// Answer: P = 12.9 pounds

// const example1Input: CalculateGasQuantityInput = {
//   psi: 900,
//   radius: 4.5, // in
//   height: 50, // in
//   specificGravity: 1.516,
// };

// const example1 = calculateGasQuantity(example1Input);
// console.log("Example 1");
// console.log("Input: ", example1Input);
// console.log("Output: ", example1);
// console.log("\n");

/** EXAMPLE 2 **/
// A26.5.1.2. Example 2. Tank measurements:
// Height: 40 inches
// Diameter: 12 inches
// Radius = 6 inches
// Tank contents: C2H2
// Internal Pressure: 500 psi
// Tank Volume = 2.618 Ft3
// P (pounds of gas) = 0.00512 x A x B x C = {0.00512 in2
// /Ft3
// } x {500 psi} x {2.618 Ft3
// } x
// {0.897}
// Answer: P = 6.01 pounds

// const example2Input: CalculateGasQuantityInput = {
//   psi: 500,
//   radius: 6, // in
//   height: 40, // in
//   specificGravity: 0.897,
// };

// const example2 = calculateGasQuantity(example2Input);
// console.log("Example 2");
// console.log("Input: ", example2Input);
// console.log("Output: ", example2);
// console.log("\n");

/** EXAMPLE 3 **/
// A26.5.1.3. Example 3. Tank measurements:
// Height: 50 inches
// Diameter: 9 inches
// Radius = 4.5 inches
// Tank contents: CO2
// Internal Pressure: 900 psi
// Tank Volume = 1.841 Ft3
// P = 0.0001744 x A x B x M = 0.0001744 x (900 psi) x (1.841 Ft3
// ) x (44.00)
// Answer: P = 12.7 pounds

// const example3Input: CalculateGasQuantityInput = {
//   psi: 900,
//   radius: 4.5, // in
//   height: 50, // in
//   molecularWeight: 44,
// };

// const example3 = calculateGasQuantity(example3Input);
// console.log("Example 3");
// console.log("Input: ", example3Input);
// console.log("Output: ", example3);
// console.log("\n");

/** EXAMPLE 4 **/
// A26.5.1.4. Example 4. Tank measurements:
// Height: 40 inches
// Diameter: 12 inches
// Radius = 6 inches
// Tank contents: C2H2
// Internal Pressure: 500 psi
// Tank Volume = 2.618 Ft3
// P = 0.0001744 x A x B x C = 0.0001744 x (500 psi) x (2.618 Ft3
// ) x (26.00)
// Answer: P = 5.94 pounds

// const example4Input: CalculateGasQuantityInput = {
//   psi: 500,
//   radius: 6, // in
//   height: 40, // in
//   molecularWeight: 26.0,
// };

// const example4 = calculateGasQuantity(example4Input); // outputs: 27.34lbs (12.40kg)
// console.log("Example 4");
// console.log("Input: ", example4Input);
// console.log("Output: ", example4);
// console.log("\n");

/** EXAMPLE 5 **/
// example used in youtube video
// user did the following:
// 1. selected Nitrous Oxide
// 2. entered 3200psi
// 3. entered 5in radius
// 4. entered 24in height
// 5. clicked "Calculate" which outputted 26.78lbs (12.14kg)
// const example5Input: CalculateGasQuantityInput = {
//   psi: 3200,
//   radius: 5, // in
//   height: 24, // in
//   specificGravity: 1.53,
// };

// const example5 = calculateGasQuantity(example5Input); // outputs: 27.34lbs (12.40kg)
// console.log("Example 5");
// console.log("Input: ", example5Input);
// console.log("Output: ", example5);
// console.log("\n");
