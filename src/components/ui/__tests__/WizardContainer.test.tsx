// src/components/ui/__tests__/WizardContainer.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WizardContainer } from '../WizardContainer';
import { Text } from 'react-native';

describe('WizardContainer', () => {
  const defaultProps = {
    title: 'Test Wizard',
    steps: ['Step 1', 'Step 2', 'Step 3'],
    currentStep: 0,
    onNext: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and step indicator', () => {
    const { getByText } = render(
      <WizardContainer {...defaultProps}>
        <Text>Content</Text>
      </WizardContainer>
    );
    expect(getByText('Test Wizard')).toBeTruthy();
    expect(getByText('Step 1 of 3')).toBeTruthy();
  });

  it('renders children content', () => {
    const { getByText } = render(
      <WizardContainer {...defaultProps}>
        <Text>Test Content</Text>
      </WizardContainer>
    );
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('calls onNext when Next button pressed', () => {
    const onNext = jest.fn();
    const { getByText } = render(
      <WizardContainer {...defaultProps} onNext={onNext}>
        <Text>Content</Text>
      </WizardContainer>
    );
    fireEvent.press(getByText('Next'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('shows Finish on last step', () => {
    const { getByText } = render(
      <WizardContainer {...defaultProps} currentStep={2}>
        <Text>Content</Text>
      </WizardContainer>
    );
    expect(getByText('Finish')).toBeTruthy();
  });

  it('hides Back button when onBack is undefined', () => {
    const { queryByText } = render(
      <WizardContainer {...defaultProps}>
        <Text>Content</Text>
      </WizardContainer>
    );
    expect(queryByText('Back')).toBeNull();
  });

  it('shows Back button when onBack is provided', () => {
    const onBack = jest.fn();
    const { getByText } = render(
      <WizardContainer {...defaultProps} onBack={onBack}>
        <Text>Content</Text>
      </WizardContainer>
    );
    expect(getByText('Back')).toBeTruthy();
    fireEvent.press(getByText('Back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('shows Save & Exit button when onSaveExit is provided', () => {
    const onSaveExit = jest.fn();
    const { getByText } = render(
      <WizardContainer {...defaultProps} onSaveExit={onSaveExit}>
        <Text>Content</Text>
      </WizardContainer>
    );
    expect(getByText('Save & Exit')).toBeTruthy();
    fireEvent.press(getByText('Save & Exit'));
    expect(onSaveExit).toHaveBeenCalledTimes(1);
  });

  it('disables Next button when nextDisabled is true', () => {
    const onNext = jest.fn();
    const { getByText } = render(
      <WizardContainer {...defaultProps} onNext={onNext} nextDisabled>
        <Text>Content</Text>
      </WizardContainer>
    );
    fireEvent.press(getByText('Next'));
    expect(onNext).not.toHaveBeenCalled();
  });

  it('uses custom nextLabel when provided', () => {
    const { getByText } = render(
      <WizardContainer {...defaultProps} nextLabel="Continue">
        <Text>Content</Text>
      </WizardContainer>
    );
    expect(getByText('Continue')).toBeTruthy();
  });
});
