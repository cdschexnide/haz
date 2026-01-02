import { ValtioStringHazProEnginePreparationDataRecord, ValtioVehicleFuelTypeHazProEnginePreparationDataRecord, ValtioFloatHazProEnginePreparationDataRecord, ValtioBooleanHazProEnginePreparationDataRecord, ValtioLifeCycleEnginePreparationDataEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocEnginePreparationData } from "./../../yjs";
import { buildStringHazProEnginePreparationDataRecord } from "./StringHazProEnginePreparationDataRecord";
import { buildVehicleFuelTypeHazProEnginePreparationDataRecord } from "./VehicleFuelTypeHazProEnginePreparationDataRecord";
import { buildFloatHazProEnginePreparationDataRecord } from "./FloatHazProEnginePreparationDataRecord";
import { buildBooleanHazProEnginePreparationDataRecord } from "./BooleanHazProEnginePreparationDataRecord";

export interface ValtioEnginePreparationData {
    uuid: string;
    /** Type of engine */
    engineType: ValtioStringHazProEnginePreparationDataRecord;
    /** Fuel type used by the engine */
    fuelType: ValtioVehicleFuelTypeHazProEnginePreparationDataRecord;
    /** Engine displacement */
    displacement?: ValtioFloatHazProEnginePreparationDataRecord;
    /** Whether the engine has been drained */
    isDrained: ValtioBooleanHazProEnginePreparationDataRecord;
    /** Method used for drainage */
    drainageMethod?: ValtioStringHazProEnginePreparationDataRecord;
    /** Amount of residual fuel remaining */
    residualFuel?: ValtioStringHazProEnginePreparationDataRecord;
    /** Special precautions for handling */
    specialPrecautions?: ValtioStringHazProEnginePreparationDataRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleEnginePreparationDataEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: EnginePreparationDataFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleEnginePreparationDataEvents(events: any[]): ValtioLifeCycleEnginePreparationDataEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            enginePreparationData__REF: event.enginePreparationData__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleEnginePreparationDataEvent',
        }
    });
}

export async function upsertEnginePreparationDataValtioEntity(ydoc: YDocEnginePreparationData) {
    if (!store.EnginePreparationDataMap[ydoc.uuid]) {
        store.EnginePreparationDataMap[ydoc.uuid] = proxy({} as ValtioEnginePreparationData)
    }

    const enginePreparationData = store.EnginePreparationDataMap[ydoc.uuid]
    if (!enginePreparationData) {
        throw new Error('EnginePreparationData does not exist')
    }

    enginePreparationData.__typename = 'EnginePreparationData';
    enginePreparationData.path = ydoc.path;
    enginePreparationData._version = 0;
    enginePreparationData.uuid = ydoc.uuid;
    enginePreparationData.engineType = buildStringHazProEnginePreparationDataRecord(ydoc.engineType);
    enginePreparationData.fuelType = buildVehicleFuelTypeHazProEnginePreparationDataRecord(ydoc.fuelType);
    enginePreparationData.displacement = buildFloatHazProEnginePreparationDataRecord(ydoc.displacement);
    enginePreparationData.isDrained = buildBooleanHazProEnginePreparationDataRecord(ydoc.isDrained);
    enginePreparationData.drainageMethod = buildStringHazProEnginePreparationDataRecord(ydoc.drainageMethod);
    enginePreparationData.residualFuel = buildStringHazProEnginePreparationDataRecord(ydoc.residualFuel);
    enginePreparationData.specialPrecautions = buildStringHazProEnginePreparationDataRecord(ydoc.specialPrecautions);
    enginePreparationData.lifeCycleEvents = buildLifeCycleEnginePreparationDataEvents(ydoc.lifeCycleEvents);
}
