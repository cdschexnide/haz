import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import colors from "../theming/colors";
import { AIR_FORCE_RANKS } from "../constants/airForceRanks";

const logoImage = require("../../assets/hazpro-01.png");

interface UserFormData {
  name: string;
  rank: string;
  title: string;
}

interface LoginScreenProps {
  onLogin: (role: "preparer" | "inspector", userData: UserFormData) => void;
}

export default function LoginScreen({
  onLogin,
}: LoginScreenProps): React.JSX.Element {
  const [step, setStep] = useState<"roleSelection" | "form">("roleSelection");
  const [selectedRole, setSelectedRole] = useState<
    "preparer" | "inspector" | null
  >(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    rank: "",
    title: "",
  });
  const [errors, setErrors] = useState<{ name?: string; title?: string }>({});

  const handleRoleSelect = (role: "preparer" | "inspector") => {
    setSelectedRole(role);
    setStep("form");
    // Reset form data when selecting new role
    setFormData({ name: "", rank: "", title: "" });
    setErrors({});
  };

  const handleBack = () => {
    setStep("roleSelection");
    setSelectedRole(null);
    setFormData({ name: "", rank: "", title: "" });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; title?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm() && selectedRole) {
      onLogin(selectedRole, formData);
    }
  };

  // Role Selection Step
  if (step === "roleSelection") {
    return (
      <View style={styles.background}>
        <SafeAreaView style={styles.container}>
          <View style={styles.contentContainer}>
            {/* App Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={logoImage}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.subtitle}>Select Your Role</Text>
            </View>

            {/* Role Selection Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleRoleSelect("preparer")}
                testID="preparer-button"
              >
                {/* <Text style={styles.buttonIcon}>📦</Text> */}
                <Text style={styles.buttonText}>PREPARER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleRoleSelect("inspector")}
                testID="inspector-button"
              >
                {/* <Text style={styles.buttonIcon}>📋</Text> */}
                <Text style={styles.buttonText}>INSPECTOR</Text>
              </TouchableOpacity>
            </View>

            {/* Version Text */}
            <Text style={styles.versionText}>HAZPRO Mobile v1.0</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Form Step
  const roleTitle = selectedRole === "preparer" ? "Preparer" : "Inspector";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.formScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Small Logo */}
          <Image
            source={logoImage}
            style={styles.logoSmall}
            resizeMode="contain"
          />

          {/* Form Title */}
          <Text style={styles.formTitle}>{roleTitle} Login</Text>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{roleTitle} Name *</Text>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                value={formData.name}
                onChangeText={text => {
                  setFormData({ ...formData, name: text });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder={`Enter ${roleTitle.toLowerCase()} name`}
                placeholderTextColor="#999"
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Rank Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{roleTitle} Rank (Optional)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.rank}
                  onValueChange={value =>
                    setFormData({ ...formData, rank: value })
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Select Rank (Optional)" value="" />
                  {AIR_FORCE_RANKS.map(rank => (
                    <Picker.Item key={rank} label={rank} value={rank} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{roleTitle} Title *</Text>
              <TextInput
                style={[styles.input, errors.title ? styles.inputError : null]}
                value={formData.title}
                onChangeText={text => {
                  setFormData({ ...formData, title: text });
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                placeholder={`Enter ${roleTitle.toLowerCase()} title`}
                placeholderTextColor="#999"
              />
              {errors.title && (
                <Text style={styles.errorText}>{errors.title}</Text>
              )}
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>
                ← Back to Role Selection
              </Text>
            </TouchableOpacity>
          </View>

          {/* Version Text */}
          <Text style={styles.versionText}>HAZPRO Mobile v1.0</Text>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    flex: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 40,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logo: {
    width: 350,
    height: 120,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 22,
    color: "#333333",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    flex: 1,
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.blue,
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 55,
    width: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  buttonText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  versionText: {
    color: "#6E6E6E",
    fontSize: 14,
    marginBottom: 20,
  },
  // Form Styles
  formScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
  },
  logoSmall: {
    width: 250,
    height: 80,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 24,
  },
  formCard: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333333",
  },
  inputError: {
    borderColor: "#D32F2F",
    borderWidth: 2,
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 14,
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  loginButton: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  backButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  backButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "500",
  },
});
