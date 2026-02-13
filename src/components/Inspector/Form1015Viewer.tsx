import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import legacyColors from "../../theming/colors";
import {
  mapFrustrationsToForm1015WithResolved,
  getForm1015FrustrationDescription,
  SDDG_TO_FORM1015_MAPPING,
  getPackageFrustrationField,
} from "../../utils/sddgToForm1015Mapping";
import { getLatestReinspectionInfo } from "../../utils/reinspectionInfo";
import { Form1015CheckBoxWithStatus } from "./Form1015CheckboxWithStatus";
import { colors, spacing, borderRadius } from "../ui";
import { InspectorShipment } from "../../types/sddg";
import { buildForm1015PdfData, shareForm1015Pdf } from "../../utils/form1015PdfGenerator";

interface Form1015ViewerProps {
  inspection: InspectorShipment;
  onClose: () => void;
}

// Section types for FlatList
type SectionItem =
  | { type: "header" }
  | { type: "grid-header" }
  | { type: "checkbox-row"; leftId: string; leftLabel: string; rightId?: string; rightLabel?: string; isRightHeader?: boolean }
  | { type: "stacked-row"; leftId: string; leftLabel: string; rightItems: { id?: string; label: string; isHeader?: boolean }[] }
  | { type: "section-header"; title: string; subtitle?: string }
  | { type: "full-row"; id: string; label: string }
  | { type: "comments" }
  | { type: "final-row" };

