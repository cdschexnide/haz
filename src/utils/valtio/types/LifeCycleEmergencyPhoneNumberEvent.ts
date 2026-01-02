import { Reference } from "./../../yjs";

export interface ValtioLifeCycleEmergencyPhoneNumberEvent {
    uuid: string;
    emergencyPhoneNumber__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}
