import { ValtioLifeCycleUserEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocUser } from "./../../yjs";

export interface ValtioUser {
    /** User unique identifier */
    uuid: string;
    /** User display name */
    name: string;
    /** User email address */
    email: string;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleUserEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: UserFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleUserEvents(events: any[]): ValtioLifeCycleUserEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            user__REF: event.user__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleUserEvent',
        }
    });
}

export async function upsertUserValtioEntity(ydoc: YDocUser) {
    if (!store.UserMap[ydoc.uuid]) {
        store.UserMap[ydoc.uuid] = proxy({} as ValtioUser)
    }

    const user = store.UserMap[ydoc.uuid]
    if (!user) {
        throw new Error('User does not exist')
    }

    user.__typename = 'User';
    user.path = ydoc.path;
    user._version = 0;
    user.uuid = ydoc.uuid;
    user.name = ydoc.name;
    user.email = ydoc.email;
    user.lifeCycleEvents = buildLifeCycleUserEvents(ydoc.lifeCycleEvents);
}
