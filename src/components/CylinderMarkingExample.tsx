import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import exampleCylinderImage from "../../assets/cylinder_marking_diagram.png";
exampleCylinderImage;
type Props = {
  visible: boolean;
  onClose: () => void;
};

const CylinderMarkingExample: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <View style={styles.modalCard}>
      <Text style={styles.subtitle}>
        Example Cylinder Marking (Country of Approval Highlighted)
      </Text>
      <View style={styles.imageWrapper}>
        <Image
          source={exampleCylinderImage}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>USA</Text>
        </View>
      </View>
    </View>
  );
};

export default CylinderMarkingExample;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    transform: "scale(1.2)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 603 / 376,
    position: "relative",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  highlightBox: {
    position: "absolute",
    top: "69.5%",
    left: "42.7%",
    backgroundColor: "#007bff",
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  highlightText: {
    color: "#fff",
    fontWeight: 600,
    fontSize: 6,
  },
  closeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    marginBottom: 12,
    textAlign: "center",
  },
});
