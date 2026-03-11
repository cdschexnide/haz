import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  NavigationContainer,
  NavigationContainerRefWithCurrent,
} from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Alert,
  Platform,
  AppState,
} from "react-native";
import CustomDrawerContent from "./components/CustomDrawerContent";
import MainLayoutNavigator from "./components/MainLayoutNavigator";
import { HazProValtioProvider } from "./contexts/HazProPreparerProvider/HazProValtioProvider";
import { NavigationRefProvider } from "./contexts/NavigationRefProvider/NavigationRefProvider";
import { useSetNavigationRef } from "./contexts/NavigationRefProvider/useSetNavigationRef";
import { useNavigationRef } from "./contexts/NavigationRefProvider/useNavigationRef";
import { ShipmentsProvider } from "./contexts/ShipmentsProvider";
import InspectorLayoutNavigator from "./screens/inspector/InspectorLayoutNavigator";
import { HazProInspectorProvider } from "./contexts/HazProInspectorProvider/HazProInspectorProvider";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { DataProvider } from "./contexts/DataProvider";
import { InspectionFormProvider } from "./contexts/InspectionFormProvider";
import { PreparerFormProvider } from "./contexts/PreparerFormProvider";
import LoginScreen from "./components/LoginScreen";
import AcknowledgementScreen from "./components/AcknowledgementScreen";
import { hazProActions } from "./stores/hazProActions";
import { useInspectionForm } from "./contexts/InspectionFormProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Drawer = createDrawerNavigator();

const AppInner = ({
  initialRole,
  userData,
}: {
  initialRole: "preparer" | "inspector";
  userData: UserData | null;
}) => {
  const navigationRef = useRef<NavigationContainerRefWithCurrent<any>>(null);
  const setNavigationRef = useSetNavigationRef();

  useEffect(() => {
    if (navigationRef.current) {
      setNavigationRef(
        navigationRef as React.RefObject<NavigationContainerRefWithCurrent<any>>
      );
    }
  }, [navigationRef.current]);

  // Determine initial route based on selected role
  const initialRouteName =
    initialRole === "preparer"
      ? "Hazardous Material Preparer"
      : "Hazardous Material Inspector";

  return (
    <NavigationContainer ref={navigationRef}>
      {/* Set inspector data if inspector role */}
      {initialRole === "inspector" && (
        <InspectorDataSetter userData={userData} />
      )}

      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{ drawerType: "front", headerShown: false }}
        initialRouteName={initialRouteName}
      >
        <Drawer.Screen
          name="Hazardous Material Preparer"
          component={MainLayoutNavigator}
        />
        <Drawer.Screen
          name="Hazardous Material Inspector"
          component={InspectorLayoutNavigator}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

interface UserData {
  name: string;
  rank: string;
  title: string;
}

// Logout Context
interface LogoutContextType {
  logout: () => void;
}

const LogoutContext = React.createContext<LogoutContextType | undefined>(
  undefined
);

export const useLogout = () => {
  const context = React.useContext(LogoutContext);
  if (!context) {
    throw new Error("useLogout must be used within LogoutProvider");
  }
  return context;
};

// Component that wraps the app and handles login logic with access to providers
function AppWithLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"preparer" | "inspector">(
    "preparer"
  );
  const [userData, setUserData] = useState<UserData | null>(null);
  const [hasPassedAcknowledgement, setHasPassedAcknowledgement] =
    useState(false);
  const { startNewInspection, setInspector } = useInspectionForm();
  const { navigationRef } = useNavigationRef();
  const appStateRef = useRef(AppState.currentState);

  const handleLogin = (role: "preparer" | "inspector", formData: UserData) => {
    setSelectedRole(role);
    setUserData(formData);
    setIsLoggedIn(true);

    // Store data in appropriate global state
    if (role === "preparer") {
      // Store in Valtio store
      hazProActions.updatePreparer({
        preparerName: formData.name,
        preparerRank: formData.rank || null,
        preparerTitle: formData.title,
      });
      console.log("Preparer data saved to Valtio store:", formData);
    }

    console.log(`${role} logged in:`, formData);
  };

  const handleLogout = useCallback(() => {
    console.log("Logging out — resetting all state...");
    setIsLoggedIn(false);
    setSelectedRole("preparer");
    setUserData(null);
    setHasPassedAcknowledgement(false);

    // Reset preparer working context (material, packaging, shipment, etc.)
    hazProActions.resetContext();

    // Reset inspector working context (SDDG, frustrations, etc.)
    // Note: startNewInspection() and clearInspectionContext() preserve inspector identity by design
    startNewInspection();
    hazProActions.clearInspectionContext();
    hazProActions.resetWorkflow();

    // Explicitly clear inspector identity (preserved by the above calls)
    setInspector({ inspectorName: "", inspectorRank: null, inspectorTitle: "" });
    hazProActions.setInspector({ inspectorName: "", inspectorRank: null, inspectorTitle: "" });
  }, [startNewInspection, setInspector]);

  const handleAcknowledge = () => {
    console.log("User acknowledged and passed through");
    setHasPassedAcknowledgement(true);
  };

  // Navigation-aware Android back button handler
  // Only intercepts at the navigation root — lets React Navigation handle in-stack pops
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!isLoggedIn) {
        // At login screen — let Android minimize (default behavior)
        return false;
      }

      // If React Navigation can go back, let it handle the press
      if (navigationRef?.canGoBack?.()) {
        return false;
      }

      // At navigation root while logged in — show confirmation instead of minimizing
      Alert.alert("Exit App?", "Any unsaved progress will be lost.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Exit",
          style: "destructive",
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true;
    });

    return () => handler.remove();
  }, [isLoggedIn, navigationRef]);

  // Handle app returning from background — refresh data and validate state
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App returned to foreground");

        // Refresh shipments index in case filesystem changed
        hazProActions.refreshShipmentsIndex();

        // Validate in-memory state consistency
        // If we're at the login screen, ensure no stale working state lingers
        if (!isLoggedIn) {
          hazProActions.resetContext();
          hazProActions.clearInspectionContext();
          hazProActions.resetWorkflow();
        }
      }
      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, [isLoggedIn]);

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Show acknowledgement screen if logged in but hasn't passed acknowledgement yet
  if (isLoggedIn && !hasPassedAcknowledgement && userData) {
    return (
      <AcknowledgementScreen
        userName={userData.name}
        userRole={selectedRole}
        onAcknowledge={handleAcknowledge}
      />
    );
  }

  // Show main app after login and acknowledgement - wrap with LogoutContext provider
  return (
    <LogoutContext.Provider value={{ logout: handleLogout }}>
      <ErrorBoundary onReset={handleLogout}>
        <AppInner initialRole={selectedRole} userData={userData} />
      </ErrorBoundary>
    </LogoutContext.Provider>
  );
}

