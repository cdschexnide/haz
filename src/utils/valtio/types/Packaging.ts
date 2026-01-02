import { ValtioPackagingTypeHazProPackagingRecord, ValtioBooleanHazProPackagingRecord, ValtioPOPMarking, ValtioStringHazProPackagingRecord, ValtioCylinderDetails, ValtioPackagingTypeInfo, ValtioCombinationPackaging, ValtioMassValue, ValtioVolumeValue, ValtioLifeCyclePackagingEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocPackaging, Reference } from "./../../yjs";
import { buildPackagingTypeHazProPackagingRecord } from "./PackagingTypeHazProPackagingRecord";
import { buildBooleanHazProPackagingRecord } from "./BooleanHazProPackagingRecord";
import { buildStringHazProPackagingRecord } from "./StringHazProPackagingRecord";

export interface ValtioPackaging {
    uuid: string;
    /** Type of packaging being used */
    packagingTypeRecord: ValtioPackagingTypeHazProPackagingRecord;
    /** Whether Performance Oriented Packaging marking is used */
    usesPopMarkingRecord?: ValtioBooleanHazProPackagingRecord;
    /** Whether DOT cylinder marking is used */
    usesDotCylinderMarkingRecord?: ValtioBooleanHazProPackagingRecord;
    /** POP marking data for non-cylinder packages */
    inputPOPMarking__REF?: Reference<string>;
    /** POP marking data for non-cylinder packages */
    get inputPOPMarking(): ValtioPOPMarking | undefined;
    /** POP marking string for cylinders */
    inputCylinderPOPMarkingRecord?: ValtioStringHazProPackagingRecord;
    /** Cylinder-specific details */
    cylinderDetails__REF?: Reference<string>;
    /** Cylinder-specific details */
    get cylinderDetails(): ValtioCylinderDetails | undefined;
    /** Single packaging type details */
    singlePackagingType__REF?: Reference<string>;
    /** Single packaging type details */
    get singlePackagingType(): ValtioPackagingTypeInfo | undefined;
    /** Composite packaging type details */
    compositePackagingType__REF?: Reference<string>;
    /** Composite packaging type details */
    get compositePackagingType(): ValtioPackagingTypeInfo | undefined;
    /** Intermediate packaging type details */
    intermediatePackagingType__REF?: Reference<string>;
    /** Intermediate packaging type details */
    get intermediatePackagingType(): ValtioPackagingTypeInfo | undefined;
    /** Combination packaging configuration */
    combinationPackaging__REF?: Reference<string>;
    /** Combination packaging configuration */
    get combinationPackaging(): ValtioCombinationPackaging | undefined;
    /** Total net mass of hazardous material */
    totalNetMass__REF?: Reference<string>;
    /** Total net mass of hazardous material */
    get totalNetMass(): ValtioMassValue | undefined;
    /** Total net volume of hazardous material */
    totalNetVolume__REF?: Reference<string>;
    /** Total net volume of hazardous material */
    get totalNetVolume(): ValtioVolumeValue | undefined;
    /** Whether the POP marking is valid */
    popIsValidRecord?: ValtioBooleanHazProPackagingRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCyclePackagingEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: PackagingFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCyclePackagingEvents(events: any[]): ValtioLifeCyclePackagingEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            packaging__REF: event.packaging__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCyclePackagingEvent',
        }
    });
}

export async function upsertPackagingValtioEntity(ydoc: YDocPackaging) {
    if (!store.PackagingMap[ydoc.uuid]) {
        store.PackagingMap[ydoc.uuid] = proxy({} as ValtioPackaging)
    }

    const packaging = store.PackagingMap[ydoc.uuid]
    if (!packaging) {
        throw new Error('Packaging does not exist')
    }

    packaging.__typename = 'Packaging';
    packaging.path = ydoc.path;
    packaging._version = 0;
    packaging.uuid = ydoc.uuid;
    packaging.packagingTypeRecord = buildPackagingTypeHazProPackagingRecord(ydoc.packagingTypeRecord);
    packaging.usesPopMarkingRecord = buildBooleanHazProPackagingRecord(ydoc.usesPopMarkingRecord);
    packaging.usesDotCylinderMarkingRecord = buildBooleanHazProPackagingRecord(ydoc.usesDotCylinderMarkingRecord);
    packaging.inputPOPMarking__REF = ydoc.inputPOPMarking__REF;
    packaging.inputCylinderPOPMarkingRecord = buildStringHazProPackagingRecord(ydoc.inputCylinderPOPMarkingRecord);
    packaging.cylinderDetails__REF = ydoc.cylinderDetails__REF;
    packaging.singlePackagingType__REF = ydoc.singlePackagingType__REF;
    packaging.compositePackagingType__REF = ydoc.compositePackagingType__REF;
    packaging.intermediatePackagingType__REF = ydoc.intermediatePackagingType__REF;
    packaging.combinationPackaging__REF = ydoc.combinationPackaging__REF;
    packaging.totalNetMass__REF = ydoc.totalNetMass__REF;
    packaging.totalNetVolume__REF = ydoc.totalNetVolume__REF;
    packaging.popIsValidRecord = buildBooleanHazProPackagingRecord(ydoc.popIsValidRecord);
    packaging.lifeCycleEvents = buildLifeCyclePackagingEvents(ydoc.lifeCycleEvents);
    Object.defineProperty(packaging, 'inputPOPMarking', {
        get() {
            return Object.values(store.POPMarkingMap).filter((pOPMarking) => pOPMarking?.uuid === this.inputPOPMarking__REF.uuid)[0];
        }
    });
    Object.defineProperty(packaging, 'cylinderDetails', {
        get() {
            return Object.values(store.CylinderDetailsMap).filter((cylinderDetails) => cylinderDetails?.uuid === this.cylinderDetails__REF.uuid)[0];
        }
    });
    Object.defineProperty(packaging, 'singlePackagingType', {
        get() {
            return Object.values(store.PackagingTypeInfoMap).filter((packagingTypeInfo) => packagingTypeInfo?.uuid === this.singlePackagingType__REF.uuid)[0];
        }
    });
    Object.defineProperty(packaging, 'compositePackagingType', {
        get() {
            return Object.values(store.PackagingTypeInfoMap).filter((packagingTypeInfo) => packagingTypeInfo?.uuid === this.compositePackagingType__REF.uuid)[0];
        }
    });
    Object.defineProperty(packaging, 'intermediatePackagingType', {
        get() {
            return Object.values(store.PackagingTypeInfoMap).filter((packagingTypeInfo) => packagingTypeInfo?.uuid === this.intermediatePackagingType__REF.uuid)[0];
        }
    });
    Object.defineProperty(packaging, 'combinationPackaging', {
        get() {
            return Object.values(store.CombinationPackagingMap).filter((combinationPackaging) => combinationPackaging?.packagings__REF?.uuid.includes(this.uuid))[0];
        }
    });
    Object.defineProperty(packaging, 'totalNetMass', {
        get() {
            return Object.values(store.MassValueMap).filter((massValue) => massValue?.uuid === this.totalNetMass__REF.uuid)[0];
        }
    });
    Object.defineProperty(packaging, 'totalNetVolume', {
        get() {
            return Object.values(store.VolumeValueMap).filter((volumeValue) => volumeValue?.uuid === this.totalNetVolume__REF.uuid)[0];
        }
    });
}
