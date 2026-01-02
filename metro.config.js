const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add model file extensions as assets
// .pte - ExecuTorch models (PyTorch ExecuTorch format)
// .onnx - ONNX Runtime models (optional fallback)
// .tflite - TensorFlow Lite models (optional)
// .bin - Tokenizer/weight files
config.resolver.assetExts.push('pte', 'onnx', 'tflite', 'bin');

module.exports = config;
