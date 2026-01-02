import { ValtioPackagingTypeInfo, ValtioIntHazProCombinationPackagingRecord, ValtioStringHazProCombinationPackagingRecord, ValtioMassValue, ValtioVolumeValue, ValtioLifeCycleCombinationPackagingEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocCombinationPackaging, Reference } from "./../../yjs";
import { buildIntHazProCombinationPackagingRecord } from "./IntHazProCombinationPackagingRecord";
import { buildStringHazProCombinationPackagingRecord } from "./StringHazProCombinationPackagingRecord";

export interface ValtioCombinationPackaging {
    uuid: string;
    /** Inner packaging type */
    innerPackaging__REF?: Reference<string>;
    /** Inner packaging type */
    get innerPackaging(): ValtioPackagingTypeInfo | undefined;
    /** Intermediate packaging type */
    intermediatePackaging__REF?: Reference<string>;
    /** Intermediate packaging type */
    get intermediatePackaging(): ValtioPackagingTypeInfo | undefined;
    /** Outer packaging type */
    outerPackaging__REF?: Reference<string>;
    /** Outer packaging type */
    get outerPackaging(): ValtioPackagingTypeInfo | undefined;
    /** Number of inner containers */
    numberOfInnerContainersRecord?: ValtioIntHazProCombinationPackagingRecord;
    /** Quantity per individual container */
    quantityPerContainerRecord?: ValtioStringHazProCombinationPackagingRecord;
    /** Mass per inner container */
    massPerInnerContainer__REF?: Reference<string>;
    /** Mass per inner container */
    get massPerInnerContainer(): ValtioMassValue | undefined;
    /** Volume per inner container */
    volumePerInnerContainer__REF?: Reference<string>;
    /** Volume per inner container */
    get volumePerInnerContainer(): ValtioVolumeValue | undefined;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleCombinationPackagingEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: CombinationPackagingFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleCombinationPackagingEvents(events: any[]): ValtioLifeCycleCombinationPackagingEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            combinationPackaging__REF: event.combinationPackaging__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleCombinationPackagingEvent',
        }
    });
}

export async function upsertCombinationPackagingValtioEntity(ydoc: YDocCombinationPackaging) {
    if (!store.CombinationPackagingMap[ydoc.uuid]) {
        store.CombinationPackagingMap[ydoc.uuid] = proxy({} as ValtioCombinationPackaging)
    }

    const combinationPackaging = store.CombinationPackagingMap[ydoc.uuid]
    if (!combinationPackaging) {
        throw new Error('CombinationPackaging does not exist')
    }

    combinationPackaging.__typename = 'CombinationPackaging';
    combinationPackaging.path = ydoc.path;
    combinationPackaging._version = 0;
    combinationPackaging.uuid = ydoc.uuid;
    combinationPackaging.innerPackaging__REF = ydoc.innerPackaging__REF;
    combinationPackaging.intermediatePackaging__REF = ydoc.intermediatePackaging__REF;
    combinationPackaging.outerPackaging__REF = ydoc.outerPackaging__REF;
    combinationPackaging.numberOfInnerContainersRecord = buildIntHazProCombinationPackagingRecord(ydoc.numberOfInnerContainersRecord);
    combinationPackaging.quantityPerContainerRecord = buildStringHazProCombinationPackagingRecord(ydoc.quantityPerContainerRecord);
    combinationPackaging.massPerInnerContainer__REF = ydoc.massPerInnerContainer__REF;
    combinationPackaging.volumePerInnerContainer__REF = ydoc.volumePerInnerContainer__REF;
    combinationPackaging.lifeCycleEvents = buildLifeCycleCombinationPackagingEvents(ydoc.lifeCycleEvents);
    Object.defineProperty(combinationPackaging, 'innerPackaging', {
        get() {
            return Object.values(store.PackagingTypeInfoMap).filter((packagingTypeInfo) => packagingTypeInfo?.uuid === this.innerPackaging__REF.uuid)[0];
        }
    });
    Object.defineProperty(combinationPackaging, 'intermediatePackaging', {
        get() {
            return Object.values(store.PackagingTypeInfoMap).filter((packagingTypeInfo) => packagingTypeInfo?.uuid === this.intermediatePackaging__REF.uuid)[0];
        }
    });
    Object.defineProperty(combinationPackaging, 'outerPackaging', {
        get() {
            return Object.values(store.PackagingTypeInfoMap).filter((packagingTypeInfo) => packagingTypeInfo?.uuid === this.outerPackaging__REF.uuid)[0];
        }
    });
    Object.defineProperty(combinationPackaging, 'massPerInnerContainer', {
        get() {
            return Object.values(store.MassValueMap).filter((massValue) => massValue?.uuid === this.massPerInnerContainer__REF.uuid)[0];
        }
    });
    Object.defineProperty(combinationPackaging, 'volumePerInnerContainer', {
        get() {
            return Object.values(store.VolumeValueMap).filter((volumeValue) => volumeValue?.uuid === this.volumePerInnerContainer__REF.uuid)[0];
        }
    });
}
