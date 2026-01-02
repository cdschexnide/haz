import React from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";

interface DataSectionWithImageProps {
  title: string;
  croppedImageUri?: string;
  loading?: boolean;
  children: React.ReactNode;
}

export default function DataSectionWithImage({
  title,
  croppedImageUri,
  loading = false,
  children,
}: DataSectionWithImageProps) {
  return (
    <View style={styles.card}>
      {/* Section Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Cropped Region Image */}
      {loading ? (
        <View style={styles.imageLoadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.loadingText}>Loading region image...</Text>
        </View>
      ) : croppedImageUri ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: croppedImageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      ) : null}

      {/* Extracted Data */}
      <View style={styles.dataContainer}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleContainer: {
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  imageContainer: {
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    padding: 8,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 120,
    maxWidth: 400,
  },
  imageLoadingContainer: {
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
  },
  dataContainer: {
    padding: 16,
  },
});
