import { Reference } from "./Reference";
import { YDocStringHazProEmergencyPhoneNumberRecord } from "./YDocStringHazProEmergencyPhoneNumberRecord";

export interface YDocLifeCycleEmergencyPhoneNumberEvent {
    uuid: string;
    emergencyPhoneNumber__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocEmergencyPhoneNumber {
    uuid: string;
    providerRecord: YDocStringHazProEmergencyPhoneNumberRecord;
    numberRecord: YDocStringHazProEmergencyPhoneNumberRecord;
    countryRecord: YDocStringHazProEmergencyPhoneNumberRecord;
    lifeCycleEvents: YDocLifeCycleEmergencyPhoneNumberEvent[];
    path: string;
    __typename: string;
}
