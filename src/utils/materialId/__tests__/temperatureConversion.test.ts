import {
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  parseTemperatureInput,
} from '../temperatureConversion';

describe('temperatureConversion', () => {
  describe('fahrenheitToCelsius', () => {
    it('converts 32°F to 0°C', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
    });

    it('converts 212°F to 100°C', () => {
      expect(fahrenheitToCelsius(212)).toBe(100);
    });

    it('converts -40°F to -40°C', () => {
      expect(fahrenheitToCelsius(-40)).toBe(-40);
    });
  });

  describe('celsiusToFahrenheit', () => {
    it('converts 0°C to 32°F', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);
    });

    it('converts 100°C to 212°F', () => {
      expect(celsiusToFahrenheit(100)).toBe(212);
    });
  });

  describe('parseTemperatureInput', () => {
    it('parses Fahrenheit input and converts to both units', () => {
      const result = parseTemperatureInput('212', 'F');
      expect(result.fahrenheit).toBe(212);
      expect(result.celsius).toBe(100);
    });

    it('parses Celsius input and converts to both units', () => {
      const result = parseTemperatureInput('100', 'C');
      expect(result.celsius).toBe(100);
      expect(result.fahrenheit).toBe(212);
    });
  });
});
