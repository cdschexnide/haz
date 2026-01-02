import { Reference } from "./Reference";
import { YDocStringHazProPOPMarkingRecord } from "./YDocStringHazProPOPMarkingRecord";

export interface YDocLifeCyclePOPMarkingEvent {
    uuid: string;
    popMarking__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocPOPMarking {
    uuid: string;
    typeRecord?: YDocStringHazProPOPMarkingRecord;
    ARecord?: YDocStringHazProPOPMarkingRecord;
    BRecord?: YDocStringHazProPOPMarkingRecord;
    CRecord?: YDocStringHazProPOPMarkingRecord;
    DRecord?: YDocStringHazProPOPMarkingRecord;
    ERecord?: YDocStringHazProPOPMarkingRecord;
    FRecord?: YDocStringHazProPOPMarkingRecord;
    GRecord?: YDocStringHazProPOPMarkingRecord;
    HRecord?: YDocStringHazProPOPMarkingRecord;
    lifeCycleEvents: YDocLifeCyclePOPMarkingEvent[];
    path: string;
    __typename: string;
}
