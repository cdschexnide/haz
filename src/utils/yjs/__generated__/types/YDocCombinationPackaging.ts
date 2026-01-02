import { Reference } from "./Reference";
import { YDocIntHazProCombinationPackagingRecord } from "./YDocIntHazProCombinationPackagingRecord";
import { YDocStringHazProCombinationPackagingRecord } from "./YDocStringHazProCombinationPackagingRecord";

export interface YDocLifeCycleCombinationPackagingEvent {
    uuid: string;
    combinationPackaging__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocCombinationPackaging {
    uuid: string;
    innerPackaging__REF?: Reference<string>;
    intermediatePackaging__REF?: Reference<string>;
    outerPackaging__REF?: Reference<string>;
    numberOfInnerContainersRecord?: YDocIntHazProCombinationPackagingRecord;
    quantityPerContainerRecord?: YDocStringHazProCombinationPackagingRecord;
    massPerInnerContainer__REF?: Reference<string>;
    volumePerInnerContainer__REF?: Reference<string>;
    lifeCycleEvents: YDocLifeCycleCombinationPackagingEvent[];
    path: string;
    __typename: string;
}
