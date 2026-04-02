import React, { forwardRef, useImperativeHandle } from "react";
import { View } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";

const STAMP_FONT_SCALE = 0.018;
const MAX_IMAGE_DIMENSION = 2048;
export const STAMP_TIMEOUT_MS = 10000;

export interface StampInspectorInfo {
  inspectorName: string;
  inspectorRank: string | null;
  inspectorTitle: string;
}

export interface SddgStampOverlayHandle {
  stamp: (
    imageUri: string,
    inspector: StampInspectorInfo,
    date: Date
  ) => Promise<string | null>;
}

export function scaleToMax(
  width: number,
  height: number,
  maxDimension: number = MAX_IMAGE_DIMENSION
): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / Math.max(width, height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function buildStampLines(
  inspector: StampInspectorInfo,
  date: Date
): { line1: string; line2: string } {
  const rankPrefix = inspector.inspectorRank ? `${inspector.inspectorRank} ` : "";
  const line1 = `Inspected by ${rankPrefix}${inspector.inspectorName}`;
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
  const line2 = `${inspector.inspectorTitle} Date: ${formattedDate}`;
  return { line1, line2 };
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Stamp an SDDG image with inspector info using expo-print.
 *
 * This produces a single-page PDF with the image and stamp text overlay,
 * which is stored as the stamped SDDG document. This approach is reliable
 * on both iOS and Android because it avoids react-native-view-shot's
 * off-screen capture limitations.
 */
async function stampImageViaPrint(
  imageUri: string,
  inspector: StampInspectorInfo,
  date: Date
): Promise<string | null> {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const ext = imageUri.split(".").pop()?.toLowerCase() || "jpeg";
    const mime = ext === "png" ? "image/png" : "image/jpeg";

    const { line1, line2 } = buildStampLines(inspector, date);

    const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @page { margin: 0; }
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        background: #fff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .page {
        position: relative;
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
      .stamp {
        position: absolute;
        top: 20%;
        left: 62%;
        width: 30%;
        font-family: Arial, sans-serif;
        font-weight: 600;
        color: #1a1a1a;
        font-size: 1.8vw;
        line-height: 1.4;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <img src="data:${mime};base64,${base64}" />
      <div class="stamp">
        <div>${escapeHtml(line1)}</div>
        <div>${escapeHtml(line2)}</div>
      </div>
    </div>
  </body>
</html>
    `;

    const printResult = await Print.printToFileAsync({
      html,
      base64: false,
    });

    const dir = `${FileSystem.documentDirectory}sddg_images/`;
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }

    const destUri = `${dir}sddg_stamped_${Date.now()}.pdf`;
    await FileSystem.moveAsync({ from: printResult.uri, to: destUri });
    return destUri;
  } catch (error) {
    console.error("[SddgStamp] Print-based stamp failed:", error);
    return null;
  }
}

export const SddgStampOverlay = forwardRef<SddgStampOverlayHandle, {}>(
  (_props, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        stamp: (
          uri: string,
          inspector: StampInspectorInfo,
          date: Date
        ): Promise<string | null> => {
          return stampImageViaPrint(uri, inspector, date);
        },
      }),
      []
    );

    // No off-screen rendering needed — stamping is done via expo-print
    return <View />;
  }
);

SddgStampOverlay.displayName = "SddgStampOverlay";
