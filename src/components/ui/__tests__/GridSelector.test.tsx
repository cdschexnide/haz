// src/components/ui/__tests__/GridSelector.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { GridSelector } from '../GridSelector';

describe('GridSelector', () => {
  const mockOptions = [
    { id: '1', label: 'Option 1', icon: <Text>Icon1</Text>, onPress: jest.fn() },
    { id: '2', label: 'Option 2', icon: <Text>Icon2</Text>, onPress: jest.fn() },
    { id: '3', label: 'Option 3', icon: <Text>Icon3</Text>, onPress: jest.fn() },
    { id: '4', label: 'Option 4', icon: <Text>Icon4</Text>, onPress: jest.fn() },
  ];

  beforeEach(() => {
    mockOptions.forEach(opt => (opt.onPress as jest.Mock).mockClear());
  });

  it('renders all options with labels', () => {
    const { getByText } = render(<GridSelector options={mockOptions} />);
    expect(getByText('Option 1')).toBeTruthy();
    expect(getByText('Option 2')).toBeTruthy();
    expect(getByText('Option 3')).toBeTruthy();
    expect(getByText('Option 4')).toBeTruthy();
  });

  it('renders icons for each option', () => {
    const { getByText } = render(<GridSelector options={mockOptions} />);
    expect(getByText('Icon1')).toBeTruthy();
    expect(getByText('Icon2')).toBeTruthy();
  });

  it('calls onPress when option is pressed', () => {
    const { getByText } = render(<GridSelector options={mockOptions} />);
    fireEvent.press(getByText('Option 1'));
    expect(mockOptions[0].onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled option is pressed', () => {
    const disabledOptions = [
      { ...mockOptions[0], disabled: true },
      mockOptions[1],
    ];
    const { getByText } = render(<GridSelector options={disabledOptions} />);
    fireEvent.press(getByText('Option 1'));
    expect(disabledOptions[0].onPress).not.toHaveBeenCalled();
  });

  it('renders banner when provided', () => {
    const banner = {
      id: 'banner',
      label: 'Banner Label',
      icon: <Text>BannerIcon</Text>,
      onPress: jest.fn(),
    };
    const { getByText } = render(
      <GridSelector options={mockOptions} banner={banner} />
    );
    expect(getByText('Banner Label')).toBeTruthy();
    expect(getByText('BannerIcon')).toBeTruthy();
  });

  it('calls banner onPress when banner is pressed', () => {
    const banner = {
      id: 'banner',
      label: 'Banner Label',
      icon: <Text>BannerIcon</Text>,
      onPress: jest.fn(),
    };
    const { getByText } = render(
      <GridSelector options={mockOptions} banner={banner} />
    );
    fireEvent.press(getByText('Banner Label'));
    expect(banner.onPress).toHaveBeenCalledTimes(1);
  });

  it('applies disabled styling to disabled options', () => {
    const disabledOptions = [{ ...mockOptions[0], disabled: true }];
    const { getByTestId } = render(<GridSelector options={disabledOptions} />);
    const option = getByTestId('grid-option-1');
    expect(option.props.accessibilityState.disabled).toBe(true);
  });
});
