// src/components/preparer/__tests__/ToolButtonsBar.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ToolButtonsBar, ToolButtonConfig } from '../ToolButtonsBar';

const mockTools: ToolButtonConfig[] = [
  { icon: 'calculate', label: 'Gas Calculator', onPress: jest.fn() },
  { icon: 'ac-unit', label: 'Dry Ice', onPress: jest.fn() },
  { icon: 'swap-horiz', label: 'Unit Converter', onPress: jest.fn(), disabled: true },
];

describe('ToolButtonsBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all tool buttons', () => {
    const { getByText } = render(<ToolButtonsBar tools={mockTools} />);
    expect(getByText('Gas Calculator')).toBeTruthy();
    expect(getByText('Dry Ice')).toBeTruthy();
    expect(getByText('Unit Converter')).toBeTruthy();
  });

  it('calls onPress when tool button is pressed', () => {
    const { getByText } = render(<ToolButtonsBar tools={mockTools} />);
    fireEvent.press(getByText('Gas Calculator'));
    expect(mockTools[0].onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress for disabled tool', () => {
    const { getByText } = render(<ToolButtonsBar tools={mockTools} />);
    fireEvent.press(getByText('Unit Converter'));
    expect(mockTools[2].onPress).not.toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<ToolButtonsBar tools={mockTools} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
