import { ValtioLifeCycleHazardousMaterialItemEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocHazardousMaterialItem } from "./../../yjs";

export interface ValtioHazardousMaterialItem {
    uuid: string;
    isFixed?: string;
    isDomesticShipment: boolean;
    isTechnicalNameRequired: boolean;
    /** UN/NA/ID identification number */
    unNumber: string;
    /** Proper shipping name */
    properShippingName: string;
    details?: string;
    /** Primary Hazard class or division */
    hazardClass: string;
    /** Subsidiary Risk Hazard class */
    subsidiaryRisk?: string;
    /** Packing group (I, II, or III) */
    packingGroup?: string;
    /** Special provisions that apply */
    specialProvisions: string[];
    /** Packaging paragraph reference */
    packagingParagraph: string;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleHazardousMaterialItemEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: HazardousMaterialItemFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleHazardousMaterialItemEvents(events: any[]): ValtioLifeCycleHazardousMaterialItemEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            hazardousMaterialItem__REF: event.hazardousMaterialItem__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleHazardousMaterialItemEvent',
        }
    });
}

export async function upsertHazardousMaterialItemValtioEntity(ydoc: YDocHazardousMaterialItem) {
    if (!store.HazardousMaterialItemMap[ydoc.uuid]) {
        store.HazardousMaterialItemMap[ydoc.uuid] = proxy({} as ValtioHazardousMaterialItem)
    }

    const hazardousMaterialItem = store.HazardousMaterialItemMap[ydoc.uuid]
    if (!hazardousMaterialItem) {
        throw new Error('HazardousMaterialItem does not exist')
    }

    hazardousMaterialItem.__typename = 'HazardousMaterialItem';
    hazardousMaterialItem.path = ydoc.path;
    hazardousMaterialItem._version = 0;
    hazardousMaterialItem.uuid = ydoc.uuid;
    hazardousMaterialItem.isFixed = ydoc.isFixed;
    hazardousMaterialItem.isDomesticShipment = ydoc.isDomesticShipment;
    hazardousMaterialItem.isTechnicalNameRequired = ydoc.isTechnicalNameRequired;
    hazardousMaterialItem.unNumber = ydoc.unNumber;
    hazardousMaterialItem.properShippingName = ydoc.properShippingName;
    hazardousMaterialItem.details = ydoc.details;
    hazardousMaterialItem.hazardClass = ydoc.hazardClass;
    hazardousMaterialItem.subsidiaryRisk = ydoc.subsidiaryRisk;
    hazardousMaterialItem.packingGroup = ydoc.packingGroup;
    hazardousMaterialItem.specialProvisions = ydoc.specialProvisions;
    hazardousMaterialItem.packagingParagraph = ydoc.packagingParagraph;
    hazardousMaterialItem.lifeCycleEvents = buildLifeCycleHazardousMaterialItemEvents(ydoc.lifeCycleEvents);
}
