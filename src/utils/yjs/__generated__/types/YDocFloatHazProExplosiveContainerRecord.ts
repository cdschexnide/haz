import { Reference } from "./Reference";

export interface YDocFloatHazProExplosiveContainerRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocFloatHazProExplosiveContainerRecord {
    uuid: string;
    explosiveContainer: Reference<string>;
    eventHistory: YDocFloatHazProExplosiveContainerRecordEvent[];
    currentValue?: number;
    __typename: string;
}
