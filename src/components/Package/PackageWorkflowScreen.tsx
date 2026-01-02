import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import SDDGWorkflowHeader from "../Inspector/SDDGWorkflowHeader";
import { useHazProStore } from "@/stores/useHazProStore";

interface PackageWorkflowScreenProps {
  navigation: any;
}

export default function PackageWorkflowScreen({
  navigation,
}: PackageWorkflowScreenProps) {
  const { state, actions } = useHazProStore();
  const { sddgWorkflow } = state;

  // Update workflow step when component mounts
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Workflow Header */}
      <SDDGWorkflowHeader
        currentChevron={sddgWorkflow.currentChevron}
        sddgComplete={sddgWorkflow.sddgComplete}
        packageComplete={sddgWorkflow.packageComplete}
        onChevronPress={chevron => {
          if (chevron === "sddg" && sddgWorkflow.sddgComplete) {
            actions.setCurrentChevron("sddg");
            navigation.goBack(); // Return to previous SDDG screen
          } else if (chevron === "package") {
            actions.setCurrentChevron("package");
          } else if (chevron === "complete" && sddgWorkflow.packageComplete) {
            actions.setCurrentChevron("complete");
            // TODO: Navigate to Complete workflow screen
          }
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Package Workflow</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.placeholderContainer}>
          <MaterialIcons name="inventory" size={80} color="#007AFF" />
          <Text style={styles.placeholderTitle}>Package Workflow</Text>
          <Text style={styles.placeholderSubtitle}>Coming Soon</Text>
          <Text style={styles.placeholderDescription}>
            The package workflow will include packaging selection, marking
            requirements, and compliance validation for your hazardous materials
            shipment.
          </Text>

          {/* Mock Complete Button for testing */}
          <TouchableOpacity
            style={styles.mockCompleteButton}
            onPress={() => {
              actions.setPackageComplete(true);
              actions.setCurrentChevron("complete");
              // TODO: Navigate to Complete screen when available
            }}
          >
            <Text style={styles.mockCompleteButtonText}>
              Mock Complete Package (For Testing)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  placeholderContainer: {
    alignItems: "center",
    maxWidth: 400,
  },
  placeholderTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1D1D1F",
    marginTop: 24,
    marginBottom: 8,
  },
  placeholderSubtitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#007AFF",
    marginBottom: 24,
  },
  placeholderDescription: {
    fontSize: 16,
    color: "#6D6D70",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  mockCompleteButton: {
    backgroundColor: "#34C759",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  mockCompleteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
