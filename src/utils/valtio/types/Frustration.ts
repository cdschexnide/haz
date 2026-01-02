import { ValtioStringHazProFrustrationRecord, ValtioDateHazProFrustrationRecord, ValtioInspector, ValtioReinspectionAttempt, ValtioLifeCycleFrustrationEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocFrustration, Reference } from "./../../yjs";
import { buildStringHazProFrustrationRecord } from "./StringHazProFrustrationRecord";
import { buildDateHazProFrustrationRecord } from "./DateHazProFrustrationRecord";

export interface ValtioFrustration {
    uuid: string;
    /** Field key (e.g., 'shipper', 'hazardClass') */
    keyRecord: ValtioStringHazProFrustrationRecord;
    /** Human-readable field name */
    fieldLabelRecord: ValtioStringHazProFrustrationRecord;
    /** The actual value that was frustrated */
    fieldValueRecord: ValtioStringHazProFrustrationRecord;
    /** The correct value that should be present (optional) */
    correctValueRecord?: ValtioStringHazProFrustrationRecord;
    /** When the frustration was recorded */
    frustrationDateRecord: ValtioDateHazProFrustrationRecord;
    /** Standard frustration message */
    defaultMessageRecord: ValtioStringHazProFrustrationRecord;
    /** Optional inspector comments */
    additionalCommentsRecord?: ValtioStringHazProFrustrationRecord;
    /** Inspector who frustrated the item */
    inspector__REF: Reference<string>;
    /** Inspector who frustrated the item */
    get inspector(): ValtioInspector;
    /** History of all reinspection attempts */
    reinspectionHistory__REF: Reference<string[]>;
    /** History of all reinspection attempts */
    get reinspectionHistory(): ValtioReinspectionAttempt[];
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleFrustrationEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: FrustrationFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleFrustrationEvents(events: any[]): ValtioLifeCycleFrustrationEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            frustration__REF: event.frustration__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleFrustrationEvent',
        }
    });
}

export async function upsertFrustrationValtioEntity(ydoc: YDocFrustration) {
    if (!store.FrustrationMap[ydoc.uuid]) {
        store.FrustrationMap[ydoc.uuid] = proxy({} as ValtioFrustration)
    }

    const frustration = store.FrustrationMap[ydoc.uuid]
    if (!frustration) {
        throw new Error('Frustration does not exist')
    }

    frustration.__typename = 'Frustration';
    frustration.path = ydoc.path;
    frustration._version = 0;
    frustration.uuid = ydoc.uuid;
    frustration.keyRecord = buildStringHazProFrustrationRecord(ydoc.keyRecord);
    frustration.fieldLabelRecord = buildStringHazProFrustrationRecord(ydoc.fieldLabelRecord);
    frustration.fieldValueRecord = buildStringHazProFrustrationRecord(ydoc.fieldValueRecord);
    frustration.correctValueRecord = buildStringHazProFrustrationRecord(ydoc.correctValueRecord);
    frustration.frustrationDateRecord = buildDateHazProFrustrationRecord(ydoc.frustrationDateRecord);
    frustration.defaultMessageRecord = buildStringHazProFrustrationRecord(ydoc.defaultMessageRecord);
    frustration.additionalCommentsRecord = buildStringHazProFrustrationRecord(ydoc.additionalCommentsRecord);
    frustration.inspector__REF = ydoc.inspector__REF;
    frustration.reinspectionHistory__REF = ydoc.reinspectionHistory__REF;
    frustration.lifeCycleEvents = buildLifeCycleFrustrationEvents(ydoc.lifeCycleEvents);
    Object.defineProperty(frustration, 'inspector', {
        get() {
            return Object.values(store.InspectorMap).filter((inspector) => inspector?.uuid === this.inspector__REF.uuid)[0];
        }
    });
    Object.defineProperty(frustration, 'reinspectionHistory', {
        get() {
            return Object.values(store.ReinspectionAttemptMap).filter((reinspectionAttempt) => reinspectionAttempt?.frustration__REF?.uuid === this.uuid).map((reinspectionAttempt) => reinspectionAttempt);
        }
    });
}
