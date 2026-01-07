import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as Clipboard from "expo-clipboard";
import DraggableRegion from "../../components/SDDG/DraggableRegion";
import { AMC_IMT_1033_TEMPLATE } from "../../templates/AMC_IMT_1033";
import { Region, SDDGTemplate, FieldRegion } from "@/types/sddg-template";
import {
  templateToDisplay,
  displayToTemplate,
} from "@/utils/sddg/coordinateConverter";
import { correctImageOrientation } from "@/utils/sddg/imageUtils";

const SECTION_COLORS: Record<string, string> = {
  shipper: "rgba(255, 0, 0, 0.3)",
  consignee: "rgba(0, 255, 0, 0.3)",
  air_waybill: "rgba(0, 0, 255, 0.3)",
  shipper_reference: "rgba(255, 255, 0, 0.3)",
  transportation_details: "rgba(255, 0, 255, 0.3)",
  dangerous_goods: "rgba(0, 255, 255, 0.3)",
  additional_handling: "rgba(255, 128, 0, 0.3)",
  signature_block: "rgba(128, 0, 255, 0.3)",
  inspector: "rgba(128, 128, 0, 0.3)",
  shipment_type: "rgba(0, 128, 128, 0.3)",
};

interface RegionInfo {
  path: string;
  displayName: string;
  templateRegion: Region;
  displayRegion: Region;
  sectionName: string;
  color: string;
}

