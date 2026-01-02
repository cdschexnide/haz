import { ValtioInspectionStatusHazProInspectorShipmentRecord, ValtioDateHazProInspectorShipmentRecord, ValtioSDDGInspectionContext, ValtioStringHazProInspectorShipmentRecord, ValtioInspector, ValtioInspectionItemStatusHazProInspectorShipmentRecord, ValtioIntHazProInspectorShipmentRecord, ValtioLifeCycleInspectorShipmentEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocInspectorShipment, Reference } from "./../../yjs";
import { buildInspectionStatusHazProInspectorShipmentRecord } from "./InspectionStatusHazProInspectorShipmentRecord";
import { buildDateHazProInspectorShipmentRecord } from "./DateHazProInspectorShipmentRecord";
import { buildStringHazProInspectorShipmentRecord } from "./StringHazProInspectorShipmentRecord";
import { buildInspectionItemStatusHazProInspectorShipmentRecord } from "./InspectionItemStatusHazProInspectorShipmentRecord";
import { buildIntHazProInspectorShipmentRecord } from "./IntHazProInspectorShipmentRecord";

export interface ValtioInspectorShipment {
    /** Unique inspection ID */
    uuid: string;
    /** Current inspection status */
    statusRecord: ValtioInspectionStatusHazProInspectorShipmentRecord;
    /** When inspection was performed */
    inspectedAtRecord: ValtioDateHazProInspectorShipmentRecord;
    /** Complete inspection context data */
    inspectionContext__REF: Reference<string>;
    /** Complete inspection context data */
    get inspectionContext(): ValtioSDDGInspectionContext;
    /** Transportation Control Number (denormalized from SDDG) */
    tcnRecord: ValtioStringHazProInspectorShipmentRecord;
    /** UN/ID number (denormalized from SDDG) */
    unIdRecord: ValtioStringHazProInspectorShipmentRecord;
    /** Proper shipping name (denormalized from SDDG) */
    properShippingNameRecord: ValtioStringHazProInspectorShipmentRecord;
    /** Inspector name */
    inspector__REF: Reference<string>;
    /** Inspector name */
    get inspector(): ValtioInspector;
    /** SDDG verification status */
    sddgStatusRecord: ValtioInspectionItemStatusHazProInspectorShipmentRecord;
    /** Package verification status */
    packageStatusRecord: ValtioInspectionItemStatusHazProInspectorShipmentRecord;
    /** Total number of frustrations (SDDG + package) */
    totalFrustrationsRecord: ValtioIntHazProInspectorShipmentRecord;
    /** Number of SDDG frustrations */
    sddgFrustrationsRecord: ValtioIntHazProInspectorShipmentRecord;
    /** Number of package frustrations */
    packageFrustrationsRecord: ValtioIntHazProInspectorShipmentRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleInspectorShipmentEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: InspectorShipmentFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleInspectorShipmentEvents(events: any[]): ValtioLifeCycleInspectorShipmentEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            inspectorShipment__REF: event.inspectorShipment__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleInspectorShipmentEvent',
        }
    });
}

export async function upsertInspectorShipmentValtioEntity(ydoc: YDocInspectorShipment) {
    if (!store.InspectorShipmentMap[ydoc.uuid]) {
        store.InspectorShipmentMap[ydoc.uuid] = proxy({} as ValtioInspectorShipment)
    }

    const inspectorShipment = store.InspectorShipmentMap[ydoc.uuid]
    if (!inspectorShipment) {
        throw new Error('InspectorShipment does not exist')
    }

    inspectorShipment.__typename = 'InspectorShipment';
    inspectorShipment.path = ydoc.path;
    inspectorShipment._version = 0;
    inspectorShipment.uuid = ydoc.uuid;
    inspectorShipment.statusRecord = buildInspectionStatusHazProInspectorShipmentRecord(ydoc.statusRecord);
    inspectorShipment.inspectedAtRecord = buildDateHazProInspectorShipmentRecord(ydoc.inspectedAtRecord);
    inspectorShipment.inspectionContext__REF = ydoc.inspectionContext__REF;
    inspectorShipment.tcnRecord = buildStringHazProInspectorShipmentRecord(ydoc.tcnRecord);
    inspectorShipment.unIdRecord = buildStringHazProInspectorShipmentRecord(ydoc.unIdRecord);
    inspectorShipment.properShippingNameRecord = buildStringHazProInspectorShipmentRecord(ydoc.properShippingNameRecord);
    inspectorShipment.inspector__REF = ydoc.inspector__REF;
    inspectorShipment.sddgStatusRecord = buildInspectionItemStatusHazProInspectorShipmentRecord(ydoc.sddgStatusRecord);
    inspectorShipment.packageStatusRecord = buildInspectionItemStatusHazProInspectorShipmentRecord(ydoc.packageStatusRecord);
    inspectorShipment.totalFrustrationsRecord = buildIntHazProInspectorShipmentRecord(ydoc.totalFrustrationsRecord);
    inspectorShipment.sddgFrustrationsRecord = buildIntHazProInspectorShipmentRecord(ydoc.sddgFrustrationsRecord);
    inspectorShipment.packageFrustrationsRecord = buildIntHazProInspectorShipmentRecord(ydoc.packageFrustrationsRecord);
    inspectorShipment.lifeCycleEvents = buildLifeCycleInspectorShipmentEvents(ydoc.lifeCycleEvents);
    Object.defineProperty(inspectorShipment, 'inspectionContext', {
        get() {
            return Object.values(store.SDDGInspectionContextMap).filter((sDDGInspectionContext) => sDDGInspectionContext?.uuid === this.inspectionContext__REF.uuid)[0];
        }
    });
    Object.defineProperty(inspectorShipment, 'inspector', {
        get() {
            return Object.values(store.InspectorMap).filter((inspector) => inspector?.uuid === this.inspector__REF.uuid)[0];
        }
    });
}
