import type { HazProPreparerContext } from '@/contexts/HazProPreparerProvider/reducer';

export interface FileMetadata {
  filename: string;
  name: string;
  lastModified: string;
  size: number;
}

export interface SavedShipment {
  tcn: string;
  filename: string;
  lastModified: string;
  unid?: string;
  hazardClass?: string;
  poe?: string;
  pod?: string;
  status?: string;
}

/**
 * Interface for the reducer's SavedShipment type.
 * This is used in PreparerHomeScreen for displaying shipment lists.
 */
export interface ReducerSavedShipment {
  id: string;
  status: 'in-progress' | 'completed';
  savedAt: Date;
  hazProPreparerContext: HazProPreparerContext;
}

/**
 * Interface for ShipmentFile as stored in the database.
 */
export interface ShipmentFileData {
  id: string;
  metadata: {
    status: 'in-progress' | 'completed';
    savedAt: string;
  };
  hazProPreparerContext: HazProPreparerContext;
}

/**
 * Converts a ShipmentFile from database to the reducer's SavedShipment format.
 * This eliminates duplicate conversion logic across components.
 */
export const convertShipmentFileToSavedShipment = (
  shipmentFile: ShipmentFileData
): ReducerSavedShipment => {
  return {
    id: shipmentFile.id,
    status: shipmentFile.metadata.status,
    savedAt: new Date(shipmentFile.metadata.savedAt),
    hazProPreparerContext: shipmentFile.hazProPreparerContext,
  };
};

/**
 * Sorts saved shipments by savedAt date in descending order (newest first).
 */
export const sortShipmentsByDate = (
  shipments: ReducerSavedShipment[]
): ReducerSavedShipment[] => {
  return [...shipments].sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );
};

/**
 * Converts file metadata from storage to SavedShipment structure.
 */
export const convertShipmentFile = (metadata: FileMetadata): SavedShipment => {
  // Extract TCN from filename (remove .json extension)
  const tcn = metadata.name.replace(/\.json$/, '');

  return {
    tcn,
    filename: metadata.filename,
    lastModified: metadata.lastModified,
  };
};

/**
 * Enriches a SavedShipment with data from the shipment file content.
 */
export const enrichShipmentData = (
  shipment: SavedShipment,
  content: any
): SavedShipment => {
  return {
    ...shipment,
    unid: content?.hazardousMaterial?.unid,
    hazardClass: content?.hazardousMaterial?.hazardClass,
    poe: content?.shipment?.poeOption,
    pod: content?.shipment?.podOption,
    status: content?.status || 'draft',
  };
};
