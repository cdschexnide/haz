import { Reference } from "./Reference";
import { YDocStringHazProDryIceDataRecord } from "./YDocStringHazProDryIceDataRecord";
import { YDocBooleanHazProDryIceDataRecord } from "./YDocBooleanHazProDryIceDataRecord";

export interface YDocLifeCycleDryIceDataEvent {
    uuid: string;
    dryIceData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocDryIceData {
    uuid: string;
    packagingType: YDocStringHazProDryIceDataRecord;
    quantity: YDocStringHazProDryIceDataRecord;
    aircraftType: YDocStringHazProDryIceDataRecord;
    isAircraftPressurized: YDocBooleanHazProDryIceDataRecord;
    isVentingProvided: YDocBooleanHazProDryIceDataRecord;
    specialInstructions: YDocStringHazProDryIceDataRecord;
    handlingInstructions: YDocStringHazProDryIceDataRecord;
    lifeCycleEvents: YDocLifeCycleDryIceDataEvent[];
    path: string;
    __typename: string;
}
