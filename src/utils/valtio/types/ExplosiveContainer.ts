import { ValtioStringHazProExplosiveContainerRecord, ValtioFloatHazProExplosiveContainerRecord, ValtioIntHazProExplosiveContainerRecord, ValtioLifeCycleExplosiveContainerEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocExplosiveContainer } from "./../../yjs";
import { buildStringHazProExplosiveContainerRecord } from "./StringHazProExplosiveContainerRecord";
import { buildFloatHazProExplosiveContainerRecord } from "./FloatHazProExplosiveContainerRecord";
import { buildIntHazProExplosiveContainerRecord } from "./IntHazProExplosiveContainerRecord";

export interface ValtioExplosiveContainer {
    uuid: string;
    /** Type of container */
    containerTypeRecord: ValtioStringHazProExplosiveContainerRecord;
    /** Net explosive weight */
    netExplosiveWeightRecord: ValtioFloatHazProExplosiveContainerRecord;
    /** Compatibility group */
    compatibilityGroupRecord: ValtioStringHazProExplosiveContainerRecord;
    /** Number of containers */
    numberOfContainersRecord: ValtioIntHazProExplosiveContainerRecord;
    /** Method used for packing */
    packingMethodRecord?: ValtioStringHazProExplosiveContainerRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleExplosiveContainerEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: ExplosiveContainerFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleExplosiveContainerEvents(events: any[]): ValtioLifeCycleExplosiveContainerEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            explosiveContainer__REF: event.explosiveContainer__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleExplosiveContainerEvent',
        }
    });
}

export async function upsertExplosiveContainerValtioEntity(ydoc: YDocExplosiveContainer) {
    if (!store.ExplosiveContainerMap[ydoc.uuid]) {
        store.ExplosiveContainerMap[ydoc.uuid] = proxy({} as ValtioExplosiveContainer)
    }

    const explosiveContainer = store.ExplosiveContainerMap[ydoc.uuid]
    if (!explosiveContainer) {
        throw new Error('ExplosiveContainer does not exist')
    }

    explosiveContainer.__typename = 'ExplosiveContainer';
    explosiveContainer.path = ydoc.path;
    explosiveContainer._version = 0;
    explosiveContainer.uuid = ydoc.uuid;
    explosiveContainer.containerTypeRecord = buildStringHazProExplosiveContainerRecord(ydoc.containerTypeRecord);
    explosiveContainer.netExplosiveWeightRecord = buildFloatHazProExplosiveContainerRecord(ydoc.netExplosiveWeightRecord);
    explosiveContainer.compatibilityGroupRecord = buildStringHazProExplosiveContainerRecord(ydoc.compatibilityGroupRecord);
    explosiveContainer.numberOfContainersRecord = buildIntHazProExplosiveContainerRecord(ydoc.numberOfContainersRecord);
    explosiveContainer.packingMethodRecord = buildStringHazProExplosiveContainerRecord(ydoc.packingMethodRecord);
    explosiveContainer.lifeCycleEvents = buildLifeCycleExplosiveContainerEvents(ydoc.lifeCycleEvents);
}
