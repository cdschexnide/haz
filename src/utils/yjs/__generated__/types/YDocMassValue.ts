import { Reference } from "./Reference";
import { YDocFloatHazProMassValueRecord } from "./YDocFloatHazProMassValueRecord";

export interface YDocLifeCycleMassValueEvent {
    uuid: string;
    massValue__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocMassValue {
    uuid: string;
    lbsRecord: YDocFloatHazProMassValueRecord;
    kgRecord: YDocFloatHazProMassValueRecord;
    lifeCycleEvents: YDocLifeCycleMassValueEvent[];
    path: string;
    __typename: string;
}
