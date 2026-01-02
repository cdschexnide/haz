import { Reference } from "./Reference";
import { YDocFloatHazProInspectorMagnetizedMaterialDataRecord } from "./YDocFloatHazProInspectorMagnetizedMaterialDataRecord";
import { YDocStringHazProInspectorMagnetizedMaterialDataRecord } from "./YDocStringHazProInspectorMagnetizedMaterialDataRecord";
import { YDocMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord } from "./YDocMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord";
import { YDocMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecord } from "./YDocMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecord";

export interface YDocLifeCycleInspectorMagnetizedMaterialDataEvent {
    uuid: string;
    inspectorMagnetizedMaterialData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocInspectorMagnetizedMaterialData {
    uuid: string;
    magneticFieldReading1Record?: YDocFloatHazProInspectorMagnetizedMaterialDataRecord;
    magneticFieldReading2Record?: YDocFloatHazProInspectorMagnetizedMaterialDataRecord;
    compassDeviationReading1Record?: YDocFloatHazProInspectorMagnetizedMaterialDataRecord;
    compassDeviationReading2Record?: YDocFloatHazProInspectorMagnetizedMaterialDataRecord;
    measuringDevice1Record: YDocStringHazProInspectorMagnetizedMaterialDataRecord;
    measuringDevice2Record: YDocStringHazProInspectorMagnetizedMaterialDataRecord;
    shieldingPresentRecord?: YDocMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord;
    blockingBracingAdequateRecord?: YDocMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord;
    protectiveDistanceMaintainedRecord?: YDocMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord;
    outerPackagingDescriptionRecord: YDocStringHazProInspectorMagnetizedMaterialDataRecord;
    packageWeightRecord?: YDocFloatHazProInspectorMagnetizedMaterialDataRecord;
    packageDimensionsRecord?: YDocStringHazProInspectorMagnetizedMaterialDataRecord;
    overallComplianceRecord?: YDocMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecord;
    frustrationReasons: string[];
    inspectorNotesRecord: YDocStringHazProInspectorMagnetizedMaterialDataRecord;
    lifeCycleEvents: YDocLifeCycleInspectorMagnetizedMaterialDataEvent[];
    path: string;
    __typename: string;
}
