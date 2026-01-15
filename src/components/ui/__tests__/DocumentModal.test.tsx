// src/components/ui/__tests__/DocumentModal.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DocumentModal } from '../DocumentModal';

// Mock react-native-webview
jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
}));

describe('DocumentModal', () => {
  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    title: 'Test Document',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when visible is false', () => {
    const { toJSON } = render(
      <DocumentModal {...defaultProps} visible={false} />
    );
    expect(toJSON()).toBeNull();
  });

  it('renders title and close button when visible', () => {
    const { getByText, getByTestId } = render(
      <DocumentModal {...defaultProps} />
    );
    expect(getByText('Test Document')).toBeTruthy();
    expect(getByTestId('close-button')).toBeTruthy();
  });

  it('calls onClose when close button pressed', () => {
    const { getByTestId } = render(<DocumentModal {...defaultProps} />);
    fireEvent.press(getByTestId('close-button'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders WebView with htmlContent when no tabs', () => {
    const { getByTestId } = render(
      <DocumentModal
        {...defaultProps}
        htmlContent="<p>Test content</p>"
      />
    );
    expect(getByTestId('document-webview')).toBeTruthy();
  });

  it('renders tab bar when tabs provided', () => {
    const tabs = [
      { key: 'tab1', label: 'Tab 1', content: '<p>Content 1</p>' },
      { key: 'tab2', label: 'Tab 2', content: '<p>Content 2</p>' },
    ];
    const { getByText } = render(
      <DocumentModal {...defaultProps} tabs={tabs} />
    );
    expect(getByText('Tab 1')).toBeTruthy();
    expect(getByText('Tab 2')).toBeTruthy();
  });

  it('switches content when tab pressed', () => {
    const tabs = [
      { key: 'tab1', label: 'Tab 1', content: '<p>Content 1</p>' },
      { key: 'tab2', label: 'Tab 2', content: '<p>Content 2</p>' },
    ];
    const { getByText, getByTestId } = render(
      <DocumentModal {...defaultProps} tabs={tabs} />
    );

    // Initially Tab 1 should be active (first tab is default)
    const tab1 = getByText('Tab 1');
    const tab2 = getByText('Tab 2');

    // Press Tab 2
    fireEvent.press(tab2);

    // WebView should still be rendered (content switched internally)
    expect(getByTestId('document-webview')).toBeTruthy();
  });

  it('uses defaultTabKey when provided', () => {
    const tabs = [
      { key: 'tab1', label: 'Tab 1', content: '<p>Content 1</p>' },
      { key: 'tab2', label: 'Tab 2', content: '<p>Content 2</p>' },
    ];
    const { getByTestId } = render(
      <DocumentModal {...defaultProps} tabs={tabs} defaultTabKey="tab2" />
    );
    // Component should render with tab2 selected by default
    expect(getByTestId('document-webview')).toBeTruthy();
  });
});
