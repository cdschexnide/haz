// src/components/ui/__tests__/KeyValueRow.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { KeyValueRow } from '../KeyValueRow';

describe('KeyValueRow', () => {
  it('renders label and string value', () => {
    const { getByText } = render(
      <KeyValueRow label="Name" value="John Doe" />
    );
    expect(getByText('Name')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
  });

  it('renders label with ReactNode value', () => {
    const { getByText } = render(
      <KeyValueRow
        label="Custom"
        value={<Text testID="custom-node">Custom Content</Text>}
      />
    );
    expect(getByText('Custom')).toBeTruthy();
    expect(getByText('Custom Content')).toBeTruthy();
  });

  it('returns null when value is undefined', () => {
    const { toJSON } = render(<KeyValueRow label="Empty" value={undefined} />);
    expect(toJSON()).toBeNull();
  });

  it('returns null when value is empty string', () => {
    const { toJSON } = render(<KeyValueRow label="Empty" value="" />);
    expect(toJSON()).toBeNull();
  });

  it('applies bold style when valueStyle is bold', () => {
    const { getByText } = render(
      <KeyValueRow label="Bold Label" value="Bold Value" valueStyle="bold" />
    );
    const valueElement = getByText('Bold Value');
    // Flatten style array to check for fontWeight
    const flatStyle = Array.isArray(valueElement.props.style)
      ? Object.assign({}, ...valueElement.props.style.filter(Boolean))
      : valueElement.props.style;
    expect(flatStyle.fontWeight).toBe('600');
  });

  it('applies accent style when valueStyle is accent', () => {
    const { getByTestId } = render(
      <KeyValueRow label="Accent Label" value="Accent Value" valueStyle="accent" />
    );
    const container = getByTestId('key-value-row');
    // Check that accent styling is applied (left border)
    const flatStyle = Array.isArray(container.props.style)
      ? Object.assign({}, ...container.props.style)
      : container.props.style;
    expect(flatStyle.borderLeftWidth).toBe(3);
  });

  it('renders with default style when no valueStyle is specified', () => {
    const { getByText } = render(
      <KeyValueRow label="Default Label" value="Default Value" />
    );
    const valueElement = getByText('Default Value');
    // Flatten style array to check for fontWeight
    const flatStyle = Array.isArray(valueElement.props.style)
      ? Object.assign({}, ...valueElement.props.style.filter(Boolean))
      : valueElement.props.style;
    expect(flatStyle.fontWeight).toBe('400');
  });
});
