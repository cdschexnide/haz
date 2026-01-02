/**
 * @file DisclaimerScreen.test.tsx
 * @description Snapshot test for the DisclaimerScreen component.
 *
 * This is a proof-of-concept test demonstrating the snapshot testing
 * infrastructure. It captures the rendered output of the component
 * to detect unintended visual changes during refactoring.
 *
 * This test follows the pattern that should be used for all components
 * before they are modified in Phase 5 (Component Migration).
 */
import React from 'react';
import { render } from '@testing-library/react-native';

// Mock the useHazProStore hook
jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => ({
    state: {
      hazProPreparerContext: {
        activePersona: 'Preparer',
      },
    },
  }),
}));

// Import component after mocks are set up
import DisclaimerScreen from '../DisclaimerScreen';

describe('DisclaimerScreen', () => {
  // Create mock navigation
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatch: jest.fn(),
  };

  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  it('renders correctly for Preparer persona', () => {
    const { toJSON } = render(
      <DisclaimerScreen navigation={mockNavigation} />
    );

    // Capture the snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the disclaimer title', () => {
    const { getByText } = render(
      <DisclaimerScreen navigation={mockNavigation} />
    );

    expect(getByText('Important Disclaimer')).toBeTruthy();
  });

  it('renders Accept and Decline buttons', () => {
    const { getByText } = render(
      <DisclaimerScreen navigation={mockNavigation} />
    );

    expect(getByText('Accept')).toBeTruthy();
    expect(getByText('Decline')).toBeTruthy();
  });

  it('renders the main disclaimer text about HazPro being a support tool', () => {
    const { getByText } = render(
      <DisclaimerScreen navigation={mockNavigation} />
    );

    // Check for part of the disclaimer text
    expect(
      getByText(/HazPro is a support tool designed to assist/)
    ).toBeTruthy();
  });
});
