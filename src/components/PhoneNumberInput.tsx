import { usePreparerForm } from "@/contexts/PreparerFormProvider";
import { countryPhoneNumberCodes } from "@/mock/countryPhoneNumberCodes";
import { ConsigneeAddress, ShipperAddress } from "../../types";
import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type PhoneNumber = "DSN" | "Commercial" | "Both";
type CommercialFormat = "Domestic" | "International";
const phoneTypes: PhoneNumber[] = ["DSN", "Commercial", "Both"];
const commercialFormats: CommercialFormat[] = ["Domestic", "International"];

type Props = {
  getRef: (index: number) => any;
  focusNext: (index: number) => void;
  target: "shipper" | "consignee";
};

export const PhoneNumberInput = ({ getRef, focusNext, target }: Props) => {
  const { preparerContext, updateShipper, updateConsignee } = usePreparerForm();

  const entity = preparerContext[target];
  const [lastType, setLastType] = useState<
    "DSN" | "Commercial" | "Both" | null
  >(null);
  const [lastFormat, setLastFormat] = useState<
    "Domestic" | "International" | null
  >(null);

  const updatePhoneNumber = (updates: any) => {
    if (target === "shipper") {
      updateShipper({
        phoneNumber: { ...entity.phoneNumber, ...updates },
      });
    } else {
      updateConsignee({
        phoneNumber: { ...entity.phoneNumber, ...updates },
      });
    }
  };

  const selectedCountryKey =
    target === "shipper"
      ? (entity?.address as ShipperAddress).selectedShipperCountry
      : (entity?.address as ConsigneeAddress).selectedConsigneeCountry;

  const selectedCountryCode = useMemo(() => {
    const match = countryPhoneNumberCodes.find(
      c => c.country.toLowerCase() === selectedCountryKey?.toLowerCase()
    );
    return match?.code ? `+${match.code}` : "";
  }, [selectedCountryKey]);

  const formatDomesticPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const formatPhoneNumber = (raw: string, format: string) => {
    const digits = raw.replace(/\D/g, "");

    if (format === "International") {
      const prefix = selectedCountryCode.replace("+", "");
      const cleaned = digits.replace(new RegExp(`^${prefix}`), "").slice(0, 10);

      if (cleaned.length <= 3) return `+${prefix} (${cleaned}`;
      if (cleaned.length <= 6)
        return `+${prefix} (${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
      return `+${prefix} (${cleaned.slice(0, 3)}) ${cleaned.slice(
        3,
        6
      )}-${cleaned.slice(6)}`;
    }

    return formatDomesticPhone(raw);
  };

  const renderPhoneInput = (type: "DSN" | "Commercial") => {
    const phone = entity?.phoneNumber;
    const phoneType = phone?.type;
    const phoneValue =
      type === "DSN"
        ? (phoneType === "DSN"
            ? phone?.number
            : phoneType === "Both"
            ? phone?.dsnNumber
            : "") || ""
        : (phoneType === "Commercial"
            ? phone?.number
            : phoneType === "Both"
            ? phone?.number
            : "") || "";
    const format =
      type === "Commercial" ? phone?.format || "Domestic" : "Domestic";

    return (
      <View style={styles.phoneBlock}>
        <Text style={styles.inputLabel}>{type} Phone Number</Text>

        {type === "Commercial" && (
          <View style={styles.buttonGroupCompact}>
            {commercialFormats.map(fmt => (
              <TouchableOpacity
                key={fmt}
                onPress={() => {
                  const currentFormat = entity?.phoneNumber?.format;
                  if (currentFormat !== fmt) {
                    updatePhoneNumber({
                      format: fmt,
                      number: "",
                    });
                  }
                  setLastFormat(fmt);
                }}
                style={[
                  styles.buttonCompact,
                  format === fmt && styles.selectedButton,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    format === fmt ? styles.whiteText : styles.blackText,
                  ]}
                >
                  {fmt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TextInput
          ref={getRef(type === "DSN" ? 4 : 5)}
          returnKeyType="next"
          keyboardType="phone-pad"
          placeholder={
            type === "Commercial"
              ? `${selectedCountryCode} (XXX) XXX-XXXX`
              : "DSN Number"
          }
          value={phoneValue}
          style={styles.input}
          onChangeText={text => {
            let formatted = text;

            if (type === "Commercial") {
              formatted = formatPhoneNumber(text, format);

              if (
                format === "International" &&
                selectedCountryCode &&
                !formatted.startsWith(selectedCountryCode)
              ) {
                formatted = `${selectedCountryCode} ${formatted.replace(
                  /^\+?[\d\s()-]*/,
                  ""
                )}`;
              }
            } else {
              formatted = formatDomesticPhone(text);
            }

            if (type === "DSN") {
              if (phoneType === "Both") {
                updatePhoneNumber({ dsnNumber: formatted });
              } else {
                updatePhoneNumber({ number: formatted });
              }
            } else {
              updatePhoneNumber({ number: formatted });
            }
          }}
          onSubmitEditing={() => focusNext(type === "DSN" ? 4 : 5)}
        />
      </View>
    );
  };

  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Phone Type</Text>
        <View style={styles.buttonGroupCompact}>
          {phoneTypes.map(type => (
            <TouchableOpacity
              key={type}
              onPress={() => {
                const currentType = entity?.phoneNumber?.type;
                const currentNumber = entity?.phoneNumber?.number;

                if (type === "Both") {
                  if (currentType === "DSN") {
                    updatePhoneNumber({
                      type: "Both",
                      number: "",
                      format: "Domestic",
                      dsnNumber: currentNumber,
                    });
                  } else if (currentType === "Commercial") {
                    updatePhoneNumber({
                      type: "Both",
                      number: currentNumber,
                      format: entity?.phoneNumber?.format || "Domestic",
                      dsnNumber: "",
                    });
                  } else {
                    updatePhoneNumber({ type: "Both" });
                  }
                } else {
                  if (
                    (currentType === "DSN" && type === "Commercial") ||
                    (currentType === "Commercial" && type === "DSN")
                  ) {
                    updatePhoneNumber({
                      type,
                      number: "",
                      format: type === "Commercial" ? "Domestic" : undefined,
                    });
                  } else {
                    updatePhoneNumber({ type });
                  }
                }

                setLastType(type);
              }}
              style={[
                styles.buttonCompact,
                entity?.phoneNumber?.type === type && styles.selectedButton,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  entity?.phoneNumber?.type === type
                    ? styles.whiteText
                    : styles.blackText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {entity?.phoneNumber?.type === "DSN" && renderPhoneInput("DSN")}
      {entity?.phoneNumber?.type === "Commercial" &&
        renderPhoneInput("Commercial")}
      {entity?.phoneNumber?.type === "Both" && (
        <>
          {renderPhoneInput("DSN")}
          {renderPhoneInput("Commercial")}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 16,
    color: "#000",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#000",
  },
  buttonGroupCompact: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 6,
  },
  buttonCompact: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#888",
    backgroundColor: "#fff",
  },
  selectedButton: {
    backgroundColor: "#007BFF",
    borderColor: "#007BFF",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  whiteText: {
    color: "#fff",
  },
  blackText: {
    color: "#000",
  },
  phoneBlock: {
    marginBottom: 20,
  },
  suggestion: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f1f1f1",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
