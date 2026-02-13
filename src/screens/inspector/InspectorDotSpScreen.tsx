import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DocumentScanner, {
  ResponseType,
} from "react-native-document-scanner-plugin";
import { Button, Divider } from "react-native-elements";

const InspectorDotSpScreen = ({ navigation }: { navigation: any }) => {
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<
    boolean | null
  >(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [waiverNumber, setWaiverNumber] = useState("");
  const [waiverDescription, setWaiverDescription] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const { inspection, addDotSpWaiver, removeDotSpWaiver } = useInspectionForm();

  useEffect(() => {
    checkCameraPermission();
  }, []);

  useEffect(() => {
    if (isCameraVisible && !isScanning) {
      scanDocument();
    }
  }, [isCameraVisible]);

  const checkCameraPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "This app needs camera access to scan documents",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        setCameraPermissionGranted(
          granted === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        setCameraPermissionGranted(true);
      }
    } catch (err) {
      console.error("Error checking camera permission:", err);
      setCameraPermissionGranted(false);
    }
  };

  const scanDocument = async () => {
    setIsScanning(true);
    try {
      const { scannedImages } = await DocumentScanner.scanDocument({
        croppedImageQuality: 80,
        maxNumDocuments: 1,
        responseType: ResponseType.ImageFilePath,
      });

      if (scannedImages && scannedImages.length > 0) {
        setCapturedImages(prev => [...prev, ...scannedImages]);

        if (scannedImages.length > 0) {
          Alert.alert(
            "Document Scanned",
            "Document successfully scanned and cropped.",
            [{ text: "OK" }]
          );
        }
      }
    } catch (error) {
      console.error("Document scanning error:", error);
      Alert.alert(
        "Scanning Failed",
        "There was an error while scanning the document. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsScanning(false);
      setIsCameraVisible(false);
    }
  };

  const convertImagesToPdf = async () => {
    if (capturedImages.length === 0) {
      Alert.alert(
        "No Images",
        "Please capture at least one image before creating a PDF."
      );
      return;
    }
    if (!waiverNumber) {
      Alert.alert(
        "Missing Information",
        "Please enter a DOT-SP waiver number."
      );
      return;
    }

    setIsProcessingPdf(true);
    try {
      const pagesHtml = await Promise.all(
        capturedImages.map(async imgUri => {
          const ext = imgUri.toLowerCase().endsWith(".png") ? "png" : "jpeg";
          const base64 = await FileSystem.readAsStringAsync(imgUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          return `
            <div style="page-break-after:always;">
              <img
                src="data:image/${ext};base64,${base64}"
                style="width:100%;height:auto;display:block;"
              />
            </div>`;
        })
      );

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head><meta charset="utf-8" /></head>
          <body style="margin:0;padding:0;">
            ${pagesHtml.join("")}
          </body>
        </html>`;

      const { uri: tmpPdf } = await Print.printToFileAsync({
        html: htmlContent,
      });

      const fileName = `DOT-SP_${Date.now()}.pdf`;
      const newUri = FileSystem.documentDirectory + fileName;
      await FileSystem.copyAsync({ from: tmpPdf, to: newUri });

      const base64Pdf = await FileSystem.readAsStringAsync(newUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const entry = {
        uri: newUri,
        base64Data: base64Pdf,
        waiverNumber,
        description: waiverDescription,
        agency: "DOT",
      };

      addDotSpWaiver(entry);

      Alert.alert("Success", "DOT-SP waiver document saved.");
      setCapturedImages([]);
      setWaiverNumber("");
      setWaiverDescription("");
      setIsCameraVisible(false);
    } catch (err) {
      console.error("PDF generation failed:", err);
      Alert.alert("Error", "Failed to generate PDF. Please try again.");
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const deleteDocument = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this document?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeDotSpWaiver(id),
        },
      ]
    );
  };

  const handleSaveAndContinue = () => {
    const dotSpWaivers = inspection.dotSpWaivers || [];

    if (dotSpWaivers.length === 0) {
      Alert.alert(
        "Document Required",
        "Upload at least one DOT-SP document before continuing."
      );
      return;
    }

    const latestWaiver = dotSpWaivers[dotSpWaivers.length - 1];
    const referenceNumber =
      typeof latestWaiver?.waiverNumber === "string"
        ? latestWaiver.waiverNumber.trim()
        : "";

    if (!referenceNumber) {
      Alert.alert(
        "Missing Reference Number",
        "The latest DOT-SP document is missing a reference number."
      );
      return;
    }

    navigation.goBack();
  };

  const removeImage = (index: number) => {
    setCapturedImages(capturedImages.filter((_, i) => i !== index));
  };

  const renderScanner = () => (
    <View style={styles.scannerContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={styles.scannerOverlay}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.scannerText}>Scanning document...</Text>
        <TouchableOpacity
          style={styles.cancelScanButton}
          onPress={() => setIsCameraVisible(false)}
        >
          <Text style={styles.cancelScanText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cameraPermissionGranted === null) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={styles.permissionText}>
          Checking camera permissions...
        </Text>
      </SafeAreaView>
    );
  }

  if (cameraPermissionGranted === false) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
        <MaterialCommunityIcons name="camera-off" size={64} color="#e53935" />
        <Text style={styles.errorText}>Camera permission is required</Text>
        <Text style={styles.permissionSubtext}>
          This app needs camera access to scan your documents
        </Text>
        <Button
          title="Grant Permission"
          onPress={checkCameraPermission}
          buttonStyle={styles.permissionButton}
          containerStyle={styles.permissionButtonContainer}
          icon={
            <Ionicons
              name="camera"
              size={20}
              color="white"
              style={{ marginRight: 10 }}
            />
          }
        />
      </SafeAreaView>
    );
  }

  const renderCapturedImages = () => (
    <View style={styles.capturedImagesContainer}>
      <View style={styles.sectionHeaderContainer}>
        <MaterialCommunityIcons
          name="image-multiple"
          size={20}
          color="#1a73e8"
        />
        <Text style={styles.sectionHeader}>
          Captured Images ({capturedImages.length})
        </Text>
      </View>

      {capturedImages.length > 0 ? (
        <FlatList
          data={capturedImages}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageGalleryContainer}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item }} style={styles.thumbnailImage} />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageNumber}>Page {index + 1}</Text>
                <TouchableOpacity
                  style={styles.deleteImageButton}
                  onPress={() => removeImage(index)}
                >
                  <MaterialIcons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyImagesContainer}>
          <MaterialCommunityIcons name="image-off" size={40} color="#9e9e9e" />
          <Text style={styles.noImagesText}>No images captured yet</Text>
          <Text style={styles.noImagesSubText}>
            Tap the scan button to capture document images
          </Text>
        </View>
      )}
    </View>
  );

  const renderDocuments = () => {
    const dotSpWaivers = inspection.dotSpWaivers || [];

    return (
      <View style={styles.documentsContainer}>
        <View style={styles.sectionHeaderContainer}>
          <MaterialIcons name="folder" size={20} color="#1a73e8" />
          <Text style={styles.sectionHeader}>DOT Special Permit</Text>
        </View>

        <Divider style={styles.divider} />

        {dotSpWaivers.length > 0 ? (
          dotSpWaivers.map((doc: any) => (
            <View key={doc.id} style={styles.documentCard}>
              <View style={styles.documentInfo}>
                <View style={styles.documentIconContainer}>
                  <MaterialIcons name="description" size={24} color="#1a73e8" />
                </View>
                <View style={styles.documentDetails}>
                  <Text style={styles.documentName}>
                    DOT-SP {doc.waiverNumber}
                  </Text>
                  <Text style={styles.documentDescription}>
                    {doc.description || "No description"}
                  </Text>
                  <Text style={styles.documentAgency}>
                    Agency: {doc.agency || "DOT"}
                  </Text>
                  <Text style={styles.documentDate}>
                    {new Date(doc.dateAdded).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteDocButton}
                onPress={() => deleteDocument(doc.id)}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={22}
                  color="#e53935"
                />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyDocContainer}>
            <Text style={styles.noDocumentsText}>
              No DOT Special Permit added
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isCameraVisible ? "light-content" : "dark-content"}
      />

      {isCameraVisible ? (
        renderScanner()
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>DOT Special Permit Scanner</Text>
            <Text style={styles.headerSubtitle}>
              Scan Department of Transportation Special Permit waiver documents
            </Text>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.infoBox}>
              <View style={styles.infoTitleContainer}>
                <MaterialIcons name="info-outline" size={18} color="#1a73e8" />
                <Text style={styles.infoTitle}>About DOT Special Permits</Text>
              </View>
              <Text style={styles.infoText}>
                <Text style={{ fontWeight: "bold" }}>DOT Special Permits:</Text>{" "}
                Department of Transportation Special Permits allow for
                transportation of hazardous materials in a manner that may vary
                from standard regulations under specific conditions.
              </Text>
            </View>

            <View style={styles.documentNameContainer}>
              <View style={styles.sectionHeaderContainer}>
                <MaterialIcons name="label" size={20} color="#1a73e8" />
                <Text style={styles.sectionHeader}>
                  DOT Special Permit Reference Number
                </Text>
              </View>

              <TextInput
                style={styles.documentNameInput}
                placeholder="Enter DOT special permit reference number"
                value={waiverNumber}
                onChangeText={setWaiverNumber}
                placeholderTextColor="#9e9e9e"
              />
            </View>

            <View style={styles.documentNameContainer}>
              <View style={styles.sectionHeaderContainer}>
                <MaterialIcons name="business" size={20} color="#1a73e8" />
                <Text style={styles.sectionHeader}>Approval Agency</Text>
              </View>

              <View style={styles.uneditableInputContainer}>
                <Text style={styles.uneditableInputText}>DOT</Text>
              </View>
            </View>

            {renderCapturedImages()}

            <View style={styles.actionsContainer}>
              <Button
                title="Scan Document"
                icon={
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                }
                buttonStyle={styles.captureImagesButton}
                titleStyle={styles.buttonText}
                onPress={() => setIsCameraVisible(true)}
                containerStyle={styles.actionButtonContainer}
              />

              <Button
                title="Create PDF"
                icon={
                  <MaterialIcons
                    name="picture-as-pdf"
                    size={22}
                    color="white"
                    style={{ marginRight: 8 }}
                  />
                }
                buttonStyle={[
                  styles.createPdfButton,
                  (capturedImages.length === 0 || !waiverNumber) &&
                    styles.disabledButton,
                ]}
                titleStyle={styles.buttonText}
                disabled={
                  capturedImages.length === 0 ||
                  !waiverNumber ||
                  isProcessingPdf
                }
                loading={isProcessingPdf}
                onPress={convertImagesToPdf}
                containerStyle={styles.actionButtonContainer}
                loadingProps={{ color: "white" }}
              />
            </View>

            {renderDocuments()}
          </ScrollView>

          <View style={styles.bottomButtonsContainer}>
            <Button
              title="Cancel"
              type="outline"
              buttonStyle={styles.cancelButton}
              titleStyle={styles.cancelButtonText}
              onPress={() => navigation.goBack()}
              containerStyle={styles.bottomButtonContainer}
            />

            <Button
              title="Save & Continue"
              buttonStyle={styles.continueButton}
              titleStyle={styles.buttonText}
              onPress={handleSaveAndContinue}
              containerStyle={styles.bottomButtonContainer}
              icon={
                <MaterialIcons
                  name="arrow-forward"
                  size={20}
                  color="white"
                  style={{ marginLeft: 8 }}
                />
              }
              iconRight
            />
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default InspectorDotSpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    color: "#4a4a4a",
    marginTop: 16,
    textAlign: "center",
  },
  permissionSubtext: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
    maxWidth: "80%",
  },
  permissionButtonContainer: {
    width: "60%",
    marginTop: 16,
  },
  permissionButton: {
    backgroundColor: "#1a73e8",
    paddingVertical: 12,
    borderRadius: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a73e8",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#757575",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  infoBox: {
    backgroundColor: "#e8f0fe",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#1a73e8",
  },
  infoTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
    color: "#1a73e8",
  },
  infoText: {
    fontSize: 14,
    color: "#4a4a4a",
    marginBottom: 8,
    lineHeight: 20,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
    color: "#4a4a4a",
  },
  documentNameContainer: {
    marginBottom: 24,
  },
  documentNameInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "white",
    color: "#4a4a4a",
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
    paddingTop: 14,
  },
  capturedImagesContainer: {
    marginBottom: 24,
  },
  imageGalleryContainer: {
    paddingVertical: 8,
  },
  imageContainer: {
    width: 120,
    height: 160,
    borderRadius: 10,
    marginRight: 12,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  imageNumber: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  deleteImageButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(229, 57, 53, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImagesContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  noImagesText: {
    fontSize: 16,
    color: "#4a4a4a",
    fontWeight: "600",
    marginTop: 12,
  },
  noImagesSubText: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    marginTop: 8,
    maxWidth: "80%",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 12,
  },
  actionButtonContainer: {
    flex: 1,
  },
  captureImagesButton: {
    backgroundColor: "#1a73e8",
    paddingVertical: 14,
    borderRadius: 8,
  },
  createPdfButton: {
    backgroundColor: "#e53935",
    paddingVertical: 14,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#bdbdbd",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 15,
  },
  documentsContainer: {
    marginBottom: 24,
  },
  divider: {
    backgroundColor: "#e0e0e0",
    height: 1,
    marginBottom: 16,
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  documentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
  },
  documentDetails: {
    marginLeft: 12,
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a4a4a",
  },
  documentDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  documentAgency: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
  documentDate: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
  deleteDocButton: {
    padding: 8,
  },
  emptyDocContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
  },
  noDocumentsText: {
    fontSize: 14,
    color: "#757575",
    fontStyle: "italic",
    textAlign: "center",
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 12,
  },
  bottomButtonContainer: {
    flex: 1,
  },
  cancelButton: {
    borderColor: "#1a73e8",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#1a73e8",
    fontWeight: "600",
    fontSize: 15,
  },
  continueButton: {
    backgroundColor: "#1a73e8",
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#e53935",
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  scannerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 16,
    textAlign: "center",
  },
  cancelScanButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "rgba(229, 57, 53, 0.8)",
    borderRadius: 8,
  },
  cancelScanText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  uneditableInputContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#f0f0f0",
  },
  uneditableInputText: {
    fontSize: 16,
    color: "#4a4a4a",
    fontWeight: "600",
  },
});
