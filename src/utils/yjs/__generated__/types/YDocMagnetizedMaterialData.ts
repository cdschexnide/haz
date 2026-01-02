import { Reference } from "./Reference";
import { YDocFloatHazProMagnetizedMaterialDataRecord } from "./YDocFloatHazProMagnetizedMaterialDataRecord";
import { YDocStringHazProMagnetizedMaterialDataRecord } from "./YDocStringHazProMagnetizedMaterialDataRecord";

export interface YDocLifeCycleMagnetizedMaterialDataEvent {
    uuid: string;
    magnetizedMaterialData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocMagnetizedMaterialData {
    uuid: string;
    magneticFieldStrength: YDocFloatHazProMagnetizedMaterialDataRecord;
    compassDeflection: YDocFloatHazProMagnetizedMaterialDataRecord;
    packagingMethod: YDocStringHazProMagnetizedMaterialDataRecord;
    shieldingDescription?: YDocStringHazProMagnetizedMaterialDataRecord;
    handlingInstructions?: YDocStringHazProMagnetizedMaterialDataRecord;
    lifeCycleEvents: YDocLifeCycleMagnetizedMaterialDataEvent[];
    path: string;
    __typename: string;
}
