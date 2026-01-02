import { Reference } from "./Reference";
import { YDocStringHazProLithiumBatteryDataRecord } from "./YDocStringHazProLithiumBatteryDataRecord";
import { YDocFloatHazProLithiumBatteryDataRecord } from "./YDocFloatHazProLithiumBatteryDataRecord";
import { YDocIntHazProLithiumBatteryDataRecord } from "./YDocIntHazProLithiumBatteryDataRecord";
import { YDocBooleanHazProLithiumBatteryDataRecord } from "./YDocBooleanHazProLithiumBatteryDataRecord";

export interface YDocLifeCycleLithiumBatteryDataEvent {
    uuid: string;
    lithiumBatteryData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocLithiumBatteryData {
    uuid: string;
    batteryTypeRecord: YDocStringHazProLithiumBatteryDataRecord;
    wattHoursRecord?: YDocFloatHazProLithiumBatteryDataRecord;
    lithiumContentRecord?: YDocFloatHazProLithiumBatteryDataRecord;
    numberOfCellsRecord?: YDocIntHazProLithiumBatteryDataRecord;
    packingInstructionRecord: YDocStringHazProLithiumBatteryDataRecord;
    numberOfBatteriesRecord?: YDocIntHazProLithiumBatteryDataRecord;
    massPerBatteryRecord?: YDocFloatHazProLithiumBatteryDataRecord;
    isInEquipmentRecord?: YDocBooleanHazProLithiumBatteryDataRecord;
    isPackedWithEquipmentRecord?: YDocBooleanHazProLithiumBatteryDataRecord;
    lifeCycleEvents: YDocLifeCycleLithiumBatteryDataEvent[];
    path: string;
    __typename: string;
}
