/**
 * MLCamera component - SIMPLIFIED for Android compatibility
 */

import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { CapturedImage } from '../types';

const THUMBNAIL_SIZE = 60;

interface MLCameraProps {
  onCapture: (image: CapturedImage) => void;
  onDone: (images: CapturedImage[]) => void;
  onClose: () => void;
  onRemoveImage: (index: number) => void;
  capturedImages: CapturedImage[];
  maxCaptures: number;
}

export function MLCamera({
  onCapture,
  onDone,
  onClose,
  onRemoveImage,
  capturedImages,
  maxCaptures
}: MLCameraProps) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);

  const captureCount = capturedImages.length;
  const canCapture = captureCount < maxCaptures;
  const hasMinimumCaptures = captureCount >= 1;

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Initializing Camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          HazPro needs camera access to detect hazmat labels.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing || !canCapture) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (photo) {
        onCapture({
          uri: photo.uri,
          width: photo.width,
          height: photo.height,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error('Failed to capture photo:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDonePress = () => {
    if (hasMinimumCaptures) {
      onDone(capturedImages);
    }
  };

  const toggleFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        {/* Top Bar */}
        <SafeAreaView style={styles.topBar}>
          <TouchableOpacity style={styles.topBtn} onPress={onClose}>
            <Text style={styles.topBtnText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.counter}>
            <Text style={styles.counterText}>{captureCount} / {maxCaptures}</Text>
          </View>
          <TouchableOpacity style={styles.topBtn} onPress={toggleFacing}>
            <Text style={styles.topBtnText}>⟳</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Thumbnails */}
        {captureCount > 0 && (
          <View style={styles.thumbnailStrip}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {capturedImages.map((img, index) => (
                <View key={img.timestamp} style={styles.thumbnailContainer}>
                  <Image source={{ uri: img.uri }} style={styles.thumbnail} />
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => onRemoveImage(index)}
                  >
                    <Text style={styles.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.sideBtn} onPress={onClose}>
            <Text style={styles.sideBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.captureBtn, !canCapture && styles.disabled]}
            onPress={handleCapture}
            disabled={isCapturing || !canCapture}
          >
            {isCapturing ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <View style={styles.captureBtnInner} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.doneBtn, !hasMinimumCaptures && styles.disabled]}
            onPress={handleDonePress}
            disabled={!hasMinimumCaptures}
          >
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  permissionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  permissionText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelBtn: {
    padding: 12,
  },
  cancelBtnText: {
    color: '#999',
    fontSize: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  topBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBtnText: {
    color: '#fff',
    fontSize: 20,
  },
  counter: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  counterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  thumbnailStrip: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    height: THUMBNAIL_SIZE + 16,
    paddingHorizontal: 16,
  },
  thumbnailContainer: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  removeBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  sideBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  captureBtnInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FF9500',
  },
  doneBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#34C759',
    borderRadius: 8,
  },
  doneBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.4,
  },
});

export default MLCamera;
