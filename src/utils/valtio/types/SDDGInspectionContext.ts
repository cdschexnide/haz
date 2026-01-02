import { ValtioExtractedSDDGContent, ValtioStringHazProSDDGInspectionContextRecord, ValtioFrustration, ValtioPackageFrustration, ValtioInspectorMagnetizedMaterialData, ValtioInnerPackagingInspectionData, ValtioPackagePopMarking, ValtioInspector, ValtioDateHazProSDDGInspectionContextRecord, ValtioLifeCycleSDDGInspectionContextEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocSDDGInspectionContext, Reference } from "./../../yjs";
import { buildStringHazProSDDGInspectionContextRecord } from "./StringHazProSDDGInspectionContextRecord";
import { buildDateHazProSDDGInspectionContextRecord } from "./DateHazProSDDGInspectionContextRecord";

export interface ValtioSDDGInspectionContext {
    uuid: string;
    /** Original OCR/AI extracted content */
    extractedContent__REF?: Reference<string>;
    /** Original OCR/AI extracted content */
    get extractedContent(): ValtioExtractedSDDGContent | undefined;
    /** User-verified/corrected copy */
    verificationCopy__REF?: Reference<string>;
    /** User-verified/corrected copy */
    get verificationCopy(): ValtioExtractedSDDGContent | undefined;
    /** URI of original SDDG image */
    originalImageUriRecord?: ValtioStringHazProSDDGInspectionContextRecord;
    /** Active SDDG frustrations */
    frustrations__REF: Reference<string[]>;
    /** Active SDDG frustrations */
    get frustrations(): ValtioFrustration[];
    /** Active package frustrations */
    packageFrustrations__REF: Reference<string[]>;
    /** Active package frustrations */
    get packageFrustrations(): ValtioPackageFrustration[];
    /** Resolved SDDG frustrations (passed reinspection) */
    resolvedFrustrations__REF: Reference<string[]>;
    /** Resolved SDDG frustrations (passed reinspection) */
    get resolvedFrustrations(): ValtioFrustration[];
    /** Resolved package frustrations (passed reinspection) */
    resolvedPackageFrustrations__REF: Reference<string[]>;
    /** Resolved package frustrations (passed reinspection) */
    get resolvedPackageFrustrations(): ValtioPackageFrustration[];
    /** UN2807 magnetized material inspection data */
    magnetizedMaterialInspection__REF?: Reference<string>;
    /** UN2807 magnetized material inspection data */
    get magnetizedMaterialInspection(): ValtioInspectorMagnetizedMaterialData | undefined;
    /** Inner packaging inspection data for combination packaging */
    innerPackagingInspection__REF?: Reference<string>;
    /** Inner packaging inspection data for combination packaging */
    get innerPackagingInspection(): ValtioInnerPackagingInspectionData | undefined;
    /** Package POP marking data entry */
    packagePopMarking__REF?: Reference<string>;
    /** Package POP marking data entry */
    get packagePopMarking(): ValtioPackagePopMarking | undefined;
    /** Inspector information */
    inspector__REF: Reference<string>;
    /** Inspector information */
    get inspector(): ValtioInspector;
    /** When inspection started */
    inspectionStartTimeRecord?: ValtioDateHazProSDDGInspectionContextRecord;
    /** When inspection completed */
    inspectionCompleteTimeRecord?: ValtioDateHazProSDDGInspectionContextRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleSDDGInspectionContextEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: SDDGInspectionContextFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleSDDGInspectionContextEvents(events: any[]): ValtioLifeCycleSDDGInspectionContextEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            sDDGInspectionContext__REF: event.sDDGInspectionContext__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleSDDGInspectionContextEvent',
        }
    });
}

