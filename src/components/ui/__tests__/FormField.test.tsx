// src/components/ui/__tests__/FormField.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { FormField } from '../FormField';

describe('FormField', () => {
  it('renders label correctly', () => {
    const { getByText } = render(
      <FormField label="Test Label">
        <Text>Child content</Text>
      </FormField>
    );
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders required asterisk when required prop is true', () => {
    const { getByText } = render(
      <FormField label="Test Label" required>
        <Text>Child content</Text>
      </FormField>
    );
    expect(getByText('*')).toBeTruthy();
  });

  it('renders error message when error prop is provided', () => {
    const { getByText } = render(
      <FormField label="Test Label" error={{ message: 'This field is required' }}>
        <Text>Child content</Text>
      </FormField>
    );
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('renders children correctly', () => {
    const { getByText } = render(
      <FormField label="Test Label">
        <Text>Child content</Text>
      </FormField>
    );
    expect(getByText('Child content')).toBeTruthy();
  });
});
