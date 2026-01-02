import { ValtioFloatHazProMagnetizedMaterialDataRecord, ValtioStringHazProMagnetizedMaterialDataRecord, ValtioLifeCycleMagnetizedMaterialDataEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocMagnetizedMaterialData } from "./../../yjs";
import { buildFloatHazProMagnetizedMaterialDataRecord } from "./FloatHazProMagnetizedMaterialDataRecord";
import { buildStringHazProMagnetizedMaterialDataRecord } from "./StringHazProMagnetizedMaterialDataRecord";

export interface ValtioMagnetizedMaterialData {
    uuid: string;
    /** Magnetic field strength measurement */
    magneticFieldStrength: ValtioFloatHazProMagnetizedMaterialDataRecord;
    /** Compass deflection measurement */
    compassDeflection: ValtioFloatHazProMagnetizedMaterialDataRecord;
    /** Method used for packaging */
    packagingMethod: ValtioStringHazProMagnetizedMaterialDataRecord;
    /** Description of magnetic shielding used */
    shieldingDescription?: ValtioStringHazProMagnetizedMaterialDataRecord;
    /** Special handling instructions */
    handlingInstructions?: ValtioStringHazProMagnetizedMaterialDataRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleMagnetizedMaterialDataEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: MagnetizedMaterialDataFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleMagnetizedMaterialDataEvents(events: any[]): ValtioLifeCycleMagnetizedMaterialDataEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            magnetizedMaterialData__REF: event.magnetizedMaterialData__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleMagnetizedMaterialDataEvent',
        }
    });
}

export async function upsertMagnetizedMaterialDataValtioEntity(ydoc: YDocMagnetizedMaterialData) {
    if (!store.MagnetizedMaterialDataMap[ydoc.uuid]) {
        store.MagnetizedMaterialDataMap[ydoc.uuid] = proxy({} as ValtioMagnetizedMaterialData)
    }

    const magnetizedMaterialData = store.MagnetizedMaterialDataMap[ydoc.uuid]
    if (!magnetizedMaterialData) {
        throw new Error('MagnetizedMaterialData does not exist')
    }

    magnetizedMaterialData.__typename = 'MagnetizedMaterialData';
    magnetizedMaterialData.path = ydoc.path;
    magnetizedMaterialData._version = 0;
    magnetizedMaterialData.uuid = ydoc.uuid;
    magnetizedMaterialData.magneticFieldStrength = buildFloatHazProMagnetizedMaterialDataRecord(ydoc.magneticFieldStrength);
    magnetizedMaterialData.compassDeflection = buildFloatHazProMagnetizedMaterialDataRecord(ydoc.compassDeflection);
    magnetizedMaterialData.packagingMethod = buildStringHazProMagnetizedMaterialDataRecord(ydoc.packagingMethod);
    magnetizedMaterialData.shieldingDescription = buildStringHazProMagnetizedMaterialDataRecord(ydoc.shieldingDescription);
    magnetizedMaterialData.handlingInstructions = buildStringHazProMagnetizedMaterialDataRecord(ydoc.handlingInstructions);
    magnetizedMaterialData.lifeCycleEvents = buildLifeCycleMagnetizedMaterialDataEvents(ydoc.lifeCycleEvents);
}
