import { Reference } from "./Reference";

export interface YDocIntHazProExplosiveContainerRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocIntHazProExplosiveContainerRecord {
    uuid: string;
    explosiveContainer: Reference<string>;
    eventHistory: YDocIntHazProExplosiveContainerRecordEvent[];
    currentValue?: number;
    __typename: string;
}
