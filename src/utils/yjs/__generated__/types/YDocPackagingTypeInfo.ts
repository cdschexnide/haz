import { Reference } from "./Reference";
import { YDocStringHazProPackagingTypeInfoRecord } from "./YDocStringHazProPackagingTypeInfoRecord";

export interface YDocLifeCyclePackagingTypeInfoEvent {
    uuid: string;
    packagingTypeInfo__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocPackagingTypeInfo {
    uuid: string;
    codeRecord: YDocStringHazProPackagingTypeInfoRecord;
    packagingTypeRecord: YDocStringHazProPackagingTypeInfoRecord;
    lifeCycleEvents: YDocLifeCyclePackagingTypeInfoEvent[];
    path: string;
    __typename: string;
}
