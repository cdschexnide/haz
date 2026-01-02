import { Reference } from "./Reference";

export interface YDocStringHazProHazardousMaterialItemRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProHazardousMaterialItemRecord {
    uuid: string;
    hazardousMaterialItem: Reference<string>;
    eventHistory: YDocStringHazProHazardousMaterialItemRecordEvent[];
    currentValue?: string;
    __typename: string;
}
