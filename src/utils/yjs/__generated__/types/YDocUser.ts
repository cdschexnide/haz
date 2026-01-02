import { Reference } from "./Reference";

export interface YDocLifeCycleUserEvent {
    uuid: string;
    user__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocUser {
    uuid: string;
    name: string;
    email: string;
    lifeCycleEvents: YDocLifeCycleUserEvent[];
    path: string;
    __typename: string;
}
