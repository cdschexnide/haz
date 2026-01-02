import CylinderMarkingExample from "@/components/CylinderMarkingExample";
import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { useHazProStore } from "@/stores/useHazProStore";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";

const ProgressIndicator = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  const dots = [];
  for (let i = 0; i < total; i++) {
    dots.push(
      <View
        key={i}
        style={[
          styles.progressDot,
          i === current ? styles.progressDotActive : null,
        ]}
        accessibilityLabel={
          i === current ? "Current step" : `Step ${i + 1} of ${total}`
        }
      />
    );
  }

  return (
    <View style={styles.progressContainer} accessibilityRole="progressbar">
      <Text style={styles.progressText} allowFontScaling={true}>
        {current + 1} of {total}
      </Text>
      <View style={styles.progressDots}>{dots}</View>
    </View>
  );
};

const AcknowledgementCard = ({
  title,
  children,
  type,
}: {
  title: string;
  children: React.ReactNode;
  type: string;
}) => {
  const typeLabel =
    type === "informative" ? "Informative Statement" : "Workflow Modifier";
  const borderColor =
    type === "informative"
      ? styles.informativeBorder.borderColor
      : styles.workflowBorder.borderColor;

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: borderColor, borderLeftWidth: 4 },
      ]}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.typeBadge,
            type === "informative"
              ? styles.informativeBadge
              : styles.workflowBadge,
          ]}
        >
          <Text
            style={styles.typeBadgeText}
            numberOfLines={1}
            allowFontScaling={true}
          >
            {typeLabel}
          </Text>
        </View>
        {title && (
          <Text style={styles.cardTitle} allowFontScaling={true}>
            {title}
          </Text>
        )}
      </View>
      <View style={styles.divider} />
      <View style={styles.cardContent}>{children}</View>
    </View>
  );
};

const ActionButtons = ({
  onAcknowledge,
  onReject,
  acknowledged,
}: {
  onAcknowledge: () => void;
  onReject: () => void;
  acknowledged: boolean;
}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.continueButton} onPress={onAcknowledge}>
        <Text style={styles.buttonText}>Acknowledge Requirement</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cancelButton} onPress={onReject}>
        <Text style={styles.cancelButtonText}>Reject Requirement</Text>
      </TouchableOpacity>
    </View>
  );
};

