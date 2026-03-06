import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { InspectorShipment } from "@/types/sddg";
import { mergeSDDGWithAttachments } from "@/utils/sddgPdfGenerator";
import { getInspectionSddgContent } from "@/utils/inspectorSddgDocumentSource";

type AttachmentLike = {
  uri?: string;
  base64Data?: string;
};

export interface InspectorAuthorizationAttachmentContext {
  attachments: AttachmentLike[];
  type: "COE" | "CAA" | "DOT-SP" | null;
  isAttested: boolean;
}

export interface ComposeInspectorSddgPdfResult {
  pdfUri: string;
  includesAuthAttachments: boolean;
  warnings: string[];
  tempUris: string[];
}

const escapeHtmlAttribute = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeHtmlText = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const withLineBreaks = (value: string): string =>
  escapeHtmlText(value || "").replace(/\n/g, "<br />");

export const getInspectorAuthorizationAttachmentContext = (
  inspection: InspectorShipment
): InspectorAuthorizationAttachmentContext => {
  const ctx = inspection.inspectionContext;
  if (!ctx) {
    return { attachments: [], type: null, isAttested: false };
  }

  if (!ctx.specialAuthorizationType) {
    return { attachments: [], type: null, isAttested: false };
  }

  const coeDocs = ctx.coeAndCaaDocuments?.coeDocuments || [];
  const caaDocs = ctx.coeAndCaaDocuments?.caaDocuments || [];
  const dotSpDocs = ctx.dotSpWaivers || [];

  if (ctx.specialAuthorizationType === "COE") {
    return {
      attachments: coeDocs,
      type: "COE",
      isAttested: ctx.specialAuthorizationAttested === true,
    };
  }

  if (ctx.specialAuthorizationType === "CAA") {
    return {
      attachments: caaDocs,
      type: "CAA",
      isAttested: ctx.specialAuthorizationAttested === true,
    };
  }

  return {
    attachments: dotSpDocs,
    type: "DOT-SP",
    isAttested: ctx.specialAuthorizationAttested === true,
  };
};

const imageUriToPdf = async (imageUri: string): Promise<string> => {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const ext = imageUri.split(".").pop()?.toLowerCase() || "jpeg";
  const mime = ext === "png" ? "image/png" : "image/jpeg";

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @page { margin: 0.4in; }
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #fff;
      }
      .page {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        width: 100%;
        height: auto;
        max-height: 100%;
        object-fit: contain;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <img src="data:${mime};base64,${escapeHtmlAttribute(base64)}" />
    </div>
  </body>
</html>
  `;

  const printResult = await Print.printToFileAsync({
    html,
    base64: false,
  });

  return printResult.uri;
};

const digitalSddgContentToPdf = async (
  inspection: InspectorShipment
): Promise<string> => {
  const content = getInspectionSddgContent(inspection);
  if (!content) {
    throw new Error("SDDG content is missing.");
  }

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @page { margin: 0.35in; }
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        color: #111827;
      }
      .title {
        text-align: center;
        font-weight: 700;
        font-size: 16px;
        margin-bottom: 12px;
      }
      .hint {
        text-align: center;
        color: #4b5563;
        font-size: 11px;
        margin-bottom: 14px;
      }
      .grid {
        border: 1px solid #d1d5db;
        border-radius: 8px;
        overflow: hidden;
      }
      .row {
        display: table;
        width: 100%;
        table-layout: fixed;
        border-bottom: 1px solid #e5e7eb;
      }
      .row:last-child { border-bottom: none; }
      .cell {
        display: table-cell;
        vertical-align: top;
        padding: 8px;
        border-right: 1px solid #e5e7eb;
      }
      .cell:last-child { border-right: none; }
      .label {
        font-size: 10px;
        color: #6b7280;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.2px;
      }
      .value {
        font-size: 12px;
        line-height: 1.45;
        word-wrap: break-word;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      .table th, .table td {
        border: 1px solid #d1d5db;
        padding: 6px;
        text-align: left;
        font-size: 11px;
        vertical-align: top;
      }
      .table th {
        background: #f3f4f6;
        font-weight: 700;
      }
      .declaration {
        margin-top: 12px;
        font-size: 11px;
        line-height: 1.45;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        padding: 10px;
      }
    </style>
  </head>
  <body>
    <div class="title">SHIPPER'S DECLARATION FOR DANGEROUS GOODS</div>
    <div class="hint">Digital SDDG generated from inspection data</div>

    <div class="grid">
      <div class="row">
        <div class="cell">
          <div class="label">Shipper</div>
          <div class="value">${withLineBreaks(content.shipper || "")}</div>
        </div>
        <div class="cell">
          <div class="label">Consignee</div>
          <div class="value">${withLineBreaks(content.consignee || "")}</div>
        </div>
      </div>
      <div class="row">
        <div class="cell">
          <div class="label">Air Waybill No.</div>
          <div class="value">${withLineBreaks(content.airWaybillNumber || "")}</div>
        </div>
        <div class="cell">
          <div class="label">TCN</div>
          <div class="value">${withLineBreaks(
            content.shippersReferenceNumber || ""
          )}</div>
        </div>
        <div class="cell">
          <div class="label">Aircraft Type</div>
          <div class="value">${withLineBreaks(content.aircraftType || "")}</div>
        </div>
      </div>
      <div class="row">
        <div class="cell">
          <div class="label">Airport of Departure</div>
          <div class="value">${withLineBreaks(
            content.airportOfDeparture || ""
          )}</div>
        </div>
        <div class="cell">
          <div class="label">Airport of Destination</div>
          <div class="value">${withLineBreaks(
            content.airportOfDestination || ""
          )}</div>
        </div>
        <div class="cell">
          <div class="label">Shipment Type</div>
          <div class="value">${withLineBreaks(content.shipmentType || "")}</div>
        </div>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>UN or ID No.</th>
          <th>Proper Shipping Name</th>
          <th>Class or Division</th>
          <th>Packing Group</th>
          <th>Quantity and Type of Packing</th>
          <th>Packing Inst.</th>
          <th>Authorization</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${withLineBreaks(content.unIdNo || "")}</td>
          <td>${withLineBreaks(content.properShippingName || "")}</td>
          <td>${withLineBreaks(
            [content.hazardClass, content.subsidiaryRisk]
              .filter(Boolean)
              .join(" ")
          )}</td>
          <td>${withLineBreaks(content.packingGroup || "—")}</td>
          <td>${withLineBreaks(content.quantityAndPacking || "")}</td>
          <td>${withLineBreaks(content.packingInstruction || "")}</td>
          <td>${withLineBreaks(content.authorization || "")}</td>
        </tr>
      </tbody>
    </table>

    <div class="declaration">
      <div><strong>Additional Handling Information</strong></div>
      <div>${withLineBreaks(content.additionalHandlingInfo || "")}</div>
      <br />
      <div><strong>Name/Title of Signatory</strong>: ${withLineBreaks(
        content.nameOfSignatory || ""
      )}</div>
      <div><strong>Place and Date</strong>: ${withLineBreaks(
        content.placeAndDate || ""
      )}</div>
    </div>
  </body>
</html>
  `;

  const printResult = await Print.printToFileAsync({
    html,
    base64: false,
  });

  return printResult.uri;
};