export default function RegionAdjustmentScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const { imageUri, isScanned } = route.params as {
    imageUri: string;
    isScanned?: boolean;
  };

  const [loading, setLoading] = useState(true);
  const [imageDims, setImageDims] = useState({ width: 0, height: 0 });
  const [displayScale, setDisplayScale] = useState(1);
  const [regions, setRegions] = useState<RegionInfo[]>([]);
  const [selectedRegionPath, setSelectedRegionPath] = useState<string | null>(
    null
  );
  const [adjustedRegions, setAdjustedRegions] = useState<
    Record<string, Region>
  >({});
  const [correctedImageUri, setCorrectedImageUri] = useState(imageUri);

  useEffect(() => {
    loadImageAndRegions();
  }, []);

  const loadImageAndRegions = async () => {
    try {
      setLoading(true);

      // Apply the same orientation correction as template extractor
      const orientationResult = await correctImageOrientation(
        imageUri,
        2550, // Template width (300 DPI)
        3300 // Template height (300 DPI)
      );

      setCorrectedImageUri(orientationResult.imageUri);
      const dims = {
        width: orientationResult.width,
        height: orientationResult.height,
      };
      setImageDims(dims);

      if (orientationResult.rotated) {
        console.log(
          `✓ Image rotated ${orientationResult.rotationDegrees}° for region adjustment`
        );
      }

      // Calculate display scale
      const screenWidth = Dimensions.get("window").width;
      const scale = screenWidth / dims.width;
      setDisplayScale(scale);

      // Extract all regions from template
      const template = AMC_IMT_1033_TEMPLATE;
      const extractedRegions = extractAllRegions(template);

      // Convert to display coordinates
      const regionsWithDisplay = extractedRegions.map(r => ({
        ...r,
        displayRegion: templateToDisplay(
          r.templateRegion,
          dims.width,
          dims.height
        ),
      }));

      console.log(`Loaded ${regionsWithDisplay.length} regions`);
      console.log(`Display scale: ${scale.toFixed(2)}x`);
      console.log(
        `First region:`,
        regionsWithDisplay[0]?.displayName,
        regionsWithDisplay[0]?.displayRegion
      );

      setRegions(regionsWithDisplay);
      setLoading(false);
    } catch (error) {
      console.error("Error loading image and regions:", error);
      setLoading(false);
    }
  };

  const extractAllRegions = (template: SDDGTemplate): RegionInfo[] => {
    const regions: RegionInfo[] = [];

    function traverse(obj: any, sectionName: string, path: string = "") {
      for (const key in obj) {
        const value = obj[key];
        const currentPath = path ? `${path}.${key}` : key;

        // Check if it's a FieldRegion
        if (
          value &&
          typeof value === "object" &&
          "x" in value &&
          "y" in value &&
          "w" in value &&
          "h" in value &&
          "fieldType" in value
        ) {
          const region: FieldRegion = value;
          const color =
            SECTION_COLORS[sectionName] || "rgba(128, 128, 128, 0.3)";

          regions.push({
            path: currentPath,
            displayName: formatDisplayName(currentPath),
            templateRegion: {
              x: region.x,
              y: region.y,
              w: region.w,
              h: region.h,
            },
            displayRegion: { x: 0, y: 0, w: 0, h: 0 }, // Will be filled later
            sectionName,
            color,
          });
        }
        // Otherwise recurse if it's an object
        else if (
          value &&
          typeof value === "object" &&
          !("fieldType" in value)
        ) {
          const newSectionName = path === "" ? key : sectionName;
          traverse(value, newSectionName, currentPath);
        }
      }
    }

    traverse(template.regions, "", "");
    return regions;
  };

  const formatDisplayName = (path: string): string => {
    // Convert path like "air_waybill.awb_number" to "Air Waybill › AWB Number"
    const parts = path.split(".");
    return parts
      .map(part =>
        part
          .split("_")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
      .join(" › ");
  };

  const handleRegionChange = (path: string, newDisplayRegion: Region) => {
    // Update the regions array
    setRegions(prevRegions =>
      prevRegions.map(r =>
        r.path === path ? { ...r, displayRegion: newDisplayRegion } : r
      )
    );

    // Track this as an adjusted region
    let templateRegion = displayToTemplate(
      newDisplayRegion,
      imageDims.width,
      imageDims.height
    );

    // Enforce minimum size in template coordinates (ML Kit requires 32×32 minimum)
    const MIN_TEMPLATE_SIZE = 32;
    if (templateRegion.w < MIN_TEMPLATE_SIZE) {
      templateRegion.w = MIN_TEMPLATE_SIZE;
    }
    if (templateRegion.h < MIN_TEMPLATE_SIZE) {
      templateRegion.h = MIN_TEMPLATE_SIZE;
    }

    setAdjustedRegions(prev => ({
      ...prev,
      [path]: templateRegion,
    }));
  };

  const handleResetRegion = (path: string) => {
    const region = regions.find(r => r.path === path);
    if (!region) return;

    // Reset to original template coordinates
    const displayRegion = templateToDisplay(
      region.templateRegion,
      imageDims.width,
      imageDims.height
    );

    setRegions(prevRegions =>
      prevRegions.map(r => (r.path === path ? { ...r, displayRegion } : r))
    );

    // Remove from adjusted regions
    setAdjustedRegions(prev => {
      const newAdjusted = { ...prev };
      delete newAdjusted[path];
      return newAdjusted;
    });
  };

  const handleResetAll = () => {
    // Reset all regions to original coordinates
    setRegions(prevRegions =>
      prevRegions.map(r => ({
        ...r,
        displayRegion: templateToDisplay(
          r.templateRegion,
          imageDims.width,
          imageDims.height
        ),
      }))
    );
    setAdjustedRegions({});
  };

  const handleSaveAndContinue = () => {
    // Create adjusted template
    const adjustedTemplate = createAdjustedTemplate();

    // Navigate to processing with adjusted template and corrected image
    navigation.navigate("SDDGProcessingScreen", {
      imageUri: correctedImageUri, // Use orientation-corrected image
      isScanned,
      customTemplate: adjustedTemplate,
    });
  };

  const createAdjustedTemplate = (): SDDGTemplate => {
    // Deep clone the original template
    const template = JSON.parse(JSON.stringify(AMC_IMT_1033_TEMPLATE));

    // Apply adjustments
    Object.entries(adjustedRegions).forEach(([path, templateRegion]) => {
      const parts = path.split(".");
      let current: any = template.regions;

      // Navigate to the region
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }

      const fieldName = parts[parts.length - 1];
      if (current[fieldName]) {
        // Update coordinates
        current[fieldName].x = templateRegion.x;
        current[fieldName].y = templateRegion.y;
        current[fieldName].w = templateRegion.w;
        current[fieldName].h = templateRegion.h;
      }
    });

    return template;
  };

  const handleExportTemplate = async () => {
    try {
      const adjustedTemplate = createAdjustedTemplate();

      // Add metadata about the adjustments
      const exportData = {
        template: adjustedTemplate,
        metadata: {
          originalTemplate: "AMC_IMT_1033",
          adjustedAt: new Date().toISOString(),
          adjustedFields: Object.keys(adjustedRegions).length,
          adjustedFieldsList: Object.keys(adjustedRegions),
        },
      };

      // Convert to formatted JSON
      const jsonContent = JSON.stringify(exportData, null, 2);

      // Create a filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `AMC_IMT_1033_adjusted_${timestamp}.json`;

      // Save to filesystem
      const fileUri = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(fileUri, jsonContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      console.log("Template saved to:", fileUri);

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // Show share dialog
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Export Adjusted Template",
          UTI: "public.json",
        });

        Alert.alert(
          "Template Exported",
          `Adjusted template has been exported successfully!\n\nAdjusted ${
            Object.keys(adjustedRegions).length
          } field(s).\n\nFile: ${filename}`,
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Template Saved",
          `Template saved to:\n${fileUri}\n\nNote: Sharing is not available on this device.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error exporting template:", error);
      Alert.alert(
        "Export Failed",
        `Failed to export template: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        [{ text: "OK" }]
      );
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const adjustedTemplate = createAdjustedTemplate();

      // Format the full template for pasting into AMC_IMT_1033.ts
      const templateJson = JSON.stringify(adjustedTemplate, null, 2);

      // Create the full export format ready to paste
      const output = `// Adjusted template - Generated ${new Date().toISOString()}
// Adjusted fields: ${Object.keys(adjustedRegions).join(", ") || "None"}

export const AMC_IMT_1033_TEMPLATE: SDDGTemplate = ${templateJson};`;

      await Clipboard.setStringAsync(output);

      Alert.alert(
        "Copied to Clipboard!",
        `Full template copied.\n\n${Object.keys(adjustedRegions).length} field(s) adjusted:\n${Object.keys(adjustedRegions).join("\n") || "None"}\n\nPaste into AMC_IMT_1033.ts`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      Alert.alert(
        "Copy Failed",
        `Failed to copy: ${error instanceof Error ? error.message : "Unknown error"}`,
        [{ text: "OK" }]
      );
    }
  };

  const selectedRegion = regions.find(r => r.path === selectedRegionPath);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading image...</Text>
        </View>
      ) : (
        <>
          {/* Top instruction banner */}
          <View style={styles.instructionBanner}>
            <Text style={styles.instructionText}>
              Tap a region to select, then drag corners/edges to adjust
            </Text>
          </View>

          {/* Image with region overlays */}
          <ScrollView
            style={styles.imageScrollView}
            contentContainerStyle={styles.imageContentContainer}
            maximumZoomScale={3}
            minimumZoomScale={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                width: imageDims.width * displayScale,
                height: imageDims.height * displayScale,
                position: "relative",
              }}
            >
              <Image
                source={{ uri: correctedImageUri }}
                style={{
                  width: imageDims.width * displayScale,
                  height: imageDims.height * displayScale,
                }}
                resizeMode="contain"
              />

              {/* Render all draggable regions */}
              {regions.map(region => {
                // Scale region for display
                const scaledRegion = {
                  x: region.displayRegion.x * displayScale,
                  y: region.displayRegion.y * displayScale,
                  w: region.displayRegion.w * displayScale,
                  h: region.displayRegion.h * displayScale,
                };

                const isSelected = selectedRegionPath === region.path;

                // Debug log for selected region
                if (isSelected) {
                  console.log(
                    `Rendering selected region: ${region.displayName}`
                  );
                  console.log(
                    `  Image coords: x=${region.displayRegion.x.toFixed(
                      0
                    )}, y=${region.displayRegion.y.toFixed(
                      0
                    )}, w=${region.displayRegion.w.toFixed(
                      0
                    )}, h=${region.displayRegion.h.toFixed(0)}`
                  );
                  console.log(
                    `  Scaled coords: x=${scaledRegion.x.toFixed(
                      0
                    )}, y=${scaledRegion.y.toFixed(
                      0
                    )}, w=${scaledRegion.w.toFixed(
                      0
                    )}, h=${scaledRegion.h.toFixed(0)}`
                  );
                  console.log(`  Display scale: ${displayScale.toFixed(2)}x`);
                }

                return (
                  <DraggableRegion
                    key={region.path}
                    region={scaledRegion}
                    isSelected={isSelected}
                    color={region.color}
                    onRegionChange={newRegion => {
                      // Convert back from display scale to image coordinates
                      const unscaledRegion = {
                        x: newRegion.x / displayScale,
                        y: newRegion.y / displayScale,
                        w: newRegion.w / displayScale,
                        h: newRegion.h / displayScale,
                      };
                      handleRegionChange(region.path, unscaledRegion);
                    }}
                    onSelect={() => {
                      console.log(
                        `Selected region from overlay: ${region.displayName}`
                      );
                      setSelectedRegionPath(region.path);
                    }}
                    imageWidth={imageDims.width * displayScale}
                    imageHeight={imageDims.height * displayScale}
                    label={region.displayName}
                  />
                );
              })}
            </View>
          </ScrollView>

          {/* Bottom control panel */}
          <View style={styles.controlPanel}>
            {/* Selected region info */}
            {selectedRegion && (
              <View style={styles.selectedRegionInfo}>
                <Text style={styles.selectedRegionName}>
                  {selectedRegion.displayName}
                </Text>
                <Text style={styles.coordinateText}>
                  Template: x=
                  {Math.round(
                    adjustedRegions[selectedRegion.path]?.x ||
                      selectedRegion.templateRegion.x
                  )}
                  , y=
                  {Math.round(
                    adjustedRegions[selectedRegion.path]?.y ||
                      selectedRegion.templateRegion.y
                  )}
                  , w=
                  {Math.round(
                    adjustedRegions[selectedRegion.path]?.w ||
                      selectedRegion.templateRegion.w
                  )}
                  , h=
                  {Math.round(
                    adjustedRegions[selectedRegion.path]?.h ||
                      selectedRegion.templateRegion.h
                  )}
                </Text>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => handleResetRegion(selectedRegion.path)}
                >
                  <Text style={styles.resetButtonText}>Reset This Region</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Region list */}
            <View style={styles.regionListContainer}>
              <Text style={styles.regionListTitle}>
                Regions ({regions.length}) -{" "}
                {Object.keys(adjustedRegions).length} adjusted
              </Text>
              <FlatList
                data={regions}
                keyExtractor={item => item.path}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.regionChip,
                      selectedRegionPath === item.path &&
                        styles.regionChipSelected,
                      adjustedRegions[item.path] && styles.regionChipAdjusted,
                    ]}
                    onPress={() => {
                      console.log(
                        `Selected region from chip: ${item.displayName}`
                      );
                      setSelectedRegionPath(item.path);
                    }}
                  >
                    <View
                      style={[
                        styles.regionChipColor,
                        { backgroundColor: item.color },
                      ]}
                    />
                    <Text
                      style={[
                        styles.regionChipText,
                        selectedRegionPath === item.path &&
                          styles.regionChipTextSelected,
                      ]}
                      numberOfLines={1}
                    >
                      {item.displayName}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {/* Action buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.resetAllButton}
                onPress={handleResetAll}
              >
                <Text style={styles.resetAllButtonText}>Reset All</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyToClipboard}
              >
                <Text style={styles.copyButtonText}>📋 Copy JSON</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAndContinue}
              >
                <Text style={styles.saveButtonText}>
                  Save & Continue to OCR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#aaa",
  },
  instructionBanner: {
    backgroundColor: "#007AFF",
    padding: 12,
  },
  instructionText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  imageScrollView: {
    flex: 1,
  },
  imageContentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  controlPanel: {
    backgroundColor: "#2a2a2a",
    borderTopWidth: 1,
    borderTopColor: "#444",
    paddingBottom: 20,
  },
  selectedRegionInfo: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  selectedRegionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  coordinateText: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: "#FF9500",
    padding: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  regionListContainer: {
    padding: 15,
  },
  regionListTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
  },
  regionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a3a3a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    maxWidth: 150,
  },
  regionChipSelected: {
    backgroundColor: "#007AFF",
  },
  regionChipAdjusted: {
    borderWidth: 2,
    borderColor: "#00FF00",
  },
  regionChipColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  regionChipText: {
    fontSize: 12,
    color: "#fff",
  },
  regionChipTextSelected: {
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    padding: 15,
    gap: 10,
  },
  resetAllButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  resetAllButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  copyButton: {
    flex: 1,
    backgroundColor: "#FF9500",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  exportButton: {
    flex: 1.5,
    backgroundColor: "#FF9500",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  exportButtonDisabled: {
    backgroundColor: "#666",
    opacity: 0.5,
  },
  exportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 2,
    backgroundColor: "#34C759",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
