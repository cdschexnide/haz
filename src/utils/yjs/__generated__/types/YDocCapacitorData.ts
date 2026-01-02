import { Reference } from "./Reference";
import { YDocFloatHazProCapacitorDataRecord } from "./YDocFloatHazProCapacitorDataRecord";
import { YDocIntHazProCapacitorDataRecord } from "./YDocIntHazProCapacitorDataRecord";
import { YDocBooleanHazProCapacitorDataRecord } from "./YDocBooleanHazProCapacitorDataRecord";
import { YDocStringHazProCapacitorDataRecord } from "./YDocStringHazProCapacitorDataRecord";

export interface YDocLifeCycleCapacitorDataEvent {
    uuid: string;
    capacitorData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocCapacitorData {
    uuid: string;
    capacitance: YDocFloatHazProCapacitorDataRecord;
    voltage: YDocFloatHazProCapacitorDataRecord;
    energyStorage: YDocFloatHazProCapacitorDataRecord;
    numberOfCapacitors: YDocIntHazProCapacitorDataRecord;
    discharged: YDocBooleanHazProCapacitorDataRecord;
    protectionMeasures?: YDocStringHazProCapacitorDataRecord;
    lifeCycleEvents: YDocLifeCycleCapacitorDataEvent[];
    path: string;
    __typename: string;
}
