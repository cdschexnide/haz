import { Reference } from "./Reference";

export interface YDocBooleanHazProModifiersAndAcknowledgementsRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: boolean;
    __typename: string;
}

export interface YDocBooleanHazProModifiersAndAcknowledgementsRecord {
    uuid: string;
    modifiersAndAcknowledgements: Reference<string>;
    eventHistory: YDocBooleanHazProModifiersAndAcknowledgementsRecordEvent[];
    currentValue?: boolean;
    __typename: string;
}
