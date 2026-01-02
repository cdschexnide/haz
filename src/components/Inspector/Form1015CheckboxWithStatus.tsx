import { StyleSheet, Text, View } from "react-native";
import { colors } from "react-native-elements";

interface Form1015CheckBoxWithStatusProps {
  identifier: string;
  frustratedForm1015Ids?: Set<string>;
  resolvedForm1015Ids?: Set<string>;
}

export const Form1015CheckBoxWithStatus = ({
  identifier,
  frustratedForm1015Ids,
  resolvedForm1015Ids,
}: Form1015CheckBoxWithStatusProps) => {
  // Check if this Form 1015 line item is currently frustrated (regular X)
  const hasCurrentFrustration = frustratedForm1015Ids?.has(identifier) || false;

  // Check if this Form 1015 line item was frustrated but passed reinspection (circled X)
  const hasResolvedFrustration = resolvedForm1015Ids?.has(identifier) || false;

  // Current frustrations take precedence over resolved
  const shouldCircle = hasResolvedFrustration && !hasCurrentFrustration;
  const shouldMark = hasCurrentFrustration || hasResolvedFrustration;

  return shouldCircle ? (
    <View style={styles.checkboxCircleWrapper}>
      <View style={styles.checkbox}>
        <Text style={styles.checkboxMark}>X</Text>
      </View>
    </View>
  ) : (
    <View style={styles.checkbox}>
      {shouldMark && <Text style={styles.checkboxMark}>X</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxMark: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.black,
    lineHeight: 18,
  },
  checkboxCircleWrapper: {
    width: 34,
    height: 34,
    borderWidth: 1.5,
    borderRadius: 17,
    borderColor: colors.black,
    marginRight: 6,
    paddingLeft: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCorrected: {
    borderWidth: 2,
    borderColor: colors.black,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: colors.black,
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