export async function upsertSDDGInspectionContextValtioEntity(ydoc: YDocSDDGInspectionContext) {
    if (!store.SDDGInspectionContextMap[ydoc.uuid]) {
        store.SDDGInspectionContextMap[ydoc.uuid] = proxy({} as ValtioSDDGInspectionContext)
    }

    const sDDGInspectionContext = store.SDDGInspectionContextMap[ydoc.uuid]
    if (!sDDGInspectionContext) {
        throw new Error('SDDGInspectionContext does not exist')
    }

    sDDGInspectionContext.__typename = 'SDDGInspectionContext';
    sDDGInspectionContext.path = ydoc.path;
    sDDGInspectionContext._version = 0;
    sDDGInspectionContext.uuid = ydoc.uuid;
    sDDGInspectionContext.extractedContent__REF = ydoc.extractedContent__REF;
    sDDGInspectionContext.verificationCopy__REF = ydoc.verificationCopy__REF;
    sDDGInspectionContext.originalImageUriRecord = buildStringHazProSDDGInspectionContextRecord(ydoc.originalImageUriRecord);
    sDDGInspectionContext.frustrations__REF = ydoc.frustrations__REF;
    sDDGInspectionContext.packageFrustrations__REF = ydoc.packageFrustrations__REF;
    sDDGInspectionContext.resolvedFrustrations__REF = ydoc.resolvedFrustrations__REF;
    sDDGInspectionContext.resolvedPackageFrustrations__REF = ydoc.resolvedPackageFrustrations__REF;
    sDDGInspectionContext.magnetizedMaterialInspection__REF = ydoc.magnetizedMaterialInspection__REF;
    sDDGInspectionContext.innerPackagingInspection__REF = ydoc.innerPackagingInspection__REF;
    sDDGInspectionContext.packagePopMarking__REF = ydoc.packagePopMarking__REF;
    sDDGInspectionContext.inspector__REF = ydoc.inspector__REF;
    sDDGInspectionContext.inspectionStartTimeRecord = buildDateHazProSDDGInspectionContextRecord(ydoc.inspectionStartTimeRecord);
    sDDGInspectionContext.inspectionCompleteTimeRecord = buildDateHazProSDDGInspectionContextRecord(ydoc.inspectionCompleteTimeRecord);
    sDDGInspectionContext.lifeCycleEvents = buildLifeCycleSDDGInspectionContextEvents(ydoc.lifeCycleEvents);
    Object.defineProperty(sDDGInspectionContext, 'extractedContent', {
        get() {
            return Object.values(store.ExtractedSDDGContentMap).filter((extractedSDDGContent) => extractedSDDGContent?.uuid === this.extractedContent__REF.uuid)[0];
        }
    });
    Object.defineProperty(sDDGInspectionContext, 'verificationCopy', {
        get() {
            return Object.values(store.ExtractedSDDGContentMap).filter((extractedSDDGContent) => extractedSDDGContent?.uuid === this.verificationCopy__REF.uuid)[0];
        }
    });
    Object.defineProperty(sDDGInspectionContext, 'frustrations', {
        get() {
            return Object.values(store.FrustrationMap).filter((frustration) => frustration?.sDDGInspectionContext__REF?.uuid === this.uuid).map((frustration) => frustration);
        }
    });
    Object.defineProperty(sDDGInspectionContext, 'packageFrustrations', {
        get() {
            return Object.values(store.PackageFrustrationMap).filter((packageFrustration) => packageFrustration?.sDDGInspectionContext__REF?.uuid === this.uuid).map((packageFrustration) => packageFrustration);
        }
    });
    Object.defineProperty(sDDGInspectionContext, 'resolvedFrustrations', {
        get() {
            return Object.values(store.FrustrationMap).filter((frustration) => frustration?.sDDGInspectionContext__REF?.uuid === this.uuid).map((frustration) => frustration);
        }
    });
    Object.defineProperty(sDDGInspectionContext, 'resolvedPackageFrustrations', {
        get() {
            return Object.values(store.PackageFrustrationMap).filter((packageFrustration) => packageFrustration?.sDDGInspectionContext__REF?.uuid === this.uuid).map((packageFrustration) => packageFrustration);
        }
    });
    Object.defineProperty(sDDGInspectionContext, 'magnetizedMaterialInspection', {
        get() {
            return Object.values(store.InspectorMagnetizedMaterialDataMap).filter((inspectorMagnetizedMaterialData) => inspectorMagnetizedMaterialData?.uuid === this.magnetizedMaterialInspection__REF.uuid)[0];
        }
    });
    Object.defineProperty(sDDGInspectionContext, 'innerPackagingInspection', {
        get() {
            return Object.values(store.InnerPackagingInspectionDataMap).filter((innerPackagingInspectionData) => innerPackagingInspectionData?.uuid === this.innerPackagingInspection__REF.uuid)[0];
        }
    });
    Object.defineProperty(sDDGInspectionContext, 'packagePopMarking', {
        get() {
            return Object.values(store.PackagePopMarkingMap).filter((packagePopMarking) => packagePopMarking?.uuid === this.packagePopMarking__REF.uuid)[0];
        }
    });
    Object.defineProperty(sDDGInspectionContext, 'inspector', {
        get() {
            return Object.values(store.InspectorMap).filter((inspector) => inspector?.uuid === this.inspector__REF.uuid)[0];
        }
    });
}
