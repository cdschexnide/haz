import { Reference } from "./Reference";
import { YDocStringHazProGMOShipmentDataRecord } from "./YDocStringHazProGMOShipmentDataRecord";

export interface YDocLifeCycleGMOShipmentDataEvent {
    uuid: string;
    gmoShipmentData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocGMOShipmentData {
    uuid: string;
    organismTypeRecord: YDocStringHazProGMOShipmentDataRecord;
    genotypeRecord: YDocStringHazProGMOShipmentDataRecord;
    containmentLevelRecord: YDocStringHazProGMOShipmentDataRecord;
    packagingSpecificationRecord: YDocStringHazProGMOShipmentDataRecord;
    handlingRequirementsRecord?: YDocStringHazProGMOShipmentDataRecord;
    emergencyProceduresRecord?: YDocStringHazProGMOShipmentDataRecord;
    lifeCycleEvents: YDocLifeCycleGMOShipmentDataEvent[];
    path: string;
    __typename: string;
}
