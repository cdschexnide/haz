import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import Pdf from 'react-native-pdf';

interface SimplePdfToImageConverterProps {
  pdfUri: string;
  onImageCaptured: (imageUri: string) => void;
  onError: (error: string) => void;
}

export default function SimplePdfToImageConverter({ 
  pdfUri, 
  onImageCaptured, 
  onError 
}: SimplePdfToImageConverterProps) {
  const pdfRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  console.log('🟦 [Simple PDF Converter] Component rendered with pdfUri:', pdfUri);

  useEffect(() => {
    // Set a timeout to capture the PDF once it's loaded
    if (isLoaded) {
      console.log('🟦 [Simple PDF Converter] PDF loaded, scheduling capture');
      setTimeout(capturePdf, 2000); // Wait 2 seconds for rendering to complete
    }
  }, [isLoaded]);

  const capturePdf = async () => {
    try {
      console.log('🟦 [Simple PDF Converter] Attempting to capture PDF');
      if (pdfRef.current) {
        const imageUri = await captureRef(pdfRef.current, {
          format: 'png',
          quality: 1.0,
          width: 800,
          height: 1200,
        });
        console.log('🟦 [Simple PDF Converter] PDF captured successfully:', imageUri);
        onImageCaptured(imageUri);
      } else {
        console.log('🟦 [Simple PDF Converter] PDF ref not available');
        onError('PDF reference not available for capture');
      }
    } catch (error) {
      console.error('🟦 [Simple PDF Converter] Capture error:', error);
      onError(`Failed to capture PDF: ${error.message}`);
    }
  };

  const handleLoadComplete = (numberOfPages: number, path: string) => {
    console.log('🟦 [Simple PDF Converter] PDF loaded successfully, pages:', numberOfPages);
    setIsLoaded(true);
  };

  const handleError = (error: any) => {
    console.error('🟦 [Simple PDF Converter] PDF load error:', error);
    onError(`Failed to load PDF: ${error.message || 'Unknown error'}`);
  };

  return (
    <View style={styles.container}>
      <Pdf
        ref={pdfRef}
        source={{ uri: pdfUri }}
        onLoadComplete={handleLoadComplete}
        onError={handleError}
        style={styles.pdf}
        enablePaging={false}
        enableRTL={false}
        enableAnnotationRendering={false}
        horizontal={false}
        page={1} // Only show first page
        scale={2.0} // Higher scale for better OCR quality
        spacing={0}
        fitPolicy={0} // Fit width
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -10000, // Hide off-screen
    left: 0,
    width: 800,
    height: 1200,
    backgroundColor: '#FFFFFF',
  },
  pdf: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});