// Inspector data setter component (needs access to InspectionFormProvider)
function InspectorDataSetter({ userData }: { userData: UserData | null }) {
  const { setInspector } = useInspectionForm();

  React.useEffect(() => {
    if (userData) {
      setInspector({
        inspectorName: userData.name,
        inspectorRank: userData.rank || null,
        inspectorTitle: userData.title,
      });
      console.log("Inspector data saved to InspectionFormProvider:", userData);
    }
  }, [userData, setInspector]);

  return null;
}

// Build expiration date: March 24, 2026 at end of day (UTC)
const BUILD_EXPIRY = new Date("2026-03-25T00:00:00Z");

function ExpiredScreen() {
  return (
    <View style={expiredStyles.container}>
      <Text style={expiredStyles.icon}>⚠️</Text>
      <Text style={expiredStyles.title}>Demo Period Expired</Text>
      <Text style={expiredStyles.message}>
        This demo build of HazPro has expired and is no longer available for
        use. Please contact Technergetics for continued access.
      </Text>
    </View>
  );
}

const expiredStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e94560",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#a0a0b0",
    textAlign: "center",
    lineHeight: 24,
  },
});

// Main app export with all providers
export default function App() {
  // Check build expiration
  if (new Date() >= BUILD_EXPIRY) {
    return <ExpiredScreen />;
  }

  return (
    <AutocompleteDropdownContextProvider>
      <NavigationRefProvider>
        <DataProvider>
          <InspectionFormProvider>
            <PreparerFormProvider>
              <HazProInspectorProvider>
                <HazProValtioProvider>
                  <AppWithLogin />
                </HazProValtioProvider>
              </HazProInspectorProvider>
            </PreparerFormProvider>
          </InspectionFormProvider>
        </DataProvider>
      </NavigationRefProvider>
    </AutocompleteDropdownContextProvider>
  );
}
