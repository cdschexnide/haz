import { ValtioStringHazProPreparerShipmentRecord, ValtioDateHazProPreparerShipmentRecord, ValtioHazProPreparerContext, ValtioLifeCyclePreparerShipmentEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocPreparerShipment, Reference } from "./../../yjs";
import { buildStringHazProPreparerShipmentRecord } from "./StringHazProPreparerShipmentRecord";
import { buildDateHazProPreparerShipmentRecord } from "./DateHazProPreparerShipmentRecord";

export interface ValtioPreparerShipment {
    /** Unique shipment identifier */
    uuid: string;
    /** Current shipment status */
    statusRecord: ValtioStringHazProPreparerShipmentRecord;
    /** When the shipment was saved */
    savedAtRecord: ValtioDateHazProPreparerShipmentRecord;
    /** Complete preparer context data */
    hazProPreparerContext__REF: Reference<string>;
    /** Complete preparer context data */
    get hazProPreparerContext(): ValtioHazProPreparerContext;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCyclePreparerShipmentEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: PreparerShipmentFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCyclePreparerShipmentEvents(events: any[]): ValtioLifeCyclePreparerShipmentEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            preparerShipment__REF: event.preparerShipment__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCyclePreparerShipmentEvent',
        }
    });
}

export async function upsertPreparerShipmentValtioEntity(ydoc: YDocPreparerShipment) {
    if (!store.PreparerShipmentMap[ydoc.uuid]) {
        store.PreparerShipmentMap[ydoc.uuid] = proxy({} as ValtioPreparerShipment)
    }

    const preparerShipment = store.PreparerShipmentMap[ydoc.uuid]
    if (!preparerShipment) {
        throw new Error('PreparerShipment does not exist')
    }

    preparerShipment.__typename = 'PreparerShipment';
    preparerShipment.path = ydoc.path;
    preparerShipment._version = 0;
    preparerShipment.uuid = ydoc.uuid;
    preparerShipment.statusRecord = buildStringHazProPreparerShipmentRecord(ydoc.statusRecord);
    preparerShipment.savedAtRecord = buildDateHazProPreparerShipmentRecord(ydoc.savedAtRecord);
    preparerShipment.hazProPreparerContext__REF = ydoc.hazProPreparerContext__REF;
    preparerShipment.lifeCycleEvents = buildLifeCyclePreparerShipmentEvents(ydoc.lifeCycleEvents);
    Object.defineProperty(preparerShipment, 'hazProPreparerContext', {
        get() {
            return Object.values(store.HazProPreparerContextMap).filter((hazProPreparerContext) => hazProPreparerContext?.uuid === this.hazProPreparerContext__REF.uuid)[0];
        }
    });
}
