// src/components/preparer/__tests__/SignatureSection.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SignatureSection } from '../SignatureSection';

// Mock SignatureModal
jest.mock('@/components/SignatureModal', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, Modal } = require('react-native');
  return {
    __esModule: true,
    default: ({ visible, onClose, onConfirm }: {
      visible: boolean;
      onClose: () => void;
      onConfirm: (signature: string) => void;
    }) => {
      if (!visible) return null;
      return (
        <Modal visible={visible} testID="signature-modal">
          <View>
            <Text>Sign Below</Text>
            <TouchableOpacity
              testID="modal-submit"
              onPress={() => onConfirm('data:image/png;base64,mockSignature')}
            >
              <Text>Submit Signature</Text>
            </TouchableOpacity>
            <TouchableOpacity testID="modal-cancel" onPress={onClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      );
    },
  };
});

describe('SignatureSection', () => {
  const mockOnSignatureCapture = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders placeholder when no signature', () => {
    const { getByText } = render(
      <SignatureSection onSignatureCapture={mockOnSignatureCapture} />
    );
    expect(getByText('Tap to sign')).toBeTruthy();
  });

  it('renders custom placeholder text when provided', () => {
    const { getByText } = render(
      <SignatureSection
        onSignatureCapture={mockOnSignatureCapture}
        placeholder="Click here to sign"
      />
    );
    expect(getByText('Click here to sign')).toBeTruthy();
  });

  it('renders label when provided', () => {
    const { getByText } = render(
      <SignatureSection
        onSignatureCapture={mockOnSignatureCapture}
        label="Signature"
      />
    );
    expect(getByText('Signature')).toBeTruthy();
  });

  it('renders signature image when signatureDataUrl provided', () => {
    const signatureUrl = 'data:image/png;base64,testSignature123';
    const { getByTestId, queryByText } = render(
      <SignatureSection
        signatureDataUrl={signatureUrl}
        onSignatureCapture={mockOnSignatureCapture}
      />
    );
    const image = getByTestId('signature-image');
    expect(image.props.source.uri).toBe(signatureUrl);
    // Placeholder should not be visible
    expect(queryByText('Tap to sign')).toBeNull();
  });

  it('opens modal on press', () => {
    const { getByTestId, queryByTestId } = render(
      <SignatureSection onSignatureCapture={mockOnSignatureCapture} />
    );
    // Modal should not be visible initially
    expect(queryByTestId('signature-modal')).toBeNull();

    // Press the signature area
    fireEvent.press(getByTestId('signature-pressable'));

    // Modal should now be visible
    expect(getByTestId('signature-modal')).toBeTruthy();
  });

  it('calls onSignatureCapture when signature captured', () => {
    const { getByTestId } = render(
      <SignatureSection onSignatureCapture={mockOnSignatureCapture} />
    );

    // Open the modal
    fireEvent.press(getByTestId('signature-pressable'));

    // Submit signature via modal
    fireEvent.press(getByTestId('modal-submit'));

    // Should call onSignatureCapture with the signature data URL
    expect(mockOnSignatureCapture).toHaveBeenCalledTimes(1);
    expect(mockOnSignatureCapture).toHaveBeenCalledWith(
      'data:image/png;base64,mockSignature'
    );
  });

  it('closes modal without capturing when cancelled', () => {
    const { getByTestId, queryByTestId } = render(
      <SignatureSection onSignatureCapture={mockOnSignatureCapture} />
    );

    // Open the modal
    fireEvent.press(getByTestId('signature-pressable'));
    expect(getByTestId('signature-modal')).toBeTruthy();

    // Cancel the modal
    fireEvent.press(getByTestId('modal-cancel'));

    // Modal should be closed
    expect(queryByTestId('signature-modal')).toBeNull();

    // Should not have called onSignatureCapture
    expect(mockOnSignatureCapture).not.toHaveBeenCalled();
  });
});
