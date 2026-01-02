import { Reference } from "./Reference";
import { YDocStringHazProQuantityValueRecord } from "./YDocStringHazProQuantityValueRecord";

export interface YDocLifeCycleQuantityValueEvent {
    uuid: string;
    quantityValue__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocQuantityValue {
    uuid: string;
    lbsRecord: YDocStringHazProQuantityValueRecord;
    kgsRecord: YDocStringHazProQuantityValueRecord;
    lifeCycleEvents: YDocLifeCycleQuantityValueEvent[];
    path: string;
    __typename: string;
}
