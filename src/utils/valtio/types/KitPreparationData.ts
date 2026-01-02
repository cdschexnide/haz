import { ValtioStringHazProKitPreparationDataRecord, ValtioLifeCycleKitPreparationDataEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocKitPreparationData } from "./../../yjs";
import { buildStringHazProKitPreparationDataRecord } from "./StringHazProKitPreparationDataRecord";

export interface ValtioKitPreparationData {
    uuid: string;
    /** Type of kit */
    kitTypeRecord: ValtioStringHazProKitPreparationDataRecord;
    /** Contents of the kit */
    contents: string[];
    /** Hazardous components in the kit */
    hazardousComponents: string[];
    /** Method used for packaging */
    packagingMethodRecord: ValtioStringHazProKitPreparationDataRecord;
    /** Special instructions for handling */
    specialInstructionsRecord?: ValtioStringHazProKitPreparationDataRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleKitPreparationDataEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: KitPreparationDataFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleKitPreparationDataEvents(events: any[]): ValtioLifeCycleKitPreparationDataEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            kitPreparationData__REF: event.kitPreparationData__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleKitPreparationDataEvent',
        }
    });
}

export async function upsertKitPreparationDataValtioEntity(ydoc: YDocKitPreparationData) {
    if (!store.KitPreparationDataMap[ydoc.uuid]) {
        store.KitPreparationDataMap[ydoc.uuid] = proxy({} as ValtioKitPreparationData)
    }

    const kitPreparationData = store.KitPreparationDataMap[ydoc.uuid]
    if (!kitPreparationData) {
        throw new Error('KitPreparationData does not exist')
    }

    kitPreparationData.__typename = 'KitPreparationData';
    kitPreparationData.path = ydoc.path;
    kitPreparationData._version = 0;
    kitPreparationData.uuid = ydoc.uuid;
    kitPreparationData.kitTypeRecord = buildStringHazProKitPreparationDataRecord(ydoc.kitTypeRecord);
    kitPreparationData.contents = ydoc.contents;
    kitPreparationData.hazardousComponents = ydoc.hazardousComponents;
    kitPreparationData.packagingMethodRecord = buildStringHazProKitPreparationDataRecord(ydoc.packagingMethodRecord);
    kitPreparationData.specialInstructionsRecord = buildStringHazProKitPreparationDataRecord(ydoc.specialInstructionsRecord);
    kitPreparationData.lifeCycleEvents = buildLifeCycleKitPreparationDataEvents(ydoc.lifeCycleEvents);
}
