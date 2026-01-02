import { ValtioHazProPackageFrustrationCategoryRecord, ValtioStringHazProPackageFrustrationRecord, ValtioDateHazProPackageFrustrationRecord, ValtioInspector, ValtioReinspectionAttempt, ValtioLifeCyclePackageFrustrationEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocPackageFrustration, Reference } from "./../../yjs";
import { buildHazProPackageFrustrationCategoryRecord } from "./HazProPackageFrustrationCategoryRecord";
import { buildStringHazProPackageFrustrationRecord } from "./StringHazProPackageFrustrationRecord";
import { buildDateHazProPackageFrustrationRecord } from "./DateHazProPackageFrustrationRecord";

export interface ValtioPackageFrustration {
    /** Unique identifier */
    uuid: string;
    /** Category of frustration */
    categoryRecord: ValtioHazProPackageFrustrationCategoryRecord;
    /** ID of the marking or label being frustrated */
    itemIdRecord: ValtioStringHazProPackageFrustrationRecord;
    /** Human-readable name of the item */
    itemLabelRecord: ValtioStringHazProPackageFrustrationRecord;
    /** What should be present */
    expectedValues: string[];
    /** Status that triggered frustration */
    verificationStatusRecord: ValtioStringHazProPackageFrustrationRecord;
    /** When the frustration was recorded */
    frustrationDateRecord: ValtioDateHazProPackageFrustrationRecord;
    /** Standard frustration message */
    defaultMessageRecord: ValtioStringHazProPackageFrustrationRecord;
    /** Optional inspector comments */
    additionalCommentsRecord?: ValtioStringHazProPackageFrustrationRecord;
    /** Inspector who frustrated the item */
    inspector__REF: Reference<string>;
    /** Inspector who frustrated the item */
    get inspector(): ValtioInspector;
    /** AFMAN reference if applicable */
    afmanReferenceRecord?: ValtioStringHazProPackageFrustrationRecord;
    /** History of all reinspection attempts */
    reinspectionHistory__REF: Reference<string[]>;
    /** History of all reinspection attempts */
    get reinspectionHistory(): ValtioReinspectionAttempt[];
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCyclePackageFrustrationEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: PackageFrustrationFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCyclePackageFrustrationEvents(events: any[]): ValtioLifeCyclePackageFrustrationEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            packageFrustration__REF: event.packageFrustration__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCyclePackageFrustrationEvent',
        }
    });
}

export async function upsertPackageFrustrationValtioEntity(ydoc: YDocPackageFrustration) {
    if (!store.PackageFrustrationMap[ydoc.uuid]) {
        store.PackageFrustrationMap[ydoc.uuid] = proxy({} as ValtioPackageFrustration)
    }

    const packageFrustration = store.PackageFrustrationMap[ydoc.uuid]
    if (!packageFrustration) {
        throw new Error('PackageFrustration does not exist')
    }

    packageFrustration.__typename = 'PackageFrustration';
    packageFrustration.path = ydoc.path;
    packageFrustration._version = 0;
    packageFrustration.uuid = ydoc.uuid;
    packageFrustration.categoryRecord = buildHazProPackageFrustrationCategoryRecord(ydoc.categoryRecord);
    packageFrustration.itemIdRecord = buildStringHazProPackageFrustrationRecord(ydoc.itemIdRecord);
    packageFrustration.itemLabelRecord = buildStringHazProPackageFrustrationRecord(ydoc.itemLabelRecord);
    packageFrustration.expectedValues = ydoc.expectedValues;
    packageFrustration.verificationStatusRecord = buildStringHazProPackageFrustrationRecord(ydoc.verificationStatusRecord);
    packageFrustration.frustrationDateRecord = buildDateHazProPackageFrustrationRecord(ydoc.frustrationDateRecord);
    packageFrustration.defaultMessageRecord = buildStringHazProPackageFrustrationRecord(ydoc.defaultMessageRecord);
    packageFrustration.additionalCommentsRecord = buildStringHazProPackageFrustrationRecord(ydoc.additionalCommentsRecord);
    packageFrustration.inspector__REF = ydoc.inspector__REF;
    packageFrustration.afmanReferenceRecord = buildStringHazProPackageFrustrationRecord(ydoc.afmanReferenceRecord);
    packageFrustration.reinspectionHistory__REF = ydoc.reinspectionHistory__REF;
    packageFrustration.lifeCycleEvents = buildLifeCyclePackageFrustrationEvents(ydoc.lifeCycleEvents);
    Object.defineProperty(packageFrustration, 'inspector', {
        get() {
            return Object.values(store.InspectorMap).filter((inspector) => inspector?.uuid === this.inspector__REF.uuid)[0];
        }
    });
    Object.defineProperty(packageFrustration, 'reinspectionHistory', {
        get() {
            return Object.values(store.ReinspectionAttemptMap).filter((reinspectionAttempt) => reinspectionAttempt?.packageFrustration__REF?.uuid === this.uuid).map((reinspectionAttempt) => reinspectionAttempt);
        }
    });
}
