import { ValtioStringHazProBatteryVehicleDataRecord, ValtioFloatHazProBatteryVehicleDataRecord, ValtioIntHazProBatteryVehicleDataRecord, ValtioBooleanHazProBatteryVehicleDataRecord, ValtioLifeCycleBatteryVehicleDataEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocBatteryVehicleData } from "./../../yjs";
import { buildStringHazProBatteryVehicleDataRecord } from "./StringHazProBatteryVehicleDataRecord";
import { buildFloatHazProBatteryVehicleDataRecord } from "./FloatHazProBatteryVehicleDataRecord";
import { buildIntHazProBatteryVehicleDataRecord } from "./IntHazProBatteryVehicleDataRecord";
import { buildBooleanHazProBatteryVehicleDataRecord } from "./BooleanHazProBatteryVehicleDataRecord";

export interface ValtioBatteryVehicleData {
    uuid: string;
    /** Type of vehicle */
    vehicleType: ValtioStringHazProBatteryVehicleDataRecord;
    /** Type of battery */
    batteryType: ValtioStringHazProBatteryVehicleDataRecord;
    /** Battery capacity in watt-hours */
    wattHours: ValtioFloatHazProBatteryVehicleDataRecord;
    /** Number of batteries in vehicle */
    numberOfBatteries: ValtioIntHazProBatteryVehicleDataRecord;
    /** Location of battery in vehicle */
    batteryLocation: ValtioStringHazProBatteryVehicleDataRecord;
    /** Whether the battery has been drained */
    isDrained: ValtioBooleanHazProBatteryVehicleDataRecord;
    /** Protection measures applied */
    protectionMeasures?: ValtioStringHazProBatteryVehicleDataRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleBatteryVehicleDataEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: BatteryVehicleDataFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleBatteryVehicleDataEvents(events: any[]): ValtioLifeCycleBatteryVehicleDataEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            batteryVehicleData__REF: event.batteryVehicleData__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleBatteryVehicleDataEvent',
        }
    });
}

export async function upsertBatteryVehicleDataValtioEntity(ydoc: YDocBatteryVehicleData) {
    if (!store.BatteryVehicleDataMap[ydoc.uuid]) {
        store.BatteryVehicleDataMap[ydoc.uuid] = proxy({} as ValtioBatteryVehicleData)
    }

    const batteryVehicleData = store.BatteryVehicleDataMap[ydoc.uuid]
    if (!batteryVehicleData) {
        throw new Error('BatteryVehicleData does not exist')
    }

    batteryVehicleData.__typename = 'BatteryVehicleData';
    batteryVehicleData.path = ydoc.path;
    batteryVehicleData._version = 0;
    batteryVehicleData.uuid = ydoc.uuid;
    batteryVehicleData.vehicleType = buildStringHazProBatteryVehicleDataRecord(ydoc.vehicleType);
    batteryVehicleData.batteryType = buildStringHazProBatteryVehicleDataRecord(ydoc.batteryType);
    batteryVehicleData.wattHours = buildFloatHazProBatteryVehicleDataRecord(ydoc.wattHours);
    batteryVehicleData.numberOfBatteries = buildIntHazProBatteryVehicleDataRecord(ydoc.numberOfBatteries);
    batteryVehicleData.batteryLocation = buildStringHazProBatteryVehicleDataRecord(ydoc.batteryLocation);
    batteryVehicleData.isDrained = buildBooleanHazProBatteryVehicleDataRecord(ydoc.isDrained);
    batteryVehicleData.protectionMeasures = buildStringHazProBatteryVehicleDataRecord(ydoc.protectionMeasures);
    batteryVehicleData.lifeCycleEvents = buildLifeCycleBatteryVehicleDataEvents(ydoc.lifeCycleEvents);
}
