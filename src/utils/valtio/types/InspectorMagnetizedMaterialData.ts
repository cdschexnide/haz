import { ValtioFloatHazProInspectorMagnetizedMaterialDataRecord, ValtioStringHazProInspectorMagnetizedMaterialDataRecord, ValtioMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord, ValtioMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecord, ValtioLifeCycleInspectorMagnetizedMaterialDataEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocInspectorMagnetizedMaterialData } from "./../../yjs";
import { buildFloatHazProInspectorMagnetizedMaterialDataRecord } from "./FloatHazProInspectorMagnetizedMaterialDataRecord";
import { buildStringHazProInspectorMagnetizedMaterialDataRecord } from "./StringHazProInspectorMagnetizedMaterialDataRecord";
import { buildMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord } from "./MagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord";
import { buildMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecord } from "./MagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecord";

export interface ValtioInspectorMagnetizedMaterialData {
    uuid: string;
    /** First magnetic field reading */
    magneticFieldReading1Record?: ValtioFloatHazProInspectorMagnetizedMaterialDataRecord;
    /** Second magnetic field reading */
    magneticFieldReading2Record?: ValtioFloatHazProInspectorMagnetizedMaterialDataRecord;
    /** First compass deviation reading */
    compassDeviationReading1Record?: ValtioFloatHazProInspectorMagnetizedMaterialDataRecord;
    /** Second compass deviation reading */
    compassDeviationReading2Record?: ValtioFloatHazProInspectorMagnetizedMaterialDataRecord;
    /** Device used for first measurement */
    measuringDevice1Record: ValtioStringHazProInspectorMagnetizedMaterialDataRecord;
    /** Device used for second measurement */
    measuringDevice2Record: ValtioStringHazProInspectorMagnetizedMaterialDataRecord;
    /** Whether magnetic shielding is present */
    shieldingPresentRecord?: ValtioMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord;
    /** Whether blocking/bracing is adequate */
    blockingBracingAdequateRecord?: ValtioMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord;
    /** Whether protective distance is maintained */
    protectiveDistanceMaintainedRecord?: ValtioMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord;
    /** Description of outer packaging */
    outerPackagingDescriptionRecord: ValtioStringHazProInspectorMagnetizedMaterialDataRecord;
    /** Package weight in pounds */
    packageWeightRecord?: ValtioFloatHazProInspectorMagnetizedMaterialDataRecord;
    /** Package dimensions */
    packageDimensionsRecord?: ValtioStringHazProInspectorMagnetizedMaterialDataRecord;
    /** Overall compliance assessment */
    overallComplianceRecord?: ValtioMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecord;
    /** Reasons for frustration if non-compliant */
    frustrationReasons: string[];
    /** Inspector notes */
    inspectorNotesRecord: ValtioStringHazProInspectorMagnetizedMaterialDataRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleInspectorMagnetizedMaterialDataEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: InspectorMagnetizedMaterialDataFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleInspectorMagnetizedMaterialDataEvents(events: any[]): ValtioLifeCycleInspectorMagnetizedMaterialDataEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            inspectorMagnetizedMaterialData__REF: event.inspectorMagnetizedMaterialData__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleInspectorMagnetizedMaterialDataEvent',
        }
    });
}

export async function upsertInspectorMagnetizedMaterialDataValtioEntity(ydoc: YDocInspectorMagnetizedMaterialData) {
    if (!store.InspectorMagnetizedMaterialDataMap[ydoc.uuid]) {
        store.InspectorMagnetizedMaterialDataMap[ydoc.uuid] = proxy({} as ValtioInspectorMagnetizedMaterialData)
    }

    const inspectorMagnetizedMaterialData = store.InspectorMagnetizedMaterialDataMap[ydoc.uuid]
    if (!inspectorMagnetizedMaterialData) {
        throw new Error('InspectorMagnetizedMaterialData does not exist')
    }

    inspectorMagnetizedMaterialData.__typename = 'InspectorMagnetizedMaterialData';
    inspectorMagnetizedMaterialData.path = ydoc.path;
    inspectorMagnetizedMaterialData._version = 0;
    inspectorMagnetizedMaterialData.uuid = ydoc.uuid;
    inspectorMagnetizedMaterialData.magneticFieldReading1Record = buildFloatHazProInspectorMagnetizedMaterialDataRecord(ydoc.magneticFieldReading1Record);
    inspectorMagnetizedMaterialData.magneticFieldReading2Record = buildFloatHazProInspectorMagnetizedMaterialDataRecord(ydoc.magneticFieldReading2Record);
    inspectorMagnetizedMaterialData.compassDeviationReading1Record = buildFloatHazProInspectorMagnetizedMaterialDataRecord(ydoc.compassDeviationReading1Record);
    inspectorMagnetizedMaterialData.compassDeviationReading2Record = buildFloatHazProInspectorMagnetizedMaterialDataRecord(ydoc.compassDeviationReading2Record);
    inspectorMagnetizedMaterialData.measuringDevice1Record = buildStringHazProInspectorMagnetizedMaterialDataRecord(ydoc.measuringDevice1Record);
    inspectorMagnetizedMaterialData.measuringDevice2Record = buildStringHazProInspectorMagnetizedMaterialDataRecord(ydoc.measuringDevice2Record);
    inspectorMagnetizedMaterialData.shieldingPresentRecord = buildMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord(ydoc.shieldingPresentRecord);
    inspectorMagnetizedMaterialData.blockingBracingAdequateRecord = buildMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord(ydoc.blockingBracingAdequateRecord);
    inspectorMagnetizedMaterialData.protectiveDistanceMaintainedRecord = buildMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord(ydoc.protectiveDistanceMaintainedRecord);
    inspectorMagnetizedMaterialData.outerPackagingDescriptionRecord = buildStringHazProInspectorMagnetizedMaterialDataRecord(ydoc.outerPackagingDescriptionRecord);
    inspectorMagnetizedMaterialData.packageWeightRecord = buildFloatHazProInspectorMagnetizedMaterialDataRecord(ydoc.packageWeightRecord);
    inspectorMagnetizedMaterialData.packageDimensionsRecord = buildStringHazProInspectorMagnetizedMaterialDataRecord(ydoc.packageDimensionsRecord);
    inspectorMagnetizedMaterialData.overallComplianceRecord = buildMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecord(ydoc.overallComplianceRecord);
    inspectorMagnetizedMaterialData.frustrationReasons = ydoc.frustrationReasons;
    inspectorMagnetizedMaterialData.inspectorNotesRecord = buildStringHazProInspectorMagnetizedMaterialDataRecord(ydoc.inspectorNotesRecord);
    inspectorMagnetizedMaterialData.lifeCycleEvents = buildLifeCycleInspectorMagnetizedMaterialDataEvents(ydoc.lifeCycleEvents);
}
