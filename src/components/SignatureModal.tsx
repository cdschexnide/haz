import React, { useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import SignatureScreen, { SignatureViewRef } from "react-native-signature-canvas";

const { width } = Dimensions.get("window");

interface SignatureModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (signature: string) => void;
}

const SignatureModal: React.FC<SignatureModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const ref = useRef<SignatureViewRef>(null);

  const handleOK = (signature: string) => {
    onConfirm(signature);
    onClose(); // Close only after user explicitly submits
  };

  const handleClear = () => {
    ref.current?.clearSignature();
  };

  const handleSubmit = () => {
    ref.current?.readSignature();
  };

  const customStyle = `
    .m-signature-pad--footer { display: none; }
    body,html { background-color: transparent; margin: 0; padding: 0; }
  `;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Sign Below</Text>
          <View style={styles.canvasContainer}>
            <SignatureScreen
              ref={ref}
              onOK={handleOK}
              onClear={handleClear}
              descriptionText=""
              webStyle={customStyle}
              autoClear={false}
            />
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.actionText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.actionText}>Submit Signature</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SignatureModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 12,
  },
  canvasContainer: {
    height: 250,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  actions: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 15,
    color: "#007bff",
    fontWeight: "600",
  },
});
