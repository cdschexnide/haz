import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { InspectorShipment } from "@/types/sddg";
import { mergeSDDGWithAttachments } from "@/utils/sddgPdfGenerator";

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

  if (!imageUri) {
    throw new Error("SDDG image URI is missing.");
  }

  const imageInfo = await FileSystem.getInfoAsync(imageUri);
  if (!imageInfo.exists) {
    throw new Error("SDDG image file not found.");
  }

  const sddgPdfUri = await imageUriToPdf(imageUri);
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
