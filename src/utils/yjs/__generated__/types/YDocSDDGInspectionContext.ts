import { Reference } from "./Reference";
import { YDocStringHazProSDDGInspectionContextRecord } from "./YDocStringHazProSDDGInspectionContextRecord";
import { YDocDateHazProSDDGInspectionContextRecord } from "./YDocDateHazProSDDGInspectionContextRecord";

export interface YDocLifeCycleSDDGInspectionContextEvent {
    uuid: string;
    sddgInspectionContext__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocSDDGInspectionContext {
    uuid: string;
    extractedContent__REF?: Reference<string>;
    verificationCopy__REF?: Reference<string>;
    originalImageUriRecord?: YDocStringHazProSDDGInspectionContextRecord;
    frustrations__REF: Reference<string[]>;
    packageFrustrations__REF: Reference<string[]>;
    resolvedFrustrations__REF: Reference<string[]>;
    resolvedPackageFrustrations__REF: Reference<string[]>;
    magnetizedMaterialInspection__REF?: Reference<string>;
    innerPackagingInspection__REF?: Reference<string>;
    packagePopMarking__REF?: Reference<string>;
    inspector__REF: Reference<string>;
    inspectionStartTimeRecord?: YDocDateHazProSDDGInspectionContextRecord;
    inspectionCompleteTimeRecord?: YDocDateHazProSDDGInspectionContextRecord;
    lifeCycleEvents: YDocLifeCycleSDDGInspectionContextEvent[];
    path: string;
    __typename: string;
}
