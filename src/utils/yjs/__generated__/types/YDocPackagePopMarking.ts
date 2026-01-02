import { Reference } from "./Reference";
import { YDocStringHazProPackagePopMarkingRecord } from "./YDocStringHazProPackagePopMarkingRecord";

export interface YDocLifeCyclePackagePopMarkingEvent {
    uuid: string;
    packagePopMarking__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocPackagePopMarking {
    uuid: string;
    BRecord: YDocStringHazProPackagePopMarkingRecord;
    CRecord: YDocStringHazProPackagePopMarkingRecord;
    DRecord: YDocStringHazProPackagePopMarkingRecord;
    ERecord: YDocStringHazProPackagePopMarkingRecord;
    FRecord: YDocStringHazProPackagePopMarkingRecord;
    GRecord: YDocStringHazProPackagePopMarkingRecord;
    HRecord: YDocStringHazProPackagePopMarkingRecord;
    lifeCycleEvents: YDocLifeCyclePackagePopMarkingEvent[];
    path: string;
    __typename: string;
}
