import { Reference } from "./Reference";
import { YDocBooleanHazProHazProPreparerContextRecord } from "./YDocBooleanHazProHazProPreparerContextRecord";
import { YDocStringHazProHazProPreparerContextRecord } from "./YDocStringHazProHazProPreparerContextRecord";
import { YDocIntHazProHazProPreparerContextRecord } from "./YDocIntHazProHazProPreparerContextRecord";

export interface YDocLifeCycleHazProPreparerContextEvent {
    uuid: string;
    hazProPreparerContext__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocHazProPreparerContext {
    uuid: string;
    hazardousMaterial__REF?: Reference<string>;
    shipper__REF?: Reference<string>;
    consignee__REF?: Reference<string>;
    preparer__REF?: Reference<string>;
    shipment__REF?: Reference<string>;
    packaging__REF?: Reference<string>;
    lithiumBatteryData__REF?: Reference<string>;
    magnetizedMaterialData__REF?: Reference<string>;
    dryIceData__REF?: Reference<string>;
    batteryVehicle__REF?: Reference<string>;
    capacitorData__REF?: Reference<string>;
    lifeSavingApplianceData__REF?: Reference<string>;
    geneticallyModifiedOrganism__REF?: Reference<string>;
    safetyDeviceData__REF?: Reference<string>;
    kitPreparationData__REF?: Reference<string>;
    engineOrMachineryPreparationData__REF?: Reference<string>;
    explosivesDetails__REF?: Reference<string>;
    usesCoeCertificationRecord: YDocBooleanHazProHazProPreparerContextRecord;
    usesCaaCertificationRecord: YDocBooleanHazProHazProPreparerContextRecord;
    usesDotSpPermitRecord: YDocBooleanHazProHazProPreparerContextRecord;
    coeDocuments__REF: Reference<string[]>;
    caaDocuments__REF: Reference<string[]>;
    dotSpWaivers__REF: Reference<string[]>;
    coeApprovalEntityRecord?: YDocStringHazProHazProPreparerContextRecord;
    caaApprovalEntityRecord?: YDocStringHazProHazProPreparerContextRecord;
    exceptedLithiumBatteryEmergencyContactRecord?: YDocStringHazProHazProPreparerContextRecord;
    modifiersAndRequiredAcknowledgements__REF?: Reference<string>;
    currentShipmentIdRecord?: YDocStringHazProHazProPreparerContextRecord;
    activeStepRecord?: YDocIntHazProHazProPreparerContextRecord;
    activeSubstepRecord?: YDocIntHazProHazProPreparerContextRecord;
    completedSubsteps: string[];
    packagingMethodRecord?: YDocStringHazProHazProPreparerContextRecord;
    allowablePackingGroupsRecord?: YDocStringHazProHazProPreparerContextRecord;
    redirectUnidRecord?: YDocStringHazProHazProPreparerContextRecord;
    explosivesAuthorizedToBeShippedUnpackedRecord?: YDocBooleanHazProHazProPreparerContextRecord;
    technicalName?: string;
    lifeCycleEvents: YDocLifeCycleHazProPreparerContextEvent[];
    path: string;
    __typename: string;
}
