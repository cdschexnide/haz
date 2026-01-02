import { Reference } from "./../../yjs";

export interface ValtioLifeCycleBatteryVehicleDataEvent {
    uuid: string;
    batteryVehicleData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}
