import { Reference } from "./Reference";
import { YDocStringHazProInspectorRecord } from "./YDocStringHazProInspectorRecord";

export interface YDocLifeCycleInspectorEvent {
    uuid: string;
    inspector__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocInspector {
    uuid: string;
    inspectorNameRecord: YDocStringHazProInspectorRecord;
    inspectorRankRecord?: YDocStringHazProInspectorRecord;
    inspectorTitleRecord: YDocStringHazProInspectorRecord;
    lifeCycleEvents: YDocLifeCycleInspectorEvent[];
    path: string;
    __typename: string;
}
