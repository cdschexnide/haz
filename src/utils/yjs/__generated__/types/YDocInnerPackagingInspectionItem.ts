import { Reference } from "./Reference";
import { YDocStringHazProInnerPackagingInspectionItemRecord } from "./YDocStringHazProInnerPackagingInspectionItemRecord";
import { YDocInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecord } from "./YDocInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecord";

export interface YDocLifeCycleInnerPackagingInspectionItemEvent {
    uuid: string;
    innerPackagingInspectionItem__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocInnerPackagingInspectionItem {
    uuid: string;
    idRecord: YDocStringHazProInnerPackagingInspectionItemRecord;
    labelRecord: YDocStringHazProInnerPackagingInspectionItemRecord;
    statusRecord: YDocInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecord;
    notesRecord?: YDocStringHazProInnerPackagingInspectionItemRecord;
    afmanReferenceRecord: YDocStringHazProInnerPackagingInspectionItemRecord;
    lifeCycleEvents: YDocLifeCycleInnerPackagingInspectionItemEvent[];
    path: string;
    __typename: string;
}
