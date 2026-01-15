// src/components/ui/__tests__/LoadingOverlay.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingOverlay } from '../LoadingOverlay';

describe('LoadingOverlay', () => {
  it('returns null when visible is false', () => {
    const { toJSON } = render(<LoadingOverlay visible={false} />);
    expect(toJSON()).toBeNull();
  });

  it('renders overlay with spinner when visible is true', () => {
    const { getByTestId } = render(<LoadingOverlay visible={true} />);
    expect(getByTestId('loading-overlay')).toBeTruthy();
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });

  it('renders message when provided', () => {
    const { getByText } = render(
      <LoadingOverlay visible={true} message="Loading data..." />
    );
    expect(getByText('Loading data...')).toBeTruthy();
  });

  it('does not render message when not provided', () => {
    const { queryByTestId } = render(<LoadingOverlay visible={true} />);
    expect(queryByTestId('loading-message')).toBeNull();
  });
});
