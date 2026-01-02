/* Figure A3.1. Cylinder Specification and Service Pressures */

type SpecificationMarking = string;
type ServicePressureInPSIG = number;

const cylinderSpecificationsAndServicePressuresInPSIG: Record<
  SpecificationMarking,
  ServicePressureInPSIG
> = {
  3: 1800,
  "3E": 1800,
  8: 250,
};
