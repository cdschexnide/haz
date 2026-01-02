import { Reference } from "./Reference";
import { YDocStringHazProExplosiveContainerRecord } from "./YDocStringHazProExplosiveContainerRecord";
import { YDocFloatHazProExplosiveContainerRecord } from "./YDocFloatHazProExplosiveContainerRecord";
import { YDocIntHazProExplosiveContainerRecord } from "./YDocIntHazProExplosiveContainerRecord";

export interface YDocLifeCycleExplosiveContainerEvent {
    uuid: string;
    explosiveContainer__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocExplosiveContainer {
    uuid: string;
    containerTypeRecord: YDocStringHazProExplosiveContainerRecord;
    netExplosiveWeightRecord: YDocFloatHazProExplosiveContainerRecord;
    compatibilityGroupRecord: YDocStringHazProExplosiveContainerRecord;
    numberOfContainersRecord: YDocIntHazProExplosiveContainerRecord;
    packingMethodRecord?: YDocStringHazProExplosiveContainerRecord;
    lifeCycleEvents: YDocLifeCycleExplosiveContainerEvent[];
    path: string;
    __typename: string;
}
