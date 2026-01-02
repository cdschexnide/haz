import { Reference } from "./Reference";
import { YDocStringHazProSafetyDeviceDataRecord } from "./YDocStringHazProSafetyDeviceDataRecord";
import { YDocIntHazProSafetyDeviceDataRecord } from "./YDocIntHazProSafetyDeviceDataRecord";
import { YDocBooleanHazProSafetyDeviceDataRecord } from "./YDocBooleanHazProSafetyDeviceDataRecord";

export interface YDocLifeCycleSafetyDeviceDataEvent {
    uuid: string;
    safetyDeviceData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocSafetyDeviceData {
    uuid: string;
    deviceTypeRecord: YDocStringHazProSafetyDeviceDataRecord;
    activationMethodRecord: YDocStringHazProSafetyDeviceDataRecord;
    numberOfDevicesRecord: YDocIntHazProSafetyDeviceDataRecord;
    gasTypeRecord?: YDocStringHazProSafetyDeviceDataRecord;
    pyrotechnicComponentsRecord?: YDocBooleanHazProSafetyDeviceDataRecord;
    lifeCycleEvents: YDocLifeCycleSafetyDeviceDataEvent[];
    path: string;
    __typename: string;
}