const InformativeAndWorkflowModifiersAcknowledgementScreen = ({
  navigation,
}: {
  navigation: any;
}) => {
  const { state, store } = useHazProStore();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const [showCylinderMarkingModal, setShowCylinderMarkingModal] =
    useState<boolean>(false);
  const { navigate } = useNavigationRef();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const informativeStatements =
    state.hazProPreparerContext.modifiersAndRequiredAcknowledgements
      ?.specialProvisionsInformativeStatements || {};
  const documentNodeInformativeStatements =
    state.hazProPreparerContext.modifiersAndRequiredAcknowledgements
      ?.documentNodeInformativeStatements || [];

  const workflowModifiers =
    state.hazProPreparerContext.modifiersAndRequiredAcknowledgements
      ?.specialProvisionsWorkflowModifiers || {};
  const documentNodeWorkflowModifiers =
    state.hazProPreparerContext.modifiersAndRequiredAcknowledgements
      ?.documentNodeWorkflowModifiers || [];

  const combinedList = useMemo(() => {
    const informativeItems = [
      ...Object.entries(informativeStatements).map(([key, value]) => ({
        id: key,
        value,
        type: "informative",
      })),
      ...documentNodeInformativeStatements.map((jsx, index) => ({
        id: `InformativeStatementNode-${index}`,
        value: jsx,
        type: "informative",
      })),
    ];

    const workflowItems = [
      ...Object.entries(workflowModifiers).map(([key, value]) => ({
        id: key,
        value,
        type: "workflow",
      })),
      ...documentNodeWorkflowModifiers.map((jsx, index) => ({
        id: `WorkflowNode-${index}`,
        value: jsx,
        type: "workflow",
      })),
    ];

    return [...informativeItems, ...workflowItems];
  }, [informativeStatements, workflowModifiers, documentNodeWorkflowModifiers]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [acknowledgements, setAcknowledgements] = useState<{
    [id: string]: boolean;
  }>({});

  const handleAcknowledge = () => {
    const current = combinedList[currentIndex];
    setAcknowledgements(prev => ({ ...prev, [current.id]: true }));
    goToNext();
  };

  const handleReject = () => {
    if (store.hazProPreparerContext) {
      Object.keys(store.hazProPreparerContext).forEach(key => {
        delete store.hazProPreparerContext[key];
      });
    }
    navigate("PreparerHomeStack", { screen: "PreparerHome" });
  };

  const goToNext = () => {
    if (currentIndex + 1 < combinedList.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      if (store.hazProPreparerContext) {
        if (!store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
          store.hazProPreparerContext.modifiersAndRequiredAcknowledgements = {};
        }
        store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.informativeStatementsAcknowledged =
          true;
        store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.workflowModifiersAcknowledged =
          true;
        store.hazProPreparerContext.completedSubsteps = [
          ...completedSubsteps,
          "InformativeAndWorkflowModifierAcknowledgement",
        ];
      }

      if (state.hazProPreparerContext.isGrandfatheredExplosive === true) {
        navigation.navigate("LabelingAndMarking");
        return;
      }
      const unid = state.hazProPreparerContext.hazardousMaterial?.unid;
      if (unid === "UN3166") {
        navigation.navigate("UN3166FuelEntryScreen");
        return;
      }
      if (unid === "UN2807") {
        navigation.navigate("MagnetizedMaterialPrepScreen");
        return;
      }
      if (unid === "UN3268") {
        navigation.navigate("SafetyDevicesPreparationScreen");
        return;
      }
      if (unid === "UN1845") {
        navigation.navigate("DryIcePrepScreen");
        return;
      }
      if (unid === "UN3090" || unid === "UN3480") {
        navigation.navigate("LithiumBatteriesPrepScreen");
        return;
      }
      if (unid === "UN3529" || unid === "UN3528" || unid === "UN3530") {
        navigation.navigate("EnginesInternalCombustion");
        return;
      }
      if (unid === "UN3171") {
        navigation.navigate("BatteryPoweredVehicle");
        return;
      }
      if (unid === "UN3072" || unid === "UN2990") {
        navigation.navigate("LifeSavingAppliances");
        return;
      }
      if (unid === "UN3316") {
        navigation.navigate("KitPreparationScreen");
        return;
      }
      if (unid === "UN3245" || unid === "UN2900" || unid === "UN2814") {
        navigation.navigate("GeneticallyModifiedOrganisms");
        return;
      }
      if (unid === "UN3363") {
        navigation.navigate("DangerousGoods");
        return;
      }
      if (unid === "UN3508" || unid === "UN3499") {
        navigation.navigate("Capacitors");
        return;
      }
      navigation.navigate("PackagingScreen");
      return;
    }
  };

  const currentItem = combinedList[currentIndex];
  const isSpecialCylinderCase =
    currentItem &&
    (currentItem.id === "A6.9." ||
      currentItem.id === "A6.9.3." ||
      currentItem.id === "A6.4.9." ||
      currentItem.id === "A6.6.4.");

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle} allowFontScaling={true}>
            Requirements Acknowledgement
          </Text>
          <ProgressIndicator
            current={currentIndex}
            total={combinedList.length}
          />
        </View>

        {combinedList.length > 0 ? (
          <Animated.View
            style={[styles.contentContainer, { opacity: fadeAnim }]}
            accessibilityLiveRegion="polite"
          >
            {isSpecialCylinderCase ? (
              <View style={styles.specialCaseContainer}>
                <AcknowledgementCard title={``} type={currentItem.type}>
                  {typeof currentItem.value === "string" ? (
                    <Text style={styles.itemText} allowFontScaling={true}>
                      {currentItem.value}
                    </Text>
                  ) : (
                    currentItem.value
                  )}
                </AcknowledgementCard>

                <View style={styles.cylinderExampleContainer}>
                  <CylinderMarkingExample
                    visible={showCylinderMarkingModal}
                    onClose={() => setShowCylinderMarkingModal(false)}
                  />
                  <TouchableOpacity
                    style={styles.viewExampleButton}
                    onPress={() => setShowCylinderMarkingModal(true)}
                    accessibilityLabel="View cylinder marking example"
                    accessibilityRole="button"
                  >
                    <Text
                      style={styles.viewExampleText}
                      allowFontScaling={true}
                    >
                      View Example
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <AcknowledgementCard type={currentItem.type} title={""}>
                <ScrollView
                  style={styles.scrollViewContent}
                  contentContainerStyle={styles.scrollViewContentContainer}
                >
                  {typeof currentItem.value === "string" ? (
                    <Text style={styles.itemText} allowFontScaling={true}>
                      {currentItem.value}
                    </Text>
                  ) : (
                    currentItem.value
                  )}
                </ScrollView>
              </AcknowledgementCard>
            )}
          </Animated.View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Icon name="info-outline" size={48} color="#aaa" />
            <Text style={styles.emptyStateText} allowFontScaling={true}>
              No requirements to acknowledge
            </Text>
          </View>
        )}

        {combinedList.length > 0 && (
          <ActionButtons
            onAcknowledge={handleAcknowledge}
            onReject={handleReject}
            acknowledged={acknowledgements[currentItem?.id]}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default InformativeAndWorkflowModifiersAcknowledgementScreen;

const colors = {
  background: "#f0f0f0",
  cardBackground: "#ffffff",
  blue: "#5386E4",
  text: {
    primary: "#212121",
    secondary: "#444444",
    light: "#666666",
  },
  accent: {
    primary: "#0a396b",
    light: "#e6eef7",
  },
  informative: {
    main: "#1a4f7c",
    light: "#e6f0f7",
  },
  workflow: {
    main: "#235a4e",
    light: "#e6f0ee",
  },
  actions: {
    acknowledge: "#235a4e",
    reject: "#a02020",
    border: "#d0d0d0",
  },
  progress: {
    active: "#0a396b",
    inactive: "#cccccc",
  },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  cancelButton: {
    flex: 1,
    height: 55,
    borderRadius: 4,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  continueButton: {
    flex: 1,
    height: 55,
    backgroundColor: "#28a745",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  progressDots: {
    flexDirection: "row",
    justifyContent: "center",
  },
  progressDot: {
    width: 8,
    height: 8,
    backgroundColor: colors.progress.inactive,
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: colors.progress.active,
    width: 12,
    height: 12,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 16,
    height: 450,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.actions.border,
    padding: 16,
    backgroundColor: colors.cardBackground,
    minHeight: 400,
    height: "100%",
  },
  cardHeader: {
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 8,
    borderWidth: 1,
  },
  informativeBadge: {
    backgroundColor: colors.informative.light,
    borderColor: colors.informative.main,
  },
  workflowBadge: {
    backgroundColor: colors.workflow.light,
    borderColor: colors.workflow.main,
  },
  informativeBorder: {
    borderColor: colors.informative.main,
  },
  workflowBorder: {
    borderColor: colors.workflow.main,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text.primary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.actions.border,
    marginVertical: 12,
  },
  cardContent: {
    flex: 1,
    backgroundColor: "#ffffff",
    minHeight: 300,
  },
  scrollViewContent: {
    backgroundColor: "#ffffff",
    flex: 1,
    minHeight: 300,
  },
  scrollViewContentContainer: {
    padding: 8,
    backgroundColor: "#ffffff",
  },
  itemText: {
    fontSize: 15,
    color: colors.text.secondary,
    lineHeight: 22,
    backgroundColor: "#ffffff",
  },
  specialCaseContainer: {
    flexDirection: "column",
  },
  cylinderExampleContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  viewExampleButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.accent.light,
    borderWidth: 1,
    borderColor: colors.accent.primary,
    marginTop: 16,
    minWidth: 150,
    alignItems: "center",
  },
  viewExampleText: {
    color: colors.accent.primary,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    minWidth: 160,
    minHeight: 56,
  },
  acknowledgeButton: {
    backgroundColor: "#28a745",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 280,
  },
  rejectButton: {
    backgroundColor: "red",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 280,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text.light,
    textAlign: "center",
  },
});
