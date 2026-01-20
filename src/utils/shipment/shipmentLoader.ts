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
