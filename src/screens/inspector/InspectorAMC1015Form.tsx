import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import legacyColors from "../../theming/colors";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import {
  mapFrustrationsToForm1015WithResolved,
  getForm1015FrustrationDescription,
  PACKAGE_TO_FORM1015_MAPPING,
} from "../../utils/sddgToForm1015Mapping";
import { Form1015CheckBoxWithStatus } from "../../components/Inspector/Form1015CheckboxWithStatus";
import { useHazProActions } from "../../stores/useHazProStore";
import { DevBenchmarkButton } from "../../components/dev/DevBenchmarkButton";
import { ActionFooter, colors, spacing, borderRadius } from "../../components/ui";

interface InspectorAMC1015FormProps {
  navigation?: any;
}

export const InspectorAMC1015Form = ({
  navigation,
}: InspectorAMC1015FormProps) => {
  const { inspection, completeInspection } = useInspectionForm();
  const actions = useHazProActions();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Set the active chevron to "Complete" when this screen is mounted
  useEffect(() => {
    actions.setCurrentChevron("complete");
  }, []);

  // Get SDDG and package frustrations (current and resolved) and verification data
  const sddgFrustrations = inspection.frustrations || [];
  const packageFrustrations = inspection.packageFrustrations || [];
  const resolvedSddgFrustrations = inspection.resolvedFrustrations || [];
  const resolvedPackageFrustrations =
    inspection.resolvedPackageFrustrations || [];
  const verificationCopy = inspection.verificationCopy;

  // Helper to format inspector for display
  const formatInspector = (inspectorData: any): string => {
    if (typeof inspectorData === "string") {
      return inspectorData;
    }
    if (inspectorData && typeof inspectorData === "object") {
      const rank = inspectorData.inspectorRank || "";
      const name = inspectorData.inspectorName || "";
      return `${rank} ${name}`.trim() || "Unknown Inspector";
    }
    return "Unknown Inspector";
  };

  const inspector = formatInspector(inspection.inspector);

  // Map both current and resolved frustrations to Form 1015 line items
  const {
    currentlyFrustrated: frustratedForm1015Ids,
    resolved: resolvedForm1015Ids,
  } = mapFrustrationsToForm1015WithResolved(
    sddgFrustrations,
    packageFrustrations,
    resolvedSddgFrustrations,
    resolvedPackageFrustrations,
    verificationCopy
  );

  // Determine validation status
  const anyFailed =
    sddgFrustrations.length > 0 || packageFrustrations.length > 0;
  const allPassed =
    sddgFrustrations.length === 0 && packageFrustrations.length === 0;

  // Get TCN from SDDG data
  const tcn = verificationCopy?.shippersReferenceNumber || "N/A";

  // Format dates - use current date as inspection date
  const currentDate = new Date();
  const inspectedByDate = currentDate
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");

  // For now, reinspection date is only set if corrective actions were taken
  const correctiveActionsChecked = false; // Will be true when we implement correction tracking
  const reinspectedByDate = correctiveActionsChecked ? inspectedByDate : "";

  // Format frustrations for comments section with complete reinspection history
  const formatFrustrationsForComments = () => {
    interface TimelineEntry {
      date: Date;
      lineNumber: string;
      formatted: string;
    }

    const allEntries: TimelineEntry[] = [];

    // Helper to format date and time
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
    const allSddgFrustrations = [
      ...sddgFrustrations,
      ...resolvedSddgFrustrations,
    ];
    allSddgFrustrations.forEach(frustration => {
      const form1015Id =
        Array.from(frustratedForm1015Ids).find(id => {
          const description = getForm1015FrustrationDescription(
            id,
            sddgFrustrations,
            packageFrustrations
          );
          return description === frustration.fieldLabel;
        }) ||
        Array.from(resolvedForm1015Ids).find(id => {
          const description = getForm1015FrustrationDescription(
            id,
            resolvedSddgFrustrations,
            resolvedPackageFrustrations
          );
          return description === frustration.fieldLabel;
        });
      const lineNumber = form1015Id || "N/A";

      // Add original frustration entry
      const { formattedDate, formattedTime } = formatDateTime(
        new Date(frustration.frustrationDate)
      );
      allEntries.push({
        date: new Date(frustration.frustrationDate),
        lineNumber,
        formatted: `${lineNumber}. – ${formattedDate} @ ${formattedTime} – ${frustration.fieldLabel.toUpperCase()} – Inspector: ${formatInspector(
          frustration.inspector
        )}`,
      });

      // Add all reinspection attempts
      if (
        frustration.reinspectionHistory &&
        frustration.reinspectionHistory.length > 0
      ) {
        frustration.reinspectionHistory.forEach(attempt => {
          const { formattedDate: reinspectDate, formattedTime: reinspectTime } =
            formatDateTime(new Date(attempt.date));
          const action =
            attempt.action === "verified" ? "VERIFIED" : "FRUSTRATED";
          const comments = attempt.additionalComments
            ? ` – ${attempt.additionalComments}`
            : "";
          allEntries.push({
            date: new Date(attempt.date),
            lineNumber,
            formatted: `${lineNumber}. – ${reinspectDate} @ ${reinspectTime} – REINSPECTED: ${action} – Inspector: ${formatInspector(
              attempt.inspector
            )}${comments}`,
          });
        });
      }
    });

    // Process package frustrations (current + resolved)
    const allPackageFrustrations = [
      ...packageFrustrations.filter(
        f =>
          f.verificationStatus === "missing" ||
          f.verificationStatus === "incorrect"
      ),
      ...resolvedPackageFrustrations.filter(
        f =>
          f.verificationStatus === "missing" ||
          f.verificationStatus === "incorrect"
      ),
    ];
    allPackageFrustrations.forEach(frustration => {
      // Directly look up the form1015Id from the mapping using the frustration's itemLabel
      // This avoids the issue where multiple labels map to the same ID (e.g., multiple labels -> "59")
      const form1015Id = PACKAGE_TO_FORM1015_MAPPING[frustration.itemLabel] ||
        Array.from(frustratedForm1015Ids).find(id => {
          const description = getForm1015FrustrationDescription(
            id,
            sddgFrustrations,
            packageFrustrations
          );
          return description?.includes(frustration.itemLabel);
        }) ||
        Array.from(resolvedForm1015Ids).find(id => {
          const description = getForm1015FrustrationDescription(
            id,
            resolvedSddgFrustrations,
            resolvedPackageFrustrations
          );
          return description?.includes(frustration.itemLabel);
        });
      const lineNumber = form1015Id || "N/A";

      // Determine label display - for MSL mapped to Field 75 (Other), add "MSL" annotation
      let labelDisplay = frustration.itemLabel.toUpperCase();
      if (
        frustration.itemLabel === "Military Shipping Label (MSL) or DD Form 1387" &&
        lineNumber === "75"
      ) {
        labelDisplay = "MSL (MILITARY SHIPPING LABEL)";
      }

      // Add original frustration entry (without MISSING/INCORRECT status)
      const { formattedDate, formattedTime } = formatDateTime(
        new Date(frustration.frustrationDate)
      );
      allEntries.push({
        date: new Date(frustration.frustrationDate),
        lineNumber,
        formatted: `${lineNumber}. – ${formattedDate} @ ${formattedTime} – ${labelDisplay} – Inspector: ${formatInspector(
          frustration.inspector
        )}`,
      });

      // Add all reinspection attempts
      if (
        frustration.reinspectionHistory &&
        frustration.reinspectionHistory.length > 0
      ) {
        frustration.reinspectionHistory.forEach(attempt => {
          const { formattedDate: reinspectDate, formattedTime: reinspectTime } =
            formatDateTime(new Date(attempt.date));
          const action =
            attempt.action === "verified" ? "VERIFIED" : "FRUSTRATED";
          const comments = attempt.additionalComments
            ? ` – ${attempt.additionalComments}`
            : "";
          allEntries.push({
            date: new Date(attempt.date),
            lineNumber,
            formatted: `${lineNumber}. – ${reinspectDate} @ ${reinspectTime} – REINSPECTED: ${action} – Inspector: ${formatInspector(
              attempt.inspector
            )}${comments}`,
          });
        });
      }
    });

    // Sort all entries chronologically
    allEntries.sort((a, b) => a.date.getTime() - b.date.getTime());

    return allEntries.map(entry => ({ formatted: entry.formatted }));
  };

  const failedItems = formatFrustrationsForComments();

  // Helper function to generate checkbox HTML based on state
  const getCheckboxHTML = (
    identifier: string,
    frustratedIds: Set<string>,
    resolvedIds: Set<string>
  ): string => {
    const isResolved = resolvedIds.has(identifier);
    const isFrustrated = frustratedIds.has(identifier);

    if (isResolved) {
      // Circled X for resolved frustrations
      return '<div class="checkbox-circle"><span class="checkbox-mark">X</span></div>';
    } else if (isFrustrated) {
      // Regular X for current frustrations
      return '<div class="checkbox"><span class="checkbox-mark">X</span></div>';
    } else {
      // Empty checkbox
      return '<div class="checkbox"></div>';
    }
  };

  // Function to generate complete HTML for the AMC Form 1015
  const generateFormHtml = (): string => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AMC Form 1015 - HAZMAT Inspection and Acceptance Checklist</title>
        <style>
          @page {
            size: letter portrait;
            margin: 0.5in;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: white;
            color: black;
            font-size: 13px;
          }
          .container {
            border: 1px solid black;
            margin-bottom: 10px;
          }
          .row {
            display: flex;
            border-bottom: 1px solid black;
          }
          .row:last-child {
            border-bottom: none;
          }
          .title-block {
            flex: 3;
            padding: 7px;
            border-right: 1px solid black;
          }
          .tcn-block {
            flex: 1;
            padding: 9.5px;
            display: flex;
            align-items: center;
          }
          .title-text {
            font-weight: bold;
            font-size: 18px;
          }
          .tcn-value {
            font-size: 15px;
            margin-left: 15px;
          }
          .validation-banner {
            padding: 4px;
            text-align: center;
            background-color: #D3D3D3;
            border-bottom: 1px solid black;
          }
          .validation-banner-text {
            font-weight: bold;
            font-size: 14px;
          }
          .label {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 2px;
          }
          .value {
            font-size: 15px;
            margin-top: 2px;
          }
          .flex-row {
            display: flex;
            border-bottom: 1px solid black;
          }
          .flex-20 {
            width: 20%;
            padding: 6px;
            border-right: 1px solid black;
          }
          .flex-30 {
            width: 30%;
            padding: 6px;
            border-right: 1px solid black;
          }
          .flex-40 {
            flex: 4;
            display: flex;
            align-items: center;
            padding: 6px;
            border-right: 1px solid black;
          }
          .flex-50 {
            flex: 5;
            display: flex;
            align-items: center;
            padding: 6px;
          }
          .checkbox {
            width: 18px;
            height: 18px;
            border: 1px solid black;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 6px;
            flex-shrink: 0;
          }
          .checkbox-circle {
            width: 34px;
            height: 34px;
            border: 1.5px solid black;
            border-radius: 17px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 6px;
            flex-shrink: 0;
          }
          .checkbox-mark {
            font-size: 14px;
            font-weight: bold;
            line-height: 18px;
          }
          .label-small {
            font-size: 14px;
          }
          .instructions-block {
            padding: 10px;
            border-bottom: 1px solid black;
          }
          .instructions-text {
            font-size: 15px;
            line-height: 20px;
            font-style: italic;
          }
          .grid-row {
            display: flex;
            border-bottom: 1px solid black;
          }
          .grid-header-left,
          .grid-header-right {
            width: 50%;
            padding: 6px;
            background-color: #D3D3D3;
            text-align: center;
            font-weight: bold;
            font-size: 15px;
          }
          .grid-header-left {
            border-right: 1px solid black;
          }
          .cell-left,
          .cell-right {
            width: 50%;
            display: flex;
            align-items: center;
            padding: 6px;
            min-height: 50px;
          }
          .cell-left {
            border-right: 1px solid black;
          }
          .cell-text {
            font-size: 13px;
            flex: 1;
          }
          .section-header {
            font-weight: bold;
            font-size: 15px;
            text-align: center;
            padding: 6px;
            background-color: #D3D3D3;
          }
          .left-span-cell {
            width: 50%;
            display: flex;
            align-items: center;
            padding: 6px;
            min-height: 110px;
            border-right: 1px solid black;
          }
          .right-stacked {
            width: 50%;
            display: flex;
            flex-direction: column;
          }
          .sub-row {
            flex: 1;
            display: flex;
            align-items: center;
            padding: 6px;
            border-bottom: 1px solid black;
          }
          .sub-row:last-child {
            border-bottom: none;
          }
          .sub-row-header {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px;
            background-color: #D3D3D3;
            border-bottom: 1px solid black;
          }
          .page-break {
            page-break-before: always;
          }
          .full-row {
            display: flex;
            align-items: center;
            padding: 6px 8px;
            min-height: 50px;
            border-bottom: 1px solid black;
          }
          .centered-section-row {
            padding: 6px 8px;
            text-align: center;
            background-color: #D3D3D3;
            border-bottom: 1px solid black;
          }
          .comments-container {
            border-bottom: 1px solid black;
          }
          .comments-header {
            padding: 4px 6px;
            min-height: 50px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid black;
          }
          .comments-body {
            min-height: 450px;
            padding: 15px;
          }
          .comments-text {
            font-size: 15px;
            margin-bottom: 10px;
          }
          .final-row {
            display: flex;
            border-bottom: 1px solid black;
          }
          .inspection-status {
            flex: 3;
            padding: 6px;
            border-right: 1px solid black;
          }
          .optional-use {
            flex: 1;
          }
          .optional-header {
            padding: 4px;
            text-align: center;
            border-bottom: 1px solid black;
          }
          .optional-data-row {
            padding: 4px;
            border-bottom: 1px solid black;
          }
          .optional-data-row:last-child {
            border-bottom: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Title and TCN -->
          <div class="row">
            <div class="title-block">
              <div class="title-text">HAZMAT INSPECTION AND ACCEPTANCE CHECKLIST</div>
            </div>
            <div class="tcn-block">
              <span class="label">TCN</span>
              <span class="tcn-value">${tcn}</span>
            </div>
          </div>

          <!-- Validation Banner -->
          <div class="validation-banner">
            <div class="validation-banner-text">INSPECTION VALIDATION</div>
          </div>

          <!-- Validation Checkboxes -->
          <div class="flex-row">
            <div class="flex-20">
              <div class="label">THIS SHIPMENT HAS BEEN INSPECTED AND</div>
            </div>
            <div class="flex-40">
              <div class="checkbox">${
                allPassed ? '<span class="checkbox-mark">X</span>' : ""
              }</div>
              <div class="label-small">COMPLIES WITH ALL REGULATORY REQUIREMENTS</div>
            </div>
            <div class="flex-40">
              <div class="checkbox">${
                anyFailed ? '<span class="checkbox-mark">X</span>' : ""
              }</div>
              <div class="label-small">DOES NOT COMPLY WITH ALL REGULATORY REQUIREMENTS AS INDICATED</div>
            </div>
          </div>

          <!-- Inspector Info Row 1 -->
          <div class="flex-row">
            <div class="flex-20">
              <div class="label">DATE (YYYYMMDD)</div>
              <div class="value">${inspectedByDate || "N/A"}</div>
            </div>
            <div class="flex-30">
              <div class="label">INSPECTED BY (NAME)</div>
              <div class="value">${inspector}</div>
            </div>
            <div class="flex-20">
              <div class="label">DATE (YYYYMMDD)</div>
              <div class="value">${
                correctiveActionsChecked ? reinspectedByDate : "N/A"
              }</div>
            </div>
            <div class="flex-30">
              <div class="label">CORRECTED BY (NAME)</div>
              <div class="value">${
                correctiveActionsChecked ? inspector : "N/A"
              }</div>
            </div>
          </div>

          <!-- Inspector Info Row 2 -->
          <div class="flex-row">
            <div class="flex-20">
              <div class="label">DATE (YYYYMMDD)</div>
              <div class="value">${
                correctiveActionsChecked ? reinspectedByDate : "N/A"
              }</div>
            </div>
            <div class="flex-30">
              <div class="label">RE-INSPECTED BY (NAME)</div>
              <div class="value">${
                correctiveActionsChecked ? inspector : "N/A"
              }</div>
            </div>
            <div class="flex-50">
              <div class="checkbox">${
                correctiveActionsChecked
                  ? '<span class="checkbox-mark">X</span>'
                  : ""
              }</div>
              <div class="label-small">CORRECTIVE ACTIONS CHECKED. SHIPMENT COMPLIES WITH ALL REGULATORY REQUIREMENTS.</div>
            </div>
          </div>

          <!-- Instructions -->
          <div class="instructions-block">
            <div class="instructions-text">
              ENTER <strong>\"X\"</strong> TO IDENTIFY NONCOMPLIANCE. USE <strong>COMMENTS</strong> BLOCK TO PROVIDE ADDITIONAL DETAILS. CIRCLE <strong>\"X\"</strong> WHEN CORRECTIVE ACTION IS COMPLETED. SIGN INSPECTION <strong>VALIDATION BLOCK</strong> AND ATTACH TO SHIPPER'S DECLARATION FILED WITH STATION MANIFEST. THOSE ITEMS THAT APPLY ONLY TO RADIOACTIVE MATERIAL ARE IDENTIFIED BY AN <strong>\"R\"</strong>. <strong>ADDITIONAL CHECKPOINTS ON THE REVERSE.</strong>
            </div>
          </div>

          <!-- Section Headers -->
          <div class="grid-row">
            <div class="grid-header-left">SHIPPER'S DECLARATION</div>
            <div class="grid-header-right">CARGO IDENTIFICATION (IF APPLICABLE) (CONTINUED)</div>
          </div>

          <!-- Checklist Items -->
          <div class="grid-row">
            <div class="left-span-cell">
              ${getCheckboxHTML(
                "1",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">1. THREE ORIGINAL DOCUMENTS FOR EACH PROPER SHIPPING NAME (PSN) UNDER A SINGLE TCN (ONLY TWO REQUIRED FOR CHAPTER 3)</div>
            </div>
            <div class="right-stacked">
              <div class="sub-row">
                ${getCheckboxHTML(
                  "33",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">33. CRYOGENICS VENTING REQUIREMENTS</div>
              </div>
              <div class="sub-row">
                ${getCheckboxHTML(
                  "34",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">34. SECONDARY HAZARD PSN, CLASS OR DIVISION AND NET QUANTITY</div>
              </div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "2",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">2. SHIPPER'S ADDRESS AND PHONE NUMBER</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "35",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">35. HANDLING INSTRUCTIONS</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "3",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">3. CONSIGNEE DODAAC OR ADDRESS (OR WORLDWIDE MOBILITY)</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "36",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">36. OTHER</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "4",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">4. TRANSPORTATION CONTROL NUMBER (TCN)</div>
            </div>
            <div class="cell-right section-header">
              PACKAGING--OUTER
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "5",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">5. AIRPORT OF DEPARTURE AND DESTINATION (OR WORLDWIDE MOBILITY)</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "37",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">37. CONTAINER SERVICEABLE; DAMAGE, LEAKAGE OR LOSS CONTENTS</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "6",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">6. NAME AND TITLE OF PREPARER WITH SIGNATURE</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "38",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">38. APPROVED OUTER CONTAINER (IF REQUIRED)</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "7",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">7. PLACE AND DATE MATERIAL CERTIFIED</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "39",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">39. PACKAGE PERMITTED BY PACKAGING REFERENCE</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "8",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">8. PEN AND INK CHANGES SIGNED</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "40",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">40. OTHER</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "9",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">9. EMERGENCY RESPONSE NUMBER</div>
            </div>
            <div class="cell-right section-header">
              IF APPLICABLE
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "10",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">10. OTHER</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "41",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">41. ULLAGE</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="left-span-cell">
              <div class="sub-row-header">CARGO IDENTIFICATION (NATURE & QUANTITY OF HAZMAT)</div>
              <div style="flex: 1; display: flex; align-items: center; padding: 6px; border-top: 1px solid black;">
                ${getCheckboxHTML(
                  "11",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">11. IDENTIFIES WHETHER PACKED WITHIN PASSENGER OR CARGO AIRCRAFT ONLY</div>
              </div>
            </div>
            <div class="cell-right" style="min-height: 100px;">
              ${getCheckboxHTML(
                "42",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">42. UN SPECIFICATION OR POP CONTAINER MATCHES CORRESPONDING PACKING GROUP</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="left-span-cell">
              <div style="flex: 1; display: flex; align-items: center; padding: 6px;">
                ${getCheckboxHTML(
                  "12",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">12. IDENTIFIES RADIOACTIVE OR NONRADIOACTIVE SHIPMENT</div>
              </div>
              <div style="flex: 1; display: flex; align-items: center; padding: 6px; border-top: 1px solid black;">
                ${getCheckboxHTML(
                  "13",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">13. IDENTIFICATION NUMBER (UN, ID, NA)</div>
              </div>
            </div>
            <div class="cell-right" style="min-height: 110px;">
              ${getCheckboxHTML(
                "43",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">43. GROSS WEIGHT OF PACKAGE IS EQUAL TO OR LESS THAN TESTED WEIGHT INDICATED AS PART OF POP MARKING</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="left-span-cell">
              <div style="flex: 1; display: flex; align-items: center; padding: 6px;">
                ${getCheckboxHTML(
                  "14",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">14. PSN (WITH TECHNICAL NAME IF REQUIRED)</div>
              </div>
              <div style="flex: 1; display: flex; align-items: center; padding: 6px; border-top: 1px solid black;">
                ${getCheckboxHTML(
                  "15",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">15. PRIMARY HAZARD CLASS OR DIVISION (COMPATIBILITY GROUP FOR EXPLOSIVES)</div>
              </div>
            </div>
            <div class="cell-right" style="min-height: 110px;">
              ${getCheckboxHTML(
                "44",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">44. SINGLE PACKAGE (CONTAINING A LIQUID) TESTED PRESSURE (KPA) AGREES WITH CONTAINER REQUIREMENTS</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "16",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">16. SUBSIDIARY RISK CLASS OR DIVISION, IF ASSIGNED</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "45",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">45. OTHER</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "17",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">17. PACKAGING GROUP</div>
            </div>
            <div class="cell-right section-header">
              PACKAGING--INNER (IF INSPECTED AND APPLICABLE)
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "18",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">18. NUMBER AND TYPE OF PACKAGES</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "46",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">46. ABSORBENT MATERIAL</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "19",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">19. NET QUANTITY PER PACKAGE (METRIC UNLESS EXCEPTED)</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "47",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">47. LEAK OR ACID PROOF LINER</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "20",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">20. R--ACTIVITY PER PACKAGE GIVEN IN BECQUEREL SYSTEM</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "48",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">48. INNER RECEPTACLE ORIENTA</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "21",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">21. R--NAME AND SYMBOL OF MATERIAL</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "49",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">49. SECONDARY CLOSURE</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "22",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">22. R--MATERIAL PHYSICAL AND CHEMICAL FORM</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "50",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">50. OTHER</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "23",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">23. PACKAGING PARAGRAPH (FROM ATTACHMENTS 5-13)</div>
            </div>
            <div class="cell-right section-header">
              MARKING
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              <div class="cell-text">A. "A3.1.7.3" USED WHEN POP TESTED PACKAGE IS OVERPACKED TO MEET AIR REQUIREMENTS</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "53",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">53. PSN AND IDENTIFICATION NUMBER</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              <div class="cell-text">B. PACKAGING REFERENCE FROM ATTACHMENT 27 USED FOR EXPLOSIVES MEETING GRANDFATHER CLAUSE</div>
            </div>
            <div class="right-stacked">
              <div class="sub-row-header">IF APPLICABLE</div>
              <div class="sub-row">
                ${getCheckboxHTML(
                  "54",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">54. UN OR POP SPECIFICATION MARKING</div>
              </div>
              <div class="sub-row">
                ${getCheckboxHTML(
                  "55",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">55. "RQ"</div>
              </div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              <div class="cell-text">C. UNPACKAGED EXPLOSIVES AUTHORIZED IAW "A5.2"</div>
            </div>
            <div class="right-stacked">
              <div class="sub-row">
                ${getCheckboxHTML(
                  "56",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">56. "WASTE"</div>
              </div>
              <div class="sub-row">
                ${getCheckboxHTML(
                  "57",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">57. "AIR ELIGIBLE" MARKING OR SYMBOL</div>
              </div>
              <div class="sub-row">
                ${getCheckboxHTML(
                  "58",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">58. "OVERPACKS" IDENTIFIED</div>
              </div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "24",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">24. DOT-E, COE, CAA OR OTHER APPROVED DOCUMENT USED AS CERTIFICATION REFERENCE (COPY ACCOMPANIES SHIPMENT)</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "59",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">59. "ORIENTATION ARROWS"</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="left-span-cell">
              ${getCheckboxHTML(
                "25",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">25. 49CFR, IATA OR ICAO REFERENCE USED AS CERTIFICATION REFERENCE (IF MEETING PASSENGER RESTRICTIONS)</div>
            </div>
            <div class="right-stacked">
              <div class="sub-row">
                ${getCheckboxHTML(
                  "60",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">60. LIMITED QUANTITY IDENTIFIED</div>
              </div>
              <div class="sub-row">
                ${getCheckboxHTML(
                  "61",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">61. "ORM-D" OR "ORM-D-AIR" FOR DOMESTIC ONLY SHIPMENT</div>
              </div>
            </div>
          </div>

          <div class="grid-row">
            <div class="left-span-cell">
              <div style="flex: 1; display: flex; align-items: center; padding: 6px;">
                ${getCheckboxHTML(
                  "26",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">26. --CATEGORY OF RADIOACTIVE PACKAGE</div>
              </div>
              <div style="flex: 1; display: flex; align-items: center; padding: 6px; border-top: 1px solid black;">
                ${getCheckboxHTML(
                  "27",
                  frustratedForm1015Ids,
                  resolvedForm1015Ids
                )}
                <div class="cell-text">27. R--TRANSPORT INDEX</div>
              </div>
            </div>
            <div class="cell-right" style="min-height: 110px;">
              ${getCheckboxHTML(
                "62",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">62. "INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS"</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left section-header">
              IF APPLICABLE
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "63",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">63. DOT SPECIAL PERMIT (WHEN USED AS CERTIFICATION REFERENCE)</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "28",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">28. "RQ" IDENTIFIES A PSN AS HAZARDOUS SUBSTANCE</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "64",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">64. COE NUMBER (WHEN USED AS CERTIFICATION REFERENCE)</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "29",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">29. "WASTE" IF MARKED OR LABELED ON PACKAGE</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "65",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">65. CAA NUMBER (IF REQUIRED BY CAA)</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "30",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">30. "INHALATION HAZARD (ZONE)" (IF MATERIAL MEETS THIS DEFINITION)</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "66",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">66. FLASHPOINT (FOR FLAMMABLE LIQUIDS)</div>
            </div>
          </div>

          <div class="grid-row">
            <div class="cell-left">
              ${getCheckboxHTML(
                "31",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">31. IF OVERPACKED, THE WORDS "OVERPACK USED"</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "67",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">67. NSN (OR PART NUMBER) FOR EXPLOSIVES</div>
            </div>
          </div>

          <div class="grid-row" style="border-bottom: none;">
            <div class="cell-left">
              ${getCheckboxHTML(
                "32",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">32. "LIMITED QUANTITY" OR "LTD QTY"</div>
            </div>
            <div class="cell-right">
              ${getCheckboxHTML(
                "68",
                frustratedForm1015Ids,
                resolvedForm1015Ids
              )}
              <div class="cell-text">68. OTHER</div>
            </div>
          </div>
        </div>

        <!-- Page Break -->
        <div class="page-break"></div>

        <!-- Page 2 -->
        <div class="container">
          <div class="instructions-block" style="border-bottom: 1px solid black;">
            <div class="instructions-text">
              ENTER <strong>"X"</strong> TO IDENTIFY NONCOMPLIANCE. USE <strong>COMMENTS</strong> BLOCK TO PROVIDE ADDITIONAL DETAILS. CIRCLE <strong>"X"</strong> WHEN CORRECTIVE ACTION IS COMPLETED. SIGN INSPECTION <strong>VALIDATION BLOCK</strong> AND ATTACH TO SHIPPER'S DECLARATION FILED WITH STATION MANIFEST.
            </div>
          </div>

          <div class="instructions-block" style="border-bottom: 1px solid black;">
            <div class="instructions-text">
              THOSE ITEMS THAT APPLY ONLY TO RADIOACTIVE MATERIAL ARE IDENTIFIED BY AN <strong>"R"</strong>.
            </div>
          </div>

          <div class="section-header" style="border-bottom: 1px solid black;">LABELING</div>

          <div class="full-row">
            ${getCheckboxHTML("69", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">69. PRIMARY RISK LABEL</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("70", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">70. R--RADIOACTIVE MATERIAL LABELS ON OPPOSITE SIDES OF PACKAGE</div>
          </div>

          <div class="section-header" style="border-bottom: 1px solid black;">IF APPLICABLE</div>

          <div class="full-row">
            ${getCheckboxHTML("71", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">71. SUBSIDIARY RISK LABELS</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("72", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">72. "CARGO AIRCRAFT ONLY" (NOT MANDATORY FOR MOBILITY OPERATIONS)</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("73", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">73. "MAGNETIZED MATERIAL"</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("74", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">74. "EMPTY"</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("75", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">75. OTHER</div>
          </div>

          <div class="centered-section-row">
            <div class="section-header" style="background: none; margin-bottom: 5px;">VEHICLES AND EQUIPMENT</div>
            <div class="instructions-text" style="font-size: 14px;">
              USE DD FORM 2133 AS CHECKLIST FOR DEPLOYMENT OPERATIONS(DTR,PARTIII)
            </div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("76", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">76. FUEL GUAGE OPERATIVE OR DIP STICK AVAILABLE</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("77", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">77. VEHICLES AND SELF-PROPELLED EQUIPMENT WITH FUEL QTY NOT EXCEEDING 1/2 TANK CAPACITY</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("78", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">78. SUPPORT EQUIPMENT DRAINED</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("79", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">79. NO EXISTING FUEL LEAKS</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("80", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">80. ALL ADDITIONAL HAZARDS IDENTIFIED (SEE BLOCK 36)</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("81", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">81. SECONDARY LOADS CERTIFIED, PACKAGED AND MARKED</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("82", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">82. BULK FLAMMABLE LIQUID FUEL TANKS DRAINED OR PURGED AS REQUIRED</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("83", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">83. SPARE FUEL IN AUTHORIZED CONTAINERS</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("84", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">84. BATTERY POSTS PROTECTED</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("85", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">85. FIRE EXTINGUISHERS IN APPROVED HOLDER</div>
          </div>

          <div class="full-row">
            ${getCheckboxHTML("86", frustratedForm1015Ids, resolvedForm1015Ids)}
            <div class="cell-text">86. OTHER</div>
          </div>

          <!-- Comments Section -->
          <div class="comments-container">
            <div class="comments-header">
              <div class="cell-text" style="font-size: 15px;">87. COMMENTS/REASON(S) FOR FRUSTRATION</div>
            </div>
            <div class="comments-body">
              ${failedItems
                .map(
                  (item: any) =>
                    `<div class="comments-text">${item.formatted}</div>`
                )
                .join("")}
            </div>
          </div>

          <!-- Final Row -->
          <div class="final-row">
            <div class="inspection-status">
              <div class="label" style="margin-bottom: 8px;">OPENED FOR INSPECTION:</div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <div class="checkbox"></div>
                <span class="label-small">YES</span>
                <div class="checkbox" style="margin-left: 12px;"></div>
                <span class="label-small">NO</span>
              </div>
            </div>
            <div class="optional-use">
              <div class="optional-header">
                <strong><em>OPTIONAL USE</em></strong>
              </div>
              <div class="optional-data-row">
                <div class="label-small">87. PCS:</div>
                <div style="margin-top: 4px; margin-left: 4px; text-align: center;">${
                  verificationCopy?.quantityAndPacking || "N/A"
                }</div>
              </div>
              <div class="optional-data-row">
                <div class="label-small">88. WT:</div>
                <div style="margin-top: 4px; margin-left: 4px; text-align: center;">N/A</div>
              </div>
              <div class="optional-data-row">
                <div class="label-small">89. CUBE:</div>
                <div style="margin-top: 4px; margin-left: 4px; text-align: center;">N/A</div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    return html;
  };

  // Function to generate and share PDF
  const generateAndSharePdf = async () => {
    try {
      setIsGeneratingPdf(true);
      console.log("== Starting PDF generation for AMC Form 1015 ==");

      // Generate the HTML for the form
      const html = generateFormHtml();
      console.log("Generated HTML for AMC Form 1015");

      // Create a PDF of the form
      const { uri: pdfUri } = await Print.printToFileAsync({
        html,
        base64: false,
      });
      console.log("Created AMC Form 1015 PDF at:", pdfUri);

      // Share the PDF
      await Sharing.shareAsync(pdfUri, {
        mimeType: "application/pdf",
        dialogTitle: "Share AMC Form 1015",
        UTI: "com.adobe.pdf",
      });

      // Clean up the temporary file
      await FileSystem.deleteAsync(pdfUri, { idempotent: true });
      console.log("PDF generation and sharing completed");
    } catch (error) {
      console.error("Error generating or sharing PDF:", error);
      Alert.alert("Error", "Failed to generate or share PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleCompleteInspectionWithFrustration = async () => {
    const totalFrustrations =
      sddgFrustrations.length + packageFrustrations.length;

    Alert.alert(
      "Complete Inspection",
      `This inspection will be marked as complete with ${totalFrustrations} frustration${
        totalFrustrations !== 1 ? "s" : ""
      }.\n\nThe shipment requires re-inspection before it can proceed for airlift.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete with Frustration",
          style: "destructive",
          onPress: async () => {
            try {
              // Log completion start
              console.log(
                "🚨 [AMC1015] Starting inspection completion with frustrations:",
                {
                  sddgFrustrations: sddgFrustrations.length,
                  packageFrustrations: packageFrustrations.length,
                  totalFrustrations,
                  inspector: inspector,
                  completionTime: new Date(),
                }
              );

              // Use the new completion action that saves to database
              const result = await completeInspection();

              if (result?.success) {
                console.log(
                  "✅ [AMC1015] Inspection completed and saved successfully"
                );

                // Navigate back to Inspector Home
                if (navigation) {
                  navigation.navigate("InspectorHomeStack", {
                    screen: "InspectorHome",
                  });
                } else {
                  console.warn("🚨 [AMC1015] No navigation object available");
                }
              } else {
                console.error(
                  "❌ [AMC1015] Failed to complete inspection:",
                  result?.error
                );
                Alert.alert(
                  "Error",
                  "Failed to save the inspection. Please try again.",
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              console.error(
                "❌ [AMC1015] Error during inspection completion:",
                error
              );
              Alert.alert(
                "Error",
                "An unexpected error occurred while saving the inspection. Please try again.",
                [{ text: "OK" }]
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formContainer}>
          <View style={styles.row}>
            <View style={styles.titleBlock}>
              <Text style={styles.titleText}>
                HAZMAT INSPECTION AND ACCEPTANCE CHECKLIST
              </Text>
            </View>
            <View style={styles.tcnBlock}>
              <Text style={styles.label}>TCN</Text>
              <Text style={styles.tcnValue}>{tcn}</Text>
            </View>
          </View>
          <View style={styles.validationBanner}>
            <Text style={styles.validationBannerText}>
              INSPECTION VALIDATION
            </Text>
          </View>
          <View style={styles.row2}>
            <View style={styles.flex20}>
              <Text style={styles.label}>
                THIS SHIPMENT HAS BEEN INSPECTED AND
              </Text>
            </View>
            <View style={styles.flex40Row}>
              <View style={styles.checkbox}>
                {allPassed && <Text style={styles.checkboxMark}>X</Text>}
              </View>
              <Text style={styles.labelSmall}>
                COMPLIES WITH ALL REGULATORY REQUIREMENTS
              </Text>
            </View>

            <View style={styles.flex40Row}>
              <View style={styles.checkbox}>
                {anyFailed && <Text style={styles.checkboxMark}>X</Text>}
              </View>
              <Text style={styles.labelSmall}>
                DOES NOT COMPLY WITH ALL REGULATORY REQUIREMENTS AS INDICATED
              </Text>
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.flex20}>
              <Text style={styles.label}>DATE (YYYYMMDD)</Text>
              <Text style={styles.value}>{inspectedByDate || "N/A"}</Text>
            </View>
            <View style={styles.flex30}>
              <Text style={styles.label}>INSPECTED BY (NAME)</Text>
              <Text style={styles.value}>{inspector}</Text>
            </View>
            <View style={styles.flex20}>
              <Text style={styles.label}>DATE (YYYYMMDD)</Text>
              <Text style={styles.value}>
                {correctiveActionsChecked ? reinspectedByDate : "N/A"}
              </Text>
            </View>
            <View style={styles.flex30}>
              <Text style={styles.label}>CORRECTED BY (NAME)</Text>
              <Text style={styles.value}>
                {correctiveActionsChecked ? inspector : "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.flex20}>
              <Text style={styles.label}>DATE (YYYYMMDD)</Text>
              <Text style={styles.value}>
                {correctiveActionsChecked ? reinspectedByDate : "N/A"}
              </Text>
            </View>
            <View style={styles.flex30}>
              <Text style={styles.label}>RE-INSPECTED BY (NAME)</Text>
              <Text style={styles.value}>
                {correctiveActionsChecked ? inspector : "N/A"}
              </Text>
            </View>
            <View style={styles.flex50Row}>
              <View style={styles.checkbox}>
                {correctiveActionsChecked && (
                  <Text style={styles.checkboxMark}>X</Text>
                )}
              </View>
              <Text style={styles.labelSmall}>
                CORRECTIVE ACTIONS CHECKED. SHIPMENT COMPLIES WITH ALL
                REGULATORY REQUIREMENTS.
              </Text>
            </View>
          </View>
          <View style={styles.instructionsBlock}>
            <Text style={styles.instructionsText}>
              <Text style={{ fontStyle: "italic" }}>
                ENTER{" "}
                <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                  "X"
                </Text>{" "}
                TO IDENTIFY NONCOMPLIANCE. USE{" "}
                <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                  COMMENTS
                </Text>{" "}
                BLOCK TO PROVIDE ADDITIONAL DETAILS. CIRCLE{" "}
                <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                  "X"
                </Text>{" "}
                WHEN CORRECTIVE ACTION IS COMPLETED. SIGN INSPECTION{" "}
                <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                  VALIDATION BLOCK
                </Text>{" "}
                AND ATTACH TO SHIPPER'S DECLARATION FILED WITH STATION MANIFEST.
                THOSE ITEMS THAT APPLY ONLY TO RADIOACTIVE MATERIAL ARE
                IDENTIFIED BY AN{" "}
                <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                  "R"
                </Text>
                .{" "}
                <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                  ADDITIONAL CHECKPOINTS ON THE REVERSE.
                </Text>
              </Text>
            </Text>
          </View>
          <View style={styles.gridContainer}>
            <View style={styles.row2}>
              <View style={styles.gridHeaderLeft}>
                <Text style={styles.sectionHeader}>SHIPPER'S DECLARATION</Text>
              </View>
              <View style={styles.gridHeaderRight}>
                <Text style={styles.sectionHeader}>
                  CARGO IDENTIFICATION (IF APPLICABLE) (CONTINUED)
                </Text>
              </View>
            </View>
            <View style={styles.row2}>
              <View style={styles.leftSpanCell}>
                <Form1015CheckBoxWithStatus
                  identifier="1"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  1. THREE ORIGINAL DOCUMENTS FOR EACH PROPER SHIPPING NAME
                  (PSN) UNDER A SINGLE TCN (ONLY TWO REQUIRED FOR CHAPTER 3)
                </Text>
              </View>
              <View style={styles.rightStacked}>
                <View style={styles.subRow}>
                  <Form1015CheckBoxWithStatus
                    identifier="33"
                    frustratedForm1015Ids={frustratedForm1015Ids}
                    resolvedForm1015Ids={resolvedForm1015Ids}
                  />
                  <Text style={styles.cellText}>
                    33. CRYOGENICS VENTING REQUIREMENTS
                  </Text>
                </View>
                <View style={[styles.subRow, styles.rowBorderTop]}>
                  <Form1015CheckBoxWithStatus
                    identifier="34"
                    frustratedForm1015Ids={frustratedForm1015Ids}
                    resolvedForm1015Ids={resolvedForm1015Ids}
                  />
                  <Text style={styles.cellText}>
                    34. SECONDARY HAZARD PSN, CLASS OR DIVISION AND NET QUANTITY
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.row2}>
              <View style={styles.cell}>
                <Form1015CheckBoxWithStatus
                  identifier="2"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  2. SHIPPER'S ADDRESS AND PHONE NUMBER
                </Text>
              </View>
              <View style={styles.cellRight}>
                <Form1015CheckBoxWithStatus
                  identifier="35"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>35. HANDLING INSTRUCTIONS</Text>
              </View>
            </View>
            <View style={styles.row2}>
              <View style={styles.cell}>
                <Form1015CheckBoxWithStatus
                  identifier="3"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  3. CONSIGNEE DODAAC OR ADDRESS (OR WORLDWIDE MOBILITY)
                </Text>
              </View>
              <View style={styles.cellRight}>
                <Form1015CheckBoxWithStatus
                  identifier="36"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>36. OTHER</Text>
              </View>
            </View>
            <View style={styles.row2}>
              <View style={styles.cell}>
                <Form1015CheckBoxWithStatus
                  identifier="4"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  4. TRANSPORTATION CONTROL NUMBER (TCN)
                </Text>
              </View>
              <View style={styles.cellRightSectionHeader}>
                <Text style={styles.sectionHeader}>PACKAGING--OUTER</Text>
              </View>
            </View>
            <View style={styles.row2}>
              <View style={styles.cell}>
                <Form1015CheckBoxWithStatus
                  identifier="5"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  5. AIRPORT OF DEPARTURE AND DESTINATION (OR WORLDWIDE
                  MOBILITY)
                </Text>
              </View>
              <View style={styles.cellRight}>
                <Form1015CheckBoxWithStatus
                  identifier="37"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  37. CONTAINER SERVICEABLE; DAMAGE, LEAKAGE OR LOSS CONTENTS
                </Text>
              </View>
            </View>
            <View style={styles.row2}>
              <View style={styles.cell}>
                <Form1015CheckBoxWithStatus
                  identifier="6"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  6. NAME AND TITLE OF PREPARER WITH SIGNATURE
                </Text>
              </View>
              <View style={styles.cellRight}>
                <Form1015CheckBoxWithStatus
                  identifier="38"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  38. APPROVED OUTER CONTAINER (IF REQUIRED)
                </Text>
              </View>
            </View>
            <View style={styles.row2}>
              <View style={styles.cell}>
                <Form1015CheckBoxWithStatus
                  identifier="7"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  7. PLACE AND DATE MATERIAL CERTIFIED
                </Text>
              </View>
              <View style={styles.cellRight}>
                <Form1015CheckBoxWithStatus
                  identifier="39"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  39. PACKAGE PERMITTED BY PACKAGING REFERENCE
                </Text>
              </View>
            </View>
            <View style={styles.row2}>
              <View style={styles.cell}>
                <Form1015CheckBoxWithStatus
                  identifier="8"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  8. PEN AND INK CHANGES SIGNED
                </Text>
              </View>
              <View style={styles.cellRight}>
                <Form1015CheckBoxWithStatus
                  identifier="40"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>40. OTHER</Text>
              </View>
            </View>
            <View style={styles.row2}>
              <View style={styles.cell}>
                <Form1015CheckBoxWithStatus
                  identifier="9"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  9. EMERGENCY RESPONSE NUMBER
                </Text>
              </View>
              <View style={styles.cellRightSectionHeader}>
                <Text style={styles.sectionHeader}>IF APPLICABLE</Text>
              </View>
            </View>
            <View style={styles.row2}>
              <View style={styles.cell}>
                <Form1015CheckBoxWithStatus
                  identifier="10"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>10. OTHER</Text>
              </View>
              <View style={styles.cellRight}>
                <Form1015CheckBoxWithStatus
                  identifier="41"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>41. ULLAGE</Text>
              </View>
            </View>
          </View>
          {/* <View style={styles.row4}>
          <View style={styles.leftStacked}>
            <View style={styles.subRowSectionHeader}>
              <Text style={styles.sectionHeader}>
                CARGO IDENTIFICATION (NATURE & QUANTITY OF HAZMAT)
              </Text>
            </View>
            <View style={[styles.subRow, styles.rowBorderTop]}>
              <View style={styles.checkbox} />
              <Text style={styles.cellText}>
                11. IDENTIFIES WHETHER PACKED WITHIN PASSENGER OR CARGO AIRCRAFT ONLY
              </Text>
            </View>
          </View>
          <View style={styles.rightSpanCell}>
            <View style={[styles.checkbox, { marginTop: 3 }]} />
            <Text style={styles.cellText}>
              42. UN SPECIFICATION OR POP CONTAINER MATCHES CORRESPONDING PACKING GROUP
            </Text>
          </View>
        </View> */}
          <View style={styles.row42}>
            <View style={styles.leftStacked42}>
              <View style={styles.subRowSectionHeader42}>
                <Text style={styles.sectionHeader}>
                  CARGO IDENTIFICATION (NATURE & QUANTITY OF HAZMAT)
                </Text>
              </View>
              <View style={[styles.subRow42, styles.rowBorderTop42]}>
                <Form1015CheckBoxWithStatus
                  identifier="11"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  11. IDENTIFIES WHETHER PACKED WITHIN PASSENGER OR CARGO
                  AIRCRAFT ONLY
                </Text>
              </View>
            </View>

            <View style={styles.rightSpanCell42}>
              <Form1015CheckBoxWithStatus
                identifier="42"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                42. UN SPECIFICATION OR POP CONTAINER MATCHES CORRESPONDING
                PACKING GROUP
              </Text>
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.leftStacked}>
              <View style={styles.subRow}>
                <Form1015CheckBoxWithStatus
                  identifier="12"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  12. IDENTIFIES RADIOACTIVE OR NONRADIOACTIVE SHIPMENT
                </Text>
              </View>
              <View style={[styles.subRow, styles.rowBorderTop]}>
                <Form1015CheckBoxWithStatus
                  identifier="13"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  13. IDENTIFICATION NUMBER (UN, ID, NA)
                </Text>
              </View>
            </View>
            <View style={styles.rightSpanCell}>
              <Form1015CheckBoxWithStatus
                identifier="43"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                43. GROSS WEIGHT OF PACKAGE IS EQUAL TO OR LESS THAN TESTED
                WEIGHT INDICATED AS PART OF POP MARKING
              </Text>
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.leftStacked}>
              <View style={styles.subRow}>
                <Form1015CheckBoxWithStatus
                  identifier="14"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  14. PSN (WITH TECHNICAL NAME IF REQUIRED)
                </Text>
              </View>
              <View style={[styles.subRow, styles.rowBorderTop]}>
                <Form1015CheckBoxWithStatus
                  identifier="15"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  15. PRIMARY HAZARD CLASS OR DIVISION (COMPATIBILITY GROUP FOR
                  EXPLOSIVES)
                </Text>
              </View>
            </View>
            <View style={styles.rightSpanCell}>
              <Form1015CheckBoxWithStatus
                identifier="44"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                44. SINGLE PACKAGE (CONTAINING A LIQUID) TESTED PRESSURE (KPA)
                AGREES WITH CONTAINER REQUIREMENTS
              </Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2}>
              <Form1015CheckBoxWithStatus
                identifier="16"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                16. SUBSIDIARY RISK CLASS OR DIVISION, IF ASSIGNED
              </Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="45"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>45. OTHER</Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2}>
              <Form1015CheckBoxWithStatus
                identifier="17"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>17. PACKAGING GROUP</Text>
            </View>
            <View style={styles.cellRightSectionHeader}>
              <Text style={styles.sectionHeader}>
                PACKAGING--INNER (IF INSPECTED AND APPLICABLE)
              </Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2}>
              <Form1015CheckBoxWithStatus
                identifier="18"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                18. NUMBER AND TYPE OF PACKAGES
              </Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="46"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>46. ABSORBENT MATERIAL</Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2}>
              <Form1015CheckBoxWithStatus
                identifier="19"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                19. NET QUANTITY PER PACKAGE (METRIC UNLESS EXCEPTED)
              </Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="47"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>47. LEAK OR ACID PROOF LINER</Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2}>
              <Form1015CheckBoxWithStatus
                identifier="20"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                20. R--ACTIVITY PER PACKAGE GIVEN IN BECQUEREL SYSTEM
              </Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="48"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>48. INNER RECEPTACLE ORIENTA</Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2}>
              <Form1015CheckBoxWithStatus
                identifier="21"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                21. R--NAME AND SYMBOL OF MATERIAL
              </Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="49"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>49. SECONDARY CLOSURE</Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2}>
              <Form1015CheckBoxWithStatus
                identifier="22"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                22. R--MATERIAL PHYSICAL AND CHEMICAL FORM{" "}
              </Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="50"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>50. OTHER</Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2}>
              <Form1015CheckBoxWithStatus
                identifier="23"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                23. PACKAGING PARAGRAPH (FROM ATTACHMENTS 5-13)
              </Text>
            </View>
            <View style={styles.cellRightSectionHeader}>
              <Text style={styles.sectionHeader}>MARKING</Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2}>
              <Text style={styles.cellText}>
                A. "A3.1.7.3" USED WHEN POP TESTED PACKAGE IS OVERPACKED TO MEET
                AIR REQUIREMENTS
              </Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="53"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                53. PSN AND IDENTIFICATION NUMBER
              </Text>
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.cell2}>
              <Text style={styles.cellText}>
                B. PACKAGING REFERENCE FROM ATTACHMENT 27 USED FOR EXPLOSIVES
                MEETING GRANDFATHER CLAUSE
              </Text>
            </View>
            <View style={styles.rightStacked}>
              <View style={styles.subRowSectionHeader}>
                <Text style={styles.sectionHeader}>IF APPLICABLE</Text>
              </View>
              <View style={[styles.subRow, styles.rowBorderTop]}>
                <Form1015CheckBoxWithStatus
                  identifier="54"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  54. UN OR POP SPECIFICATION MARKING
                </Text>
              </View>
              <View style={[styles.subRow, styles.rowBorderTop]}>
                <Form1015CheckBoxWithStatus
                  identifier="55"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>55. "RQ"</Text>
              </View>
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.cell2}>
              <Text style={styles.cellText}>
                C. UNPACKAGED EXPLOSIVES AUTHORIZED IAW "A5.2"
              </Text>
            </View>
            <View style={styles.rightStacked}>
              <View style={styles.subRow}>
                <Form1015CheckBoxWithStatus
                  identifier="56"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>56. "WASTE"</Text>
              </View>
              <View style={[styles.subRow, styles.rowBorderTop]}>
                <Form1015CheckBoxWithStatus
                  identifier="57"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  57. "AIR ELIGIBLE" MARKING OR SYMBOL
                </Text>
              </View>
              <View style={[styles.subRow, styles.rowBorderTop]}>
                <Form1015CheckBoxWithStatus
                  identifier="58"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>58. "OVERPACKS" IDENTIFIED</Text>
              </View>
            </View>
          </View>
          <View style={styles.row6}>
            <View style={styles.cell2}>
              <Form1015CheckBoxWithStatus
                identifier="24"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                24. DOT-E, COE, CAA OR OTHER APPROVED DOCUMENT USED AS
                CERTIFICATION REFERENCE (COPY ACCOMPANIES SHIPMENT)
              </Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="59"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>59. "ORIENTATION ARROWS"</Text>
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.leftSpanCell}>
              <Form1015CheckBoxWithStatus
                identifier="25"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                25. 49CFR, IATA OR ICAO REFERENCE USED AS CERTIFICATION
                REFERENCE (IF MEETING PASSENGER RESTRICTIONS)
              </Text>
            </View>
            <View style={styles.rightStacked}>
              <View style={styles.subRow}>
                <Form1015CheckBoxWithStatus
                  identifier="60"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  60. LIMITED QUANTITY IDENTIFIED
                </Text>
              </View>
              <View style={[styles.subRow, styles.rowBorderTop]}>
                <Form1015CheckBoxWithStatus
                  identifier="61"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  61. "ORM-D" OR "ORM-D-AIR" FOR DOMESTIC ONLY SHIPMENT
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.row2}>
            <View style={styles.leftStacked}>
              <View style={styles.subRow}>
                <Form1015CheckBoxWithStatus
                  identifier="26"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>
                  26. --CATEGORY OF RADIOACTIVE PACKAGE
                </Text>
              </View>
              <View style={[styles.subRow, styles.rowBorderTop]}>
                <Form1015CheckBoxWithStatus
                  identifier="27"
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>27. R--TRANSPORT INDEX</Text>
              </View>
            </View>
            <View style={styles.rightSpanCell}>
              <Form1015CheckBoxWithStatus
                identifier="62"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                62. "INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS"
              </Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2SectionHeader}>
              <Text style={styles.sectionHeader}>IF APPLICABLE</Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="63"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                63. DOT SPECIAL PERMIT (WHEN USED AS CERTIFICATION REFERENCE)
              </Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2}>
              <Form1015CheckBoxWithStatus
                identifier="28"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                28. "RQ" IDENTIFIES A PSN AS HAZARDOUS SUBSTANCE
              </Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="64"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                64. COE NUMBER (WHEN USED AS CERTIFICATION REFERENCE)
              </Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2}>
              <Form1015CheckBoxWithStatus
                identifier="29"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                29. "WASTE" IF MARKED OR LABELED ON PACKAGE
              </Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="65"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                65. CAA NUMBER (IF REQUIRED BY CAA)
              </Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2}>
              <Form1015CheckBoxWithStatus
                identifier="30"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                30. "INHALATION HAZARD (ZONE)" (IF MATERIAL MEETS THIS
                DEFINITION)
              </Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="66"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                66. FLASHPOINT (FOR FLAMMABLE LIQUIDS)
              </Text>
            </View>
          </View>
          <View style={styles.row5}>
            <View style={styles.cell2}>
              <Form1015CheckBoxWithStatus
                identifier="31"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                31. IF OVERPACKED, THE WORDS "OVERPACK USED"
              </Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="67"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                67. NSN (OR PART NUMBER) FOR EXPLOSIVES
              </Text>
            </View>
          </View>
          <View style={styles.row3}>
            <View style={styles.cell3}>
              <Form1015CheckBoxWithStatus
                identifier="32"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>
                32. "LIMITED QUANTITY" OR "LTD QTY"
              </Text>
            </View>
            <View style={styles.cellRight}>
              <Form1015CheckBoxWithStatus
                identifier="68"
                frustratedForm1015Ids={frustratedForm1015Ids}
                resolvedForm1015Ids={resolvedForm1015Ids}
              />
              <Text style={styles.cellText}>68. OTHER</Text>
            </View>
          </View>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.fullRow2}>
            <Text style={styles.instructionsText2}>
              ENTER{" "}
              <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                "X"
              </Text>{" "}
              TO IDENTIFY NONCOMPLIANCE. USE{" "}
              <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                COMMENTS
              </Text>{" "}
              BLOCK TO PROVIDE ADDITIONAL DETAILS. CIRCLE{" "}
              <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                "X"
              </Text>{" "}
              WHEN CORRECTIVE ACTION IS COMPLETED. SIGN INSPECTION{" "}
              <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                VALIDATION BLOCK
              </Text>{" "}
              AND ATTACH TO SHIPPER'S DECLARATION FILED WITH STATION MANIFEST.
            </Text>
          </View>
          <View style={styles.fullRow}>
            <Text style={[styles.instructionsText, { fontStyle: "italic" }]}>
              THOSE ITEMS THAT APPLY ONLY TO RADIOACTIVE MATERIAL ARE IDENTIFIED
              BY AN{" "}
              <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
                "R"
              </Text>
              .
            </Text>
          </View>
          <View style={styles.fullRowSectionHeader}>
            <Text style={styles.sectionHeader}>LABELING</Text>
          </View>
          <View style={styles.fullRow}>
            <Form1015CheckBoxWithStatus
              identifier="69"
              frustratedForm1015Ids={frustratedForm1015Ids}
              resolvedForm1015Ids={resolvedForm1015Ids}
            />
            <Text style={styles.cellText}>69. PRIMARY RISK LABEL</Text>
          </View>
          <View style={styles.fullRow}>
            <Form1015CheckBoxWithStatus
              identifier="70"
              frustratedForm1015Ids={frustratedForm1015Ids}
              resolvedForm1015Ids={resolvedForm1015Ids}
            />
            <Text style={styles.cellText}>
              70. R--RADIOACTIVE MATERIAL LABELS ON OPPOSITE SIDES OF PACKAGE
            </Text>
          </View>
          <View style={styles.fullRowSectionHeader}>
            <Text style={styles.sectionHeader}>IF APPLICABLE</Text>
          </View>
          <View style={styles.fullRow}>
            <Form1015CheckBoxWithStatus
              identifier="71"
              frustratedForm1015Ids={frustratedForm1015Ids}
              resolvedForm1015Ids={resolvedForm1015Ids}
            />
            <Text style={styles.cellText}>71. SUBSIDIARY RISK LABELS</Text>
          </View>
          <View style={styles.fullRow}>
            <Form1015CheckBoxWithStatus
              identifier="72"
              frustratedForm1015Ids={frustratedForm1015Ids}
              resolvedForm1015Ids={resolvedForm1015Ids}
            />
            <Text style={styles.cellText}>
              72. "CARGO AIRCRAFT ONLY" (NOT MANDATORY FOR MOBILITY OPERATIONS)
            </Text>
          </View>
          <View style={styles.fullRow}>
            <Form1015CheckBoxWithStatus
              identifier="73"
              frustratedForm1015Ids={frustratedForm1015Ids}
              resolvedForm1015Ids={resolvedForm1015Ids}
            />
            <Text style={styles.cellText}>73. "MAGNETIZED MATERIAL"</Text>
          </View>
          <View style={styles.fullRow}>
            <Form1015CheckBoxWithStatus
              identifier="74"
              frustratedForm1015Ids={frustratedForm1015Ids}
              resolvedForm1015Ids={resolvedForm1015Ids}
            />
            <Text style={styles.cellText}>74. "EMPTY"</Text>
          </View>
          <View style={styles.fullRow}>
            <Form1015CheckBoxWithStatus
              identifier="75"
              frustratedForm1015Ids={frustratedForm1015Ids}
              resolvedForm1015Ids={resolvedForm1015Ids}
            />
            <Text style={styles.cellText}>75. OTHER</Text>
          </View>
          <View style={styles.centeredSectionRow}>
            <Text style={styles.sectionHeader}>VEHICLES AND EQUIPMENT</Text>
            <Text
              style={[
                styles.instructionsText,
                { fontStyle: "italic", textAlign: "center" },
              ]}
            >
              USE DD FORM 2133 AS CHECKLIST FOR DEPLOYMENT
              OPERATIONS(DTR,PARTIII)
            </Text>
          </View>
          {[
            "76. FUEL GUAGE OPERATIVE OR DIP STICK AVAILABLE",
            "77. VEHICLES AND SELF-PROPELLED EQUIPMENT WITH FUEL QTY NOT EXCEEDING 1/2 TANK CAPACITY",
            "78. SUPPORT EQUIPMENT DRAINED",
            "79. NO EXISTING FUEL LEAKS",
            "80. ALL ADDITIONAL HAZARDS IDENTIFIED (SEE BLOCK 36)",
            "81. SECONDARY LOADS CERTIFIED, PACKAGED AND MARKED",
            "82. BULK FLAMMABLE LIQUID FUEL TANKS DRAINED OR PURGED AS REQUIRED",
            "83. SPARE FUEL IN AUTHORIZED CONTAINERS",
            "84. BATTERY POSTS PROTECTED",
            "85. FIRE EXTINGUISHERS IN APPROVED HOLDER",
            "86. OTHER",
          ].map((label, index) => {
            const indentifier = label.slice(0, 2);
            return (
              <View style={styles.fullRow} key={index}>
                <Form1015CheckBoxWithStatus
                  identifier={indentifier}
                  frustratedForm1015Ids={frustratedForm1015Ids}
                  resolvedForm1015Ids={resolvedForm1015Ids}
                />
                <Text style={styles.cellText}>{label}</Text>
              </View>
            );
          })}
          <View style={styles.commentsContainer}>
            <View style={styles.commentsHeader}>
              <Text style={styles.cellText2}>
                87. COMMENTS/REASON(S) FOR FRUSTRATION
              </Text>
            </View>
            <View style={styles.commentsBody}>
              <View style={styles.commentsBody}>
                {failedItems.map((item, index) => {
                  return (
                    <Text
                      key={`${item.formatted}-${index}`}
                      style={styles.commentsText}
                    >
                      {item.formatted}
                    </Text>
                  );
                })}
              </View>
            </View>
          </View>
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
                  <Text style={{ fontStyle: "italic", fontWeight: "bold" }}>
                    OPTIONAL USE
                  </Text>
                </Text>
              </View>
              <View style={styles.optionalDataRow}>
                <Text style={styles.labelSmall}>87. PCS:</Text>
                <Text style={styles.optionalDataValue}>
                  {verificationCopy?.quantityAndPacking || "N/A"}
                </Text>
              </View>
              <View style={styles.optionalDataRow}>
                <Text style={styles.labelSmall}>88. WT:</Text>
                <Text style={styles.optionalDataValue}>{"N/A"}</Text>
              </View>
              <View style={styles.optionalDataRow}>
                <Text style={styles.labelSmall}>89. CUBE:</Text>
                <Text style={styles.optionalDataValue}>{"N/A"}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <ActionFooter
        buttons={[
          {
            label: "Cancel",
            onPress: () => navigation?.goBack(),
            variant: "outline",
          },
          {
            label: "Share",
            onPress: generateAndSharePdf,
            variant: "secondary",
            icon: "share",
            iconPosition: "left",
            loading: isGeneratingPdf,
            disabled: isGeneratingPdf,
          },
          {
            label: "Complete Inspection",
            onPress: handleCompleteInspectionWithFrustration,
            variant: "primary",
          },
        ]}
      />

      {/* Dev Benchmark Button - only visible in __DEV__ */}
      <DevBenchmarkButton position="bottom-right" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  formContainer: { padding: 10 },
  title: { fontWeight: "bold", fontSize: 19 },
  input: {
    paddingHorizontal: 10,
    height: 28,
    fontSize: 15,
    color: colors.textPrimary,
  },
  flex1: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
  },
  flex2: {
    flex: 2,
    padding: 6,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
  },
  flex3: {
    flex: 3,
    padding: 6,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
  },
  flex2Row: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
  },
  flex3Row: {
    flex: 3,
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
  },
  instructionsText: {
    fontSize: 15,
    textAlign: "left",
    lineHeight: 20,
    color: "#000000",
  },
  instructionsText2: {
    fontSize: 15,
    textAlign: "left",
    lineHeight: 20,
    color: "#000000",
    fontStyle: "italic",
  },
  gridContainer: {
    borderColor: legacyColors.black,
  },
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
  cell2: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  cell3: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  cell2SectionHeader: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: legacyColors.mediumGrey,
    justifyContent: "center",
    height: 55,
  },
  rowBorderTop: {
    borderTopWidth: 1,
    borderColor: legacyColors.black,
  },
  leftStacked: {
    width: "50%",
    borderColor: legacyColors.black,
    height: 110,
  },
  rightSpanCell: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: legacyColors.black,
    borderLeftWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 6,
    height: 110,
  },
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
  fullRowSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: legacyColors.black,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: legacyColors.mediumGrey,
    height: 45,
  },
  fullRow2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: legacyColors.black,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
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
    height: 450,
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
  inlineCheckboxGroup: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
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
  inspectionInlineRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  titleBlock: {
    flex: 3,
    padding: 7,
  },
  tcnBlock: {
    flex: 1,
    padding: 9.5,
    borderLeftWidth: 1,
    borderColor: legacyColors.black,
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#000000",
  },
  tcnValue: {
    fontSize: 15,
    color: "#000000",
    marginLeft: 15,
  },
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
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: legacyColors.black,
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },

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
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: legacyColors.black,
  },
  row2: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
  },
  row3: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: legacyColors.black,
    height: 60,
  },
  row4: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
    height: 100,
  },
  row5: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
    height: 60,
  },
  row6: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
    height: 80,
  },
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
  instructionsBlock: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    padding: 10,
  },
  row42: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: legacyColors.black,
    height: 100,
  },
  leftStacked42: {
    width: "50%",
    height: "100%",
  },
  rightSpanCell42: {
    width: "50%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderColor: legacyColors.black,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  subRowSectionHeader42: {
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: legacyColors.mediumGrey,
    paddingHorizontal: 6,
  },
  subRow42: {
    height: "50%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  rowBorderTop42: {
    borderTopWidth: 1,
    borderColor: legacyColors.black,
  },
  checkboxMark: {
    fontSize: 14,
    fontWeight: "bold",
    color: legacyColors.black,
    lineHeight: 18,
  },
  checkboxCircleWrapper: {
    width: 34,
    height: 34,
    borderWidth: 1.5,
    borderRadius: 17,
    borderColor: legacyColors.black,
    marginRight: 6,
    paddingLeft: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCorrected: {
    borderWidth: 2,
    borderColor: legacyColors.black,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
