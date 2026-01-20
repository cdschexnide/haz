/**
 * Temperature conversion utilities for hazmat material handling.
 * Used by specialty screens that require temperature specifications.
 */

export const fahrenheitToCelsius = (f: number): number => {
  return ((f - 32) * 5) / 9;
};

export const celsiusToFahrenheit = (c: number): number => {
  return (c * 9) / 5 + 32;
};

export interface TemperatureResult {
  fahrenheit: number;
  celsius: number;
}

export const parseTemperatureInput = (
  value: string,
  unit: 'F' | 'C'
): TemperatureResult => {
  const num = parseFloat(value);
  if (unit === 'F') {
    return { fahrenheit: num, celsius: fahrenheitToCelsius(num) };
  }
  return { fahrenheit: celsiusToFahrenheit(num), celsius: num };
};
