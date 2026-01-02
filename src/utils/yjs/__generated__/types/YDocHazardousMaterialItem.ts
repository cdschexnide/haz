import { Reference } from "./Reference";

export interface YDocLifeCycleHazardousMaterialItemEvent {
    uuid: string;
    hazardousMaterialItem__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocHazardousMaterialItem {
    uuid: string;
    isFixed?: string;
    isDomesticShipment: boolean;
    isTechnicalNameRequired: boolean;
    unNumber: string;
    properShippingName: string;
    details?: string;
    hazardClass: string;
    subsidiaryRisk?: string;
    packingGroup?: string;
    specialProvisions: string[];
    packagingParagraph: string;
    lifeCycleEvents: YDocLifeCycleHazardousMaterialItemEvent[];
    path: string;
    __typename: string;
}
