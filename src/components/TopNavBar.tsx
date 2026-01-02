import { HazProInspectorContext } from "@/contexts/HazProInspectorProvider/HazProInspectorContext";
import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { useHazProStore } from "@/stores/useHazProStore";
import { MaterialIcons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import React, { useContext, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLogout } from "../App";

console.warn = () => {};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const MENU_WIDTH = 250;

interface TopNavBarProps {
  title?: string;
  onMenuPress?: () => void;
  onAccountPress?: () => void;
  onSelectRole?: (role: string) => void;
}

type NavigationProp = DrawerNavigationProp<Record<string, object>>;

const TopNavBar: React.FC<TopNavBarProps> = ({
  title = "HAZPRO",
  onAccountPress,
  onSelectRole,
}) => {
  const { store } = useHazProStore();
  const { logout } = useLogout();
  const { dispatch: inspectorDispatch } = useContext(HazProInspectorContext);

  const navigation = useNavigation<NavigationProp>();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const { navigate, goBack } = useNavigationRef();

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -MENU_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const handleNestedInspectorContextFieldUpdate = (
    field: string,
    value: any
  ) => {
    inspectorDispatch({ type: "UPDATE_NESTED_FIELD", field, value });
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            closeMenu();
            logout();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <View style={styles.container}>
        {/* Hamburger Menu Icon */}
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialIcons name="menu" size={28} color="black" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        {/* Account Icon */}
        <TouchableOpacity onPress={onAccountPress}>
          <MaterialIcons name="account-circle" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Sliding Menu and Overlay */}
      {menuVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <Animated.View
            style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
          >
            <Text style={styles.menuTitle}>Menu</Text>

            <View style={styles.menuItemsContainer}>
              <TouchableOpacity
                style={[styles.menuItem, styles.logoutMenuItem]}
                onPress={handleLogout}
              >
                <MaterialIcons name="logout" size={20} color="#D32F2F" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderBottomWidth: 4,
    borderBottomColor: "#e2e2e2",
  },
  title: {
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  menu: {
    position: "absolute",
    top: 0,
    left: 0,
    width: MENU_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  menuItemsContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  logoutMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    color: "#D32F2F",
    fontWeight: "600",
  },
});

export default TopNavBar;
