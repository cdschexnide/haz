import { ValtioStringHazProPOPMarkingRecord, ValtioLifeCyclePOPMarkingEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocPOPMarking } from "./../../yjs";
import { buildStringHazProPOPMarkingRecord } from "./StringHazProPOPMarkingRecord";

export interface ValtioPOPMarking {
    uuid: string;
    /** Packaging type code */
    typeRecord?: ValtioStringHazProPOPMarkingRecord;
    /** UN packaging code - packaging material and type */
    ARecord?: ValtioStringHazProPOPMarkingRecord;
    /** Category of packaging (single/combination/composite) */
    BRecord?: ValtioStringHazProPOPMarkingRecord;
    /** Type of inner receptacle (for combination/composite) */
    CRecord?: ValtioStringHazProPOPMarkingRecord;
    /** Material of inner receptacle (for combination/composite) */
    DRecord?: ValtioStringHazProPOPMarkingRecord;
    /** Packing group for which design type has been successfully tested */
    ERecord?: ValtioStringHazProPOPMarkingRecord;
    /** Test pressure or gross mass */
    FRecord?: ValtioStringHazProPOPMarkingRecord;
    /** Year of manufacture (2 digits) */
    GRecord?: ValtioStringHazProPOPMarkingRecord;
    /** Country of manufacture and manufacturer identification */
    HRecord?: ValtioStringHazProPOPMarkingRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCyclePOPMarkingEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: POPMarkingFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCyclePOPMarkingEvents(events: any[]): ValtioLifeCyclePOPMarkingEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            pOPMarking__REF: event.pOPMarking__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCyclePOPMarkingEvent',
        }
    });
}

export async function upsertPOPMarkingValtioEntity(ydoc: YDocPOPMarking) {
    if (!store.POPMarkingMap[ydoc.uuid]) {
        store.POPMarkingMap[ydoc.uuid] = proxy({} as ValtioPOPMarking)
    }

    const pOPMarking = store.POPMarkingMap[ydoc.uuid]
    if (!pOPMarking) {
        throw new Error('POPMarking does not exist')
    }

    pOPMarking.__typename = 'POPMarking';
    pOPMarking.path = ydoc.path;
    pOPMarking._version = 0;
    pOPMarking.uuid = ydoc.uuid;
    pOPMarking.typeRecord = buildStringHazProPOPMarkingRecord(ydoc.typeRecord);
    pOPMarking.ARecord = buildStringHazProPOPMarkingRecord(ydoc.ARecord);
    pOPMarking.BRecord = buildStringHazProPOPMarkingRecord(ydoc.BRecord);
    pOPMarking.CRecord = buildStringHazProPOPMarkingRecord(ydoc.CRecord);
    pOPMarking.DRecord = buildStringHazProPOPMarkingRecord(ydoc.DRecord);
    pOPMarking.ERecord = buildStringHazProPOPMarkingRecord(ydoc.ERecord);
    pOPMarking.FRecord = buildStringHazProPOPMarkingRecord(ydoc.FRecord);
    pOPMarking.GRecord = buildStringHazProPOPMarkingRecord(ydoc.GRecord);
    pOPMarking.HRecord = buildStringHazProPOPMarkingRecord(ydoc.HRecord);
    pOPMarking.lifeCycleEvents = buildLifeCyclePOPMarkingEvents(ydoc.lifeCycleEvents);
}
