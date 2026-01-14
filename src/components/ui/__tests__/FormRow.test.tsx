// src/components/ui/__tests__/FormRow.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { FormRow } from '../FormRow';

describe('FormRow', () => {
  it('renders children in a row', () => {
    const { getByText } = render(
      <FormRow>
        <Text>Field 1</Text>
        <Text>Field 2</Text>
      </FormRow>
    );
    expect(getByText('Field 1')).toBeTruthy();
    expect(getByText('Field 2')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(
      <FormRow>
        <Text>Field 1</Text>
        <Text>Field 2</Text>
      </FormRow>
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
