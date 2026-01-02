import { ValtioStringHazProPackagePopMarkingRecord, ValtioLifeCyclePackagePopMarkingEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocPackagePopMarking } from "./../../yjs";
import { buildStringHazProPackagePopMarkingRecord } from "./StringHazProPackagePopMarkingRecord";

export interface ValtioPackagePopMarking {
    uuid: string;
    /** Packaging code for outer packaging (Field B) */
    BRecord: ValtioStringHazProPackagePopMarkingRecord;
    /** Packing Group X, Y, or Z (Field C) */
    CRecord: ValtioStringHazProPackagePopMarkingRecord;
    /** Relative Density (liquid) or Maximum Gross Mass (solid) (Field D) */
    DRecord: ValtioStringHazProPackagePopMarkingRecord;
    /** Test Pressure (liquids) or 'S' (solids/inner packagings) (Field E) */
    ERecord: ValtioStringHazProPackagePopMarkingRecord;
    /** Year of manufacture - 2 digits (Field F) */
    FRecord: ValtioStringHazProPackagePopMarkingRecord;
    /** State (Country) Authorizing Mark (Field G) */
    GRecord: ValtioStringHazProPackagePopMarkingRecord;
    /** Symbol of Manufacturer/Certifier (Field H) */
    HRecord: ValtioStringHazProPackagePopMarkingRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCyclePackagePopMarkingEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: PackagePopMarkingFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCyclePackagePopMarkingEvents(events: any[]): ValtioLifeCyclePackagePopMarkingEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            packagePopMarking__REF: event.packagePopMarking__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCyclePackagePopMarkingEvent',
        }
    });
}

export async function upsertPackagePopMarkingValtioEntity(ydoc: YDocPackagePopMarking) {
    if (!store.PackagePopMarkingMap[ydoc.uuid]) {
        store.PackagePopMarkingMap[ydoc.uuid] = proxy({} as ValtioPackagePopMarking)
    }

    const packagePopMarking = store.PackagePopMarkingMap[ydoc.uuid]
    if (!packagePopMarking) {
        throw new Error('PackagePopMarking does not exist')
    }

    packagePopMarking.__typename = 'PackagePopMarking';
    packagePopMarking.path = ydoc.path;
    packagePopMarking._version = 0;
    packagePopMarking.uuid = ydoc.uuid;
    packagePopMarking.BRecord = buildStringHazProPackagePopMarkingRecord(ydoc.BRecord);
    packagePopMarking.CRecord = buildStringHazProPackagePopMarkingRecord(ydoc.CRecord);
    packagePopMarking.DRecord = buildStringHazProPackagePopMarkingRecord(ydoc.DRecord);
    packagePopMarking.ERecord = buildStringHazProPackagePopMarkingRecord(ydoc.ERecord);
    packagePopMarking.FRecord = buildStringHazProPackagePopMarkingRecord(ydoc.FRecord);
    packagePopMarking.GRecord = buildStringHazProPackagePopMarkingRecord(ydoc.GRecord);
    packagePopMarking.HRecord = buildStringHazProPackagePopMarkingRecord(ydoc.HRecord);
    packagePopMarking.lifeCycleEvents = buildLifeCyclePackagePopMarkingEvents(ydoc.lifeCycleEvents);
}
