import { Reference } from "./Reference";
import { YDocStringHazProCylinderDetailsRecord } from "./YDocStringHazProCylinderDetailsRecord";
import { YDocQuantityUnitHazProCylinderDetailsRecord } from "./YDocQuantityUnitHazProCylinderDetailsRecord";

export interface YDocLifeCycleCylinderDetailsEvent {
    uuid: string;
    cylinderDetails__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocCylinderDetails {
    uuid: string;
    numberOfCylindersRecord: YDocStringHazProCylinderDetailsRecord;
    quantityPerCylinder__REF: Reference<string>;
    cryogenicLiquidDetails__REF?: Reference<string>;
    unitRecord: YDocQuantityUnitHazProCylinderDetailsRecord;
    lifeCycleEvents: YDocLifeCycleCylinderDetailsEvent[];
    path: string;
    __typename: string;
}
