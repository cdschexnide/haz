import { Reference } from "./Reference";

export interface YDocStringHazProExplosiveContainerRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProExplosiveContainerRecord {
    uuid: string;
    explosiveContainer: Reference<string>;
    eventHistory: YDocStringHazProExplosiveContainerRecordEvent[];
    currentValue?: string;
    __typename: string;
}
