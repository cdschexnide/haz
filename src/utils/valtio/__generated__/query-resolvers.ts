import { store } from "./store";
import { ValtioPreparerShipment, ValtioInspectorShipment } from "./../types";

export const queryResolvers = {
    preparerShipments: async () => {
        const entities: ValtioPreparerShipment[] = [];
        for (const entity of Object.values(store.PreparerShipmentMap)) {
            if (entity) entities.push(entity);
        }
        return entities;
    },
    inspectorShipments: async () => {
        const entities: ValtioInspectorShipment[] = [];
        for (const entity of Object.values(store.InspectorShipmentMap)) {
            if (entity) entities.push(entity);
        }
        return entities;
    }
};
