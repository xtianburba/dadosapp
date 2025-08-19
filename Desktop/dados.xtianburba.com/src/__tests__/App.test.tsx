import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

describe('Example test', () => {
  it('renders a component', () => {
    const { getByText } = render(React.createElement(Text, null, 'Testing works!'));
    expect(getByText('Testing works!')).toBeTruthy();
  });
});
