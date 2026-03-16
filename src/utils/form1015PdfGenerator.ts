import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { InspectorShipment } from "../types/sddg";
import {
  SDDG_TO_FORM1015_MAPPING,
  getForm1015FrustrationDescription,
  getPackageFrustrationField,
  mapFrustrationsToForm1015WithResolved,
} from "./sddgToForm1015Mapping";
import { getLatestReinspectionInfo } from "./reinspectionInfo";

export interface Form1015PdfData {
  tcn: string;
  allPassed: boolean;
  anyFailed: boolean;
  inspectedByName: string;
  inspectedByDate: string;
  correctedByName: string;
  reinspectedByName: string;
  reinspectedByDate: string;
  hasReinspectionAttempts: boolean;
  correctiveActionsChecked: boolean;
  frustratedIds: Set<string>;
  resolvedIds: Set<string>;
  failedItems: Array<{ formatted: string }>;
  quantityAndPacking: string;
  openedForInspection: boolean | null;
}

const sanitizeFilenameSegment = (value: string): string =>
  value.replace(/[^a-zA-Z0-9]/g, "");

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatInspector = (inspectorData: unknown): string => {
  if (typeof inspectorData === "string") {
    return inspectorData.replace(",", " ").replace(/\s+/g, " ").trim();
  }

  if (inspectorData && typeof inspectorData === "object") {
    const name = (inspectorData as { inspectorName?: string }).inspectorName || "";
    return name.replace(",", " ").replace(/\s+/g, " ").trim();
  }

  return "";
};

const toArray = <T>(value: unknown): T[] => (Array.isArray(value) ? value : []);

