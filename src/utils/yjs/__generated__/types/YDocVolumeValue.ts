import { Reference } from "./Reference";
import { YDocFloatHazProVolumeValueRecord } from "./YDocFloatHazProVolumeValueRecord";

export interface YDocLifeCycleVolumeValueEvent {
    uuid: string;
    volumeValue__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocVolumeValue {
    uuid: string;
    litersRecord: YDocFloatHazProVolumeValueRecord;
    gallonsRecord: YDocFloatHazProVolumeValueRecord;
    lifeCycleEvents: YDocLifeCycleVolumeValueEvent[];
    path: string;
    __typename: string;
}
