import { ValtioStringHazProShipmentRecord, ValtioInspector, ValtioFloatHazProShipmentRecord, ValtioLifeCycleShipmentEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocShipment, Reference } from "./../../yjs";
import { buildStringHazProShipmentRecord } from "./StringHazProShipmentRecord";
import { buildFloatHazProShipmentRecord } from "./FloatHazProShipmentRecord";

export interface ValtioShipment {
    uuid: string;
    /** Port of embarkation option */
    poeOptionRecord: ValtioStringHazProShipmentRecord;
    /** Port of debarkation option */
    podOptionRecord: ValtioStringHazProShipmentRecord;
    /** Whether this is a Chapter 3 shipment */
    isChapter3Record?: ValtioStringHazProShipmentRecord;
    /** Transportation Control Number */
    tcnRecord: ValtioStringHazProShipmentRecord;
    /** Port of embarkation */
    poeRecord: ValtioStringHazProShipmentRecord;
    /** Port of debarkation */
    podRecord: ValtioStringHazProShipmentRecord;
    /** Type of shipment */
    shipmentTypeRecord?: ValtioStringHazProShipmentRecord;
    /** Assigned inspector name */
    inspector__REF: Reference<string>;
    /** Assigned inspector name */
    get inspector(): ValtioInspector;
    /** Selected outer packaging type */
    selectedOuterPackagingRecord?: ValtioStringHazProShipmentRecord;
    /** Total net explosive weight for Class 1 materials */
    totalNetExplosiveWeightRecord?: ValtioFloatHazProShipmentRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleShipmentEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: ShipmentFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleShipmentEvents(events: any[]): ValtioLifeCycleShipmentEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            shipment__REF: event.shipment__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleShipmentEvent',
        }
    });
}

export async function upsertShipmentValtioEntity(ydoc: YDocShipment) {
    if (!store.ShipmentMap[ydoc.uuid]) {
        store.ShipmentMap[ydoc.uuid] = proxy({} as ValtioShipment)
    }

    const shipment = store.ShipmentMap[ydoc.uuid]
    if (!shipment) {
        throw new Error('Shipment does not exist')
    }

    shipment.__typename = 'Shipment';
    shipment.path = ydoc.path;
    shipment._version = 0;
    shipment.uuid = ydoc.uuid;
    shipment.poeOptionRecord = buildStringHazProShipmentRecord(ydoc.poeOptionRecord);
    shipment.podOptionRecord = buildStringHazProShipmentRecord(ydoc.podOptionRecord);
    shipment.isChapter3Record = buildStringHazProShipmentRecord(ydoc.isChapter3Record);
    shipment.tcnRecord = buildStringHazProShipmentRecord(ydoc.tcnRecord);
    shipment.poeRecord = buildStringHazProShipmentRecord(ydoc.poeRecord);
    shipment.podRecord = buildStringHazProShipmentRecord(ydoc.podRecord);
    shipment.shipmentTypeRecord = buildStringHazProShipmentRecord(ydoc.shipmentTypeRecord);
    shipment.inspector__REF = ydoc.inspector__REF;
    shipment.selectedOuterPackagingRecord = buildStringHazProShipmentRecord(ydoc.selectedOuterPackagingRecord);
    shipment.totalNetExplosiveWeightRecord = buildFloatHazProShipmentRecord(ydoc.totalNetExplosiveWeightRecord);
    shipment.lifeCycleEvents = buildLifeCycleShipmentEvents(ydoc.lifeCycleEvents);
    Object.defineProperty(shipment, 'inspector', {
        get() {
            return Object.values(store.InspectorMap).filter((inspector) => inspector?.uuid === this.inspector__REF.uuid)[0];
        }
    });
}