export const Form1015Viewer: React.FC<Form1015ViewerProps> = ({
  inspection,
  onClose,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Get data from inspectionContext (where database stores full inspection data)
  const context = (inspection.inspectionContext || {}) as any;

  // Get frustrations from inspectionContext
  const sddgFrustrations = useMemo(() =>
    Array.isArray(context.frustrations) ? context.frustrations : [],
    [context.frustrations]
  );
  const packageFrustrations = useMemo(() =>
    Array.isArray(context.packageFrustrations) ? context.packageFrustrations : [],
    [context.packageFrustrations]
  );
  const resolvedSddgFrustrations = useMemo(() =>
    Array.isArray(context.resolvedFrustrations) ? context.resolvedFrustrations : [],
    [context.resolvedFrustrations]
  );
  const resolvedPackageFrustrations = useMemo(() =>
    Array.isArray(context.resolvedPackageFrustrations) ? context.resolvedPackageFrustrations : [],
    [context.resolvedPackageFrustrations]
  );
  const verificationCopy = context.verificationCopy || null;

  // Format inspector helper
  const formatInspector = useCallback((inspectorData: any): string => {
    if (typeof inspectorData === "string") {
      return inspectorData.replace(",", " ").replace(/\s+/g, " ").trim();
    }
    if (inspectorData && typeof inspectorData === "object") {
      const name = inspectorData.inspectorName || "";
      return name.replace(",", " ").replace(/\s+/g, " ").trim();
    }
    return "";
  }, []);

  const inspector = formatInspector(inspection.inspector);

  // Map frustrations to Form 1015 line items
  const { currentlyFrustrated: frustratedForm1015Ids, resolved: resolvedForm1015Ids } = useMemo(() =>
    mapFrustrationsToForm1015WithResolved(
      sddgFrustrations,
      packageFrustrations,
      resolvedSddgFrustrations,
      resolvedPackageFrustrations,
      verificationCopy
    ),
    [sddgFrustrations, packageFrustrations, resolvedSddgFrustrations, resolvedPackageFrustrations, verificationCopy]
  );

  // Determine validation status
  const anyFailed = sddgFrustrations.length > 0 || packageFrustrations.length > 0;
  const allPassed = sddgFrustrations.length === 0 && packageFrustrations.length === 0;

  // Get TCN
  const tcn = verificationCopy?.shippersReferenceNumber || inspection.tcn || "N/A";

  // Format dates
  const currentDate = new Date();
  const inspectedByDate = currentDate.toISOString().split("T")[0].replace(/-/g, "");

  // Check corrective actions
  const hasResolvedFrustrations = resolvedSddgFrustrations.length > 0 || resolvedPackageFrustrations.length > 0;
  const correctiveActionsChecked = hasResolvedFrustrations && allPassed;

  const { latestDate: reinspectionDate, latestInspector } = useMemo(() =>
    getLatestReinspectionInfo({
      sddgFrustrations,
      packageFrustrations,
      resolvedSddgFrustrations,
      resolvedPackageFrustrations,
    }),
    [sddgFrustrations, packageFrustrations, resolvedSddgFrustrations, resolvedPackageFrustrations]
  );

  const normalizedLatestInspector = latestInspector ? formatInspector(latestInspector) : "";
  const reinspectedByDate = reinspectionDate
    ? reinspectionDate.toISOString().split("T")[0].replace(/-/g, "")
    : "";
  const hasReinspectionAttempts = !!reinspectionDate;
  const reinspectedByName = hasReinspectionAttempts ? normalizedLatestInspector || inspector : "N/A";
  const correctedByName = correctiveActionsChecked ? normalizedLatestInspector || inspector : "N/A";
  const inspectedByName = inspector || "N/A";

  // Format frustrations for comments - matching InspectorAMC1015Form exactly
  const failedItems = useMemo(() => {
    interface TimelineEntry {
      date: Date;
      lineNumber: string;
      formatted: string;
    }
    const allEntries: TimelineEntry[] = [];

    // Helper to format date and time - exactly matching InspectorAMC1015Form
    const formatDateTime = (date: Date) => {
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
        timeZoneName: "short",
      });
      return { formattedDate, formattedTime };
    };

    // Process SDDG frustrations (current + resolved)
    const allSddgFrustrations = [...sddgFrustrations, ...resolvedSddgFrustrations];
    allSddgFrustrations.forEach((frustration: any) => {
      // Look up the Form 1015 ID from the SDDG key mapping
      const form1015Id = SDDG_TO_FORM1015_MAPPING[frustration.key] ||
        Array.from(frustratedForm1015Ids).find(id => {
          const description = getForm1015FrustrationDescription(id, sddgFrustrations, []);
          return description === frustration.fieldLabel;
        }) ||
        Array.from(resolvedForm1015Ids).find(id => {
          const description = getForm1015FrustrationDescription(id, resolvedSddgFrustrations, []);
          return description === frustration.fieldLabel;
        });
      const lineNumber = form1015Id || "N/A";

      // Add original frustration entry
      const { formattedDate, formattedTime } = formatDateTime(
        new Date(frustration.frustrationDate || frustration.createdAt || new Date())
      );
      allEntries.push({
        date: new Date(frustration.frustrationDate || frustration.createdAt || new Date()),
        lineNumber,
        formatted: `${lineNumber}. – ${formattedDate} @ ${formattedTime} – ${(frustration.fieldLabel || frustration.message || "").toUpperCase()} – Inspector: ${formatInspector(frustration.inspector)}`,
      });

      // Add all reinspection attempts
      if (frustration.reinspectionHistory && frustration.reinspectionHistory.length > 0) {
        frustration.reinspectionHistory.forEach((attempt: any) => {
          const { formattedDate: reinspectDate, formattedTime: reinspectTime } =
            formatDateTime(new Date(attempt.date));
          const action = attempt.action === "verified" ? "VERIFIED" : "FRUSTRATED";
          const comments = attempt.additionalComments ? ` – ${attempt.additionalComments}` : "";
          allEntries.push({
            date: new Date(attempt.date),
            lineNumber,
            formatted: `${lineNumber}. – ${reinspectDate} @ ${reinspectTime} – REINSPECTED: ${action} – Inspector: ${formatInspector(attempt.inspector)}${comments}`,
          });
        });
      }
    });

    // Process package frustrations (current + resolved)
    const allPackageFrustrations = [
      ...packageFrustrations.filter(
        (f: any) => f.verificationStatus === "missing" || f.verificationStatus === "incorrect"
      ),
      ...resolvedPackageFrustrations.filter(
        (f: any) => f.verificationStatus === "missing" || f.verificationStatus === "incorrect"
      ),
    ];
    allPackageFrustrations.forEach((frustration: any) => {
      // Directly look up the form1015Id from the mapping using the frustration's itemLabel
      const form1015Id = getPackageFrustrationField(frustration) ||
        Array.from(frustratedForm1015Ids).find(id => {
          const description = getForm1015FrustrationDescription(id, [], packageFrustrations);
          return description?.includes(frustration.itemLabel);
        }) ||
        Array.from(resolvedForm1015Ids).find(id => {
          const description = getForm1015FrustrationDescription(id, [], resolvedPackageFrustrations);
          return description?.includes(frustration.itemLabel);
        });
      const lineNumber = form1015Id || "N/A";

      // Determine label display - for MSL mapped to Field 75 (Other), add "MSL" annotation
      let labelDisplay = (frustration.itemLabel || frustration.label || "").toUpperCase();
      if (
        frustration.itemLabel === "Military Shipping Label (MSL) or DD Form 1387" &&
        lineNumber === "75"
      ) {
        labelDisplay = "MSL (MILITARY SHIPPING LABEL)";
      }

      // Add original frustration entry
      const { formattedDate, formattedTime } = formatDateTime(
        new Date(frustration.frustrationDate || frustration.createdAt || new Date())
      );
      const magnetizedComments =
        frustration.category === "magnetized" && frustration.additionalComments
          ? ` – ${frustration.additionalComments}`
          : "";
      allEntries.push({
        date: new Date(frustration.frustrationDate || frustration.createdAt || new Date()),
        lineNumber,
        formatted: `${lineNumber}. – ${formattedDate} @ ${formattedTime} – ${labelDisplay} – Inspector: ${formatInspector(frustration.inspector)}${magnetizedComments}`,
      });

      // Add all reinspection attempts
      if (frustration.reinspectionHistory && frustration.reinspectionHistory.length > 0) {
        frustration.reinspectionHistory.forEach((attempt: any) => {
          const { formattedDate: reinspectDate, formattedTime: reinspectTime } =
            formatDateTime(new Date(attempt.date));
          const action = attempt.action === "verified" ? "VERIFIED" : "FRUSTRATED";
          const comments = attempt.additionalComments ? ` – ${attempt.additionalComments}` : "";
          allEntries.push({
            date: new Date(attempt.date),
            lineNumber,
            formatted: `${lineNumber}. – ${reinspectDate} @ ${reinspectTime} – REINSPECTED: ${action} – Inspector: ${formatInspector(attempt.inspector)}${comments}`,
          });
        });
      }
    });

    // Sort all entries chronologically
    allEntries.sort((a, b) => a.date.getTime() - b.date.getTime());
    return allEntries.map((entry) => ({ formatted: entry.formatted }));
  }, [sddgFrustrations, packageFrustrations, resolvedSddgFrustrations, resolvedPackageFrustrations, formatInspector, frustratedForm1015Ids, resolvedForm1015Ids]);

  // PDF generation
  const generateAndSharePdf = async () => {
    try {
      setIsGeneratingPdf(true);
      const pdfData = buildForm1015PdfData(inspection);
      await shareForm1015Pdf(pdfData);
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate or share PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Build FlatList data - Complete field structure matching InspectorAMC1015Form
  const sectionData = useMemo((): SectionItem[] => {
    const data: SectionItem[] = [];

    // Header section
    data.push({ type: "header" });

    // Grid header
    data.push({ type: "grid-header" });

    // Row 1 - stacked (Field 1 with 33, 34)
    data.push({
      type: "stacked-row",
      leftId: "1",
      leftLabel: "1. THREE ORIGINAL DOCUMENTS FOR EACH PROPER SHIPPING NAME (PSN) UNDER A SINGLE TCN (ONLY TWO REQUIRED FOR CHAPTER 3)",
      rightItems: [
        { id: "33", label: "33. CRYOGENICS VENTING REQUIREMENTS" },
        { id: "34", label: "34. SECONDARY HAZARD PSN, CLASS OR DIVISION AND NET QUANTITY" },
      ],
    });

    // Fields 2-10 with 35-41 (regular checkbox rows)
    const checkboxRows: [string, string, string?, string?, boolean?][] = [
      ["2", "2. SHIPPER'S ADDRESS AND PHONE NUMBER", "35", "35. HANDLING INSTRUCTIONS"],
      ["3", "3. CONSIGNEE DODAAC OR ADDRESS (OR WORLDWIDE MOBILITY)", "36", "36. OTHER"],
      ["4", "4. TRANSPORTATION CONTROL NUMBER (TCN)", undefined, "PACKAGING--OUTER", true],
      ["5", "5. AIRPORT OF DEPARTURE AND DESTINATION (OR WORLDWIDE MOBILITY)", "37", "37. CONTAINER SERVICEABLE; DAMAGE, LEAKAGE OR LOSS CONTENTS"],
      ["6", "6. NAME AND TITLE OF PREPARER WITH SIGNATURE", "38", "38. APPROVED OUTER CONTAINER (IF REQUIRED)"],
      ["7", "7. PLACE AND DATE MATERIAL CERTIFIED", "39", "39. PACKAGE PERMITTED BY PACKAGING REFERENCE"],
      ["8", "8. PEN AND INK CHANGES SIGNED", "40", "40. OTHER"],
      ["9", "9. EMERGENCY RESPONSE NUMBER", undefined, "IF APPLICABLE", true],
      ["10", "10. OTHER", "41", "41. ULLAGE"],
    ];

    checkboxRows.forEach(([leftId, leftLabel, rightId, rightLabel, isRightHeader]) => {
      data.push({
        type: "checkbox-row",
        leftId,
        leftLabel,
        rightId,
        rightLabel,
        isRightHeader: isRightHeader || false,
      });
    });

    // Field 11 with section header + Field 42
    data.push({
      type: "stacked-row",
      leftId: "11",
      leftLabel: "11. IDENTIFIES WHETHER PACKED WITHIN PASSENGER OR CARGO AIRCRAFT ONLY",
      rightItems: [
        { label: "CARGO IDENTIFICATION (NATURE & QUANTITY OF HAZMAT)", isHeader: true },
        { id: "42", label: "42. UN SPECIFICATION OR POP CONTAINER MATCHES CORRESPONDING PACKING GROUP" },
      ],
    });

    // Fields 12-13 stacked with 43
    data.push({
      type: "stacked-row",
      leftId: "12",
      leftLabel: "12. IDENTIFIES RADIOACTIVE OR NONRADIOACTIVE SHIPMENT",
      rightItems: [
        { id: "43", label: "43. GROSS WEIGHT OF PACKAGE IS EQUAL TO OR LESS THAN TESTED WEIGHT INDICATED AS PART OF POP MARKING" },
      ],
    });
    // Add field 13 as part of the same conceptual block
    data.push({
      type: "checkbox-row",
      leftId: "13",
      leftLabel: "13. IDENTIFICATION NUMBER (UN, ID, NA)",
      rightId: undefined,
      rightLabel: undefined,
    });

    // Fields 14-15 stacked with 44
    data.push({
      type: "stacked-row",
      leftId: "14",
      leftLabel: "14. PSN (WITH TECHNICAL NAME IF REQUIRED)",
      rightItems: [
        { id: "44", label: "44. SINGLE PACKAGE (CONTAINING A LIQUID) TESTED PRESSURE (KPA) AGREES WITH CONTAINER REQUIREMENTS" },
      ],
    });
    data.push({
      type: "checkbox-row",
      leftId: "15",
      leftLabel: "15. PRIMARY HAZARD CLASS OR DIVISION (COMPATIBILITY GROUP FOR EXPLOSIVES)",
      rightId: undefined,
      rightLabel: undefined,
    });

    // Field 16 with 45
    data.push({
      type: "checkbox-row",
      leftId: "16",
      leftLabel: "16. SUBSIDIARY RISK CLASS OR DIVISION, IF ASSIGNED",
      rightId: "45",
      rightLabel: "45. OTHER",
    });

    // Field 17 with section header PACKAGING--INNER
    data.push({
      type: "checkbox-row",
      leftId: "17",
      leftLabel: "17. PACKAGING GROUP",
      rightId: undefined,
      rightLabel: "PACKAGING--INNER (IF INSPECTED AND APPLICABLE)",
      isRightHeader: true,
    });

    // Fields 18-22 with 46-50
    data.push({
      type: "checkbox-row",
      leftId: "18",
      leftLabel: "18. NUMBER AND TYPE OF PACKAGES",
      rightId: "46",
      rightLabel: "46. ABSORBENT MATERIAL",
    });
    data.push({
      type: "checkbox-row",
      leftId: "19",
      leftLabel: "19. NET QUANTITY PER PACKAGE (METRIC UNLESS EXCEPTED)",
      rightId: "47",
      rightLabel: "47. LEAK OR ACID PROOF LINER",
    });
    data.push({
      type: "checkbox-row",
      leftId: "20",
      leftLabel: "20. R--ACTIVITY PER PACKAGE GIVEN IN BECQUEREL SYSTEM",
      rightId: "48",
      rightLabel: "48. INNER RECEPTACLE ORIENTA",
    });
    data.push({
      type: "checkbox-row",
      leftId: "21",
      leftLabel: "21. R--NAME AND SYMBOL OF MATERIAL",
      rightId: "49",
      rightLabel: "49. SECONDARY CLOSURE",
    });
    data.push({
      type: "checkbox-row",
      leftId: "22",
      leftLabel: "22. R--MATERIAL PHYSICAL AND CHEMICAL FORM",
      rightId: "50",
      rightLabel: "50. OTHER",
    });

    // Field 23 with MARKING section header
    data.push({
      type: "checkbox-row",
      leftId: "23",
      leftLabel: "23. PACKAGING PARAGRAPH (FROM ATTACHMENTS 5-13)",
      rightId: undefined,
      rightLabel: "MARKING",
      isRightHeader: true,
    });

    // Row A (text only) with 53
    data.push({
      type: "checkbox-row",
      leftId: "",
      leftLabel: "A. \"A3.1.7.3\" USED WHEN POP TESTED PACKAGE IS OVERPACKED TO MEET AIR REQUIREMENTS",
      rightId: "53",
      rightLabel: "53. PSN AND IDENTIFICATION NUMBER",
    });

    // Row B (text only) with IF APPLICABLE header + 54, 55
    data.push({
      type: "stacked-row",
      leftId: "",
      leftLabel: "B. PACKAGING REFERENCE FROM ATTACHMENT 27 USED FOR EXPLOSIVES MEETING GRANDFATHER CLAUSE",
      rightItems: [
        { label: "IF APPLICABLE", isHeader: true },
        { id: "54", label: "54. UN OR POP SPECIFICATION MARKING" },
        { id: "55", label: "55. \"RQ\"" },
      ],
    });

    // Row C (text only) with 56, 57, 58
    data.push({
      type: "stacked-row",
      leftId: "",
      leftLabel: "C. UNPACKAGED EXPLOSIVES AUTHORIZED IAW \"A5.2\"",
      rightItems: [
        { id: "56", label: "56. \"WASTE\"" },
        { id: "57", label: "57. \"AIR ELIGIBLE\" MARKING OR SYMBOL" },
        { id: "58", label: "58. \"OVERPACKS\" IDENTIFIED" },
      ],
    });

    // Field 24 with 59
    data.push({
      type: "checkbox-row",
      leftId: "24",
      leftLabel: "24. DOT-E, COE, CAA OR OTHER APPROVED DOCUMENT USED AS CERTIFICATION REFERENCE (COPY ACCOMPANIES SHIPMENT)",
      rightId: "59",
      rightLabel: "59. \"ORIENTATION ARROWS\"",
    });

    // Field 25 with 60, 61
    data.push({
      type: "stacked-row",
      leftId: "25",
      leftLabel: "25. 49CFR, IATA OR ICAO REFERENCE USED AS CERTIFICATION REFERENCE (IF MEETING PASSENGER RESTRICTIONS)",
      rightItems: [
        { id: "60", label: "60. LIMITED QUANTITY IDENTIFIED" },
        { id: "61", label: "61. \"ORM-D\" OR \"ORM-D-AIR\" FOR DOMESTIC ONLY SHIPMENT" },
      ],
    });

    // Fields 26-27 stacked with 62
    data.push({
      type: "stacked-row",
      leftId: "26",
      leftLabel: "26. --CATEGORY OF RADIOACTIVE PACKAGE",
      rightItems: [
        { id: "62", label: "62. \"INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS\"" },
      ],
    });
    data.push({
      type: "checkbox-row",
      leftId: "27",
      leftLabel: "27. R--TRANSPORT INDEX",
      rightId: undefined,
      rightLabel: undefined,
    });

    // IF APPLICABLE section header with 63
    data.push({
      type: "checkbox-row",
      leftId: "",
      leftLabel: "",
      rightId: "63",
      rightLabel: "63. DOT SPECIAL PERMIT (WHEN USED AS CERTIFICATION REFERENCE)",
      isRightHeader: false,
    });

    // Field 28 with 64
    data.push({
      type: "checkbox-row",
      leftId: "28",
      leftLabel: "28. \"RQ\" IDENTIFIES A PSN AS HAZARDOUS SUBSTANCE",
      rightId: "64",
      rightLabel: "64. COE NUMBER (WHEN USED AS CERTIFICATION REFERENCE)",
    });

    // Field 29 with 65
    data.push({
      type: "checkbox-row",
      leftId: "29",
      leftLabel: "29. \"WASTE\" IF MARKED OR LABELED ON PACKAGE",
      rightId: "65",
      rightLabel: "65. CAA NUMBER (IF REQUIRED BY CAA)",
    });

    // Field 30 with 66
    data.push({
      type: "checkbox-row",
      leftId: "30",
      leftLabel: "30. \"INHALATION HAZARD (ZONE)\" (IF MATERIAL MEETS THIS DEFINITION)",
      rightId: "66",
      rightLabel: "66. FLASHPOINT (FOR FLAMMABLE LIQUIDS)",
    });

    // Field 31 with 67
    data.push({
      type: "checkbox-row",
      leftId: "31",
      leftLabel: "31. IF OVERPACKED, THE WORDS \"OVERPACK USED\"",
      rightId: "67",
      rightLabel: "67. NSN (OR PART NUMBER) FOR EXPLOSIVES",
    });

    // Field 32 with 68
    data.push({
      type: "checkbox-row",
      leftId: "32",
      leftLabel: "32. \"LIMITED QUANTITY\" OR \"LTD QTY\"",
      rightId: "68",
      rightLabel: "68. OTHER",
    });

    // Page 2 instructions
    data.push({ type: "section-header", title: "INSTRUCTIONS", subtitle: "ENTER \"X\" TO IDENTIFY NONCOMPLIANCE. USE COMMENTS BLOCK TO PROVIDE ADDITIONAL DETAILS. CIRCLE \"X\" WHEN CORRECTIVE ACTION IS COMPLETED. SIGN INSPECTION VALIDATION BLOCK AND ATTACH TO SHIPPER'S DECLARATION FILED WITH STATION MANIFEST." });

    // Labeling section
    data.push({ type: "section-header", title: "LABELING" });
    [
      ["69", "69. PRIMARY RISK LABEL"],
      ["70", "70. R--RADIOACTIVE MATERIAL LABELS ON OPPOSITE SIDES OF PACKAGE"],
    ].forEach(([id, label]) => data.push({ type: "full-row", id, label }));

    data.push({ type: "section-header", title: "IF APPLICABLE" });
    [
      ["71", "71. SUBSIDIARY RISK LABELS"],
      ["72", "72. \"CARGO AIRCRAFT ONLY\" (NOT MANDATORY FOR MOBILITY OPERATIONS)"],
      ["73", "73. \"MAGNETIZED MATERIAL\""],
      ["74", "74. \"EMPTY\""],
      ["75", "75. OTHER"],
    ].forEach(([id, label]) => data.push({ type: "full-row", id, label }));

    data.push({ type: "section-header", title: "VEHICLES AND EQUIPMENT", subtitle: "USE DD FORM 2133 AS CHECKLIST FOR DEPLOYMENT OPERATIONS(DTR,PARTIII)" });
    [
      ["76", "76. FUEL GUAGE OPERATIVE OR DIP STICK AVAILABLE"],
      ["77", "77. VEHICLES AND SELF-PROPELLED EQUIPMENT WITH FUEL QTY NOT EXCEEDING 1/2 TANK CAPACITY"],
      ["78", "78. SUPPORT EQUIPMENT DRAINED"],
      ["79", "79. NO EXISTING FUEL LEAKS"],
      ["80", "80. ALL ADDITIONAL HAZARDS IDENTIFIED (SEE BLOCK 36)"],
      ["81", "81. SECONDARY LOADS CERTIFIED, PACKAGED AND MARKED"],
      ["82", "82. BULK FLAMMABLE LIQUID FUEL TANKS DRAINED OR PURGED AS REQUIRED"],
      ["83", "83. SPARE FUEL IN AUTHORIZED CONTAINERS"],
      ["84", "84. BATTERY POSTS PROTECTED"],
      ["85", "85. FIRE EXTINGUISHERS IN APPROVED HOLDER"],
      ["86", "86. OTHER"],
    ].forEach(([id, label]) => data.push({ type: "full-row", id, label }));

    // Comments section
    data.push({ type: "comments" });

    // Final row
    data.push({ type: "final-row" });

    return data;
  }, []);

  // Render header component
  const renderHeader = () => (
    <View style={styles.formContainer}>
      {/* Title Row */}
      <View style={styles.row}>
        <View style={styles.titleBlock}>
          <Text style={styles.titleText}>HAZMAT INSPECTION AND ACCEPTANCE CHECKLIST</Text>
        </View>
        <View style={styles.tcnBlock}>
          <Text style={styles.label}>TCN</Text>
          <Text style={styles.tcnValue}>{tcn}</Text>
        </View>
      </View>

      {/* Validation Banner */}
      <View style={styles.validationBanner}>
        <Text style={styles.validationBannerText}>INSPECTION VALIDATION</Text>
      </View>

      {/* Compliance Row */}
      <View style={styles.row2}>
        <View style={styles.flex20}>
          <Text style={styles.label}>THIS SHIPMENT HAS BEEN INSPECTED AND</Text>
        </View>
        <View style={styles.flex40Row}>
          <View style={styles.checkbox}>
            {allPassed && <Text style={styles.checkboxMark}>X</Text>}
          </View>
          <Text style={styles.labelSmall}>COMPLIES WITH ALL REGULATORY REQUIREMENTS</Text>
        </View>
        <View style={styles.flex40Row}>
          <View style={styles.checkbox}>
            {anyFailed && <Text style={styles.checkboxMark}>X</Text>}
          </View>
          <Text style={styles.labelSmall}>DOES NOT COMPLY WITH ALL REGULATORY REQUIREMENTS AS INDICATED</Text>
        </View>
      </View>

      {/* Inspector Info Row */}
      <View style={styles.row2}>
        <View style={styles.flex20}>
          <Text style={styles.label}>DATE (YYYYMMDD)</Text>
          <Text style={styles.value}>{inspectedByDate || "N/A"}</Text>
        </View>
        <View style={styles.flex30}>
          <Text style={styles.label}>INSPECTED BY (NAME)</Text>
          <Text style={styles.value}>{inspectedByName}</Text>
        </View>
        <View style={styles.flex20}>
          <Text style={styles.label}>DATE (YYYYMMDD)</Text>
          <Text style={styles.value}>{correctiveActionsChecked ? reinspectedByDate : "N/A"}</Text>
        </View>
        <View style={styles.flex30}>
          <Text style={styles.label}>CORRECTED BY (NAME)</Text>
          <Text style={styles.value}>{correctedByName}</Text>
        </View>
      </View>

      {/* Re-inspection Row */}
      <View style={styles.row2}>
        <View style={styles.flex20}>
          <Text style={styles.label}>DATE (YYYYMMDD)</Text>
          <Text style={styles.value}>{hasReinspectionAttempts ? reinspectedByDate : "N/A"}</Text>
        </View>
        <View style={styles.flex30}>
          <Text style={styles.label}>RE-INSPECTED BY (NAME)</Text>
          <Text style={styles.value}>{reinspectedByName}</Text>
        </View>
        <View style={styles.flex50Row}>
          <View style={styles.checkbox}>
            {correctiveActionsChecked && <Text style={styles.checkboxMark}>X</Text>}
          </View>
          <Text style={styles.labelSmall}>
            CORRECTIVE ACTIONS CHECKED. SHIPMENT COMPLIES WITH ALL REGULATORY REQUIREMENTS.
          </Text>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsBlock}>
        <Text style={styles.instructionsText}>
          <Text style={{ fontStyle: "italic" }}>
            ENTER <Text style={{ fontWeight: "bold" }}>"X"</Text> TO IDENTIFY NONCOMPLIANCE. USE{" "}
            <Text style={{ fontWeight: "bold" }}>COMMENTS</Text> BLOCK TO PROVIDE ADDITIONAL DETAILS. CIRCLE{" "}
            <Text style={{ fontWeight: "bold" }}>"X"</Text> WHEN CORRECTIVE ACTION IS COMPLETED. SIGN INSPECTION{" "}
            <Text style={{ fontWeight: "bold" }}>VALIDATION BLOCK</Text> AND ATTACH TO SHIPPER'S DECLARATION FILED WITH STATION MANIFEST.
            THOSE ITEMS THAT APPLY ONLY TO RADIOACTIVE MATERIAL ARE IDENTIFIED BY AN{" "}
            <Text style={{ fontWeight: "bold" }}>"R"</Text>.{" "}
            <Text style={{ fontWeight: "bold" }}>ADDITIONAL CHECKPOINTS ON THE REVERSE.</Text>
          </Text>
        </Text>
      </View>

      {/* Grid Header */}
      <View style={styles.row2}>
        <View style={styles.gridHeaderLeft}>
          <Text style={styles.sectionHeader}>SHIPPER'S DECLARATION</Text>
        </View>
        <View style={styles.gridHeaderRight}>
          <Text style={styles.sectionHeader}>CARGO IDENTIFICATION (IF APPLICABLE) (CONTINUED)</Text>
        </View>
      </View>
    </View>
  );

  // Render each item
  const renderItem = useCallback(({ item }: { item: SectionItem }) => {
    switch (item.type) {
      case "header":
        return renderHeader();

      case "grid-header":
        return null; // Already rendered in header

      case "checkbox-row":
        return (
          <View style={styles.row2}>
            <View style={styles.cell}>
              {item.leftId ? (
                <Form1015CheckBoxWithStatus
                  identifier={item.leftId}
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
              ) : null}
              <Text style={styles.cellText}>{item.leftLabel}</Text>
            </View>
            {item.isRightHeader ? (
              <View style={styles.cellRightSectionHeader}>
                <Text style={styles.sectionHeader}>{item.rightLabel}</Text>
              </View>
            ) : (
              <View style={styles.cellRight}>
                {item.rightId ? (
                  <>
                    <Form1015CheckBoxWithStatus
                      identifier={item.rightId}
                      frustratedForm1015Ids={frustratedForm1015Ids}
                      resolvedForm1015Ids={resolvedForm1015Ids}
                    />
                    <Text style={styles.cellText}>{item.rightLabel}</Text>
                  </>
                ) : item.rightLabel ? (
                  <Text style={styles.cellText}>{item.rightLabel}</Text>
                ) : null}
              </View>
            )}
          </View>
        );

      case "stacked-row":
        return (
          <View style={styles.row2}>
            <View style={styles.leftSpanCell}>
              {item.leftId ? (
                <Form1015CheckBoxWithStatus
                  identifier={item.leftId}
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
              ) : null}
              <Text style={styles.cellText}>{item.leftLabel}</Text>
            </View>
            <View style={styles.rightStacked}>
              {item.rightItems.map((ri, idx) => (
                <View key={idx} style={[ri.isHeader ? styles.subRowSectionHeader : styles.subRow, idx > 0 && styles.rowBorderTop]}>
                  {ri.isHeader ? (
                    <Text style={styles.sectionHeader}>{ri.label}</Text>
                  ) : ri.id ? (
                    <>
                      <Form1015CheckBoxWithStatus
                        identifier={ri.id}
                        frustratedForm1015Ids={frustratedForm1015Ids}
                        resolvedForm1015Ids={resolvedForm1015Ids}
                      />
                      <Text style={styles.cellText}>{ri.label}</Text>
                    </>
                  ) : (
                    <Text style={styles.cellText}>{ri.label}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        );

      case "section-header":
        return (
          <View style={styles.centeredSectionRow}>
            <Text style={styles.sectionHeader}>{item.title}</Text>
            {item.subtitle && (
              <Text style={[styles.instructionsText, { fontStyle: "italic", textAlign: "center" }]}>
                {item.subtitle}
              </Text>
            )}
          </View>
        );

      case "full-row":
        return (
          <View style={styles.fullRow}>
            <Form1015CheckBoxWithStatus
              identifier={item.id}
              frustratedForm1015Ids={frustratedForm1015Ids}
              resolvedForm1015Ids={resolvedForm1015Ids}
            />
            <Text style={styles.cellText}>{item.label}</Text>
          </View>
        );

      case "comments":
        return (
          <View style={styles.commentsContainer}>
            <View style={styles.commentsHeader}>
              <Text style={styles.cellText2}>87. COMMENTS/REASON(S) FOR FRUSTRATION</Text>
            </View>
            <View style={styles.commentsBody}>
              {failedItems.length > 0 ? (
                failedItems.map((item, index) => (
                  <Text key={index} style={styles.commentsText}>{item.formatted}</Text>
                ))
              ) : (
                <Text style={styles.commentsPlaceholder}>No frustrations recorded.</Text>
              )}
            </View>
          </View>
        );

      case "final-row":
        return (
          <View style={styles.finalRow}>
            <View style={styles.inspectionStatus}>
              <View style={styles.inspectionInlineRow}>
                <Text style={styles.label2}>OPENED FOR INSPECTION:</Text>
                <View style={styles.checkbox} />
                <Text style={styles.labelSmall}>YES</Text>
                <View style={[styles.checkbox, { marginLeft: 12 }]} />
                <Text style={styles.labelSmall}>NO</Text>
              </View>
            </View>
            <View style={styles.optionalUse}>
              <View style={styles.optionalHeader}>
                <Text style={styles.optionalHeaderText}>
                  <Text style={{ fontStyle: "italic", fontWeight: "bold" }}>OPTIONAL USE</Text>
                </Text>
              </View>
              <View style={styles.optionalDataRow}>
                <Text style={styles.labelSmall}>87. PCS:</Text>
                <Text style={styles.optionalDataValue}>{verificationCopy?.quantityAndPacking || "N/A"}</Text>
              </View>
              <View style={styles.optionalDataRow}>
                <Text style={styles.labelSmall}>88. WT:</Text>
                <Text style={styles.optionalDataValue}>N/A</Text>
              </View>
              <View style={styles.optionalDataRow}>
                <Text style={styles.labelSmall}>89. CUBE:</Text>
                <Text style={styles.optionalDataValue}>N/A</Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  }, [frustratedForm1015Ids, resolvedForm1015Ids, failedItems, verificationCopy, allPassed, anyFailed,
      inspectedByDate, inspectedByName, correctedByName, reinspectedByName, reinspectedByDate,
      correctiveActionsChecked, hasReinspectionAttempts, tcn]);

  const keyExtractor = useCallback((item: SectionItem, index: number) => `${item.type}-${index}`, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>AMC Form 1015</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* FlatList Form Content */}
      <FlatList
        data={sectionData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.shareBtn, isGeneratingPdf && styles.disabledBtn]}
          onPress={generateAndSharePdf}
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <>
              <MaterialIcons name="share" size={18} color={colors.white} />
              <Text style={styles.shareBtnText}>Share PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Styles matching InspectorAMC1015Form.tsx exactly
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  scrollContent: { paddingBottom: 20 },
  formContainer: { padding: 10 },

  // Row styles from InspectorAMC1015Form
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: legacyColors.black,
  },
  row2: {
    flexDirection: "row",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: legacyColors.black,
  },

  // Title block
  titleBlock: {
    flex: 3,
    padding: 7,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000000",
  },
  tcnBlock: {
    flex: 1,
    padding: 9.5,
    borderLeftWidth: 1,
    borderColor: legacyColors.black,
    flexDirection: "row",
    alignItems: "center",
  },
  tcnValue: {
    fontSize: 15,
    color: "#000000",
    marginLeft: 15,
  },

  // Validation banner
  validationBanner: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: legacyColors.mediumGrey,
  },
  validationBannerText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000000",
  },

  // Flex columns
  flex20: {
    width: "20%",
    padding: 6,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
  },
  flex30: {
    width: "30%",
    padding: 6,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
  },
  flex40Row: {
    flex: 4,
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
  },
  flex50Row: {
    flex: 5,
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
  },

  // Labels
  label: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "bold",
  },
  label2: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "bold",
  },
  labelSmall: {
    fontSize: 14,
    color: "#000000",
  },
  value: {
    fontSize: 15,
    marginTop: 2,
    color: "#000000",
  },

  // Checkbox
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: legacyColors.black,
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxMark: {
    fontSize: 14,
    fontWeight: "bold",
  },

  // Instructions
  instructionsBlock: {
    padding: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: legacyColors.black,
  },
  instructionsText: {
    fontSize: 15,
    textAlign: "left",
    lineHeight: 20,
    color: "#000000",
  },

  // Grid headers
  gridHeaderLeft: {
    width: "50.1%",
    padding: 6,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
    backgroundColor: legacyColors.mediumGrey,
  },
  gridHeaderRight: {
    width: "49.9%",
    padding: 6,
    backgroundColor: legacyColors.mediumGrey,
    borderRightWidth: 1,
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#000000",
    textAlign: "center",
  },

  // Cells
  cell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
    height: 50,
  },
  cellRight: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 1,
    borderColor: legacyColors.black,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  cellRightSectionHeader: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
    paddingVertical: 4,
    paddingHorizontal: 6,
    backgroundColor: legacyColors.mediumGrey,
  },
  cellText: {
    fontSize: 13,
    color: "#000000",
    flex: 1,
    flexWrap: "wrap",
  },
  cellText2: {
    fontSize: 15,
    color: "#000000",
  },

  // Stacked cells
  leftSpanCell: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 6,
    height: 110,
  },
  rightStacked: {
    width: "50%",
    borderColor: legacyColors.black,
    borderLeftWidth: 1,
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 6,
    height: 55,
  },
  subRowSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 6,
    height: 55,
    backgroundColor: legacyColors.mediumGrey,
  },
  rowBorderTop: {
    borderTopWidth: 1,
    borderColor: legacyColors.black,
  },

  // Full row
  fullRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: legacyColors.black,
    paddingVertical: 6,
    paddingHorizontal: 8,
    height: 50,
  },

  // Section row
  centeredSectionRow: {
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: legacyColors.black,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: legacyColors.mediumGrey,
    height: 70,
  },

  // Comments
  commentsContainer: {
    borderWidth: 1,
    borderColor: legacyColors.black,
    marginTop: -1,
  },
  commentsHeader: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderColor: legacyColors.black,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  commentsBody: {
    minHeight: 200,
  },
  commentsPlaceholder: {
    padding: 6,
    fontSize: 12,
    color: legacyColors.black,
  },
  commentsText: {
    padding: 15,
    fontSize: 15,
    color: legacyColors.black,
  },

  // Final row
  finalRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: legacyColors.black,
  },
  inspectionStatus: {
    flex: 3,
    padding: 6,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
  },
  inspectionInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  optionalUse: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: legacyColors.black,
  },
  optionalHeader: {
    padding: 4,
    borderBottomWidth: 1,
    borderColor: legacyColors.black,
    alignItems: "center",
  },
  optionalHeaderText: {
    fontSize: 15,
  },
  optionalDataRow: {
    borderTopWidth: 1,
    borderColor: legacyColors.black,
    padding: 4,
  },
  optionalDataValue: {
    fontSize: 14,
    color: "#000000",
    marginTop: 4,
    marginLeft: 4,
    textAlign: "center",
  },

  // Footer
  footer: {
    flexDirection: "row",
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  closeBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  closeBtnText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  shareBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  shareBtnText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: "600",
  },
  disabledBtn: {
    opacity: 0.6,
  },
});

export default Form1015Viewer;
