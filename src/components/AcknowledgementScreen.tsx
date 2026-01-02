import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../theming/colors";
import {
  ACKNOWLEDGEMENT_SECTIONS,
  AcknowledgementSection,
  CURRENT_APP_VERSION,
} from "../constants/acknowledgementContent";

const logoImage = require("../../assets/hazpro-01.png");

interface AcknowledgementScreenProps {
  userName: string;
  userRole: "preparer" | "inspector";
  onAcknowledge: () => void;
}

export default function AcknowledgementScreen({
  userName,
  userRole,
  onAcknowledge,
}: AcknowledgementScreenProps): React.JSX.Element {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isAtBottom =
      contentOffset.y >= contentSize.height - layoutMeasurement.height - 20;

    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    if (!hasScrolledToBottom || !isChecked) {
      return;
    }

    console.log("User accepted acknowledgement");
    onAcknowledge();
  };

  const isAcceptEnabled = hasScrolledToBottom && isChecked;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={logoImage} style={styles.logo} resizeMode="contain" />
          <Text style={styles.headerTitle}>Important Information</Text>
          <Text style={styles.headerSubtitle}>
            Please read carefully before proceeding
          </Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
        >
          {ACKNOWLEDGEMENT_SECTIONS.map(section => (
            <SectionComponent key={section.id} section={section} />
          ))}

          {/* Bottom padding for better scroll experience */}
          <View style={styles.scrollBottomPadding} />
        </ScrollView>

        {/* Sticky Footer */}
        <View style={styles.footer}>
          {/* Scroll Indicator */}
          {!hasScrolledToBottom && (
            <View style={styles.scrollIndicator}>
              <MaterialIcons
                name="arrow-downward"
                size={20}
                color={colors.blue}
              />
              <Text style={styles.scrollIndicatorText}>
                Scroll to bottom to continue
              </Text>
            </View>
          )}

          {/* Checkbox */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setIsChecked(!isChecked)}
            disabled={!hasScrolledToBottom}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkbox,
                isChecked && styles.checkboxChecked,
                !hasScrolledToBottom && styles.checkboxDisabled,
              ]}
            >
              {isChecked && (
                <MaterialIcons name="check" size={20} color={colors.white} />
              )}
            </View>
            <Text
              style={[
                styles.checkboxLabel,
                !hasScrolledToBottom && styles.checkboxLabelDisabled,
              ]}
            >
              I have read and understand the above information and acknowledge
              my responsibilities as outlined
            </Text>
          </TouchableOpacity>

          {/* Accept Button */}
          <TouchableOpacity
            style={[
              styles.acceptButton,
              !isAcceptEnabled && styles.acceptButtonDisabled,
            ]}
            onPress={handleAccept}
            disabled={!isAcceptEnabled}
            activeOpacity={0.8}
          >
            <Text style={styles.acceptButtonText}>ACCEPT & CONTINUE</Text>
          </TouchableOpacity>

          {/* Footer Info */}
          <Text style={styles.footerInfo}>Version {CURRENT_APP_VERSION}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Section Component
function SectionComponent({ section }: { section: AcknowledgementSection }) {
  return (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <MaterialIcons
          name={section.icon as any}
          size={24}
          color={colors.blue}
        />
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>

      {/* Section Content */}
      {section.content && (
        <Text style={styles.sectionContent}>{section.content}</Text>
      )}

      {/* Section Items (Bullet List) */}
      {section.items && section.items.length > 0 && (
        <View style={styles.itemsList}>
          {section.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemBullet}>•</Text>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 60,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6E6E6E",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollBottomPadding: {
    height: 40,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginLeft: 10,
    flex: 1,
  },
  sectionContent: {
    fontSize: 15,
    color: "#333333",
    lineHeight: 22,
    marginBottom: 8,
  },
  itemsList: {
    marginTop: 8,
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 8,
  },
  itemBullet: {
    fontSize: 15,
    color: "#333333",
    marginRight: 8,
    fontWeight: "bold",
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    color: "#333333",
    lineHeight: 22,
  },
  footer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  scrollIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 4,
  },
  scrollIndicatorText: {
    fontSize: 14,
    color: colors.blue,
    marginLeft: 8,
    fontWeight: "600",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#BDBDBD",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  checkboxDisabled: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
  checkboxLabelDisabled: {
    color: "#9E9E9E",
  },
  acceptButton: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 12,
  },
  acceptButtonDisabled: {
    backgroundColor: "#BDBDBD",
    shadowOpacity: 0,
    elevation: 0,
  },
  acceptButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  footerInfo: {
    fontSize: 12,
    color: "#9E9E9E",
    textAlign: "center",
  },
});
