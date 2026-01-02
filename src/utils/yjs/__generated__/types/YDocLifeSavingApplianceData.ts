import { Reference } from "./Reference";
import { YDocStringHazProLifeSavingApplianceDataRecord } from "./YDocStringHazProLifeSavingApplianceDataRecord";
import { YDocIntHazProLifeSavingApplianceDataRecord } from "./YDocIntHazProLifeSavingApplianceDataRecord";

export interface YDocLifeCycleLifeSavingApplianceDataEvent {
    uuid: string;
    lifeSavingApplianceData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocLifeSavingApplianceData {
    uuid: string;
    deviceTypeRecord: YDocStringHazProLifeSavingApplianceDataRecord;
    gasTypeRecord: YDocStringHazProLifeSavingApplianceDataRecord;
    cylinderSizeRecord: YDocStringHazProLifeSavingApplianceDataRecord;
    numberOfDevicesRecord: YDocIntHazProLifeSavingApplianceDataRecord;
    gasChargeRecord?: YDocStringHazProLifeSavingApplianceDataRecord;
    activationMethodRecord?: YDocStringHazProLifeSavingApplianceDataRecord;
    lifeCycleEvents: YDocLifeCycleLifeSavingApplianceDataEvent[];
    path: string;
    __typename: string;
}
