import { ValtioStringHazProDryIceDataRecord, ValtioBooleanHazProDryIceDataRecord, ValtioLifeCycleDryIceDataEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocDryIceData } from "./../../yjs";
import { buildStringHazProDryIceDataRecord } from "./StringHazProDryIceDataRecord";
import { buildBooleanHazProDryIceDataRecord } from "./BooleanHazProDryIceDataRecord";

export interface ValtioDryIceData {
    uuid: string;
    /** Type of packaging used */
    packagingType: ValtioStringHazProDryIceDataRecord;
    /** Quantity of dry ice */
    quantity: ValtioStringHazProDryIceDataRecord;
    /** Type of aircraft for transport */
    aircraftType: ValtioStringHazProDryIceDataRecord;
    /** Whether the aircraft is pressurized */
    isAircraftPressurized: ValtioBooleanHazProDryIceDataRecord;
    /** Whether venting is provided */
    isVentingProvided: ValtioBooleanHazProDryIceDataRecord;
    /** Special instructions for handling */
    specialInstructions: ValtioStringHazProDryIceDataRecord;
    /** Handling instructions */
    handlingInstructions: ValtioStringHazProDryIceDataRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleDryIceDataEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: DryIceDataFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleDryIceDataEvents(events: any[]): ValtioLifeCycleDryIceDataEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            dryIceData__REF: event.dryIceData__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleDryIceDataEvent',
        }
    });
}

export async function upsertDryIceDataValtioEntity(ydoc: YDocDryIceData) {
    if (!store.DryIceDataMap[ydoc.uuid]) {
        store.DryIceDataMap[ydoc.uuid] = proxy({} as ValtioDryIceData)
    }

    const dryIceData = store.DryIceDataMap[ydoc.uuid]
    if (!dryIceData) {
        throw new Error('DryIceData does not exist')
    }

    dryIceData.__typename = 'DryIceData';
    dryIceData.path = ydoc.path;
    dryIceData._version = 0;
    dryIceData.uuid = ydoc.uuid;
    dryIceData.packagingType = buildStringHazProDryIceDataRecord(ydoc.packagingType);
    dryIceData.quantity = buildStringHazProDryIceDataRecord(ydoc.quantity);
    dryIceData.aircraftType = buildStringHazProDryIceDataRecord(ydoc.aircraftType);
    dryIceData.isAircraftPressurized = buildBooleanHazProDryIceDataRecord(ydoc.isAircraftPressurized);
    dryIceData.isVentingProvided = buildBooleanHazProDryIceDataRecord(ydoc.isVentingProvided);
    dryIceData.specialInstructions = buildStringHazProDryIceDataRecord(ydoc.specialInstructions);
    dryIceData.handlingInstructions = buildStringHazProDryIceDataRecord(ydoc.handlingInstructions);
    dryIceData.lifeCycleEvents = buildLifeCycleDryIceDataEvents(ydoc.lifeCycleEvents);
}
