import { Reference } from "./Reference";
import { YDocStringHazProCryogenicLiquidDetailsRecord } from "./YDocStringHazProCryogenicLiquidDetailsRecord";

export interface YDocLifeCycleCryogenicLiquidDetailsEvent {
    uuid: string;
    cryogenicLiquidDetails__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocCryogenicLiquidDetails {
    uuid: string;
    ventRateInSCFHRecord: YDocStringHazProCryogenicLiquidDetailsRecord;
    lifeCycleEvents: YDocLifeCycleCryogenicLiquidDetailsEvent[];
    path: string;
    __typename: string;
}
