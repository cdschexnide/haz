import { Reference } from "./Reference";

export interface YDocStringHazProEmergencyPhoneNumberRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProEmergencyPhoneNumberRecord {
    uuid: string;
    emergencyPhoneNumber: Reference<string>;
    eventHistory: YDocStringHazProEmergencyPhoneNumberRecordEvent[];
    currentValue?: string;
    __typename: string;
}
