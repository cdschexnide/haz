import { useHazProStore } from "@/stores/useHazProStore";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

type AccordionSection = {
  title: string;
  content: React.ReactNode;
  key: string;
};

const GrandfatheredPackagingReferenceViewer: React.FC = () => {
  const { state } = useHazProStore();
  const { width } = useWindowDimensions();
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const isTablet = width > 768;
  const packagingData =
    state.hazProPreparerContext?.grandfatheredExplosive
      ?.packagingParagraphReferenceData;
  const crossReference =
    state.hazProPreparerContext?.grandfatheredExplosive
      ?.tableA27_1CrossReference;
  const generalDescription =
    state.hazProPreparerContext?.grandfatheredExplosive
      ?.generalPackageDescription;
  const packageDimensions =
    state.hazProPreparerContext?.grandfatheredExplosive?.packageDimensions;

  if (!packagingData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>
          Loading packaging reference data...
        </Text>
      </SafeAreaView>
    );
  }

  const toggleSection = useCallback((key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const renderDimensions = () => {
    if (!packageDimensions) return null;

    const hasDimensions =
      packageDimensions.length ||
      packageDimensions.width ||
      packageDimensions.height ||
      packageDimensions.diameter;

    if (!hasDimensions) return null;

    return (
      <View style={styles.dimensionsContainer}>
        <Text style={styles.dimensionsTitle}>Package Dimensions</Text>
        <View style={styles.dimensionsGrid}>
          {packageDimensions.length && (
            <View style={styles.dimensionItem}>
              <Text style={styles.dimensionLabel}>Length:</Text>
              <Text style={styles.dimensionValue}>
                {packageDimensions.length.inches
                  ? `${packageDimensions.length.inches}″`
                  : ""}
                {packageDimensions.length.inches &&
                packageDimensions.length.centimeters
                  ? " / "
                  : ""}
                {packageDimensions.length.centimeters
                  ? `${packageDimensions.length.centimeters} cm`
                  : ""}
              </Text>
            </View>
          )}
          {packageDimensions.width && (
            <View style={styles.dimensionItem}>
              <Text style={styles.dimensionLabel}>Width:</Text>
              <Text style={styles.dimensionValue}>
                {packageDimensions.width.inches
                  ? `${packageDimensions.width.inches}″`
                  : ""}
                {packageDimensions.width.inches &&
                packageDimensions.width.centimeters
                  ? " / "
                  : ""}
                {packageDimensions.width.centimeters
                  ? `${packageDimensions.width.centimeters} cm`
                  : ""}
              </Text>
            </View>
          )}
          {packageDimensions.height && (
            <View style={styles.dimensionItem}>
              <Text style={styles.dimensionLabel}>Height:</Text>
              <Text style={styles.dimensionValue}>
                {packageDimensions.height.inches
                  ? `${packageDimensions.height.inches}″`
                  : ""}
                {packageDimensions.height.inches &&
                packageDimensions.height.centimeters
                  ? " / "
                  : ""}
                {packageDimensions.height.centimeters
                  ? `${packageDimensions.height.centimeters} cm`
                  : ""}
              </Text>
            </View>
          )}
          {packageDimensions.diameter && (
            <View style={styles.dimensionItem}>
              <Text style={styles.dimensionLabel}>Diameter:</Text>
              <Text style={styles.dimensionValue}>
                {packageDimensions.diameter.inches
                  ? `${packageDimensions.diameter.inches}″`
                  : ""}
                {packageDimensions.diameter.inches &&
                packageDimensions.diameter.centimeters
                  ? " / "
                  : ""}
                {packageDimensions.diameter.centimeters
                  ? `${packageDimensions.diameter.centimeters} cm`
                  : ""}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderRequirements = () => {
    const { packagingInstructions } = packagingData;
    const requirements = packagingInstructions.requirements;

    if (
      !requirements ||
      (Array.isArray(requirements) && requirements.length === 0)
    ) {
      return null;
    }

    return (
      <View style={styles.requirementsContainer}>
        <Text style={styles.sectionTitle}>Requirements</Text>
        {Array.isArray(requirements) ? (
          requirements.map((req, index) => (
            <View key={`req-${index}`} style={styles.requirementItem}>
              <MaterialIcons
                name="check-circle"
                size={18}
                color="#00875f"
                style={styles.bulletIcon}
              />
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.complexDataText}>
            Complex requirements data available
          </Text>
        )}
      </View>
    );
  };

  const renderContainerTypes = () => {
    const { packagingInstructions } = packagingData;
    const containerTypes =
      packagingInstructions.containerTypes ||
      packagingInstructions.containerType;

    if (!containerTypes) {
      return null;
    }

    return (
      <View style={styles.containersSection}>
        <Text style={styles.sectionTitle}>Container Types</Text>
        {typeof containerTypes === "string" ? (
          <Text style={styles.containerTypeText}>{containerTypes}</Text>
        ) : Array.isArray(containerTypes) ? (
          containerTypes.map((container, index) => (
            <View key={`container-${index}`} style={styles.containerItem}>
              {typeof container === "string" ? (
                <>
                  <MaterialIcons
                    name="inventory"
                    size={18}
                    color="#0066cc"
                    style={styles.bulletIcon}
                  />
                  <Text style={styles.containerTypeText}>{container}</Text>
                </>
              ) : (
                <>
                  <MaterialIcons
                    name="inventory"
                    size={18}
                    color="#0066cc"
                    style={styles.bulletIcon}
                  />
                  <View style={styles.containerDetails}>
                    <Text style={styles.containerTypeText}>
                      {container.type}
                    </Text>

                    {container.specs && (
                      <View style={styles.containerSpecs}>
                        <Text style={styles.containerSpecText}>
                          Spec:{" "}
                          {Array.isArray(container.specs)
                            ? container.specs.join(", ")
                            : typeof container.specs === "string"
                            ? container.specs
                            : Object.entries(container.specs)
                                .map(
                                  ([key, value]) =>
                                    `${key}: ${
                                      Array.isArray(value)
                                        ? value.join(", ")
                                        : value
                                    }`
                                )
                                .join("; ")}
                        </Text>
                      </View>
                    )}
                    {container.maxGrossWeight && (
                      <View>
                        <Text style={styles.containerSpecText}>
                          Max weight:{" "}
                          {typeof container.maxGrossWeight === "object" &&
                          "lbs" in container.maxGrossWeight
                            ? `${container.maxGrossWeight.lbs} lbs / ${container.maxGrossWeight.kg} kg`
                            : typeof container.maxGrossWeight === "object"
                            ? Object.entries(container.maxGrossWeight)
                                .map(
                                  ([key, value]) =>
                                    `${key}: ${value.lbs} lbs / ${value.kg} kg`
                                )
                                .join("; ")
                            : "See details"}
                        </Text>
                      </View>
                    )}
                    {container.description && (
                      <Text style={styles.containerSpecText}>
                        {container.description}
                      </Text>
                    )}
                  </View>
                </>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.complexDataText}>
            Complex container data available
          </Text>
        )}
      </View>
    );
  };

  const renderOptions = () => {
    const { packagingInstructions } = packagingData;
    const options =
      packagingInstructions.options || packagingInstructions.packagingOptions;

    if (!options || (Array.isArray(options) && options.length === 0)) {
      return null;
    }

    return (
      <View style={styles.optionsContainer}>
        <Text style={styles.sectionTitle}>Packaging Options</Text>
        <Text style={styles.complexDataText}>
          {Array.isArray(options)
            ? `${options.length} packaging options available`
            : "Packaging options available"}
        </Text>
        {Array.isArray(options) &&
          options.map((option, index) => (
            <TouchableOpacity
              key={`option-${index}`}
              style={[
                styles.optionItem,
                expandedSections[`option-${index}`] &&
                  styles.optionItemExpanded,
              ]}
              onPress={() => toggleSection(`option-${index}`)}
              activeOpacity={0.7}
            >
              <View style={styles.optionHeader}>
                <Text style={styles.optionTitle}>
                  {typeof option.type === "string"
                    ? option.type
                    : Array.isArray(option.type)
                    ? option.type.join(", ")
                    : "Packaging Option"}
                </Text>
              </View>

              {expandedSections[`option-${index}`] && (
                <View style={styles.optionDetails}>
                  {option.spec && (
                    <Text style={styles.optionDetailText}>
                      Spec:{" "}
                      {Array.isArray(option.spec)
                        ? option.spec.join(", ")
                        : option.spec}
                    </Text>
                  )}
                  {option.maxGrossWeight && (
                    <Text style={styles.optionDetailText}>
                      Max Gross Weight:{" "}
                      {typeof option.maxGrossWeight === "object" &&
                      "lbs" in option.maxGrossWeight
                        ? `${option.maxGrossWeight.lbs} lbs / ${option.maxGrossWeight.kg} kg`
                        : "See details"}
                    </Text>
                  )}
                  {option.materials && (
                    <Text style={styles.optionDetailText}>
                      Materials:{" "}
                      {Array.isArray(option.materials)
                        ? option.materials.join(", ")
                        : option.materials}
                    </Text>
                  )}
                  {option.description && (
                    <Text style={styles.optionDetailText}>
                      Description: {option.description}
                    </Text>
                  )}
                  {option.requirements &&
                    Array.isArray(option.requirements) &&
                    option.requirements.length > 0 && (
                      <View style={styles.nestedRequirements}>
                        <Text style={styles.nestedSectionTitle}>
                          Requirements:
                        </Text>
                        {option.requirements.map((req, reqIndex) => (
                          <View
                            key={`option-${index}-req-${reqIndex}`}
                            style={styles.nestedRequirementItem}
                          >
                            <MaterialIcons
                              name="check"
                              size={16}
                              color="#00875f"
                              style={styles.bulletIcon}
                            />
                            <Text style={styles.nestedRequirementText}>
                              {req}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  {option.innerContainers &&
                    Array.isArray(option.innerContainers) && (
                      <View style={styles.nestedSection}>
                        <Text style={styles.nestedSectionTitle}>
                          Inner Containers:
                        </Text>
                        {option.innerContainers.map((inner, innerIndex) => (
                          <View
                            key={`option-${index}-inner-${innerIndex}`}
                            style={styles.nestedItem}
                          >
                            <Text style={styles.nestedItemText}>
                              • {inner.type}
                            </Text>
                            {inner.capacity && (
                              <Text style={styles.nestedItemSubText}>
                                Capacity:{" "}
                                {typeof inner.capacity === "object" &&
                                "lbs" in inner.capacity
                                  ? `${inner.capacity.lbs} lbs / ${inner.capacity.kg} kg`
                                  : inner.capacity}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    )}
                </View>
              )}
            </TouchableOpacity>
          ))}
      </View>
    );
  };

  const renderNotes = () => {
    const { packagingInstructions } = packagingData;
    const notes = packagingInstructions.notes;

    if (!notes || (Array.isArray(notes) && notes.length === 0)) {
      return null;
    }

    return (
      <View style={styles.notesContainer}>
        <Text style={styles.sectionTitle}>Notes</Text>
        {Array.isArray(notes) ? (
          notes.map((note, index) => (
            <View key={`note-${index}`} style={styles.noteItem}>
              <MaterialIcons
                name="info"
                size={18}
                color="#2c3e50"
                style={styles.bulletIcon}
              />
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.complexDataText}>
            Complex notes data available
          </Text>
        )}
      </View>
    );
  };

  const renderContainers = () => {
    const { packagingInstructions } = packagingData;
    const containers = packagingInstructions.containers;

    if (!containers || (Array.isArray(containers) && containers.length === 0)) {
      return null;
    }

    return (
      <View style={styles.containersSection}>
        <Text style={styles.sectionTitle}>Containers</Text>
        {Array.isArray(containers) &&
          containers.map((container, index) => (
            <TouchableOpacity
              key={`container-detail-${index}`}
              style={[
                styles.containerDetailItem,
                expandedSections[`container-detail-${index}`] &&
                  styles.containerDetailItemExpanded,
              ]}
              onPress={() => toggleSection(`container-detail-${index}`)}
              activeOpacity={0.7}
            >
              <View style={styles.containerDetailHeader}>
                <Text style={styles.containerDetailTitle}>
                  {container.type}
                </Text>
              </View>

              {expandedSections[`container-detail-${index}`] && (
                <View style={styles.containerDetailContent}>
                  {container.spec && (
                    <Text style={styles.containerDetailText}>
                      Spec:{" "}
                      {Array.isArray(container.spec)
                        ? container.spec.join(", ")
                        : container.spec}
                    </Text>
                  )}
                  {container.maxGrossWeight && (
                    <Text style={styles.containerDetailText}>
                      Max Gross Weight:{" "}
                      {typeof container.maxGrossWeight === "object" &&
                      "lbs" in container.maxGrossWeight
                        ? `${container.maxGrossWeight.lbs} lbs / ${container.maxGrossWeight.kg} kg`
                        : "See details"}
                    </Text>
                  )}
                  {container.features && Array.isArray(container.features) && (
                    <View style={styles.nestedFeatures}>
                      <Text style={styles.nestedSectionTitle}>Features:</Text>
                      {container.features.map((feature, featureIndex) => (
                        <View
                          key={`container-${index}-feature-${featureIndex}`}
                          style={styles.nestedFeatureItem}
                        >
                          <MaterialIcons
                            name="check"
                            size={16}
                            color="#00875f"
                            style={styles.bulletIcon}
                          />
                          <Text style={styles.nestedFeatureText}>
                            {feature}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {container.notes && Array.isArray(container.notes) && (
                    <View style={styles.nestedNotes}>
                      <Text style={styles.nestedSectionTitle}>Notes:</Text>
                      {container.notes.map((note, noteIndex) => (
                        <View
                          key={`container-${index}-note-${noteIndex}`}
                          style={styles.nestedNoteItem}
                        >
                          <MaterialIcons
                            name="info"
                            size={16}
                            color="#2c3e50"
                            style={styles.bulletIcon}
                          />
                          <Text style={styles.nestedNoteText}>{note}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
      </View>
    );
  };

  const sections: AccordionSection[] = [
    {
      title: "Reference Numbers",
      content: (
        <View style={styles.referenceContainer}>
          {crossReference && (
            <>
              <View style={styles.referenceItem}>
                <Text style={styles.referenceLabel}>Name:</Text>
                <Text style={styles.referenceValue}>{crossReference.name}</Text>
              </View>
              <View style={styles.referenceItem}>
                <Text style={styles.referenceLabel}>AFR 71-4 Paragraph:</Text>
                <Text style={styles.referenceValue}>
                  {crossReference.afr71_4Paragraph}
                </Text>
              </View>
              <View style={styles.referenceItem}>
                <Text style={styles.referenceLabel}>
                  AFMAN 24-204 Paragraph:
                </Text>
                <Text style={styles.referenceValue}>
                  {crossReference.afman24_204_Paragraph}
                </Text>
              </View>
            </>
          )}
        </View>
      ),
      key: "reference",
    },
    {
      title: "General Description",
      content: (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            {packagingData.description}
          </Text>
          {generalDescription && (
            <Text style={styles.generalDescriptionText}>
              {generalDescription}
            </Text>
          )}
          {renderDimensions()}
        </View>
      ),
      key: "description",
    },
  ];

  if (renderContainerTypes()) {
    sections.push({
      title: "Container Types",
      content: renderContainerTypes(),
      key: "containerTypes",
    });
  }

  if (renderRequirements()) {
    sections.push({
      title: "Requirements",
      content: renderRequirements(),
      key: "requirements",
    });
  }

  if (renderOptions()) {
    sections.push({
      title: "Packaging Options",
      content: renderOptions(),
      key: "options",
    });
  }

  if (renderContainers()) {
    sections.push({
      title: "Containers",
      content: renderContainers(),
      key: "containers",
    });
  }

  if (renderNotes()) {
    sections.push({
      title: "Notes",
      content: renderNotes(),
      key: "notes",
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.tabletScrollContent,
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Packaging Reference</Text>
          <Text style={styles.headerSubtitle}>{packagingData.description}</Text>
        </View>

        {sections.map(section => (
          <View key={section.key} style={styles.accordionSection}>
            <TouchableOpacity
              onPress={() => toggleSection(section.key)}
              style={styles.accordionHeader}
              activeOpacity={0.7}
            >
              <Text style={styles.accordionTitle}>{section.title}</Text>
            </TouchableOpacity>

            {expandedSections[section.key] && (
              <View style={styles.accordionContent}>{section.content}</View>
            )}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Packaging reference data is derived from AFMAN 24-204.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#555",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tabletScrollContent: {
    paddingHorizontal: 32,
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
  },
  header: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#555",
  },
  accordionSection: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  accordionContent: {
    padding: 16,
    backgroundColor: "#fff",
  },
  referenceContainer: {
    marginBottom: 8,
  },
  referenceItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  referenceLabel: {
    width: 170,
    fontWeight: "500",
    color: "#555",
  },
  referenceValue: {
    flex: 1,
    color: "#333",
  },
  descriptionContainer: {
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
    lineHeight: 22,
  },
  generalDescriptionText: {
    fontSize: 15,
    color: "#333",
    marginTop: 8,
    fontStyle: "italic",
    lineHeight: 22,
  },
  dimensionsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f5f7fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e6ed",
  },
  dimensionsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dimensionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dimensionItem: {
    width: "50%",
    marginBottom: 8,
    paddingRight: 8,
  },
  dimensionLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  dimensionValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  requirementsContainer: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  requirementText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  containersSection: {
    marginBottom: 8,
  },
  containerItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  containerTypeText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  containerDetails: {
    flex: 1,
  },
  containerSpecText: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  optionsContainer: {
    marginBottom: 8,
  },
  complexDataText: {
    fontSize: 15,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 12,
  },
  optionItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e6ed",
  },
  optionItemExpanded: {
    backgroundColor: "#f0f4f8",
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  optionDetails: {
    padding: 12,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#e0e6ed",
  },
  optionDetailText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
    lineHeight: 20,
  },
  nestedRequirements: {
    marginTop: 8,
  },
  nestedSectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  nestedRequirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingLeft: 4,
  },
  nestedRequirementText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  nestedSection: {
    marginTop: 8,
  },
  nestedItem: {
    marginBottom: 6,
    paddingLeft: 12,
  },
  nestedItemText: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  nestedItemSubText: {
    fontSize: 13,
    color: "#666",
    paddingLeft: 12,
    marginTop: 2,
  },
  notesContainer: {
    marginBottom: 8,
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  containerDetailItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e6ed",
  },
  containerDetailItemExpanded: {
    backgroundColor: "#f0f4f8",
  },
  containerDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  containerDetailTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  containerDetailContent: {
    padding: 12,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: "#e0e6ed",
  },
  containerDetailText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 6,
    lineHeight: 20,
  },
  nestedFeatures: {
    marginTop: 8,
  },
  nestedFeatureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingLeft: 4,
  },
  nestedFeatureText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  nestedNotes: {
    marginTop: 8,
  },
  nestedNoteItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingLeft: 4,
  },
  nestedNoteText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  footerText: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
  },
  containerSpecs: {
    marginTop: 15,
  },
});

export default GrandfatheredPackagingReferenceViewer;
