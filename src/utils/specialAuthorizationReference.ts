import type {
  InspectorCAADocument,
  InspectorCOEDocument,
  InspectorDotSpWaiver,
} from "@/types/sddg";
import type { SpecialAuthorizationType } from "@/utils/afmanPackagingParagraphs";

type AuthorizationDocument =
  | InspectorCOEDocument
  | InspectorCAADocument
  | InspectorDotSpWaiver;

const normalizeWhitespace = (value: string): string =>
  value.trim().toUpperCase().replace(/\s+/g, " ");

const normalizeCompact = (value: string): string =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, "");

const stripTypeToken = (
  value: string,
  type: Exclude<SpecialAuthorizationType, "DOT-SP">
): string => {
  const tokenPattern = new RegExp(`\\b${type}\\b`, "g");
  return normalizeWhitespace(value).replace(tokenPattern, "").trim();
};

const normalizeDotSpReference = (value: string): string => {
  const normalized = normalizeWhitespace(value);
  const dotSpMatch = normalized.match(
    /\b(?:DOT[\s-]*)?SP(?:ECIAL\s*PERMIT)?[\s-]*([A-Z0-9-]+)\b/
  );
  if (dotSpMatch?.[1]) {
    return normalizeCompact(dotSpMatch[1]);
  }

  const specialPermitMatch = normalized.match(
    /\bSPECIAL\s*PERMIT[\s-]*([A-Z0-9-]+)\b/
  );
  if (specialPermitMatch?.[1]) {
    return normalizeCompact(specialPermitMatch[1]);
  }

  return normalizeCompact(
    normalized
      .replace(/\bDOT\b/g, "")
      .replace(/\bSP\b/g, "")
      .replace(/\bSPECIAL\b/g, "")
      .replace(/\bPERMIT\b/g, "")
  );
};

export const normalizeAuthorizationReference = (
  value: string,
  type: SpecialAuthorizationType
): string => {
  if (!value || !value.trim()) {
    return "";
  }

  if (type === "DOT-SP") {
    return normalizeDotSpReference(value);
  }

  const withoutTypeToken = stripTypeToken(value, type);
  return normalizeCompact(withoutTypeToken);
};

const getDocumentReference = (
  document: AuthorizationDocument,
  type: SpecialAuthorizationType
): string => {
  if (type === "DOT-SP") {
    return (document as InspectorDotSpWaiver).waiverNumber || "";
  }
  return (document as InspectorCOEDocument | InspectorCAADocument).name || "";
};

export const doesAuthorizationReferenceMatchDocument = ({
  key17Reference,
  type,
  document,
}: {
  key17Reference: string;
  type: SpecialAuthorizationType;
  document: AuthorizationDocument;
}): boolean => {
  const normalizedKey17 = normalizeAuthorizationReference(key17Reference, type);
  const normalizedDocRef = normalizeAuthorizationReference(
    getDocumentReference(document, type),
    type
  );

  if (!normalizedKey17 || !normalizedDocRef) {
    return false;
  }

  if (normalizedKey17 === normalizedDocRef) {
    return true;
  }

  // Permit values can appear with prefixes/suffixes in either field.
  return (
    normalizedKey17.includes(normalizedDocRef) ||
    normalizedDocRef.includes(normalizedKey17)
  );
};

export const findMatchingAuthorizationDocuments = ({
  key17Reference,
  type,
  documents,
}: {
  key17Reference: string;
  type: SpecialAuthorizationType;
  documents: AuthorizationDocument[];
}): AuthorizationDocument[] =>
  documents.filter(document =>
    doesAuthorizationReferenceMatchDocument({
      key17Reference,
      type,
      document,
    })
  );
