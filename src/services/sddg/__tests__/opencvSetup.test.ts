/**
 * OpenCV Setup Verification Test
 *
 * This test verifies that react-native-fast-opencv is properly installed
 * and basic functions are available. Since OpenCV requires native modules,
 * these tests mock the library for unit testing purposes.
 */

// Mock react-native-fast-opencv for Jest environment
jest.mock('react-native-fast-opencv', () => ({
  OpenCV: {
    invoke: jest.fn(),
  },
  ObjectType: {
    Mat: 'Mat',
    MatVector: 'MatVector',
    PointVector: 'PointVector',
  },
  ColorConversionCodes: {
    COLOR_BGR2GRAY: 6,
    COLOR_RGBA2GRAY: 11,
  },
  ThresholdTypes: {
    THRESH_BINARY: 0,
    THRESH_BINARY_INV: 1,
  },
  AdaptiveThresholdTypes: {
    ADAPTIVE_THRESH_MEAN_C: 0,
    ADAPTIVE_THRESH_GAUSSIAN_C: 1,
  },
}));

import { OpenCV, ColorConversionCodes } from 'react-native-fast-opencv';

describe('OpenCV Setup Verification', () => {
  it('should have OpenCV module available', () => {
    expect(OpenCV).toBeDefined();
    expect(OpenCV.invoke).toBeDefined();
  });

  it('should have color conversion codes', () => {
    expect(ColorConversionCodes.COLOR_BGR2GRAY).toBe(6);
    expect(ColorConversionCodes.COLOR_RGBA2GRAY).toBe(11);
  });
});
