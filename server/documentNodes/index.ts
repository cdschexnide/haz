import { DocumentNode } from "../attachment3/types";
import { attachment5DocumentNodesList } from "../attachment5/documentNodes/A5";
import { attachment6DocumentNodesList } from "../attachment6/documentNodes/A6";
import { attachment7DocumentNodesList } from "../attachment7/documentNodes/A7";
import { attachment8DocumentNodesList } from "../attachment8/documentNodes/A8";
import { attachment9DocumentNodesList } from "../attachment9/documentNodes/A9";
import { attachment10DocumentNodesList } from "../attachment10/documentNodes/A10";
import { attachment11DocumentNodesList } from "../attachment11/documentNodes/A11";
import { attachment12DocumentNodesList } from "../attachment12/documentNodes/A12";
import { attachment13DocumentNodesList } from "../attachment13/documentNodes/A13";

/**
 * Map of attachment numbers to their document node lists.
 * Keys are attachment numbers as strings ('5', '6', ..., '13').
 */
export const documentNodesMap: Record<string, DocumentNode[]> = {
  "5": attachment5DocumentNodesList,
  "6": attachment6DocumentNodesList,
  "7": attachment7DocumentNodesList,
  "8": attachment8DocumentNodesList,
  "9": attachment9DocumentNodesList,
  "10": attachment10DocumentNodesList,
  "11": attachment11DocumentNodesList,
  "12": attachment12DocumentNodesList,
  "13": attachment13DocumentNodesList,
};

/**
 * Returns the document nodes list for a given attachment number.
 * @param attachmentNumber - The attachment number as a string (e.g., '5', '6', ..., '13')
 * @returns The array of DocumentNode objects for the attachment, or an empty array if not found
 */
export const getDocumentNodes = (attachmentNumber: string): DocumentNode[] => {
  return documentNodesMap[attachmentNumber] ?? [];
};
