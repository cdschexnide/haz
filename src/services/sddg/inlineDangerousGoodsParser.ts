import { TextBlock, AnchorMatch } from "./anchorTypes";
import { SDDGData } from "@/types/sddg-template";
import { getTableColumnAnchors } from "./anchorConfig";

/** Phrases from the inline variant's descriptive paragraph (match 2 of 3) */
const INLINE_DESCRIPTOR_PHRASES = [
  "UN Number or Identification Number",
  "proper shipping name",
  "Class or Division",
];

/** Phrases that identify the descriptive paragraph (to strip it from data) */
const DESCRIPTOR_STRIP_PATTERNS = [
  /NATURE\s*AND\s*QUANTITY/i,
  /NATURE\s*AND\s*QUALITY/i,
  /UN\s*Number\s*or\s*Identification/i,
  /proper\s*shipping\s*name/i,
  /subsidiary\s*hazard/i,
  /packing\s*group\s*\(?if\s*required\)?/i,
  /other\s*required\s*information/i,
];

/**
 * Parse an inline dangerous goods string into SDDGData fields.
 *
 * Expected format (commas between fields, // between sections):
 *   UN1956,COMPRESSED GAS, N.O.S. (PENTAFLUOROETHANE, NITROGEN),2.2//
 *   1 FIBREBOARD BOX X 2 KG//A6.5.
 *
 * Structure: UN_NUMBER,PROPER_SHIPPING_NAME,CLASS_DIVISION[,PACKING_GROUP]//QUANTITY//PACKING_INST
 */
export function parseInlineDangerousGoods(
  text: string
): Partial<SDDGData> {
  if (!text || !text.trim()) return {};

  // Normalize: join lines, collapse whitespace, normalize parens whitespace
  const normalized = text
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();

  // Must start with UN or ID number
  const unMatch = normalized.match(/^(UN|ID|NA)\s*([O0]?\d{3,4})/i);
  if (!unMatch) return {};

  // Extract and normalize UN number (O → 0)
  const prefix = unMatch[1].toUpperCase();
  const digits = unMatch[2].replace(/O/g, "0").padStart(4, "0");
  const un_number = `${prefix}${digits}`;

  // Remove UN number and leading comma from remaining text
  const remaining = normalized
    .slice(unMatch[0].length)
    .replace(/^\s*,\s*/, "");

  // Split on // delimiter to get sections
  const sections = remaining
    .split("//")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sections.length < 2) return { un_number };

  // Section 0: PROPER_SHIPPING_NAME,CLASS_DIVISION[,(SUBSIDIARY)][,PACKING_GROUP]
  const firstSection = sections[0];

  // Remaining sections (1+): identify packing instruction, OVERPACK, and quantity
  const remainingSections = sections.slice(1);

  // Find packing instruction: AFMAN packing instructions are always A-prefixed
  // Pattern: A followed by digits, dot, digits (e.g., A6.5, A5.24, A10.13)
  let packing_inst: string | undefined;
  let packingInstIdx = -1;
  for (let i = 0; i < remainingSections.length; i++) {
    const cleaned = remainingSections[i].replace(/\.\s*$/, "").trim();
    const compacted = cleaned.replace(/\s+/g, "");
    if (/^A\d+\.\d+$/.test(compacted)) {
      packing_inst = compacted;
      packingInstIdx = i;
      break;
    }
  }

  // Collect quantity parts and OVERPACK parts
  const quantityParts: string[] = [];
  for (let i = 0; i < remainingSections.length; i++) {
    if (i === packingInstIdx) continue;
    const section = remainingSections[i];
    // OVERPACK text gets appended to quantity
    if (/OVERPACK/i.test(section)) {
      quantityParts.push(section);
    } else if (packing_inst === undefined || i < packingInstIdx) {
      // Sections before packing instruction are quantity
      quantityParts.push(section);
    }
  }
  const quantity_packing =
    quantityParts.length > 0 ? quantityParts.join(" ").trim() : undefined;

  // Parse first section: find class/division, optional subsidiary risk, optional packing group
  // New regex: class/division is a bare number, subsidiary risk is separate comma + parens
  // Also handles backward-compat glued format like 3(8)
  const classWithPgMatch = firstSection.match(
    /,\s*(\d(?:\.\d)?[A-Z]{0,2})\s*(?:(\(\d(?:\.\d)?\))|\s*,\s*(\(\d(?:\.\d)?\)))?\s*(?:,\s*(III|II|I))?\s*$/
  );

  if (!classWithPgMatch) {
    return {
      un_number,
      proper_shipping_name: firstSection.trim() || undefined,
      quantity_packing,
      packing_inst,
    };
  }

  const class_division = classWithPgMatch[1];
  // Subsidiary risk: capture group 2 (glued) or capture group 3 (comma-separated)
  const subsidiary_risk =
    classWithPgMatch[2] || classWithPgMatch[3] || undefined;
  const packing_group = classWithPgMatch[4]
    ? classWithPgMatch[4].toUpperCase()
    : undefined;

  // Everything before the class/division match is the proper shipping name
  const psnEnd = firstSection.length - classWithPgMatch[0].length;
  const proper_shipping_name = firstSection.slice(0, psnEnd).trim() || undefined;

  const result: Partial<SDDGData> = { un_number };
  if (proper_shipping_name) result.proper_shipping_name = proper_shipping_name;
  if (class_division) result.class_division = class_division;
  if (subsidiary_risk) result.subsidiary_risk = subsidiary_risk;
  if (packing_group) result.packing_group = packing_group;
  if (quantity_packing) result.quantity_packing = quantity_packing;
  if (packing_inst) result.packing_inst = packing_inst;

  return result;
}