const writeAttachmentBase64ToPdf = async (
  base64Data: string,
  index: number
): Promise<string | null> => {
  if (!base64Data || !base64Data.trim()) {
    return null;
  }

  try {
    const cleanBase64 = base64Data.startsWith("data:application/pdf;base64,")
      ? base64Data.split(",")[1] || ""
      : base64Data;
    if (!cleanBase64) {
      return null;
    }

    const tempPath = `${FileSystem.cacheDirectory}inspector_attachment_${index}_${Date.now()}.pdf`;
    await FileSystem.writeAsStringAsync(tempPath, cleanBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return tempPath;
  } catch (error) {
    console.error("Failed to write attachment PDF:", error);
    return null;
  }
};

export const cleanupInspectorDocumentTempUris = async (
  uris: string[]
): Promise<void> => {
  if (!uris.length) {
    return;
  }

  await Promise.all(
    uris.map(uri =>
      FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {})
    )
  );
};

export const composeInspectorSddgPdf = async (
  inspection: InspectorShipment
): Promise<ComposeInspectorSddgPdfResult> => {
  const warnings: string[] = [];
  const tempUris: string[] = [];
  const imageUri = inspection.inspectionContext?.originalImageUri;
  let sddgPdfUri: string;

  if (imageUri) {
    const imageInfo = await FileSystem.getInfoAsync(imageUri);
    if (imageInfo.exists) {
      sddgPdfUri = await imageUriToPdf(imageUri);
    } else {
      warnings.push("Original SDDG image was missing; generated digital SDDG.");
      sddgPdfUri = await digitalSddgContentToPdf(inspection);
    }
  } else {
    sddgPdfUri = await digitalSddgContentToPdf(inspection);
  }

  tempUris.push(sddgPdfUri);

  const { attachments, type, isAttested } =
    getInspectorAuthorizationAttachmentContext(inspection);

  if (!isAttested || !type || attachments.length === 0) {
    return {
      pdfUri: sddgPdfUri,
      includesAuthAttachments: false,
      warnings,
      tempUris,
    };
  }

  const attachmentUris: string[] = [];
  for (let i = 0; i < attachments.length; i += 1) {
    const attachment = attachments[i];

    if (attachment.uri) {
      try {
        const attachmentInfo = await FileSystem.getInfoAsync(attachment.uri);
        if (attachmentInfo.exists) {
          attachmentUris.push(attachment.uri);
          continue;
        }
      } catch {
        // Fall through to base64 conversion.
      }
    }

    if (attachment.base64Data) {
      const generatedUri = await writeAttachmentBase64ToPdf(
        attachment.base64Data,
        i
      );
      if (generatedUri) {
        attachmentUris.push(generatedUri);
        tempUris.push(generatedUri);
      }
    }
  }

  if (!attachmentUris.length) {
    warnings.push(
      `No ${type} attachment files could be loaded; using SDDG only.`
    );
    return {
      pdfUri: sddgPdfUri,
      includesAuthAttachments: false,
      warnings,
      tempUris,
    };
  }

  try {
    const mergedPdfUri = await mergeSDDGWithAttachments(sddgPdfUri, attachmentUris);
    tempUris.push(mergedPdfUri);
    return {
      pdfUri: mergedPdfUri,
      includesAuthAttachments: true,
      warnings,
      tempUris,
    };
  } catch (error) {
    console.error("Failed to merge SDDG with authorization attachment(s):", error);
    warnings.push(
      `Unable to append ${type} document(s); using SDDG only.`
    );
    return {
      pdfUri: sddgPdfUri,
      includesAuthAttachments: false,
      warnings,
      tempUris,
    };
  }
};
