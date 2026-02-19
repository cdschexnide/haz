import { routeToPackageWorkflowStart } from "../inspectorPostSddgPackageRouting";

const createBaseOptions = (overrides?: {
  inspection?: any;
  navigation?: any;
  setSpecialAuthorizationData?: jest.Mock;
}) => {
  const navigation = overrides?.navigation || { navigate: jest.fn() };
  const setSpecialAuthorizationData =
    overrides?.setSpecialAuthorizationData || jest.fn();

  return {
    inspection: {
      verificationCopy: {
        unIdNo: "UN0106",
        packingInstruction: "DOT-SP 12345",
      },
      extractedContent: {},
      ...overrides?.inspection,
    },
    navigation,
    setQuantityType: jest.fn(),
    setExceptedQuantityData: jest.fn(),
    setLimitedQuantityData: jest.fn(),
    setPackagePackagingType: jest.fn(),
    setSpecialAuthorizationData,
  };
};

test("preserves preloaded authorization docs before special-authorization check", () => {
  const navigation = { navigate: jest.fn() };
  const setSpecialAuthorizationData = jest.fn();

  routeToPackageWorkflowStart(
    createBaseOptions({
      inspection: {
        dotSpWaivers: [{ id: "doc-1" }],
      },
      navigation,
      setSpecialAuthorizationData,
    })
  );

  expect(setSpecialAuthorizationData).not.toHaveBeenCalledWith(null);
  expect(navigation.navigate).toHaveBeenCalledWith(
    "InspectorSpecialAuthorizationCheckScreen",
    { packingInstruction: "DOT-SP 12345" }
  );
});

test("clears stale authorization state when invalid key17 has no preloaded docs", () => {
  const navigation = { navigate: jest.fn() };
  const setSpecialAuthorizationData = jest.fn();

  routeToPackageWorkflowStart(
    createBaseOptions({
      inspection: {
        dotSpWaivers: [],
        coeAndCaaDocuments: { coeDocuments: [], caaDocuments: [] },
      },
      navigation,
      setSpecialAuthorizationData,
    })
  );

  expect(setSpecialAuthorizationData).toHaveBeenCalledWith(null);
  expect(navigation.navigate).toHaveBeenCalledWith(
    "InspectorSpecialAuthorizationCheckScreen",
    { packingInstruction: "DOT-SP 12345" }
  );
});