/**
 * Detect whether the form uses the inline dangerous goods format
 * (Labelmaster F07LB variant) instead of the tabular grid (AMC-IMT 1033).
 *
 * Uses 3-signal scoring, requires at least 2 of 3 to trigger:
 * 1. Fewer than 2 table column header anchors found (by patternType)
 * 2. Descriptive paragraph detected (relaxed: 2 of 3 key phrases)
 * 3. "//" delimiters found in the data region text
 */
export function detectInlineVariant(
  anchors: Map<string, AnchorMatch>,
  textBlocks: TextBlock[]
): boolean {
  let signals = 0;

  // Signal 1: count table column header anchors found (by patternType)
  const tableColumnFieldIds = getTableColumnAnchors().map((a) => a.fieldId);
  const tableHeaderCount = tableColumnFieldIds.filter((f) =>
    anchors.has(f)
  ).length;
  if (tableHeaderCount < 2) signals++;

  // Signal 2: look for descriptive paragraph (relaxed: 2 of 3 phrases)
  const allText = textBlocks.map((b) => b.text).join(" ").toLowerCase();
  const matchedPhrases = INLINE_DESCRIPTOR_PHRASES.filter((phrase) =>
    allText.includes(phrase.toLowerCase())
  ).length;
  if (matchedPhrases >= 2) signals++;

  // Signal 3: "//" delimiters found in text between section boundaries
  const hasDoubleSlash = textBlocks.some((b) => b.text.includes("//"));
  if (hasDoubleSlash) signals++;

  return signals >= 2;
}

/**
 * Extract dangerous goods from the inline format.
 *
 * 1. Find the "NATURE AND QUANTITY" section header (from textBlocks or anchors)
 * 2. Find the "Additional Handling" bottom boundary (from anchors)
 * 3. Collect text blocks between them, strip the descriptive paragraph
 * 4. Parse the remaining text
 */
export function extractInlineDangerousGoods(
  textBlocks: TextBlock[],
  anchors: Map<string, AnchorMatch>
): Partial<SDDGData> {
  // Find section header Y position
  let sectionTopY: number | null = null;

  // Try from anchors first
  const natureAnchor = anchors.get("nature_quantity_header");
  if (natureAnchor) {
    sectionTopY = natureAnchor.boundingBox.y;
  }

  // Fallback: search textBlocks for the header text
  if (sectionTopY === null) {
    for (const block of textBlocks) {
      const upperText = block.text.toUpperCase();
      if (
        upperText.includes("NATURE AND QUANTITY") ||
        upperText.includes("NATURE AND QUALITY")
      ) {
        sectionTopY = block.boundingBox.y;
        break;
      }
    }
  }

  if (sectionTopY === null) return {};

  // Find bottom boundary from "additional_handling" anchor
  let sectionBottomY: number | null = null;
  const additionalAnchor = anchors.get("additional_handling");
  if (additionalAnchor) {
    sectionBottomY = additionalAnchor.boundingBox.y;
  }

  // Fallback: search textBlocks
  if (sectionBottomY === null) {
    for (const block of textBlocks) {
      if (block.text.toUpperCase().includes("ADDITIONAL HANDLING")) {
        sectionBottomY = block.boundingBox.y;
        break;
      }
    }
  }

  // If no bottom boundary, use the lowest text block on the page
  if (sectionBottomY === null) {
    const maxY = Math.max(
      ...textBlocks.map((b) => b.boundingBox.y + b.boundingBox.height)
    );
    sectionBottomY = maxY > sectionTopY ? maxY : sectionTopY + 500;
  }

  // Collect text blocks in the section (below header, above boundary)
  const sectionBlocks = textBlocks
    .filter((b) => {
      const centerY = b.boundingBox.y + b.boundingBox.height / 2;
      return centerY > sectionTopY! && centerY < sectionBottomY!;
    })
    .sort((a, b) => {
      // Reading order: top to bottom, left to right
      const yDiff = a.boundingBox.y - b.boundingBox.y;
      if (Math.abs(yDiff) > 10) return yDiff;
      return a.boundingBox.x - b.boundingBox.x;
    });

  // Strip descriptive paragraph blocks
  const dataBlocks = sectionBlocks.filter((block) => {
    return !DESCRIPTOR_STRIP_PATTERNS.some((pattern) =>
      pattern.test(block.text)
    );
  });

  if (dataBlocks.length === 0) return {};

  // Join remaining text and parse
  const rawText = dataBlocks.map((b) => b.text).join("\n");
  return parseInlineDangerousGoods(rawText);
}
