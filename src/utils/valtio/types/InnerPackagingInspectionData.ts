import { ValtioBooleanHazProInnerPackagingInspectionDataRecord, ValtioContainerTypeHazProInnerPackagingInspectionDataRecord, ValtioInnerPackagingInspectionItem, ValtioDateHazProInnerPackagingInspectionDataRecord, ValtioStringHazProInnerPackagingInspectionDataRecord, ValtioComplianceStatusHazProInnerPackagingInspectionDataRecord, ValtioLifeCycleInnerPackagingInspectionDataEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocInnerPackagingInspectionData, Reference } from "./../../yjs";
import { buildBooleanHazProInnerPackagingInspectionDataRecord } from "./BooleanHazProInnerPackagingInspectionDataRecord";
import { buildContainerTypeHazProInnerPackagingInspectionDataRecord } from "./ContainerTypeHazProInnerPackagingInspectionDataRecord";
import { buildDateHazProInnerPackagingInspectionDataRecord } from "./DateHazProInnerPackagingInspectionDataRecord";
import { buildStringHazProInnerPackagingInspectionDataRecord } from "./StringHazProInnerPackagingInspectionDataRecord";
import { buildComplianceStatusHazProInnerPackagingInspectionDataRecord } from "./ComplianceStatusHazProInnerPackagingInspectionDataRecord";

export interface ValtioInnerPackagingInspectionData {
    uuid: string;
    /** Whether the package has inner packagings requiring inspection */
    hasInnerPackagingRecord?: ValtioBooleanHazProInnerPackagingInspectionDataRecord;
    /** Type of outer container being opened */
    containerTypeRecord?: ValtioContainerTypeHazProInnerPackagingInspectionDataRecord;
    /** Inspection items checklist (A28.2.1.2.1 - A28.2.1.2.6) */
    inspectionItems__REF: Reference<string[]>;
    /** Inspection items checklist (A28.2.1.2.1 - A28.2.1.2.6) */
    get inspectionItems(): ValtioInnerPackagingInspectionItem[];
    /** Timestamp when container was opened */
    openedAtRecord?: ValtioDateHazProInnerPackagingInspectionDataRecord;
    /** Timestamp when inspection was performed */
    inspectedAtRecord?: ValtioDateHazProInnerPackagingInspectionDataRecord;
    /** Timestamp when container was closed */
    closedAtRecord?: ValtioDateHazProInnerPackagingInspectionDataRecord;
    /** Whether a new shipper's certification is required after reclosure */
    newCertificationRequiredRecord: ValtioBooleanHazProInnerPackagingInspectionDataRecord;
    /** Description of how the container was reclosed */
    reclosureMethodRecord: ValtioStringHazProInnerPackagingInspectionDataRecord;
    /** General notes from inspector about inner packaging inspection */
    inspectorNotesRecord: ValtioStringHazProInnerPackagingInspectionDataRecord;
    /** Overall compliance status of inner packaging inspection */
    overallStatusRecord?: ValtioComplianceStatusHazProInnerPackagingInspectionDataRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleInnerPackagingInspectionDataEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: InnerPackagingInspectionDataFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleInnerPackagingInspectionDataEvents(events: any[]): ValtioLifeCycleInnerPackagingInspectionDataEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            innerPackagingInspectionData__REF: event.innerPackagingInspectionData__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleInnerPackagingInspectionDataEvent',
        }
    });
}

export async function upsertInnerPackagingInspectionDataValtioEntity(ydoc: YDocInnerPackagingInspectionData) {
    if (!store.InnerPackagingInspectionDataMap[ydoc.uuid]) {
        store.InnerPackagingInspectionDataMap[ydoc.uuid] = proxy({} as ValtioInnerPackagingInspectionData)
    }

    const innerPackagingInspectionData = store.InnerPackagingInspectionDataMap[ydoc.uuid]
    if (!innerPackagingInspectionData) {
        throw new Error('InnerPackagingInspectionData does not exist')
    }

    innerPackagingInspectionData.__typename = 'InnerPackagingInspectionData';
    innerPackagingInspectionData.path = ydoc.path;
    innerPackagingInspectionData._version = 0;
    innerPackagingInspectionData.uuid = ydoc.uuid;
    innerPackagingInspectionData.hasInnerPackagingRecord = buildBooleanHazProInnerPackagingInspectionDataRecord(ydoc.hasInnerPackagingRecord);
    innerPackagingInspectionData.containerTypeRecord = buildContainerTypeHazProInnerPackagingInspectionDataRecord(ydoc.containerTypeRecord);
    innerPackagingInspectionData.inspectionItems__REF = ydoc.inspectionItems__REF;
    innerPackagingInspectionData.openedAtRecord = buildDateHazProInnerPackagingInspectionDataRecord(ydoc.openedAtRecord);
    innerPackagingInspectionData.inspectedAtRecord = buildDateHazProInnerPackagingInspectionDataRecord(ydoc.inspectedAtRecord);
    innerPackagingInspectionData.closedAtRecord = buildDateHazProInnerPackagingInspectionDataRecord(ydoc.closedAtRecord);
    innerPackagingInspectionData.newCertificationRequiredRecord = buildBooleanHazProInnerPackagingInspectionDataRecord(ydoc.newCertificationRequiredRecord);
    innerPackagingInspectionData.reclosureMethodRecord = buildStringHazProInnerPackagingInspectionDataRecord(ydoc.reclosureMethodRecord);
    innerPackagingInspectionData.inspectorNotesRecord = buildStringHazProInnerPackagingInspectionDataRecord(ydoc.inspectorNotesRecord);
    innerPackagingInspectionData.overallStatusRecord = buildComplianceStatusHazProInnerPackagingInspectionDataRecord(ydoc.overallStatusRecord);
    innerPackagingInspectionData.lifeCycleEvents = buildLifeCycleInnerPackagingInspectionDataEvents(ydoc.lifeCycleEvents);
    Object.defineProperty(innerPackagingInspectionData, 'inspectionItems', {
        get() {
            return Object.values(store.InnerPackagingInspectionItemMap).filter((innerPackagingInspectionItem) => innerPackagingInspectionItem?.innerPackagingInspectionData__REF?.uuid === this.uuid).map((innerPackagingInspectionItem) => innerPackagingInspectionItem);
        }
    });
}
