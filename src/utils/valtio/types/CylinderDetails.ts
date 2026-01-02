import { ValtioStringHazProCylinderDetailsRecord, ValtioQuantityValue, ValtioCryogenicLiquidDetails, ValtioQuantityUnitHazProCylinderDetailsRecord, ValtioLifeCycleCylinderDetailsEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocCylinderDetails, Reference } from "./../../yjs";
import { buildStringHazProCylinderDetailsRecord } from "./StringHazProCylinderDetailsRecord";
import { buildQuantityUnitHazProCylinderDetailsRecord } from "./QuantityUnitHazProCylinderDetailsRecord";

export interface ValtioCylinderDetails {
    uuid: string;
    /** Number of cylinders in shipment */
    numberOfCylindersRecord: ValtioStringHazProCylinderDetailsRecord;
    /** Quantity per individual cylinder */
    quantityPerCylinder__REF: Reference<string>;
    /** Quantity per individual cylinder */
    get quantityPerCylinder(): ValtioQuantityValue;
    /** Additional details for cryogenic liquids */
    cryogenicLiquidDetails__REF?: Reference<string>;
    /** Additional details for cryogenic liquids */
    get cryogenicLiquidDetails(): ValtioCryogenicLiquidDetails | undefined;
    /** Unit of measurement */
    unitRecord: ValtioQuantityUnitHazProCylinderDetailsRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleCylinderDetailsEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: CylinderDetailsFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleCylinderDetailsEvents(events: any[]): ValtioLifeCycleCylinderDetailsEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            cylinderDetails__REF: event.cylinderDetails__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleCylinderDetailsEvent',
        }
    });
}

export async function upsertCylinderDetailsValtioEntity(ydoc: YDocCylinderDetails) {
    if (!store.CylinderDetailsMap[ydoc.uuid]) {
        store.CylinderDetailsMap[ydoc.uuid] = proxy({} as ValtioCylinderDetails)
    }

    const cylinderDetails = store.CylinderDetailsMap[ydoc.uuid]
    if (!cylinderDetails) {
        throw new Error('CylinderDetails does not exist')
    }

    cylinderDetails.__typename = 'CylinderDetails';
    cylinderDetails.path = ydoc.path;
    cylinderDetails._version = 0;
    cylinderDetails.uuid = ydoc.uuid;
    cylinderDetails.numberOfCylindersRecord = buildStringHazProCylinderDetailsRecord(ydoc.numberOfCylindersRecord);
    cylinderDetails.quantityPerCylinder__REF = ydoc.quantityPerCylinder__REF;
    cylinderDetails.cryogenicLiquidDetails__REF = ydoc.cryogenicLiquidDetails__REF;
    cylinderDetails.unitRecord = buildQuantityUnitHazProCylinderDetailsRecord(ydoc.unitRecord);
    cylinderDetails.lifeCycleEvents = buildLifeCycleCylinderDetailsEvents(ydoc.lifeCycleEvents);
    Object.defineProperty(cylinderDetails, 'quantityPerCylinder', {
        get() {
            return Object.values(store.QuantityValueMap).filter((quantityValue) => quantityValue?.uuid === this.quantityPerCylinder__REF.uuid)[0];
        }
    });
    Object.defineProperty(cylinderDetails, 'cryogenicLiquidDetails', {
        get() {
            return Object.values(store.CryogenicLiquidDetailsMap).filter((cryogenicLiquidDetails) => cryogenicLiquidDetails?.uuid === this.cryogenicLiquidDetails__REF.uuid)[0];
        }
    });
}
