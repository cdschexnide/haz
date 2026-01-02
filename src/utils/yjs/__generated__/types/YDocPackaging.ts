import { Reference } from "./Reference";
import { YDocPackagingTypeHazProPackagingRecord } from "./YDocPackagingTypeHazProPackagingRecord";
import { YDocBooleanHazProPackagingRecord } from "./YDocBooleanHazProPackagingRecord";
import { YDocStringHazProPackagingRecord } from "./YDocStringHazProPackagingRecord";

export interface YDocLifeCyclePackagingEvent {
    uuid: string;
    packaging__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocPackaging {
    uuid: string;
    packagingTypeRecord: YDocPackagingTypeHazProPackagingRecord;
    usesPopMarkingRecord?: YDocBooleanHazProPackagingRecord;
    usesDotCylinderMarkingRecord?: YDocBooleanHazProPackagingRecord;
    inputPOPMarking__REF?: Reference<string>;
    inputCylinderPOPMarkingRecord?: YDocStringHazProPackagingRecord;
    cylinderDetails__REF?: Reference<string>;
    singlePackagingType__REF?: Reference<string>;
    compositePackagingType__REF?: Reference<string>;
    intermediatePackagingType__REF?: Reference<string>;
    combinationPackaging__REF?: Reference<string>;
    totalNetMass__REF?: Reference<string>;
    totalNetVolume__REF?: Reference<string>;
    popIsValidRecord?: YDocBooleanHazProPackagingRecord;
    lifeCycleEvents: YDocLifeCyclePackagingEvent[];
    path: string;
    __typename: string;
}
