import ErrorHandlingService, {
  ErrorRecoveryStrategy,
} from "@/services/shipment/ErrorHandlingService";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DatabaseErrorDisplayProps {
  error: string | null;
  service?: string;
  operation?: string;
  onRetry?: () => Promise<void>;
  onDismiss?: () => void;
  showTechnicalDetails?: boolean;
}

export const DatabaseErrorDisplay: React.FC<DatabaseErrorDisplayProps> = ({
  error,
  service = "Unknown",
  operation = "Unknown",
  onRetry,
  onDismiss,
  showTechnicalDetails = false,
}) => {
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryStrategy, setRecoveryStrategy] =
    useState<ErrorRecoveryStrategy | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (error) {
      const strategy = ErrorHandlingService.getRecoveryStrategy(
        error,
        service,
        operation
      );
      setRecoveryStrategy(strategy);
    }
  }, [error, service, operation]);

  const handleRecovery = useCallback(async () => {
    if (!error || !recoveryStrategy?.canRecover) return;

    setIsRecovering(true);
    try {
      const recovered = await ErrorHandlingService.attemptRecovery(
        error,
        service,
        operation
      );

      if (recovered) {
        Alert.alert("Recovery Successful", "The issue has been resolved.");
        onDismiss?.();
      } else {
        Alert.alert(
          "Recovery Failed",
          "Unable to automatically resolve the issue. Please try manually or contact support."
        );
      }
    } catch (recoveryError) {
      Alert.alert(
        "Recovery Error",
        "An error occurred during recovery. Please contact support."
      );
    } finally {
      setIsRecovering(false);
    }
  }, [error, recoveryStrategy, service, operation, onDismiss]);

  const handleExportLogs = useCallback(async () => {
    try {
      const exportPath = await ErrorHandlingService.exportErrorLogs();
      Alert.alert(
        "Error Logs Exported",
        `Logs exported to: ${exportPath}\n\nYou can share this file with support for debugging.`,
        [{ text: "OK" }]
      );
    } catch (exportError) {
      Alert.alert("Export Failed", "Unable to export error logs.");
    }
  }, []);

  if (!error) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚠️ Database Error</Text>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Text style={styles.dismissText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.userMessage}>
          {recoveryStrategy?.userMessage ||
            "An unexpected error occurred with the database."}
        </Text>

        {recoveryStrategy?.canRecover && (
          <View style={styles.recoverySection}>
            <Text style={styles.sectionTitle}>Recovery Options</Text>
            <TouchableOpacity
              style={[
                styles.button,
                styles.recoveryButton,
                isRecovering && styles.buttonDisabled,
              ]}
              onPress={handleRecovery}
              disabled={isRecovering}
            >
              <Text style={styles.buttonText}>
                {isRecovering
                  ? "🔄 Attempting Recovery..."
                  : "🛠️ Attempt Automatic Recovery"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Manual Actions</Text>

          {onRetry && (
            <TouchableOpacity
              style={[styles.button, styles.retryButton]}
              onPress={onRetry}
            >
              <Text style={styles.buttonText}>🔄 Retry Operation</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleExportLogs}
          >
            <Text style={styles.buttonText}>📋 Export Error Logs</Text>
          </TouchableOpacity>
        </View>

        {(showTechnicalDetails || recoveryStrategy?.technicalDetails) && (
          <View style={styles.detailsSection}>
            <TouchableOpacity
              style={styles.detailsToggle}
              onPress={() => setShowDetails(!showDetails)}
            >
              <Text style={styles.detailsToggleText}>
                {showDetails ? "🔽" : "▶️"} Technical Details
              </Text>
            </TouchableOpacity>

            {showDetails && (
              <View style={styles.technicalDetails}>
                <Text style={styles.technicalText}>Service: {service}</Text>
                <Text style={styles.technicalText}>Operation: {operation}</Text>
                <Text style={styles.technicalText}>Error: {error}</Text>
                {recoveryStrategy?.technicalDetails && (
                  <Text style={styles.technicalText}>
                    Details: {recoveryStrategy.technicalDetails}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        <View style={styles.helpSection}>
          <Text style={styles.helpText}>
            💡 If this error persists, please restart the app or contact support
            with the technical details above.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff5f5",
    borderWidth: 1,
    borderColor: "#fed7d7",
    borderRadius: 8,
    margin: 16,
    maxHeight: 400,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#fed7d7",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#c53030",
  },
  dismissButton: {
    padding: 4,
  },
  dismissText: {
    fontSize: 20,
    color: "#c53030",
  },
  content: {
    padding: 16,
  },
  userMessage: {
    fontSize: 16,
    color: "#2d3748",
    marginBottom: 16,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 8,
    marginTop: 16,
  },
  recoverySection: {
    marginBottom: 8,
  },
  actionsSection: {
    marginBottom: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: "center",
  },
  recoveryButton: {
    backgroundColor: "#48bb78",
  },
  retryButton: {
    backgroundColor: "#4299e1",
  },
  secondaryButton: {
    backgroundColor: "#a0aec0",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  detailsSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 16,
  },
  detailsToggle: {
    marginBottom: 8,
  },
  detailsToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4a5568",
  },
  technicalDetails: {
    backgroundColor: "#f7fafc",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  technicalText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#2d3748",
    marginBottom: 4,
  },
  helpSection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#ebf8ff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bee3f8",
  },
  helpText: {
    fontSize: 14,
    color: "#2b6cb0",
    lineHeight: 20,
  },
});

export default DatabaseErrorDisplay;
