// Structured acknowledgement content for HazPro application
// Source: acknowledgement.md

export type AcknowledgementSectionType = 'info' | 'warning' | 'list';

export interface AcknowledgementSection {
  id: string;
  title: string;
  type: AcknowledgementSectionType;
  icon: string; // MaterialIcons name
  content?: string;
  items?: string[];
  warningLevel?: 'high' | 'medium'; // For warning type sections
}

export const ACKNOWLEDGEMENT_SECTIONS: AcknowledgementSection[] = [
  {
    id: 'disclaimer',
    title: 'HazPro Usage Disclaimer',
    type: 'info',
    icon: 'info',
    content:
      'HazPro is a software application designed to assist in the preparation and inspection of hazardous materials for airlift operations. It is intended as a decision-support tool only and does not replace official regulations, required certifications, or professional judgment.',
  },
  {
    id: 'publications',
    title: 'Reference Publications',
    type: 'list',
    icon: 'menu-book',
    content:
      'HazPro currently aligns with and provides reference support based on the following publications:',
    items: [
      'AFMAN 24-604, Preparing Hazardous Materials for Military Air Shipments',
      'TM 38-250, Preparing Hazardous Materials for Military Air Shipments',
      'NAVSUP Pub 505, Navy Transportation of Hazardous Materials',
      'MCO P4030.19J, Marine Corps Packaging of Materiel',
      'DLAI 4145.3, Preparing Hazardous Materials for Military Air Shipment (9 October 2020)',
    ],
  },
  {
    id: 'limitations',
    title: 'Limitations of Use',
    type: 'warning',
    icon: 'warning',
    warningLevel: 'high',
    content: 'HazPro does not currently support the preparation or inspection of the following:',
    items: [
      'Hazardous Waste',
      'Class 7 – Radioactive Materials',
      'Organic Peroxides (Division 5.2)',
    ],
  },
  {
    id: 'beta',
    title: 'Beta Software Notice',
    type: 'warning',
    icon: 'science',
    warningLevel: 'medium',
    content:
      'HazPro is currently operating in a Beta release phase. Features, calculations, and regulatory references are still undergoing validation through user feedback and field testing. Functionality may change without prior notice, and certain capabilities may be incomplete or experimental. Users should:',
    items: [
      'Independently verify all outputs prior to operational use',
      'Cross-check with the latest governing regulations and directives',
      'Report any discrepancies, defects, or functional issues through official feedback channels',
    ],
  },
  {
    id: 'responsibility',
    title: 'Responsibility of Use',
    type: 'warning',
    icon: 'gavel',
    warningLevel: 'high',
    content:
      'Users are solely responsible for ensuring compliance with all applicable regulations, certification requirements, and safety standards. Use of HazPro does not replace required Hazardous Materials (HAZMAT) training or certification and does not absolve users from professional or legal accountability.',
  },
];

// App version for acknowledgement tracking
export const CURRENT_APP_VERSION = '1.0';

// AsyncStorage key
export const ACKNOWLEDGEMENT_STORAGE_KEY = '@HazPro:acknowledgement';