const formatDateTime = (date: Date): { formattedDate: string; formattedTime: string } => {
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

export const buildForm1015PdfData = (
  inspection: InspectorShipment
): Form1015PdfData => {
  const context = (inspection.inspectionContext || {}) as any;
  const sddgFrustrations = toArray<any>(context.frustrations);
  const packageFrustrations = toArray<any>(context.packageFrustrations);
  const resolvedSddgFrustrations = toArray<any>(context.resolvedFrustrations);
  const resolvedPackageFrustrations = toArray<any>(
    context.resolvedPackageFrustrations
  );
  const verificationCopy = context.verificationCopy || null;
  const openedForInspection = context.packageOpeningInspection?.wasOpened ?? null;

  const { currentlyFrustrated: frustratedForm1015Ids, resolved: resolvedForm1015Ids } =
    mapFrustrationsToForm1015WithResolved(
      sddgFrustrations,
      packageFrustrations,
      resolvedSddgFrustrations,
      resolvedPackageFrustrations,
      verificationCopy
    );

  const hasCurrentFrustrations =
    sddgFrustrations.length > 0 || packageFrustrations.length > 0;
  const hasResolvedFrustrations =
    resolvedSddgFrustrations.length > 0 || resolvedPackageFrustrations.length > 0;
  // "DOES NOT COMPLY" stays checked if frustrations ever existed (current or resolved)
  const anyFailed = hasCurrentFrustrations || hasResolvedFrustrations;
  const allPassed = !anyFailed;
  const tcn = verificationCopy?.shippersReferenceNumber || inspection.tcn || "N/A";
  const inspectedByDate = new Date()
    .toISOString()
    .split("T")[0]
    .replace(/-/g, "");
  const inspectedByName = formatInspector(inspection.inspector) || "N/A";

  // Reinspection info
  const correctiveActionsChecked = hasResolvedFrustrations && !hasCurrentFrustrations;

  const { latestDate: reinspectionDate, latestInspector } =
    getLatestReinspectionInfo({
      sddgFrustrations,
      packageFrustrations,
      resolvedSddgFrustrations,
      resolvedPackageFrustrations,
    });

  const normalizedLatestInspector = latestInspector
    ? formatInspector(latestInspector)
    : "";
  const reinspectedByDate = reinspectionDate
    ? reinspectionDate.toISOString().split("T")[0].replace(/-/g, "")
    : "";
  const hasReinspectionAttempts = !!reinspectionDate;
  const reinspectedByName = hasReinspectionAttempts
    ? normalizedLatestInspector || inspectedByName
    : "N/A";
  const correctedByName = correctiveActionsChecked
    ? (context.correctedByName || "N/A")
    : "N/A";

  // Build timeline entries
  interface TimelineEntry {
    date: Date;
    lineNumber: string;
    formatted: string;
  }

  const allEntries: TimelineEntry[] = [];

  const allSddgFrustrations = [...sddgFrustrations, ...resolvedSddgFrustrations];
  allSddgFrustrations.forEach((frustration: any) => {
    const form1015Id =
      SDDG_TO_FORM1015_MAPPING[frustration.key] ||
      Array.from(frustratedForm1015Ids).find(id => {
        const description = getForm1015FrustrationDescription(
          id,
          sddgFrustrations,
          []
        );
        return description === frustration.fieldLabel;
      }) ||
      Array.from(resolvedForm1015Ids).find(id => {
        const description = getForm1015FrustrationDescription(
          id,
          resolvedSddgFrustrations,
          []
        );
        return description === frustration.fieldLabel;
      });

    const lineNumber = form1015Id || "N/A";
    const entryDate = new Date(
      frustration.frustrationDate || frustration.createdAt || new Date()
    );
    const { formattedDate, formattedTime } = formatDateTime(entryDate);

    allEntries.push({
      date: entryDate,
      lineNumber,
      formatted: `${lineNumber}. - ${formattedDate} @ ${formattedTime} - ${(
        frustration.fieldLabel || frustration.message || ""
      ).toUpperCase()} - Inspector: ${formatInspector(frustration.inspector)}`,
    });

    if (
      frustration.reinspectionHistory &&
      frustration.reinspectionHistory.length > 0
    ) {
      frustration.reinspectionHistory.forEach((attempt: any) => {
        const attemptDate = new Date(attempt.date);
        const { formattedDate: reinspectDate, formattedTime: reinspectTime } =
          formatDateTime(attemptDate);
        const action = attempt.action === "verified" ? "VERIFIED" : "FRUSTRATED";
        const comments = attempt.additionalComments
          ? ` - ${attempt.additionalComments}`
          : "";

        allEntries.push({
          date: attemptDate,
          lineNumber,
          formatted: `${lineNumber}. - ${reinspectDate} @ ${reinspectTime} - REINSPECTED: ${action} - Inspector: ${formatInspector(
            attempt.inspector
          )}${comments}`,
        });
      });
    }
  });

  const allPackageFrustrations = [
    ...packageFrustrations.filter(
      (f: any) => f.verificationStatus === "missing" || f.verificationStatus === "incorrect"
    ),
    ...resolvedPackageFrustrations.filter(
      (f: any) => f.verificationStatus === "missing" || f.verificationStatus === "incorrect"
    ),
  ];

  allPackageFrustrations.forEach((frustration: any) => {
    const form1015Id =
      getPackageFrustrationField(frustration) ||
      Array.from(frustratedForm1015Ids).find(id => {
        const description = getForm1015FrustrationDescription(
          id,
          [],
          packageFrustrations
        );
        return description?.includes(frustration.itemLabel);
      }) ||
      Array.from(resolvedForm1015Ids).find(id => {
        const description = getForm1015FrustrationDescription(
          id,
          [],
          resolvedPackageFrustrations
        );
        return description?.includes(frustration.itemLabel);
      });

    const lineNumber = form1015Id || "N/A";
    let labelDisplay = (frustration.itemLabel || frustration.label || "").toUpperCase();
    if (
      frustration.itemLabel === "Military Shipping Label (MSL) or DD Form 1387" &&
      lineNumber === "75"
    ) {
      labelDisplay = "MSL (MILITARY SHIPPING LABEL)";
    }

    const entryDate = new Date(
      frustration.frustrationDate || frustration.createdAt || new Date()
    );
    const { formattedDate, formattedTime } = formatDateTime(entryDate);
    const magnetizedComments =
      frustration.category === "magnetized" && frustration.additionalComments
        ? ` - ${frustration.additionalComments}`
        : "";

    allEntries.push({
      date: entryDate,
      lineNumber,
      formatted: `${lineNumber}. - ${formattedDate} @ ${formattedTime} - ${labelDisplay} - Inspector: ${formatInspector(
        frustration.inspector
      )}${magnetizedComments}`,
    });

    if (
      frustration.reinspectionHistory &&
      frustration.reinspectionHistory.length > 0
    ) {
      frustration.reinspectionHistory.forEach((attempt: any) => {
        const attemptDate = new Date(attempt.date);
        const { formattedDate: reinspectDate, formattedTime: reinspectTime } =
          formatDateTime(attemptDate);
        const action = attempt.action === "verified" ? "VERIFIED" : "FRUSTRATED";
        const comments = attempt.additionalComments
          ? ` - ${attempt.additionalComments}`
          : "";

        allEntries.push({
          date: attemptDate,
          lineNumber,
          formatted: `${lineNumber}. - ${reinspectDate} @ ${reinspectTime} - REINSPECTED: ${action} - Inspector: ${formatInspector(
            attempt.inspector
          )}${comments}`,
        });
      });
    }
  });

  allEntries.sort((a, b) => a.date.getTime() - b.date.getTime());

  return {
    tcn,
    allPassed,
    anyFailed,
    inspectedByName,
    inspectedByDate,
    correctedByName,
    reinspectedByName,
    reinspectedByDate,
    hasReinspectionAttempts,
    correctiveActionsChecked,
    frustratedIds: frustratedForm1015Ids,
    resolvedIds: resolvedForm1015Ids,
    failedItems: allEntries.map(entry => ({ formatted: entry.formatted })),
    quantityAndPacking: verificationCopy?.quantityAndPacking || "N/A",
    openedForInspection,
  };
};

// --- HTML generation helpers ---

/** Render a checkbox cell: X if frustrated, circled-X if resolved, empty otherwise */
function checkboxHtml(id: string, data: Form1015PdfData): string {
  const isFrustrated = data.frustratedIds.has(id);
  const isResolved = data.resolvedIds.has(id);
  if (isResolved) {
    return `<span style="display:inline-block;width:16px;height:16px;border:1px solid #000;text-align:center;line-height:16px;font-size:12px;font-weight:bold;border-radius:50%;margin-right:4px;">X</span>`;
  }
  if (isFrustrated) {
    return `<span style="display:inline-block;width:16px;height:16px;border:1px solid #000;text-align:center;line-height:16px;font-size:12px;font-weight:bold;margin-right:4px;">X</span>`;
  }
  return `<span style="display:inline-block;width:16px;height:16px;border:1px solid #000;margin-right:4px;">&nbsp;</span>`;
}

/** Two-column checkbox row */
function twoColRow(
  leftId: string, leftLabel: string,
  rightId: string | null, rightLabel: string | null,
  data: Form1015PdfData,
  rightIsHeader = false
): string {
  const leftCell = leftId
    ? `<td style="padding:4px 6px;border-right:1px solid #000;width:50%;vertical-align:middle;">${checkboxHtml(leftId, data)} ${escapeHtml(leftLabel)}</td>`
    : `<td style="padding:4px 6px;border-right:1px solid #000;width:50%;vertical-align:middle;">${escapeHtml(leftLabel)}</td>`;

  let rightCell: string;
  if (rightIsHeader) {
    rightCell = `<td style="padding:4px 6px;width:50%;vertical-align:middle;background:#ddd;text-align:center;font-weight:bold;">${escapeHtml(rightLabel || "")}</td>`;
  } else if (rightId && rightLabel) {
    rightCell = `<td style="padding:4px 6px;width:50%;vertical-align:middle;">${checkboxHtml(rightId, data)} ${escapeHtml(rightLabel)}</td>`;
  } else if (rightLabel) {
    rightCell = `<td style="padding:4px 6px;width:50%;vertical-align:middle;">${escapeHtml(rightLabel)}</td>`;
  } else {
    rightCell = `<td style="padding:4px 6px;width:50%;vertical-align:middle;">&nbsp;</td>`;
  }

  return `<tr style="border-bottom:1px solid #000;">${leftCell}${rightCell}</tr>`;
}

/** Full-width checkbox row */
function fullRow(id: string, label: string, data: Form1015PdfData): string {
  return `<tr style="border-bottom:1px solid #000;">
    <td colspan="2" style="padding:4px 6px;vertical-align:middle;">${checkboxHtml(id, data)} ${escapeHtml(label)}</td>
  </tr>`;
}

/** Section header row */
function sectionHeaderRow(title: string, subtitle?: string): string {
  const sub = subtitle ? `<br/><span style="font-style:italic;font-weight:normal;font-size:10px;">${escapeHtml(subtitle)}</span>` : "";
  return `<tr><td colspan="2" style="padding:6px;background:#ddd;text-align:center;font-weight:bold;border-bottom:1px solid #000;">${escapeHtml(title)}${sub}</td></tr>`;
}

export const generateForm1015SectionHtml = (data: Form1015PdfData): string => {
  const cb = (id: string) => checkboxHtml(id, data);

  const commentsHtml = data.failedItems.length > 0
    ? data.failedItems.map(item => `<p style="margin:6px 0;font-size:11px;">${escapeHtml(item.formatted)}</p>`).join("")
    : `<p style="margin:6px 0;font-size:11px;color:#666;">No frustrations recorded.</p>`;

  return `
  <section style="font-family: Arial, Helvetica, sans-serif; font-size:11px; padding:12px;">
    <table style="width:100%;border-collapse:collapse;border:1px solid #000;">
      <!-- Title -->
      <tr>
        <td style="padding:8px;font-weight:bold;font-size:14px;border-right:1px solid #000;width:75%;">HAZMAT INSPECTION AND ACCEPTANCE CHECKLIST</td>
        <td style="padding:8px;width:25%;"><strong>TCN</strong> ${escapeHtml(data.tcn)}</td>
      </tr>

      <!-- Validation Banner -->
      <tr><td colspan="2" style="padding:4px;background:#ddd;text-align:center;font-weight:bold;border-top:1px solid #000;border-bottom:1px solid #000;">INSPECTION VALIDATION</td></tr>

      <!-- Compliance Row -->
      <tr style="border-bottom:1px solid #000;">
        <td colspan="2" style="padding:0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px;width:20%;border-right:1px solid #000;font-weight:bold;">THIS SHIPMENT HAS BEEN INSPECTED AND</td>
              <td style="padding:6px;width:40%;border-right:1px solid #000;">
                <span style="display:inline-block;width:16px;height:16px;border:1px solid #000;text-align:center;line-height:16px;font-weight:bold;margin-right:4px;">${data.allPassed ? "X" : "&nbsp;"}</span>
                COMPLIES WITH ALL REGULATORY REQUIREMENTS
              </td>
              <td style="padding:6px;width:40%;">
                <span style="display:inline-block;width:16px;height:16px;border:1px solid #000;text-align:center;line-height:16px;font-weight:bold;margin-right:4px;">${data.anyFailed ? "X" : "&nbsp;"}</span>
                DOES NOT COMPLY WITH ALL REGULATORY REQUIREMENTS AS INDICATED
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Inspector Info -->
      <tr style="border-bottom:1px solid #000;">
        <td colspan="2" style="padding:0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px;width:20%;border-right:1px solid #000;"><strong>DATE (YYYYMMDD)</strong><br/>${escapeHtml(data.inspectedByDate || "N/A")}</td>
              <td style="padding:6px;width:30%;border-right:1px solid #000;"><strong>INSPECTED BY (NAME)</strong><br/>${escapeHtml(data.inspectedByName)}</td>
              <td style="padding:6px;width:20%;border-right:1px solid #000;"><strong>DATE (YYYYMMDD)</strong><br/>${escapeHtml(data.correctiveActionsChecked ? data.reinspectedByDate : "N/A")}</td>
              <td style="padding:6px;width:30%;"><strong>CORRECTED BY (NAME)</strong><br/>${escapeHtml(data.correctedByName)}</td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Re-inspection Row -->
      <tr style="border-bottom:1px solid #000;">
        <td colspan="2" style="padding:0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px;width:20%;border-right:1px solid #000;"><strong>DATE (YYYYMMDD)</strong><br/>${escapeHtml(data.hasReinspectionAttempts ? data.reinspectedByDate : "N/A")}</td>
              <td style="padding:6px;width:30%;border-right:1px solid #000;"><strong>RE-INSPECTED BY (NAME)</strong><br/>${escapeHtml(data.reinspectedByName)}</td>
              <td style="padding:6px;width:50%;">
                <span style="display:inline-block;width:16px;height:16px;border:1px solid #000;text-align:center;line-height:16px;font-weight:bold;margin-right:4px;">${data.correctiveActionsChecked ? "X" : "&nbsp;"}</span>
                CORRECTIVE ACTIONS CHECKED. SHIPMENT COMPLIES WITH ALL REGULATORY REQUIREMENTS.
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Instructions -->
      <tr style="border-bottom:1px solid #000;">
        <td colspan="2" style="padding:8px;font-size:10px;font-style:italic;">
          ENTER <strong>"X"</strong> TO IDENTIFY NONCOMPLIANCE. USE <strong>COMMENTS</strong> BLOCK TO PROVIDE ADDITIONAL DETAILS. CIRCLE <strong>"X"</strong> WHEN CORRECTIVE ACTION IS COMPLETED. SIGN INSPECTION <strong>VALIDATION BLOCK</strong> AND ATTACH TO SHIPPER'S DECLARATION FILED WITH STATION MANIFEST. THOSE ITEMS THAT APPLY ONLY TO RADIOACTIVE MATERIAL ARE IDENTIFIED BY AN <strong>"R"</strong>. <strong>ADDITIONAL CHECKPOINTS ON THE REVERSE.</strong>
        </td>
      </tr>

      <!-- Grid Header -->
      <tr style="border-bottom:1px solid #000;">
        <td style="padding:6px;width:50%;background:#ddd;text-align:center;font-weight:bold;border-right:1px solid #000;">SHIPPER'S DECLARATION</td>
        <td style="padding:6px;width:50%;background:#ddd;text-align:center;font-weight:bold;">CARGO IDENTIFICATION (IF APPLICABLE) (CONTINUED)</td>
      </tr>

      <!-- Fields 1-32 left, 33-68 right -->
      <tr style="border-bottom:1px solid #000;">
        <td style="padding:4px 6px;border-right:1px solid #000;width:50%;vertical-align:middle;">${cb("1")} 1. THREE ORIGINAL DOCUMENTS FOR EACH PROPER SHIPPING NAME (PSN) UNDER A SINGLE TCN (ONLY TWO REQUIRED FOR CHAPTER 3)</td>
        <td style="padding:0;width:50%;vertical-align:top;">
          <div style="padding:4px 6px;border-bottom:1px solid #000;">${cb("33")} 33. CRYOGENICS VENTING REQUIREMENTS</div>
          <div style="padding:4px 6px;">${cb("34")} 34. SECONDARY HAZARD PSN, CLASS OR DIVISION AND NET QUANTITY</div>
        </td>
      </tr>
      ${twoColRow("2", "2. SHIPPER'S ADDRESS AND PHONE NUMBER", "35", "35. HANDLING INSTRUCTIONS", data)}
      ${twoColRow("3", "3. CONSIGNEE DODAAC OR ADDRESS (OR WORLDWIDE MOBILITY)", "36", "36. OTHER", data)}
      ${twoColRow("4", "4. TRANSPORTATION CONTROL NUMBER (TCN)", null, "PACKAGING--OUTER", data, true)}
      ${twoColRow("5", "5. AIRPORT OF DEPARTURE AND DESTINATION (OR WORLDWIDE MOBILITY)", "37", "37. CONTAINER SERVICEABLE; DAMAGE, LEAKAGE OR LOSS CONTENTS", data)}
      ${twoColRow("6", "6. NAME AND TITLE OF PREPARER WITH SIGNATURE", "38", "38. APPROVED OUTER CONTAINER (IF REQUIRED)", data)}
      ${twoColRow("7", "7. PLACE AND DATE MATERIAL CERTIFIED", "39", "39. PACKAGE PERMITTED BY PACKAGING REFERENCE", data)}
      ${twoColRow("8", "8. PEN AND INK CHANGES SIGNED", "40", "40. OTHER", data)}
      ${twoColRow("9", "9. EMERGENCY RESPONSE NUMBER", null, "IF APPLICABLE", data, true)}
      ${twoColRow("10", "10. OTHER", "41", "41. ULLAGE", data)}

      ${twoColRow("11", "11. IDENTIFIES WHETHER PACKED WITHIN PASSENGER OR CARGO AIRCRAFT ONLY", "42", "42. UN SPECIFICATION OR POP CONTAINER MATCHES CORRESPONDING PACKING GROUP", data)}
      ${twoColRow("12", "12. IDENTIFIES RADIOACTIVE OR NONRADIOACTIVE SHIPMENT", "43", "43. GROSS WEIGHT OF PACKAGE IS EQUAL TO OR LESS THAN TESTED WEIGHT INDICATED AS PART OF POP MARKING", data)}
      ${twoColRow("13", "13. IDENTIFICATION NUMBER (UN, ID, NA)", null, null, data)}
      ${twoColRow("14", "14. PSN (WITH TECHNICAL NAME IF REQUIRED)", "44", "44. SINGLE PACKAGE (CONTAINING A LIQUID) TESTED PRESSURE (KPA) AGREES WITH CONTAINER REQUIREMENTS", data)}
      ${twoColRow("15", "15. PRIMARY HAZARD CLASS OR DIVISION (COMPATIBILITY GROUP FOR EXPLOSIVES)", null, null, data)}
      ${twoColRow("16", "16. SUBSIDIARY RISK CLASS OR DIVISION, IF ASSIGNED", "45", "45. OTHER", data)}
      ${twoColRow("17", "17. PACKAGING GROUP", null, "PACKAGING--INNER (IF INSPECTED AND APPLICABLE)", data, true)}
      ${twoColRow("18", "18. NUMBER AND TYPE OF PACKAGES", "46", "46. ABSORBENT MATERIAL", data)}
      ${twoColRow("19", "19. NET QUANTITY PER PACKAGE (METRIC UNLESS EXCEPTED)", "47", "47. LEAK OR ACID PROOF LINER", data)}
      ${twoColRow("20", "20. R--ACTIVITY PER PACKAGE GIVEN IN BECQUEREL SYSTEM", "48", "48. INNER RECEPTACLE ORIENTATION", data)}
      ${twoColRow("21", "21. R--NAME AND SYMBOL OF MATERIAL", "49", "49. SECONDARY CLOSURE", data)}
      ${twoColRow("22", "22. R--MATERIAL PHYSICAL AND CHEMICAL FORM", "50", "50. OTHER", data)}
      ${twoColRow("23", "23. PACKAGING PARAGRAPH (FROM ATTACHMENTS 5-13)", null, "MARKING", data, true)}

      <tr style="border-bottom:1px solid #000;">
        <td style="padding:4px 6px;border-right:1px solid #000;width:50%;vertical-align:middle;font-size:10px;">A. "A3.1.7.3" USED WHEN POP TESTED PACKAGE IS OVERPACKED TO MEET AIR REQUIREMENTS</td>
        <td style="padding:4px 6px;width:50%;vertical-align:middle;">${cb("53")} 53. PSN AND IDENTIFICATION NUMBER</td>
      </tr>

      <tr style="border-bottom:1px solid #000;">
        <td style="padding:4px 6px;border-right:1px solid #000;width:50%;vertical-align:middle;font-size:10px;">B. PACKAGING REFERENCE FROM ATTACHMENT 27 USED FOR EXPLOSIVES MEETING GRANDFATHER CLAUSE</td>
        <td style="padding:4px 6px;width:50%;vertical-align:middle;">
          ${cb("54")} 54. UN OR POP SPECIFICATION MARKING<br/>
          ${cb("55")} 55. "RQ"
        </td>
      </tr>

      <tr style="border-bottom:1px solid #000;">
        <td style="padding:4px 6px;border-right:1px solid #000;width:50%;vertical-align:middle;font-size:10px;">C. UNPACKAGED EXPLOSIVES AUTHORIZED IAW "A5.2"</td>
        <td style="padding:4px 6px;width:50%;vertical-align:middle;">
          ${cb("56")} 56. "WASTE"<br/>
          ${cb("57")} 57. "AIR ELIGIBLE" MARKING OR SYMBOL<br/>
          ${cb("58")} 58. "OVERPACKS" IDENTIFIED
        </td>
      </tr>

      ${twoColRow("24", '24. DOT-E, COE, CAA OR OTHER APPROVED DOCUMENT USED AS CERTIFICATION REFERENCE (COPY ACCOMPANIES SHIPMENT)', "59", '59. "ORIENTATION ARROWS"', data)}
      <tr style="border-bottom:1px solid #000;">
        <td style="padding:4px 6px;border-right:1px solid #000;width:50%;vertical-align:middle;">${cb("25")} 25. 49CFR, IATA OR ICAO REFERENCE USED AS CERTIFICATION REFERENCE (IF MEETING PASSENGER RESTRICTIONS)</td>
        <td style="padding:0;width:50%;vertical-align:top;">
          <div style="padding:4px 6px;border-bottom:1px solid #000;">${cb("60")} 60. LIMITED QUANTITY IDENTIFIED</div>
          <div style="padding:4px 6px;">${cb("61")} 61. "ORM-D" OR "ORM-D-AIR" FOR DOMESTIC ONLY SHIPMENT</div>
        </td>
      </tr>

      ${twoColRow("26", "26. --CATEGORY OF RADIOACTIVE PACKAGE", "62", '62. "INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS"', data)}
      ${twoColRow("27", "27. R--TRANSPORT INDEX", "63", "63. DOT SPECIAL PERMIT (WHEN USED AS CERTIFICATION REFERENCE)", data)}
      ${twoColRow("28", '28. "RQ" IDENTIFIES A PSN AS HAZARDOUS SUBSTANCE', "64", "64. COE NUMBER (WHEN USED AS CERTIFICATION REFERENCE)", data)}
      ${twoColRow("29", '29. "WASTE" IF MARKED OR LABELED ON PACKAGE', "65", "65. CAA NUMBER (IF REQUIRED BY CAA)", data)}
      ${twoColRow("30", '30. "INHALATION HAZARD (ZONE)" (IF MATERIAL MEETS THIS DEFINITION)', "66", "66. FLASHPOINT (FOR FLAMMABLE LIQUIDS)", data)}
      ${twoColRow("31", '31. IF OVERPACKED, THE WORDS "OVERPACK USED"', "67", "67. NSN (OR PART NUMBER) FOR EXPLOSIVES", data)}
      ${twoColRow("32", '32. "LIMITED QUANTITY" OR "LTD QTY"', "68", "68. OTHER", data)}

      <!-- Page 2: LABELING -->
      ${sectionHeaderRow("LABELING")}
      ${fullRow("69", "69. PRIMARY RISK LABEL", data)}
      ${fullRow("70", "70. R--RADIOACTIVE MATERIAL LABELS ON OPPOSITE SIDES OF PACKAGE", data)}
      ${sectionHeaderRow("IF APPLICABLE")}
      ${fullRow("71", "71. SUBSIDIARY RISK LABELS", data)}
      ${fullRow("72", '72. "CARGO AIRCRAFT ONLY" (NOT MANDATORY FOR MOBILITY OPERATIONS)', data)}
      ${fullRow("73", '73. "MAGNETIZED MATERIAL"', data)}
      ${fullRow("74", '74. "EMPTY"', data)}
      ${fullRow("75", "75. OTHER", data)}

      ${sectionHeaderRow("VEHICLES AND EQUIPMENT", "USE DD FORM 2133 AS CHECKLIST FOR DEPLOYMENT OPERATIONS (DTR, PART III)")}
      ${fullRow("76", "76. FUEL GAUGE OPERATIVE OR DIP STICK AVAILABLE", data)}
      ${fullRow("77", "77. VEHICLES AND SELF-PROPELLED EQUIPMENT WITH FUEL QTY NOT EXCEEDING 1/2 TANK CAPACITY", data)}
      ${fullRow("78", "78. SUPPORT EQUIPMENT DRAINED", data)}
      ${fullRow("79", "79. NO EXISTING FUEL LEAKS", data)}
      ${fullRow("80", "80. ALL ADDITIONAL HAZARDS IDENTIFIED (SEE BLOCK 36)", data)}
      ${fullRow("81", "81. SECONDARY LOADS CERTIFIED, PACKAGED AND MARKED", data)}
      ${fullRow("82", "82. BULK FLAMMABLE LIQUID FUEL TANKS DRAINED OR PURGED AS REQUIRED", data)}
      ${fullRow("83", "83. SPARE FUEL IN AUTHORIZED CONTAINERS", data)}
      ${fullRow("84", "84. BATTERY POSTS PROTECTED", data)}
      ${fullRow("85", "85. FIRE EXTINGUISHERS IN APPROVED HOLDER", data)}
      ${fullRow("86", "86. OTHER", data)}

      <!-- Comments -->
      <tr style="border-bottom:1px solid #000;">
        <td colspan="2" style="padding:6px;font-weight:bold;">87. COMMENTS/REASON(S) FOR FRUSTRATION</td>
      </tr>
      <tr style="border-bottom:1px solid #000;">
        <td colspan="2" style="padding:6px;min-height:120px;">
          ${commentsHtml}
        </td>
      </tr>

      <!-- Final Row -->
      <tr>
        <td style="padding:6px;border-right:1px solid #000;">
          <strong>OPENED FOR INSPECTION:</strong>
          <span style="display:inline-block;width:16px;height:16px;border:1px solid #000;text-align:center;margin:0 4px;${data.openedForInspection === true ? "background:#007AFF;color:#fff;font-weight:bold;" : ""}">${data.openedForInspection === true ? "✓" : "&nbsp;"}</span> YES
          <span style="display:inline-block;width:16px;height:16px;border:1px solid #000;text-align:center;margin:0 4px;${data.openedForInspection === false ? "background:#007AFF;color:#fff;font-weight:bold;" : ""}">${data.openedForInspection === false ? "✓" : "&nbsp;"}</span> NO
        </td>
        <td style="padding:0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:4px;text-align:center;font-style:italic;font-weight:bold;border-bottom:1px solid #000;">OPTIONAL USE</td></tr>
            <tr><td style="padding:4px;border-bottom:1px solid #000;">87. PCS: ${escapeHtml(data.quantityAndPacking)}</td></tr>
            <tr><td style="padding:4px;border-bottom:1px solid #000;">88. WT: N/A</td></tr>
            <tr><td style="padding:4px;">89. CUBE: N/A</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </section>
`;
};

export const generateForm1015Html = (data: Form1015PdfData): string => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AMC Form 1015</title>
    <style>
      @page { margin: 0.3in; }
      body { margin: 0; padding: 0; }
    </style>
  </head>
  <body>
    ${generateForm1015SectionHtml(data)}
  </body>
</html>
`;

export const generateForm1015Pdf = async (data: Form1015PdfData): Promise<string> => {
  const html = generateForm1015Html(data);
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  return uri;
};

export const shareForm1015Pdf = async (data: Form1015PdfData): Promise<void> => {
  const pdfUri = await generateForm1015Pdf(data);
  const sanitizedTcn = sanitizeFilenameSegment(data.tcn || "NOTCN");
  const filename = `AMC1015_${sanitizedTcn}_${data.inspectedByDate}.pdf`;
  const newUri = `${FileSystem.cacheDirectory}${filename}`;

  try {
    await FileSystem.copyAsync({ from: pdfUri, to: newUri });
    await Sharing.shareAsync(newUri, {
      mimeType: "application/pdf",
      dialogTitle: "Share AMC Form 1015",
      UTI: "com.adobe.pdf",
    });
  } finally {
    // Only delete the intermediate PDF; keep the named copy so the
    // receiving app (Teams, Outlook, etc.) can finish reading it.
    await FileSystem.deleteAsync(pdfUri, { idempotent: true }).catch(() => {});
  }
};
