import { Reference } from "./Reference";
import { YDocStringHazProPreparerRecord } from "./YDocStringHazProPreparerRecord";

export interface YDocLifeCyclePreparerEvent {
    uuid: string;
    preparer__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocPreparer {
    uuid: string;
    nameRecord: YDocStringHazProPreparerRecord;
    titleRecord: YDocStringHazProPreparerRecord;
    phoneRecord: YDocStringHazProPreparerRecord;
    emailRecord: YDocStringHazProPreparerRecord;
    lifeCycleEvents: YDocLifeCyclePreparerEvent[];
    path: string;
    __typename: string;
}
