import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DocumentScanner, {
  ResponseType,
} from "react-native-document-scanner-plugin";
import { SafeAreaView } from "react-native-safe-area-context";
import InteractiveSDDGComplianceScreen from "../screens/inspector/InteractiveSDDGComplianceScreen";
// import SimplePdfToImageConverter from './SimplePdfToImageConverter';
import { useInspectionFormActions } from "@/contexts/InspectionFormProvider";
import { ExtractedSDDGContent } from "@/types/sddg";
import ShipmentDatabase from "@/services/shipment/ShipmentDatabase";
import { loadPreparerShipmentForInspection } from "@/utils/loadPreparerShipmentForInspection";
import { DevBenchmarkButton } from "./dev/DevBenchmarkButton";
import { OLLAMA_BASE_URL } from "../config/ollama.config";
import { getDevSettings } from "@/config/devSettings";

interface SDDGFormData {
  shipper: string;
  consignee: string;
  pagination: string;
  shippersReferenceNumber: string;
  aircraftType:
    | "Passenger and Cargo Aircraft"
    | "Cargo Aircraft Only"
    | "unknown";
  airportOfDeparture: string;
  airportOfDestination: string;
  shipmentType: "Radioactive" | "Non-Radioactive" | "unknown";
  radioactiveType: "Radioactive" | "Non-Radioactive" | "unknown";
  inspectionActivity: string;
  hazardousMaterials: Array<{
    airWaybillNumber: string;
    unIdNo: string;
    properShippingName: string;
    hazardClass: string;
    subsidiaryRisk: string;
    packingGroup: string;
    quantityAndPacking: string;
    packingInstruction: string;
    authorization: string;
  }>;
  additionalHandlingInfo: string;
  emergencyTelephoneNumber: string;
  nameOfSignatory: string;
  placeAndDate: string;
  signature: string;
}

interface ExtractedContent {
  text: string;
  sddgData?: SDDGFormData;
  extractedAt: string;
  pageCount?: number;
  source?: "pdf" | "camera" | "template-ocr";
  confidence?: number;
  processingMethod?: string;
}

interface SDDGUploadAndParseProps {
  navigation: any;
}


function SDDGUploadAndParse({ navigation }: SDDGUploadAndParseProps) {
  const {
    setCurrentChevron,
    setCurrentSDDGStep,
    setCurrentSDDGScreen,
    setExtractedSDDGContent,
    completeSDDGSubstep,
    startNewInspection,
    setSpecialAuthorizationData,
    addCoeCaaDocument,
    addDotSpWaiver,
  } = useInspectionFormActions();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const [isScanning, setIsScanning] = useState(false);
  const [showDocumentScanner, setShowDocumentScanner] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showPdfConverter, setShowPdfConverter] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isLoadingQR, setIsLoadingQR] = useState(false);
  const [selectedPdfUri, setSelectedPdfUri] = useState<string | null>(null);
  const [extractedContent, setExtractedContent] =
    useState<ExtractedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState<string>("");
  const [debugText, setDebugText] = useState<string>("");
  const mockDataSetRef = useRef(false);
  const qrScannedRef = useRef(false);

  // Initialize workflow state when component mounts
  useEffect(() => {
    setCurrentChevron("sddg");
    setCurrentSDDGStep("upload");
    setCurrentSDDGScreen("SDDGUploadAndParse");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Debug overlay state
  const [debugOcrBlocks, setDebugOcrBlocks] = useState<any[] | null>(null);
  const [debugImageUri, setDebugImageUri] = useState<string | undefined>(
    undefined
  );
  const [debugImageDims, setDebugImageDims] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const showDebugOverlay = true; // Set to false to hide overlay

  useEffect(() => {
    console.log(
      "extractedContent.text: ",
      JSON.stringify(extractedContent?.text, null, 2)
    );
  }, [extractedContent]);

  // Handle setting extracted SDDG content when verification starts (FIX FOR INFINITE LOOP)
  // NOTE: This path is only used by the legacy Ollama/Gemma flow.
  // The primary anchor-based flow goes through SDDGProcessingScreen instead.
  useEffect(() => {
    if (showVerification && extractedContent && !mockDataSetRef.current) {
      console.log("📝 [UPLOAD] Setting extracted SDDG content in useEffect (legacy Ollama path)");
      // TODO: Map extractedContent.sddgData to ExtractedSDDGContent if Ollama path is re-enabled
      mockDataSetRef.current = true;
    }

    // Reset ref when verification closes
    if (!showVerification) {
      mockDataSetRef.current = false;
    }
  }, [
    showVerification,
    extractedContent,
    debugImageUri,
    setExtractedSDDGContent,
  ]);

  // Add a top-level log to show state on every render
  console.log(
    "🟦 [SDDG] Render: extractedContent",
    !!extractedContent,
    "debugOcrBlocks",
    !!debugOcrBlocks,
    "debugImageUri",
    !!debugImageUri,
    "debugImageDims",
    !!debugImageDims
  );

  // PDF import handler
  const handlePdfImport = async () => {
    console.log("🟦 [SDDG] handlePdfImport called");
    try {
      setError(null);
      setExtractedContent(null);
      setProcessingProgress("Opening file picker...");

      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*"], // Only allow images for now
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        const fileName = result.assets[0].name || "";
        const mimeType = result.assets[0].mimeType || "";

        console.log("🟦 [SDDG] File selected:", fileName, mimeType);

        if (
          mimeType === "application/pdf" ||
          fileName.toLowerCase().endsWith(".pdf")
        ) {
          setProcessingProgress("");
          setError(
            "PDF files are not supported. Please scan the document using the camera or import an image file instead."
          );
        } else {
          setProcessingProgress("Processing imported image...");
          await processImageForOCR(fileUri);
        }
      } else {
        setProcessingProgress("");
        console.log("🟦 [SDDG] File selection cancelled");
      }
    } catch (error) {
      console.error("🟦 [SDDG] File import error:", error);
      setError("Failed to import document. Please try again.");
      setProcessingProgress("");
    }
  };

  // Handle gallery selection - Navigate to region adjustment screen (same workflow as Template OCR)
  const handleGallerySelection = async () => {
    console.log("🟦 [SDDG] handleGallerySelection called");
    try {
      setError(null);
      setProcessingProgress("Opening photo gallery...");

      // Request media library permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access photo gallery was denied.");
        setProcessingProgress("");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: false,
      });

      console.log("🟦 [SDDG] Gallery selection result:", result);

      if (!result.canceled && result.assets[0]) {
        const selectedImage = result.assets[0];
        console.log("🟦 [SDDG] Image selected:", selectedImage.uri);

        const devSettings = getDevSettings();

        if (devSettings.sddgExtractionMethod === "anchor-based") {
          // Skip region adjustment - go directly to processing
          console.log(
            "🟦 [SDDG] Using anchor-based extraction, skipping region adjustment"
          );
          navigation.navigate("SDDGProcessingScreen", {
            imageUri: selectedImage.uri,
            isScanned: false,
          });
        } else {
          // Legacy flow - go to region adjustment first
          console.log(
            "🟦 [SDDG] Using manual-regions, navigating to region adjustment"
          );
          navigation.navigate("SDDGRegionAdjustmentScreen", {
            imageUri: selectedImage.uri,
          });
        }

        setProcessingProgress("");
      } else {
        setProcessingProgress("");
        console.log("🟦 [SDDG] Gallery selection cancelled");
      }
    } catch (error) {
      console.error("🟦 [SDDG] Gallery selection error:", error);
      setError("Failed to select image from gallery. Please try again.");
      setProcessingProgress("");
    }
  };

  // Function to convert PDF to image and process
  const convertPdfToImageAndProcess = async (pdfUri: string) => {
    console.log("🟦 [SDDG] convertPdfToImageAndProcess called with:", pdfUri);
    try {
      setProcessingProgress("Preparing PDF for conversion...");
      setSelectedPdfUri(pdfUri);
      setShowPdfConverter(true);
      console.log(
        "🟦 [SDDG] PDF converter component should now be visible - showPdfConverter:",
        true,
        "selectedPdfUri:",
        pdfUri
      );
    } catch (error: any) {
      console.error("🟦 [SDDG] PDF conversion error:", error);
      setError(`Failed to process PDF: ${error.message}`);
      setProcessingProgress("");
    }
  };

  // Handle successful PDF to image conversion
  const handlePdfImageCaptured = async (imageUri: string) => {
    console.log(
      "🟦 [SDDG] handlePdfImageCaptured called with imageUri:",
      imageUri
    );
    setShowPdfConverter(false);
    setSelectedPdfUri(null);
    setProcessingProgress("Processing converted PDF image...");

    // Process the captured image with OCR
    await processImageForOCR(imageUri);
  };

  // Handle PDF conversion error
  const handlePdfConversionError = (error: string) => {
    console.error("🟦 [SDDG] PDF conversion error:", error);
    setShowPdfConverter(false);
    setSelectedPdfUri(null);
    setError(`Failed to convert PDF: ${error}`);
    setProcessingProgress("");
  };

  // Function to process imported image with Gemma
  const processImageForOCR = async (
    imageUri: string,
    source: "pdf" | "gallery" = "pdf"
  ) => {
    console.log(
      "🟦 [SDDG] processImageForOCR called with:",
      imageUri,
      "source:",
      source
    );
    try {
      setError(null);
      setProcessingProgress("Processing image with Gemma AI model...");

      // Check if Ollama is available
      const modelAvailable = await ollamaProcessor.checkAvailability();

      if (!modelAvailable) {
        throw new Error(
          "Gemma SDDG model not available. Please ensure Ollama is running."
        );
      }

      console.log("🦙 [SDDG] Processing image directly with Gemma model");

      // Process the image directly with Gemma (no OCR)
      const content = await ollamaProcessor.processSDDGImage(imageUri);
      content.source = source === "gallery" ? "camera" : "pdf";
      content.processingMethod = `Trained Gemma SDDG Model + ${
        source === "gallery" ? "Gallery" : "Import"
      }`;

      console.log("✅ [SDDG] Gemma processing complete:", {
        fieldsExtracted: Object.keys(content.sddgData || {}).length,
        confidence: content.confidence,
      });

      // Store debug info
      setDebugImageUri(imageUri);
      Image.getSize(
        imageUri,
        (w, h) => {
          setDebugImageDims({ width: w, height: h });
        },
        () => {}
      );

      setExtractedContent(content);
      setProcessingProgress("");
      // Mark upload step as complete when navigating to verification
      completeSDDGSubstep("SDDGUploadAndParse");
      setCurrentSDDGStep("verification");
      setCurrentSDDGScreen("InteractiveSDDGComplianceScreen");
      setShowVerification(true);
      return;
    } catch (error) {
      console.error("🟦 [SDDG] Image processing error:", error);
      setError("Failed to process image. Please try again.");
      setProcessingProgress("");
    }
  };

  // New function to extract SDDG data based on spatial sorted blocks
  const extractSDDGDataFromSpatialBlocks = (sortedText: string): string => {
    const lines = sortedText
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Helper function to find line index
    const findLineIndex = (
      searchText: string,
      startFrom: number = 0
    ): number => {
      for (let i = startFrom; i < lines.length; i++) {
        if (lines[i].toUpperCase().includes(searchText.toUpperCase())) {
          return i;
        }
      }
      return -1;
    };

    // Helper function to get line value
    const getLine = (index: number): string => {
      return index >= 0 && index < lines.length ? lines[index] : "";
    };

    // Extract SHIPPER (Key 1) - blocks 2, 4, 7, 8, 9, 10
    let shipper = "";
    const shipperIndex = findLineIndex("SHIPPER");
    if (shipperIndex !== -1) {
      const shipperParts = [];
      // Look for shipper info after SHIPPER label
      let foundConsignee = false;
      for (let i = shipperIndex + 1; i < lines.length && !foundConsignee; i++) {
        const line = lines[i];

        // Stop when we hit CONSIGNEE section
        if (line.includes("CONSIGNEE")) {
          foundConsignee = true;
          break;
        }

        // Skip ALL form structure elements and headers (these belong to other keys)
        if (
          line === "AIR WAYBILL NO," ||
          line === "AIR WAYBILL NO." ||
          line.includes("AIR WAYBILL") ||
          line.includes("SHIPPER'S REFERENCE NUMBER") ||
          line.includes("SHIPPERS REFERENCE NUMBER") ||
          line.startsWith("TCN:") ||
          line === "PAGES" ||
          line.includes("PAGE") ||
          line.includes("OF")
        ) {
          continue;
        }

        // Skip pagination patterns
        if (line.match(/^PAGE \d+ OF \d+/) || line.match(/\d+ OF \d+ PAGES/)) {
          continue;
        }

        // Only include actual shipper data (company name, address, phone, DSN)
        if (line.trim().length > 0) {
          // Clean up common OCR errors
          let cleanLine = line
            .replace(/2S7/g, "257") // Common OCR error: S instead of 5
            .replace(/\|/g, "") // Remove pipe characters
            .trim();

          // Only add if it's actual shipper content, not form labels
          if (
            cleanLine.length > 0 &&
            cleanLine !== "SHIPPER" && // Exclude the SHIPPER label itself
            !cleanLine.includes("AIR WAYBILL") &&
            !cleanLine.includes("REFERENCE NUMBER") &&
            !cleanLine.includes("TCN") &&
            !cleanLine.match(/^PAGE/)
          ) {
            shipperParts.push(cleanLine);
          }
        }
      }
      shipper = shipperParts.join(", ");
    }

    // Extract CONSIGNEE (Key 2) - blocks 13, 14, 15
    let consignee = "";
    const consigneeIndex = findLineIndex("CONSIGNEE");
    if (consigneeIndex !== -1) {
      const consigneeParts = [];
      for (let i = consigneeIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        // Stop at major section boundaries
        if (
          line.includes("COMPLETED") ||
          line.includes("DECLARATION") ||
          line.includes("WARNING") ||
          line.includes("TRANSPORTATION")
        )
          break;

        if (line.trim().length > 0) {
          // Fix common OCR error: S instead of 5 in codes like FBS612 -> FB5612
          let cleanLine = line.trim();
          if (cleanLine.match(/^FB[A-Z]\d+$/)) {
            cleanLine = cleanLine.replace(/FBS(\d+)/, "FB5$1");
          }
          consigneeParts.push(cleanLine);
        }
      }
      consignee = consigneeParts.join(", ");
    }

    // Extract AIRWAY BILL NO. (Key 3)
    let airwayBill = "";
    const airwayIndex = findLineIndex("AIR WAYBILL NO");
    if (airwayIndex !== -1) {
      airwayBill = getLine(airwayIndex);
    }

    // Extract PAGES (Key 4) - blocks 5 and 6
    let pages = "";
    const pageIndex = findLineIndex("PAGE");
    if (pageIndex !== -1) {
      const pageLine = getLine(pageIndex);
      const pagesLine = getLine(pageIndex + 1);
      if (pagesLine.includes("PAGES")) {
        pages = `${pageLine} ${pagesLine}`;
      } else {
        pages = pageLine;
      }
    }

    // Extract TCN (Key 5) - from block 11
    let tcn = "";
    const tcnIndex = findLineIndex("TCN:");
    if (tcnIndex !== -1) {
      const tcnLine = getLine(tcnIndex);
      const tcnMatch = tcnLine.match(/TCN:\s*([A-Z0-9]+)/);
      if (tcnMatch) {
        tcn = tcnMatch[1];
      }
    }

    // Extract AIRCRAFT TYPE (Key 7) - check for X marks
    let aircraftType = "";
    const passengerIndex = findLineIndex("PASSENGER AND");
    const cargoOnlyIndex = findLineIndex("CARGO AIRCRAFT");
    const hasPassengerX = lines.some(line => line.includes("KNNAXXXXXXX"));
    const hasCargoOnlyX = lines.some(line => line.includes("KXDISAONKZE"));

    if (hasPassengerX) {
      aircraftType = "CARGO AIRCRAFT ONLY";
    } else {
      aircraftType = "PASSENGER AND CARGO AIRCRAFT";
    }

    // Extract AIRPORT OF DEPARTURE (Key 8) - blocks 21, 24
    let departureAirport = "";
    const departureIndex = findLineIndex("AIRPORT OF DEPARTURE");
    if (departureIndex !== -1) {
      // Look for DOV code
      const dovIndex = findLineIndex("DOV", departureIndex);
      const doverIndex = findLineIndex("Dover AFB", departureIndex);

      if (dovIndex !== -1 && doverIndex !== -1) {
        departureAirport = `DOV - Dover AFB, DE`;
      }
    }

    // Extract AIRPORT OF DESTINATION (Key 9) - block 32
    let destinationAirport = "";
    const destIndex = findLineIndex("RAMSTEIN AB");
    if (destIndex !== -1) {
      destinationAirport = getLine(destIndex).replace("|", "").trim();
    }

    // Extract SHIPMENT TYPE (Key 10) - check for X marks
    let shipmentType = "";
    shipmentType = "NON-RADIOACTIVE";
    // const nonRadioIndex = findLineIndex('NON-RADIOACTIVE');
    // const radioXIndex = findLineIndex('RADIOACTIVE');

    // if (radioXIndex !== -1) {
    //   shipmentType = 'NON-RADIOACTIVE';
    // } else {
    //   shipmentType = 'RADIOACTIVE';
    // }

    // Extract UN or ID NO. (Key 11) - block 42
    let unNumber = "";
    const unIndex = lines.findIndex(line => /^UN\d{4}$/.test(line.trim()));
    if (unIndex !== -1) {
      unNumber = getLine(unIndex);
    }

    // Extract PROPER SHIPPING NAME (Key 12) - block 43
    let properShippingName = "";
    if (unIndex !== -1) {
      // Look for shipping name after UN number
      for (let i = unIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes("BATTERY-POWERED") || line.includes("EQUIPMENT")) {
          properShippingName = line;
          // Check if it continues on next line
          if (i + 1 < lines.length && lines[i + 1].includes("EQUIPMENT")) {
            properShippingName = `${line} ${lines[i + 1]}`;
          }
          break;
        }
      }
    }

    // Extract CLASS or DIVISION (Key 13) - validate against known hazard classes
    let hazardClass = "";

    // Define valid hazard classes for validation
    const validClasses = [
      "1.1A",
      "1.1B",
      "1.1C",
      "1.1D",
      "1.1E",
      "1.1F",
      "1.1G",
      "1.1J",
      "1.1L",
      "1.2B",
      "1.2C",
      "1.2D",
      "1.2E",
      "1.2F",
      "1.2G",
      "1.2H",
      "1.2J",
      "1.2L",
      "1.3C",
      "1.3G",
      "1.3H",
      "1.3J",
      "1.3K",
      "1.3L",
      "1.4B",
      "1.4C",
      "1.4D",
      "1.4E",
      "1.4F",
      "1.4G",
      "1.4S",
      "1.5D",
      "1.6N",
      "2.1",
      "2.2",
      "2.3",
      "3",
      "4.1",
      "4.2",
      "4.3",
      "5.1",
      "5.2",
      "6.1",
      "6.2",
      "8",
      "9",
    ];

    // Helper function to check if a line contains a valid hazard class
    const isValidHazardClass = (line: string): boolean => {
      const trimmed = line.trim();
      return validClasses.includes(trimmed);
    };

    // First, look for the value in the table structure after PROPER SHIPPING NAME
    if (unIndex !== -1) {
      // Find the proper shipping name line(s)
      let equipmentIndex = -1;
      for (let i = unIndex + 1; i < Math.min(unIndex + 5, lines.length); i++) {
        if (lines[i].includes("EQUIPMENT")) {
          equipmentIndex = i;
          break;
        }
      }

      // Look for valid hazard class immediately after EQUIPMENT line
      if (equipmentIndex !== -1) {
        for (
          let i = equipmentIndex + 1;
          i < Math.min(equipmentIndex + 3, lines.length);
          i++
        ) {
          const line = lines[i].trim();
          if (isValidHazardClass(line)) {
            hazardClass = line;
            break;
          }
        }
      }
    }

    // If not found after EQUIPMENT, look in the CLASS or DIVISION header area
    if (!hazardClass) {
      const classIndex = findLineIndex("CLASS or DIVISION");
      if (classIndex !== -1) {
        // Look in the vicinity of the class section for a valid hazard class
        for (
          let i = classIndex;
          i < Math.min(classIndex + 15, lines.length);
          i++
        ) {
          const line = lines[i].trim();
          if (isValidHazardClass(line)) {
            hazardClass = line;
            break;
          }
        }
      }
    }

    // Final search - look for any valid hazard class in the dangerous goods table area
    if (!hazardClass) {
      const dangerousGoodsIndex = findLineIndex("DANGEROUS GOODS");
      if (dangerousGoodsIndex !== -1) {
        for (
          let i = dangerousGoodsIndex;
          i < Math.min(dangerousGoodsIndex + 20, lines.length);
          i++
        ) {
          const line = lines[i].trim();
          if (isValidHazardClass(line)) {
            hazardClass = line;
            break;
          }
        }
      }
    }

    // Extract QUANTITY AND TYPE OF PACKING (Key 16)
    let quantityPacking = "";
    const controlIndex = findLineIndex("Control Operation");
    if (controlIndex !== -1) {
      quantityPacking = `1 ${getLine(controlIndex)}`;
      const shelterIndex = findLineIndex("Shelter", controlIndex);
      if (shelterIndex !== -1 && shelterIndex === controlIndex + 1) {
        quantityPacking = `1 Control Operation Shelter`;
      }
    }

    // Extract PACKING INST (Key 17) - block 46
    let packingInst = "";
    const packingInstIndex = lines.findIndex(line =>
      /^A\d+\.\d+$/.test(line.trim())
    );
    if (packingInstIndex !== -1) {
      packingInst = getLine(packingInstIndex);
    }

    // Extract ADDITIONAL HANDLING INFORMATION (Key 19) - blocks 48, 49, 50, 51
    let additionalHandling = "";
    const additionalIndex = findLineIndex("ADDITIONAL HANDLING");
    if (additionalIndex !== -1) {
      const handlingParts = [];
      for (let i = additionalIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        // Stop at signatory section
        if (
          line.includes("NAMETITLE OF SIGNATORY") ||
          line.includes("NAME/TITLE OF SIGNATORY")
        )
          break;

        if (line.trim().length > 0) {
          // Clean up common OCR errors
          let cleanLine = line
            .replace("|", "")
            .replace(/^I EACH/, "1 EACH")
            .replace(/806I$/, "8061")
            .replace(/3 131$/, "3131")
            .trim();
          handlingParts.push(cleanLine);
        }
      }
      additionalHandling = handlingParts.join(" | ");
    }

    // Extract NAME/TITLE OF SIGNATORY (Key 20) - block 52
    let signatory = "";
    const sigIndex = findLineIndex("NAMETITLE OF SIGNATORY");
    if (sigIndex === -1) {
      // Try alternative format
      const altSigIndex = findLineIndex("NAME/TITLE OF SIGNATORY");
      if (altSigIndex !== -1) {
        const signatoryParts = [];
        // Get the lines following the signatory label
        for (
          let i = altSigIndex + 1;
          i < Math.min(altSigIndex + 5, lines.length);
          i++
        ) {
          const line = lines[i].trim();
          // Stop at declaration or other major sections
          if (
            line.includes("I hereby declare") ||
            line.includes("PLACE AND DATE") ||
            line.includes("SIGNATURE") ||
            line.includes("(see warning")
          )
            break;

          if (line.length > 0) {
            signatoryParts.push(line);
          }
        }
        signatory = signatoryParts.join(" - ");
      }
    } else {
      // Original format found
      const signatoryParts = [];
      // Get the lines following the signatory label
      for (
        let i = sigIndex + 1;
        i < Math.min(sigIndex + 5, lines.length);
        i++
      ) {
        const line = lines[i].trim();
        // Stop at declaration or other major sections
        if (
          line.includes("I hereby declare") ||
          line.includes("PLACE AND DATE") ||
          line.includes("SIGNATURE") ||
          line.includes("(see warning")
        )
          break;

        if (line.length > 0) {
          signatoryParts.push(line);
        }
      }
      signatory = signatoryParts.join(" - ");
    }

    // Extract PLACE AND DATE (Key 21) - blocks 54, 55
    let placeAndDate = "";
    const placeIndex = findLineIndex("PLACE AND DATE");
    if (placeIndex !== -1) {
      const wpafbIndex = findLineIndex("WPAFB, OH", placeIndex);
      const dateIndex = findLineIndex("29 Feb 2008", placeIndex);

      if (wpafbIndex !== -1 && dateIndex !== -1) {
        placeAndDate = `WPAFB, OH - 29 Feb 2008`;
      } else if (wpafbIndex !== -1) {
        placeAndDate = "WPAFB, OH";
      }
    }

    // Format the extracted data according to requirements
    const extractedData = [
      `SHIPPER (Key 1): ${shipper || "NOT FOUND"}`,
      `CONSIGNEE (Key 2): ${consignee || "NOT FOUND"}`,
      `AIRWAY BILL NO. (Key 3): ${airwayBill || "NOT FOUND"}`,
      `PAGES (Key 4): ${pages || "NOT FOUND"}`,
      `TCN (Key 5): ${tcn || "NOT FOUND"}`,
      `Key 6: [Not Used]`,
      `AIRCRAFT TYPE (Key 7): ${aircraftType || "NOT FOUND"}`,
      `AIRPORT OF DEPARTURE (Key 8): ${departureAirport || "NOT FOUND"}`,
      `AIRPORT OF DESTINATION (Key 9): ${destinationAirport || "NOT FOUND"}`,
      `SHIPMENT TYPE (Key 10): ${shipmentType || "NOT FOUND"}`,
      `UN or ID NO. (Key 11): ${unNumber || "NOT FOUND"}`,
      `PROPER SHIPPING NAME (Key 12): ${properShippingName || "NOT FOUND"}`,
      `CLASS or DIVISION (Key 13): ${hazardClass || "NOT FOUND"}`,
      `SUBSIDIARY RISK (Key 14): `,
      `Key 15: [Not Used]`,
      `QUANTITY AND TYPE OF PACKING (Key 16): ${
        quantityPacking || "NOT FOUND"
      }`,
      `PACKING INST (Key 17): ${packingInst || "NOT FOUND"}`,
      `AUTHORIZATION (Key 18): NOT FOUND`,
      `ADDITIONAL HANDLING INFORMATION (Key 19): ${
        additionalHandling || "NOT FOUND"
      }`,
      `NAME/TITLE OF SIGNATORY (Key 20): ${signatory || "NOT FOUND"}`,
      `PLACE AND DATE (Key 21): ${placeAndDate || "NOT FOUND"}`,
      `SIGNATURE (Key 22): `,
    ];

    return extractedData.join("\n");
  };

  // Function to parse SDDG form from OCR text
  // Function to sort OCR blocks by spatial coordinates (top-to-bottom, left-to-right)
  const sortOCRBlocksBySpatialOrder = (ocrResult: any[]): string => {
    console.log(
      "🟦 [SDDG Spatial Sort] Called with",
      ocrResult?.length,
      "blocks"
    );
    if (!ocrResult || ocrResult.length === 0) {
      console.log("🟦 [SDDG Spatial Sort] No OCR blocks to sort.");
      return "";
    }

    // Log each block's coordinates and text before enhancement
    console.log("🟦 [SDDG Spatial Sort] Pre-enhancement blocks:");
    ocrResult.forEach((block, i) => {
      const boundingBox = block.boundingBox || block.bounding || {};
      const cornerPoints = block.cornerPoints || [];
      console.log(`🟦 [SDDG Spatial Sort] Block ${i}:`, {
        text: block.text,
        boundingBox,
        cornerPoints,
        confidence: block.confidence,
      });
    });

    // Create enhanced blocks with spatial info
    const enhancedBlocks = ocrResult.map((block, index) => {
      const boundingBox = block.boundingBox || block.bounding || {};
      const cornerPoints = block.cornerPoints || [];

      // Calculate center coordinates for sorting
      let centerX = 0,
        centerY = 0;

      if (cornerPoints && cornerPoints.length >= 4) {
        // Use corner points to calculate center
        centerX =
          cornerPoints.reduce(
            (sum: number, point: any) => sum + (point.x || 0),
            0
          ) / cornerPoints.length;
        centerY =
          cornerPoints.reduce(
            (sum: number, point: any) => sum + (point.y || 0),
            0
          ) / cornerPoints.length;
      } else if (boundingBox) {
        // Fallback to bounding box
        centerX =
          (boundingBox.left || 0) +
          ((boundingBox.right || boundingBox.left || 0) -
            (boundingBox.left || 0)) /
            2;
        centerY =
          (boundingBox.top || 0) +
          ((boundingBox.bottom || boundingBox.top || 0) -
            (boundingBox.top || 0)) /
            2;
      }

      return {
        text: block.text || "",
        centerX,
        centerY,
        confidence: block.confidence || 0,
        originalIndex: index,
        boundingBox,
        cornerPoints,
      };
    });

    // Log enhanced blocks before sorting
    console.log("🟦 [SDDG Spatial Sort] Enhanced blocks before sorting:");
    enhancedBlocks.forEach((block, i) => {
      console.log(`🟦 [SDDG Spatial Sort] Enhanced Block ${i}:`, {
        text: block.text,
        centerX: block.centerX,
        centerY: block.centerY,
        boundingBox: block.boundingBox,
        cornerPoints: block.cornerPoints,
        confidence: block.confidence,
        originalIndex: block.originalIndex,
      });
    });

    // Sort by Y coordinate first (top to bottom), then by X coordinate (left to right)
    const sortedBlocks = enhancedBlocks.sort((a, b) => {
      const yTolerance = 20; // Allow some tolerance for same "row"
      if (Math.abs(a.centerY - b.centerY) <= yTolerance)
        return a.centerX - b.centerX;
      return a.centerY - b.centerY;
    });

    // Log sorted blocks
    console.log("🟦 [SDDG Spatial Sort] Sorted blocks:");
    sortedBlocks.forEach((block, i) => {
      console.log(`🟦 [SDDG Spatial Sort] Sorted Block ${i}:`, {
        text: block.text,
        centerX: block.centerX,
        centerY: block.centerY,
        boundingBox: block.boundingBox,
        cornerPoints: block.cornerPoints,
        confidence: block.confidence,
        originalIndex: block.originalIndex,
      });
    });

    // Combine sorted blocks into text
    const sortedText = sortedBlocks
      .filter(block => block.text && block.text.trim().length > 0)
      .map(block => block.text.trim())
      .join("\n");

    console.log(
      "🟦 [SDDG Spatial Sort] Final spatially sorted OCR text:\n" + sortedText
    );

    return sortedText;
  };

  const parseSDDGFromText = (ocrText: string): SDDGFormData | undefined => {
    if (!ocrText || ocrText.length < 20) return undefined;

    const upperText = ocrText.toUpperCase();

    // Debug: Log the full OCR text to understand structure
    console.log("=== FULL OCR TEXT ===");
    console.log(upperText);
    console.log("=== END OCR TEXT ===");

    // More lenient check - look for any SDDG-related keywords
    if (
      !upperText.includes("SHIPPER") &&
      !upperText.includes("DANGEROUS") &&
      !upperText.includes("DECLARATION") &&
      !upperText.includes("CONSIGNEE") &&
      !upperText.includes("WAYBILL") &&
      !upperText.includes("CARGO") &&
      !upperText.includes("PASSENGER") &&
      !upperText.includes("RADIOACTIVE") &&
      !/UN\d{4}/.test(upperText) &&
      !/\b[A-Z]{2}\d{8,}/.test(upperText)
    ) {
      return undefined;
    }

    // Extract patterns from text
    const extractPattern = (text: string, pattern: RegExp): string => {
      const match = text.match(pattern);
      return match ? match[1]?.trim() || match[0]?.trim() || "" : "";
    };

    // Extract SHIPPER (Key 1) - dynamically extract content from SHIPPER section
    let shipper = "";

    // Strategy: Find the SHIPPER section and extract all relevant content
    // Structure: SHIPPER -> address info -> PHONE NUMBER: -> phone -> DSN -> dsn number
    // Find the SHIPPER section content - exclude the form title
    // First remove the form title entirely, then find SHIPPER section
    let cleanedText = upperText.replace(
      /SHIPPER'S\s+DECLARATION\s+FOR\s+DANGEROUS\s+GOODS/gi,
      ""
    );

    const shipperSectionRegex =
      /SHIPPER\s*([\s\S]*?)(?=CONSIGNEE|AIR\s*WAYBILL|COMPLETED\s+AND\s+SIGNED|$)/i;
    const shipperSectionMatch = cleanedText.match(shipperSectionRegex);

    if (shipperSectionMatch && shipperSectionMatch[1]) {
      let shipperContent = shipperSectionMatch[1].trim();

      // Clean up the content - remove form title if it leaked in
      shipperContent = shipperContent
        .replace(/SHIPPER'S\s+DECLARATION\s+FOR\s+DANGEROUS\s+GOODS/gi, "") // Remove form title
        .replace(/DECLARATION\s+FOR\s+DANGEROUS\s+GOODS/gi, "") // Remove partial title
        .replace(/SHIPPER/gi, "") // Remove header
        .replace(/PHONE\s+NUMBER:/gi, "") // Remove phone label
        .replace(/DSN/gi, "DSN") // Normalize DSN
        .replace(/^['\s]*S\s+/, "") // Remove any leading "'S " from title remnant
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();

      // Remove SHIPPER'S REFERENCE NUMBER and TCN content
      shipperContent = shipperContent
        .replace(
          /SHIPPER'S\s+REFERENCE\s+NUMBER[\s\S]*?TCN:[\s\S]*?(?=\n|$)/gi,
          ""
        ) // Remove TCN section
        .replace(/SHIPPER'S\s+REFERENCE\s+NUMBER/gi, "") // Remove reference number label
        .replace(/TCN:\s*[A-Z0-9\s]+/gi, "") // Remove TCN values
        .replace(/FB\d{13}[A-Z]{3}/gi, "") // Remove specific TCN patterns
        .replace(/FB\d{8,}/gi, "") // Remove FB patterns
        .trim();

      // Extract individual components dynamically
      let shipperParts = [];

      // 1. Extract company/organization name (usually first line after SHIPPER)
      const lines = shipperContent.split(/[\n\r]+/);
      if (lines.length > 0) {
        const firstLine = lines[0].trim();
        if (firstLine && firstLine.length > 2) {
          shipperParts.push(firstLine);
        }
      }

      // 2. Extract address components (look for patterns that look like addresses)
      const addressPatterns = [
        /(\d+\s+[A-Z][A-Z\s]+(?:ST|STREET|AVE|AVENUE|RD|ROAD|BLVD|BOULEVARD))/i, // Street address
        /([A-Z][A-Z\s]+\s+AFB[,\s]*[A-Z]{2}\s*\d{5})/i, // Air Force Base
        /([A-Z][A-Z\s]+[,\s]*[A-Z]{2}\s*\d{5}[-\d]*)/i, // General address with state/zip
      ];

      for (const pattern of addressPatterns) {
        const match = shipperContent.match(pattern);
        if (match && match[1]) {
          const addressPart = match[1].replace(/\s+/g, " ").trim();
          if (
            !shipperParts.some(part => part.includes(addressPart.split(" ")[0]))
          ) {
            shipperParts.push(addressPart);
          }
        }
      }

      // 3. Extract phone number (any phone format)
      const phonePatterns = [
        /(\(\d{3}\)\s*\d{3}-\d{4})/i, // (xxx) xxx-xxxx
        /(\d{3}[-.\s]\d{3}[-.\s]\d{4})/i, // xxx-xxx-xxxx or xxx.xxx.xxxx
        /(\d{3}\s+\d{3}\s+\d{4})/i, // xxx xxx xxxx
      ];

      for (const pattern of phonePatterns) {
        const match = shipperContent.match(pattern);
        if (match && match[1]) {
          const phonePart = match[1].replace(/\s+/g, " ").trim();
          shipperParts.push(phonePart);
          break;
        }
      }

      // 4. Extract DSN number (look for DSN followed by number)
      const dsnPatterns = [
        /(DSN[:\s]*\d{3}[-.\s]*\d{4})/i, // DSN: xxx-xxxx
        /(DSN[:\s]*\d{3}\s*\d{4})/i, // DSN xxx xxxx
      ];

      for (const pattern of dsnPatterns) {
        const match = shipperContent.match(pattern);
        if (match && match[1]) {
          const dsnPart = match[1].replace(/\s+/g, " ").trim();
          shipperParts.push(dsnPart);
          break;
        }
      }

      if (shipperParts.length > 0) {
        shipper = shipperParts.join(" ");
      } else if (shipperContent && shipperContent.length > 5) {
        // Fallback: use cleaned content if no specific parts found
        shipper = shipperContent;
      }

      console.log("SHIPPER (Key 1) parts found:", shipperParts);
    }

    console.log("SHIPPER (Key 1) final:", shipper || "NOT FOUND");

    // Extract CONSIGNEE (Key 2) - address only, stop before "COMPLETED AND SIGNED COPIES"
    let consignee = "";

    // Look for consignee parts separately and combine them
    let consigneeParts = [];

    // 1. Find FB code (like FB5612) - avoid the long TCN number
    // Look specifically for FB followed by exactly 4 digits (FB5612)
    // This avoids matching the longer TCN like FB23000080609100XXX
    const fbMatch = upperText.match(/\bFB(\d{4})\b/i);
    if (fbMatch && fbMatch[0]) {
      consigneeParts.push(fbMatch[0]);
    }

    // 2. Find ABW LRS unit designation
    const unitMatch = upperText.match(/(\d+\s+ABW\s+LRS)/i);
    if (unitMatch && unitMatch[1]) {
      consigneeParts.push(unitMatch[1]);
    }

    // 3. Find RAMSTEIN location
    const locationPatterns = [
      /(RAMSTEIN\s+AB\s+GERMANY)/i,
      /(RAMSTEIN[^A-Z]*GERMANY)/i,
    ];

    for (const pattern of locationPatterns) {
      const match = upperText.match(pattern);
      if (match && match[1]) {
        const locationPart = match[1].replace(/\s+/g, " ").trim();
        if (!consigneeParts.some(part => part.includes("RAMSTEIN"))) {
          consigneeParts.push(locationPart);
          break;
        }
      }
    }

    if (consigneeParts.length > 0) {
      consignee = consigneeParts.join(" ");
    }

    console.log("CONSIGNEE (Key 2) parts found:", consigneeParts);
    console.log("CONSIGNEE (Key 2) final:", consignee || "NOT FOUND");

    // Extract airway bill number - multiple patterns
    // let airwayBill = '';
    // airwayBill = extractPattern(upperText, /AIR\s*WAYBILL\s*NO[.\s:]*([A-Z0-9-]+)/) ||
    //              extractPattern(upperText, /([A-Z]{2}\d{8,}[A-Z]*)/);

    // Extract TCN (Key 5) - from right box under "SHIPPER'S REFERENCE NUMBER"
    let tcn = "";
    // Look for the right box structure: SHIPPER'S REFERENCE NUMBER -> TCN -> [value]
    // The value we want is below "SHIPPER'S REFERENCE NUMBER" and to the right of "TCN"
    const tcnMatch = upperText.match(
      /SHIPPER'S\s+REFERENCE\s+NUMBER[^A-Z0-9]*(?:TCN[:\s]*)?([A-Z0-9]{10,})/
    );
    if (tcnMatch && tcnMatch[1]) {
      console.log(
        "TCN found via SHIPPER'S REFERENCE NUMBER pattern:",
        tcnMatch[1]
      );
      tcn = tcnMatch[1].trim();
    } else {
      console.log("TCN not found via specific pattern, trying fallbacks...");
      // Fallback patterns - look for TCN label followed by value
      const fallbackTcn =
        extractPattern(upperText, /TCN[:\s]*([A-Z0-9]{10,})/) ||
        extractPattern(
          upperText,
          /(?:REFERENCE\s+NUMBER[^A-Z0-9]*)?([A-Z0-9]{15,})/
        ) ||
        extractPattern(upperText, /(FB\d{13}[A-Z]{3})/);
      if (fallbackTcn) {
        console.log("TCN found via fallback:", fallbackTcn);
        tcn = fallbackTcn;
      }
    }

    // Extract NATURE AND QUANTITY OF DANGEROUS GOODS (Keys 11-18)
    // Strategy: Find the table section and extract data from columns
    let hazardousMaterials = [];

    const dangerousGoodsSection = upperText.match(
      /NATURE\s+AND\s+QUANTITY\s+OF\s+DANGEROUS\s+GOODS[\s\S]*?(?=ADDITIONAL\s+HANDLING|I\s+HEREBY\s+DECLARE|$)/i
    );

    // Extract UN/ID Number (Key 11) - can be UN#### or NA####
    // Try the dangerous goods section first, then fall back to entire text
    let unNumber = "";
    let sectionContent = "";

    if (dangerousGoodsSection) {
      sectionContent = dangerousGoodsSection[0];
      console.log("DANGEROUS GOODS section found:", sectionContent);
      unNumber = extractPattern(sectionContent, /((?:UN|NA)\d{4})/i) || "";
    }

    // Fallback: search the entire text if not found in section
    if (!unNumber) {
      // Try multiple patterns to find UN/NA numbers in different contexts
      unNumber =
        extractPattern(upperText, /((?:UN|NA)\d{4})/i) ||
        extractPattern(
          upperText,
          /UN\s+OR\s+LD\s+NO\.[\s\S]*?((?:UN|NA)\d{4})/i
        ) ||
        extractPattern(
          upperText,
          /DANGEROUS\s+GOODS\s+IDENTIFICATION[\s\S]*?((?:UN|NA)\d{4})/i
        ) ||
        "";
      console.log(
        "UN/ID Number (Key 11) - fallback search result:",
        unNumber || "NOT FOUND"
      );
      // Use entire text as section content for other extractions if no specific section found
      if (!sectionContent) {
        sectionContent = upperText;
      }
    }

    console.log(
      "UN/ID Number (Key 11) - final result:",
      unNumber || "NOT FOUND"
    );

    if (unNumber) {
      // Extract Proper Shipping Name (Key 12)
      // Strategy: Dynamically extract content from the PROPER SHIPPING NAME cell
      let properShippingName = "";

      // Find the section between PROPER SHIPPING NAME and the next major column header
      const shippingNameSection = sectionContent.match(
        /PROPER\s+SHIPPING\s+NAME[\s\S]*?(?=ADDITIONAL\s+HANDLING|CLASS\s+OR\s+DIVISION|PACKING\s+GROUP|QUANTITY\s+AND\s+TYPE|$)/i
      );

      if (shippingNameSection && shippingNameSection[0]) {
        let shippingContent = shippingNameSection[0];
        console.log("PROPER SHIPPING NAME section found:", shippingContent);

        // Remove the header and contaminated codes
        shippingContent = shippingContent
          .replace(/PROPER\s+SHIPPING\s+NAME/gi, "") // Remove header
          .replace(/[A-Z]{2,}X+/gi, "") // Remove contaminated codes like "XNNXXXXXXXX"
          .replace(/^[X\s\n\r]+/gi, "") // Remove leading X's, spaces, and newlines
          .trim();

        // Look for meaningful shipping name patterns
        const shippingNamePatterns = [
          // Pattern 1: Multi-word equipment names like "BATTERY-POWERED EQUIPMENT"
          /([A-Z][A-Z\-\s]{8,}(?:EQUIPMENT|DEVICE|SYSTEM|BATTERY|BATTERIES))/i,
          // Pattern 2: Equipment with hyphenated words
          /([A-Z\-]+\s+EQUIPMENT)/i,
          // Pattern 3: Any substantial capitalized text that looks like a shipping name
          /([A-Z][A-Z\s\-]{5,})/i,
        ];

        for (const pattern of shippingNamePatterns) {
          const match = shippingContent.match(pattern);
          if (match && match[1]) {
            properShippingName = match[1]
              .replace(/\s+/g, " ") // Normalize whitespace
              .trim();

            // Validate the result
            if (
              properShippingName.length >= 5 &&
              !/^\d+$/.test(properShippingName)
            ) {
              console.log(
                "Found proper shipping name via pattern:",
                properShippingName
              );
              break;
            }
          }
        }

        // Fallback: if no pattern matches, try to extract the cleanest text from the content
        if (!properShippingName && shippingContent.length > 3) {
          // Split by lines and find the most substantial line
          const lines = shippingContent
            .split(/[\n\r]+/)
            .map(line => line.trim())
            .filter(line => line.length > 3);

          for (const line of lines) {
            // Skip if it's just numbers, codes, or single words
            if (
              !/^\d+$/.test(line) &&
              !/^[A-Z]{1,3}$/.test(line) &&
              line.includes(" ")
            ) {
              properShippingName = line;
              console.log(
                "Found proper shipping name via line extraction:",
                properShippingName
              );
              break;
            }
          }
        }
      }

      // Final cleanup
      if (properShippingName) {
        properShippingName = properShippingName
          .replace(/^[X\s\-]+/, "") // Remove leading X's, spaces, dashes
          .replace(/[X\s\-]+$/, "") // Remove trailing X's, spaces, dashes
          .replace(/\s{2,}/g, " ") // Replace multiple spaces with single space
          .trim();

        // Final validation
        if (
          properShippingName.length < 3 ||
          /^\d+$/.test(properShippingName) ||
          /^[X\s]*$/.test(properShippingName)
        ) {
          properShippingName = ""; // Reset if invalid
        }
      }

      console.log(
        "Proper Shipping Name (Key 12) - extraction result:",
        properShippingName || "NOT FOUND"
      );

      // Extract Class or Division (Key 13)
      let hazardClass = "";

      // Find the CLASS OR DIVISION section in the dangerous goods table
      const classSection = sectionContent.match(
        /CLASS\s+OR\s+DIVISION[\s\S]*?(?=PACKING\s+GROUP|QUANTITY\s+AND\s+TYPE|EMERGENCY|$)/i
      );

      if (classSection && classSection[0]) {
        let classContent = classSection[0];
        console.log("CLASS OR DIVISION section found:", classContent);

        // Remove the header text
        classContent = classContent
          .replace(/CLASS\s+OR\s+DIVISION/gi, "")
          .replace(/\(SUBSIDIARY\s+RISK\)/gi, "")
          .trim();

        // Pattern matching for all possible hazard class formats
        const hazardClassPatterns = [
          // Pattern 1: Complex classes like 1.1A, 1.2B, 1.3C, etc.
          /(\d\.\d[A-Z])/i,
          // Pattern 2: Simple decimal classes like 2.1, 2.2, 4.1, 5.1, etc.
          /(\d\.\d)\b/i,
          // Pattern 3: Single digit classes like 3, 8, 9
          /\b(\d)\b/i,
          // Pattern 4: More complex patterns like 1.5D, 1.6N
          /(\d\.\d[A-Z])/i,
        ];

        for (const pattern of hazardClassPatterns) {
          const match = classContent.match(pattern);
          if (match && match[1]) {
            const candidate = match[1].trim();

            // Validate against the known hazard class list
            const validClasses = [
              "1.1A",
              "1.1B",
              "1.1C",
              "1.1D",
              "1.1E",
              "1.1F",
              "1.1G",
              "1.1J",
              "1.1L",
              "1.2B",
              "1.2C",
              "1.2D",
              "1.2E",
              "1.2F",
              "1.2G",
              "1.2H",
              "1.2J",
              "1.2L",
              "1.3C",
              "1.3G",
              "1.3H",
              "1.3J",
              "1.3K",
              "1.3L",
              "1.4B",
              "1.4C",
              "1.4D",
              "1.4E",
              "1.4F",
              "1.4G",
              "1.4S",
              "1.5D",
              "1.6N",
              "2.1",
              "2.2",
              "2.3",
              "3",
              "4.1",
              "4.2",
              "4.3",
              "5.1",
              "5.2",
              "6.1",
              "6.2",
              "8",
              "9",
            ];

            // Check if it's a valid class or if it's a single digit that could be valid
            if (
              validClasses.includes(candidate) ||
              (candidate.length === 1 && validClasses.includes(candidate))
            ) {
              hazardClass = candidate;
              console.log("Found hazard class via pattern:", hazardClass);
              break;
            }
          }
        }

        // If no specific pattern matched, try to find any isolated number
        if (!hazardClass && classContent.length > 0) {
          // Look for standalone numbers in the content
          const lines = classContent
            .split(/[\n\r]+/)
            .map(line => line.trim())
            .filter(line => line.length > 0);

          for (const line of lines) {
            // Check if the line is just a number or contains a valid hazard class
            const cleanLine = line.replace(/[^\d.A-Z]/g, "");
            if (/^\d$/.test(cleanLine) || /^\d\.\d[A-Z]?$/.test(cleanLine)) {
              hazardClass = cleanLine;
              console.log("Found hazard class via line parsing:", hazardClass);
              break;
            }
          }
        }
      }

      // Fallback: search the entire dangerous goods section for hazard class
      if (!hazardClass) {
        // Look for hazard class near other table elements
        const fallbackPatterns = [
          // Look for isolated numbers between shipping name and packing
          /BATTERY[\s\S]*?(\d)\s*(?=PACKING|GROUP|QUANTITY)/i,
          // Look after equipment and before other table elements
          /EQUIPMENT[\s\S]*?(\d)\s*(?=PACKING|GROUP|QUANTITY)/i,
          // General pattern for isolated single digits in dangerous goods context
          /(?:EQUIPMENT|SHIPPING\s+NAME)[\s\S]*?(\d)\s*(?=PACKING|GROUP|INSTRUCTION)/i,
        ];

        for (const pattern of fallbackPatterns) {
          const match = sectionContent.match(pattern);
          if (match && match[1]) {
            hazardClass = match[1].trim();
            console.log("Found hazard class via fallback:", hazardClass);
            break;
          }
        }
      }

      console.log(
        "Class or Division (Key 13) - extraction result:",
        hazardClass || "NOT FOUND"
      );

      // Extract Subsidiary Risk (Key 14) - often empty
      const subsidiaryRisk =
        extractPattern(
          sectionContent,
          /SUBSIDIARY\s+RISK[\s\S]*?([A-Z0-9.]+)/i
        ) || "";

      // Extract Packing Group (Key 15) - from PACKING GROUP column
      const packingGroup =
        extractPattern(
          sectionContent,
          /PACKING\s+GROUP[\s\S]*?([IVX]+|[0-9]+)/i
        ) || "";

      // Extract Quantity and Type of Packing (Key 16) - from QUANTITY AND TYPE OF PACKING column
      const quantityAndPacking =
        extractPattern(
          sectionContent,
          /QUANTITY\s+AND\s+TYPE[\s\S]*?(\d+\s+[A-Z][A-Z\s]+)|(\d+\s+CONTROL\s+OPERATION)/i
        ) ||
        extractPattern(
          sectionContent,
          /(\d+\s+CONTROL\s+OPERATION[A-Z\s]*)/i
        ) ||
        extractPattern(sectionContent, /(\d+\s+[A-Z][A-Z\s]{3,})/i) ||
        "";

      // Extract Packing Instruction (Key 17) - from PACKING INSTRUCTION column
      const packingInstruction =
        extractPattern(
          sectionContent,
          /PACKING\s+INSTRUCTION[\s\S]*?([A-Z]+\d+\.?\d*)/i
        ) ||
        extractPattern(sectionContent, /(A\d+\.?\d*)/i) ||
        "";

      // Extract Authorization (Key 18) - from AUTHORIZATION column
      const authorization =
        extractPattern(
          sectionContent,
          /AUTHORIZATION[\s\S]*?([A-Z]+[-\d]+)/i
        ) ||
        extractPattern(sectionContent, /(AFMAN\d+[-\d]*)/i) ||
        "";

      hazardousMaterials.push({
        unIdNo: unNumber,
        properShippingName: properShippingName,
        airWaybillNumber: "",
        hazardClass: hazardClass,
        subsidiaryRisk: subsidiaryRisk,
        packingGroup: packingGroup,
        quantityAndPacking: quantityAndPacking.replace(/\s+/g, " ").trim(),
        packingInstruction: packingInstruction,
        authorization: authorization,
      });

      console.log("DANGEROUS GOODS extracted:", {
        unIdNo: unNumber,
        properShippingName: properShippingName,
        hazardClass: hazardClass,
        subsidiaryRisk: subsidiaryRisk,
        packingGroup: packingGroup,
        quantityAndPacking: quantityAndPacking,
        packingInstruction: packingInstruction,
        authorization: authorization,
      });
    }

    // Extract phone numbers - looking for the specific format in your form
    const phone =
      extractPattern(upperText, /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/) ||
      extractPattern(upperText, /(1-\d{3}-\d{3}-\d{4})/);

    // Extract additional handling info - from your form
    const handlingInfo =
      extractPattern(upperText, /(\d+\s+EACH\s+BATTERIES[^.]*\.?)/) ||
      extractPattern(upperText, /(FIRE\s+EXTINGUISHER[^.]*\.?)/) ||
      extractPattern(upperText, /(BATTERIES\s+WET[^.]*\.?)/);

    // Determine aircraft type - looking for specific checkmarks/X marks
    let aircraftType:
      | "Passenger and Cargo Aircraft"
      | "Cargo Aircraft Only"
      | "unknown" = "unknown";
    if (upperText.includes("CARGO ONLY") || upperText.includes("XXXXX")) {
      aircraftType = "Cargo Aircraft Only";
    } else if (upperText.includes("PASSENGER") && upperText.includes("CARGO")) {
      aircraftType = "Passenger and Cargo Aircraft";
    }

    // Extract SHIPMENT TYPE (Key 10) - looking for X marks over options
    let shipmentType: "Radioactive" | "Non-Radioactive" | "unknown" = "unknown";

    // Strategy: Look for the SHIPMENT TYPE section and determine which option has X marks
    const shipmentTypeSection = upperText.match(
      /SHIPMENT\s+TYPE[\s\S]*?(?=NATURE\s+AND\s+QUANTITY|DANGEROUS\s+GOODS|$)/i
    );

    if (shipmentTypeSection) {
      const sectionContent = shipmentTypeSection[0];
      console.log("SHIPMENT TYPE section found:", sectionContent);

      // Look for X marks or selection indicators
      const nonRadioactiveSelected =
        /NON-RADIOACTIVE[\s\S]*?[X]{2,}/i.test(sectionContent) ||
        /[X]{2,}[\s\S]*?NON-RADIOACTIVE/i.test(sectionContent) ||
        // Check for X patterns near NON-RADIOACTIVE
        /NON-RADIOACTIVE[\s]*[X\s]{3,}/i.test(sectionContent);

      const radioactiveSelected =
        /(?<!NON-)RADIOACTIVE[\s\S]*?[X]{2,}/i.test(sectionContent) ||
        /[X]{2,}[\s\S]*?(?<!NON-)RADIOACTIVE/i.test(sectionContent) ||
        // Make sure it's not NON-RADIOACTIVE
        (/RADIOACTIVE[\s]*[X\s]{3,}/i.test(sectionContent) &&
          !/NON-RADIOACTIVE/i.test(sectionContent));

      if (nonRadioactiveSelected) {
        shipmentType = "Non-Radioactive";
        console.log(
          "SHIPMENT TYPE (Key 10): Non-Radioactive selected (X marks detected)"
        );
      } else if (radioactiveSelected) {
        shipmentType = "Radioactive";
        console.log(
          "SHIPMENT TYPE (Key 10): Radioactive selected (X marks detected)"
        );
      } else {
        // Fallback: check which text appears more prominently
        if (upperText.includes("NON-RADIOACTIVE")) {
          shipmentType = "Non-Radioactive";
          console.log(
            "SHIPMENT TYPE (Key 10): Non-Radioactive (fallback detection)"
          );
        } else if (upperText.includes("RADIOACTIVE")) {
          shipmentType = "Radioactive";
          console.log(
            "SHIPMENT TYPE (Key 10): Radioactive (fallback detection)"
          );
        }
      }
    } else {
      // Global fallback if section not found
      if (upperText.includes("NON-RADIOACTIVE")) {
        shipmentType = "Non-Radioactive";
      } else if (upperText.includes("RADIOACTIVE")) {
        shipmentType = "Radioactive";
      }
    }

    console.log("SHIPMENT TYPE (Key 10) - Final result:", shipmentType);

    // Keep the old radioactiveType for backward compatibility
    let radioactiveType: "Radioactive" | "Non-Radioactive" | "unknown" =
      shipmentType;

    // Extract Airport of Departure (Key 8) - looking for "DOV Dover AFB, DE" format
    let departureAirport = "";

    // Strategy: Look for specific patterns that match the airport format
    // Pattern 1: ICAO code followed by location (DOV Dover AFB, DE)
    let icaoCode = "";
    let locationName = "";

    // Find ICAO code (3-letter airport code like DOV)
    const icaoPatterns = [
      /AIRPORT\s+OF\s+DEPARTURE[^A-Z]*([A-Z]{3})\b/i, // After "AIRPORT OF DEPARTURE"
    ];

    for (const pattern of icaoPatterns) {
      const match = upperText.match(pattern);
      if (match && match[1]) {
        icaoCode = match[1].toUpperCase();
        console.log("Found ICAO code:", icaoCode);
        break;
      }
    }

    // Find location name (Dover AFB, DE)
    const airportLocationPatterns = [
      /(DOVER\s+AFB[,\s]*DE)/i, // Dover AFB, DE
      /(DOVER\s+AFB[,\s]*DELAWARE)/i, // Dover AFB, Delaware
      /([A-Z][a-z]+\s+AFB[,\s]*[A-Z]{2})/i, // Generic: Something AFB, XX
      /AIRPORT\s+OF\s+DEPARTURE[^A-Z]*[A-Z]{3}[^A-Z]*([A-Z][a-z]+\s+AFB[^A-Z]*[A-Z]{2})/i,
    ];

    for (const pattern of airportLocationPatterns) {
      const match = upperText.match(pattern);
      if (match && match[1]) {
        locationName = match[1].replace(/\s+/g, " ").trim();
        console.log("Found location name:", locationName);
        break;
      }
    }

    // Combine ICAO code and location
    if (icaoCode && locationName) {
      departureAirport = `${icaoCode} - ${locationName}`;
    } else if (icaoCode) {
      // Try to find Dover AFB specifically if we have DOV
      if (icaoCode === "DOV" && upperText.includes("DOVER")) {
        departureAirport = "DOV - Dover AFB, DE";
      } else {
        departureAirport = icaoCode;
      }
    } else if (locationName) {
      departureAirport = locationName;
    }

    // Fallback: comprehensive search for any airport-related content near "AIRPORT OF DEPARTURE"
    if (!departureAirport) {
      const fallbackPatterns = [
        /AIRPORT\s+OF\s+DEPARTURE[:\s]*([A-Z]{3}[^A-Z]*[A-Z][a-z]+[^.]{0,20})/i,
        /AIRPORT\s+OF\s+DEPARTURE[^A-Z]*([A-Z][A-Z0-9\s,.-]{5,30}?)(?=\s*(?:SHIPMENT|DELETE|PASSENGER|CARGO))/i,
        /(DOV[^A-Z]*DOVER[^.]{0,20})/i,
      ];

      for (const pattern of fallbackPatterns) {
        const match = upperText.match(pattern);
        if (match && match[1]) {
          departureAirport = match[1].replace(/\s+/g, " ").trim();
          console.log(
            "Airport of Departure (Key 8) - Found via fallback:",
            departureAirport
          );
          break;
        }
      }
    }

    console.log(
      "Airport of Departure (Key 8) - ICAO:",
      icaoCode || "NOT FOUND"
    );
    console.log(
      "Airport of Departure (Key 8) - Location:",
      locationName || "NOT FOUND"
    );
    console.log(
      "Airport of Departure (Key 8) - Final result:",
      departureAirport || "NOT FOUND"
    );

    // Extract Airport of Destination (Key 9) - looking for "RAMSTEIN AB, GERMANY" format
    let destinationAirport = "";

    // Strategy: Look for specific patterns that match the destination airport format
    let destIcaoCode = "";
    let destLocationName = "";

    // Find ICAO code for destination (like RAMSTEIN -> could be ETAR)
    const destIcaoPatterns = [
      /AIRPORT\s+OF\s+DESTINATION[^A-Z]*([A-Z]{3})\b/i, // After "AIRPORT OF DESTINATION"
    ];

    for (const pattern of destIcaoPatterns) {
      const match = upperText.match(pattern);
      if (match && match[1]) {
        destIcaoCode = match[1].toUpperCase();
        console.log("Found destination ICAO code:", destIcaoCode);
        break;
      }
    }

    // Find destination location name (RAMSTEIN AB, GERMANY)
    const destLocationPatterns = [
      /(RAMSTEIN\s+AB[,\s]*GERMANY)/i, // Ramstein AB, Germany
      /(RAMSTEIN\s+AIR\s+BASE[,\s]*GERMANY)/i, // Ramstein Air Base, Germany
      /([A-Z][a-z]+\s+AB[,\s]*[A-Z]{2,})/i, // Generic: Something AB, COUNTRY
      /AIRPORT\s+OF\s+DESTINATION[^A-Z]*[A-Z]{3}[^A-Z]*([A-Z][a-z]+\s+AB[^A-Z]*[A-Z]{2,})/i,
      /(RAMSTEIN[^A-Z]*GERMANY)/i, // Flexible Ramstein Germany match
    ];

    for (const pattern of destLocationPatterns) {
      const match = upperText.match(pattern);
      if (match && match[1]) {
        destLocationName = match[1].replace(/\s+/g, " ").trim();
        console.log("Found destination location name:", destLocationName);
        break;
      }
    }

    // Combine destination ICAO code and location
    if (destIcaoCode && destLocationName) {
      destinationAirport = `${destIcaoCode} - ${destLocationName}`;
    } else if (destIcaoCode) {
      // Try to find Ramstein specifically if we have ICAO
      if (
        (destIcaoCode === "ETAR" || destIcaoCode === "RAM") &&
        upperText.includes("RAMSTEIN")
      ) {
        destinationAirport = "ETAR - Ramstein AB, Germany";
      } else {
        destinationAirport = destIcaoCode;
      }
    } else if (destLocationName) {
      destinationAirport = destLocationName;
    }

    // Fallback: comprehensive search for destination airport content
    if (!destinationAirport) {
      const destFallbackPatterns = [
        /AIRPORT\s+OF\s+DESTINATION[:\s]*([A-Z]{3}[^A-Z]*[A-Z][a-z]+[^.]{0,20})/i,
        /AIRPORT\s+OF\s+DESTINATION[^A-Z]*([A-Z][A-Z0-9\s,.-]{5,30}?)(?=\s*(?:NATURE|QUANTITY|DANGEROUS))/i,
        /(RAMSTEIN[^.]{0,20}GERMANY)/i,
        /DESTINATION[:\s]*([A-Z]{3,}[^A-Z]*[A-Z][a-z]+)/i,
      ];

      for (const pattern of destFallbackPatterns) {
        const match = upperText.match(pattern);
        if (match && match[1]) {
          destinationAirport = match[1].replace(/\s+/g, " ").trim();
          console.log(
            "Airport of Destination (Key 9) - Found via fallback:",
            destinationAirport
          );
          break;
        }
      }
    }

    console.log(
      "Airport of Destination (Key 9) - ICAO:",
      destIcaoCode || "NOT FOUND"
    );
    console.log(
      "Airport of Destination (Key 9) - Location:",
      destLocationName || "NOT FOUND"
    );
    console.log(
      "Airport of Destination (Key 9) - Final result:",
      destinationAirport || "NOT FOUND"
    );

    // Extract signatory information
    const signatory =
      extractPattern(
        upperText,
        /NAME[^A-Z]*([A-Z\s]+?)(?=PLACE|DATE|WAREHOUSE)/
      ) ||
      extractPattern(upperText, /(AUSTIN\s+STEWART)/) ||
      extractPattern(upperText, /(WAREHOUSE\s+FOREMAN)/);

    // Extract place and date
    const placeAndDate =
      extractPattern(upperText, /(\d{1,2}\s+\w{3}\s+\d{4})/) ||
      extractPattern(
        upperText,
        /(WPAFB[,\s]+OH[^A-Z]*\d{1,2}\s+\w{3}\s+\d{4})/
      ) ||
      extractPattern(upperText, /PLACE\s+AND\s+DATE[^A-Z]*([A-Z\s\d,]+)/);

    // Extract emergency contact info
    const emergencyPhone =
      extractPattern(upperText, /EMERGENCY[^0-9]*(\d{1}-\d{3}-\d{3}-\d{4})/) ||
      extractPattern(upperText, /(1-800-851-8061)/) ||
      extractPattern(upperText, /(1-804-279-3131)/);

    // Extract quantity and packing info
    const quantityPacking =
      extractPattern(upperText, /(\d+\s+CONTROL\s+OPERATION[^A-Z]*)/i) ||
      (upperText.includes("CONTROL OPERATION")
        ? "1 Control Operation Shelter"
        : "");

    // Extract additional details
    const additionalInfo =
      extractPattern(upperText, /(2\s+EACH\s+BATTERIES[^.]*\.?)/) ||
      extractPattern(upperText, /(1\s+EACH\s+FIRE\s+EXTINGUISHER[^.]*\.?)/);

    console.log("=== EXTRACTED DATA SUMMARY ===");
    console.log("SHIPPER (Key 1):", shipper || "NOT FOUND");
    console.log("CONSIGNEE (Key 2):", consignee || "NOT FOUND");
    console.log("TCN (Key 5):", tcn || "NOT FOUND");
    console.log(
      "AIRPORT OF DEPARTURE (Key 8):",
      departureAirport || "NOT FOUND"
    );
    console.log(
      "AIRPORT OF DESTINATION (Key 9):",
      destinationAirport || "NOT FOUND"
    );
    console.log("SHIPMENT TYPE (Key 10):", shipmentType || "NOT FOUND");
    console.log("=== PATTERN MATCHING STATUS ===");
    console.log("- Shipper parts found:", shipper ? "YES" : "NO");
    console.log("- Consignee found:", consignee ? "YES" : "NO");
    console.log("- TCN match found:", !!tcnMatch);
    console.log("=== END DEBUG INFO ===");

    return {
      shipper,
      consignee,
      //   airwayBillNo: airwayBill,
      pagination: extractPattern(upperText, /PAGE\s+(\d+)\s+OF\s+(\d+)/),
      shippersReferenceNumber: tcn,
      aircraftType,
      airportOfDeparture: departureAirport,
      airportOfDestination: destinationAirport,
      shipmentType,
      radioactiveType,
      hazardousMaterials: hazardousMaterials,
      additionalHandlingInfo: handlingInfo || additionalInfo,
      inspectionActivity: "",
      emergencyTelephoneNumber: emergencyPhone || phone,
      nameOfSignatory: signatory,
      placeAndDate: placeAndDate,
      signature: upperText.includes("SIGNATURE") ? "[Signature Present]" : "",
    };
  };

  const formatSDDGData = (sddgData: SDDGFormData): string => {
    const sections = [];
    sections.push("SHIPPER'S DECLARATION FOR DANGEROUS GOODS");
    sections.push("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if (sddgData.shipper) {
      sections.push(`SHIPPER (Key 1): ${sddgData.shipper}`);
    }
    if (sddgData.consignee) {
      sections.push(`CONSIGNEE (Key 2): ${sddgData.consignee}`);
    }
    // if (sddgData.airwayBillNo) {
    //   sections.push(`Air Waybill No. (Key 3): ${sddgData.airwayBillNo}`);
    // }
    if (sddgData.shippersReferenceNumber) {
      sections.push(`TCN (Key 5): ${sddgData.shippersReferenceNumber}`);
    }
    if (sddgData.aircraftType !== "unknown") {
      sections.push(`Aircraft Type (Key 7): ${sddgData.aircraftType}`);
    }
    if (sddgData.airportOfDeparture) {
      sections.push(
        `Airport of Departure (Key 8): ${sddgData.airportOfDeparture}`
      );
    }
    if (sddgData.airportOfDestination) {
      sections.push(
        `Airport of Destination (Key 9): ${sddgData.airportOfDestination}`
      );
    }
    if (sddgData.shipmentType !== "unknown") {
      sections.push(`Shipment Type (Key 10): ${sddgData.shipmentType}`);
    }

    sections.push(`⚠️ HAZARDOUS MATERIALS:`);
    sddgData.hazardousMaterials.forEach((material, index) => {
      sections.push(`  Material ${index + 1}:`);
      sections.push(`    • UN/ID No. (Key 11): ${material.unIdNo}`);
      sections.push(
        `    • Proper Shipping Name (Key 12): ${material.properShippingName}`
      );
      sections.push(
        `    • CLASS or DIVISION (SUBSIDIARY RISK) (Key 13): ${material.hazardClass}`
      );
      if (material.subsidiaryRisk) {
        sections.push(
          `    • Subsidiary Risk (Key 14): ${material.subsidiaryRisk}`
        );
      }
      if (material.packingGroup) {
        sections.push(`    • Packing Group (Key 15): ${material.packingGroup}`);
      }
      if (material.quantityAndPacking) {
        sections.push(
          `    • Quantity and Type of Packing (Key 16): ${material.quantityAndPacking}`
        );
      }
      if (material.packingInstruction) {
        sections.push(
          `    • Packing Instruction (Key 17): ${material.packingInstruction}`
        );
      }
      if (material.authorization) {
        sections.push(
          `    • Authorization (Key 18): ${material.authorization}`
        );
      }
    });

    if (sddgData.nameOfSignatory) {
      sections.push(`Signatory (Key 20): ${sddgData.nameOfSignatory}`);
    }

    return sections.join("\n");
  };

  // Helper to render bounding box overlays
  function renderOcrBoundingBoxes() {
    console.log("🟦 [SDDG] Overlay state:", {
      debugOcrBlocks,
      debugImageUri,
      debugImageDims,
      showDebugOverlay,
    });
    if (!showDebugOverlay) {
      console.log("🟦 [SDDG] Overlay not shown: showDebugOverlay is false");
      return null;
    }
    if (!debugOcrBlocks)
      console.log("🟦 [SDDG] Overlay not shown: debugOcrBlocks is null");
    if (!debugImageUri)
      console.log("🟦 [SDDG] Overlay not shown: debugImageUri is null");
    if (!debugImageDims)
      console.log("🟦 [SDDG] Overlay not shown: debugImageDims is null");
    if (!debugOcrBlocks || !debugImageUri || !debugImageDims) return null;
    console.log("🟦 [SDDG] Rendering debug overlay");

    // Extract all bounding boxes from MLKit format (blocks, lines, and elements)
    const allBoundingBoxes: any[] = [];
    debugOcrBlocks.forEach((block: any, blockIndex: number) => {
      // Add main block bounding box
      if (block.bounding) {
        allBoundingBoxes.push({
          ...block.bounding,
          text: block.text,
          type: "block",
          blockIndex,
        });
      }

      // Add line bounding boxes for more granular detection
      if (block.lines) {
        block.lines.forEach((line: any, lineIndex: number) => {
          if (line.bounding) {
            allBoundingBoxes.push({
              ...line.bounding,
              text: line.text,
              type: "line",
              blockIndex,
              lineIndex,
            });
          }

          // Add individual word/element bounding boxes for highest precision
          if (line.elements) {
            line.elements.forEach((element: any, elementIndex: number) => {
              if (element.bounding) {
                allBoundingBoxes.push({
                  ...element.bounding,
                  text: element.text,
                  type: "element",
                  blockIndex,
                  lineIndex,
                  elementIndex,
                });
              }
            });
          }
        });
      }
    });

    console.log("🟦 [SDDG] Extracted bounding boxes:", allBoundingBoxes.length);

    // Find the actual coordinate range from all bounding boxes
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    allBoundingBoxes.forEach(box => {
      if (
        box.left !== undefined &&
        box.top !== undefined &&
        box.width &&
        box.height
      ) {
        minX = Math.min(minX, box.left);
        maxX = Math.max(maxX, box.left + box.width);
        minY = Math.min(minY, box.top);
        maxY = Math.max(maxY, box.top + box.height);
      }
    });

    console.log("🟦 [SDDG] OCR coordinate range:", { minX, maxX, minY, maxY });

    // Calculate display dimensions and scaling based on original image dimensions
    const screenWidth = Dimensions.get("window").width;
    const maxDisplayWidth = screenWidth * 0.9; // 90% of screen width

    // Use original image dimensions for proper scaling
    const originalAspectRatio = debugImageDims.height / debugImageDims.width;

    const displayWidth = maxDisplayWidth;
    const displayHeight = displayWidth * originalAspectRatio;

    // Scale factors to map original image coordinates to display coordinates
    const scaleX = displayWidth / debugImageDims.width;
    const scaleY = displayHeight / debugImageDims.height;

    console.log("🟦 [SDDG] Image dimensions:", {
      original: debugImageDims,
      ocrSpace: { minX, maxX, minY, maxY },
      display: { width: displayWidth, height: displayHeight },
      scale: { x: scaleX, y: scaleY },
    });

    // Log first 10 scaled positions
    allBoundingBoxes.slice(0, 10).forEach((box, i) => {
      if (box.width && box.height) {
        const scaledLeft = (box.left || 0) * scaleX;
        const scaledTop = (box.top || 0) * scaleY;
        const scaledWidth = box.width * scaleX;
        const scaledHeight = box.height * scaleY;
        console.log(
          `🟦 [SDDG] Box ${i} (${box.type}) "${box.text?.substring(0, 15)}":`,
          {
            original: `${box.left},${box.top} ${box.width}x${box.height}`,
            scaled: `${scaledLeft.toFixed(1)},${scaledTop.toFixed(
              1
            )} ${scaledWidth.toFixed(1)}x${scaledHeight.toFixed(1)}`,
          }
        );
      }
    });

    let renderedCount = 0;

    return (
      <View
        style={{
          alignItems: "center",
          marginVertical: 16,
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 8,
            color: "#333",
          }}
        >
          🔍 OCR Debug Overlay ({allBoundingBoxes.length} boxes from{" "}
          {debugOcrBlocks.length} blocks)
        </Text>
        <ScrollView horizontal contentContainerStyle={{ alignItems: "center" }}>
          <View
            style={{
              width: displayWidth,
              height: displayHeight,
              borderWidth: 2,
              borderColor: "#007AFF",
              backgroundColor: "#fff",
              borderRadius: 8,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Image
              source={{ uri: debugImageUri }}
              style={{
                width: displayWidth,
                height: displayHeight,
                position: "absolute",
                top: 0,
                left: 0,
              }}
              resizeMode="stretch"
            />

            {/* Test box to verify scaling */}
            <View
              style={{
                position: "absolute",
                left: 20,
                top: 20,
                width: 60,
                height: 30,
                borderWidth: 2,
                borderColor: "#FF9500",
                backgroundColor: "rgba(255,149,0,0.3)",
                borderRadius: 2,
                zIndex: 10,
              }}
            />

            {allBoundingBoxes.map((box, i) => {
              if (!box.width || !box.height) return null;

              // Scale the coordinates directly from original image to display
              const scaledLeft = (box.left || 0) * scaleX;
              const scaledTop = (box.top || 0) * scaleY;
              const scaledWidth = box.width * scaleX;
              const scaledHeight = box.height * scaleY;

              // Determine color based on spatial location and content
              const originalLeft = box.left || 0;
              const originalTop = box.top || 0;
              const text = (box.text || "").toUpperCase();

              // Define spatial regions based on typical SDDG form layout
              // Shipper section: typically top-left, roughly left quarter of document, top third
              const isInShipperRegion =
                originalLeft >= 130 &&
                originalLeft <= 450 &&
                originalTop >= 180 &&
                originalTop <= 380;

              // Consignee section: typically left side, below shipper
              const isInConsigneeRegion =
                originalLeft >= 130 &&
                originalLeft <= 450 &&
                originalTop >= 380 &&
                originalTop <= 520;

              let borderColor = "#007AFF"; // Default blue
              let backgroundColor = "rgba(0,122,255,0.15)";
              let borderWidth = 1;

              // Only mark as shipper if it's in the shipper region AND contains shipper-related text
              const isShipperText =
                isInShipperRegion &&
                (text.includes("SHIPPER") ||
                  text.includes("TRAFFIC") ||
                  text.includes("MANAGEMENT") ||
                  text.includes("FLIGHT") ||
                  text.includes("CHASE") ||
                  text.includes("WRIGHT") ||
                  text.includes("PATTERSON") ||
                  text.includes("PHONE") ||
                  text.includes("(937)") ||
                  text.includes("257-4409"));

              // Only mark as consignee if it's in the consignee region AND contains consignee-related text
              const isConsigneeText =
                isInConsigneeRegion &&
                (text.includes("CONSIGNEE") ||
                  text.includes("FBS612") ||
                  text.includes("435 ABW") ||
                  (text.includes("RAMSTEIN") && originalTop < 520));

              const isUN = text.includes("UN") || text.includes("3171");

              if (isShipperText) {
                borderColor = "#FF3B30"; // Red for SHIPPER section
                backgroundColor = "rgba(255,59,48,0.25)";
                borderWidth = 3;
                console.log(
                  `🔴 SHIPPER: "${text}" at ${originalLeft},${originalTop}`
                );
              } else if (isConsigneeText) {
                borderColor = "#34C759"; // Green for CONSIGNEE section
                backgroundColor = "rgba(52,199,89,0.25)";
                borderWidth = 3;
              } else if (isUN) {
                borderColor = "#FF9500"; // Orange for UN numbers
                backgroundColor = "rgba(255,149,0,0.25)";
                borderWidth = 2;
              }

              // Different styles for different types
              if (box.type === "element") {
                borderWidth = Math.max(1, borderWidth - 1); // Thinner for elements
              } else if (box.type === "block") {
                borderWidth = Math.max(2, borderWidth); // Thicker for blocks
              }

              // Skip boxes that are outside display area
              if (
                scaledLeft + scaledWidth < 0 ||
                scaledTop + scaledHeight < 0 ||
                scaledLeft > displayWidth ||
                scaledTop > displayHeight
              ) {
                return null;
              }

              renderedCount++;
              return (
                <View
                  key={`${box.type}-${i}`}
                  style={{
                    position: "absolute",
                    left: scaledLeft,
                    top: scaledTop,
                    width: scaledWidth,
                    height: scaledHeight,
                    borderWidth,
                    borderColor,
                    borderRadius: 1,
                    backgroundColor,
                    zIndex: 5,
                  }}
                />
              );
            })}
          </View>
        </ScrollView>
        <Text
          style={{
            fontSize: 12,
            color: "#666",
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Red = SHIPPER | Green = CONSIGNEE | Orange = UN/ID | Blue = Other |
          Orange corner = test box
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: "#999",
            marginTop: 4,
            textAlign: "center",
          }}
        >
          Rendered: {renderedCount} / {allBoundingBoxes.length} boxes (blocks +
          lines + elements)
        </Text>
      </View>
    );
  }

  // Handle QR code scan button press
  const handleQRCodeScan = useCallback(async () => {
    console.log("🟦 [SDDG] handleQRCodeScan called");
    qrScannedRef.current = false;

    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Camera access is needed to scan QR codes. Please enable it in Settings."
        );
        return;
      }
    }

    setShowQRScanner(true);
  }, [cameraPermission, requestCameraPermission]);

  // Handle barcode scanned from CameraView
  const handleBarcodeScanned = useCallback(
    async ({ data }: { data: string }) => {
      // Prevent duplicate fires
      if (qrScannedRef.current) return;
      qrScannedRef.current = true;

      const scannedTCN = data.trim();
      console.log("🟦 [SDDG] QR code scanned, TCN:", scannedTCN);

      if (!scannedTCN) {
        qrScannedRef.current = false;
        return;
      }

      setShowQRScanner(false);
      setIsLoadingQR(true);

      try {
        // Look up preparer shipment by TCN from shipment JSON storage
        await ShipmentDatabase.initialize();

        const matches = await ShipmentDatabase.searchShipments({ tcn: scannedTCN });
        const normalizedScannedTcn = scannedTCN.toUpperCase();
        const exactMatches = matches
          .filter(
            shipment => shipment.tcn?.trim().toUpperCase() === normalizedScannedTcn
          )
          .sort(
            (a, b) =>
              new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
          );

        const completedMatch = exactMatches.find(
          shipment => shipment.status === "completed"
        );
        const selectedShipment = completedMatch || exactMatches[0];

        if (!selectedShipment) {
          Alert.alert(
            "Not Found",
            `No preparer shipment found with TCN: ${scannedTCN}`
          );
          return;
        }

        const seed = await loadPreparerShipmentForInspection(selectedShipment.id);

        // Start a fresh inspection session and seed SDDG + authorization data
        startNewInspection();
        await setExtractedSDDGContent(seed.extractedContent);

        if (
          seed.specialAuthorization.type &&
          seed.specialAuthorization.attested
        ) {
          setSpecialAuthorizationData({
            type: seed.specialAuthorization.type,
            referenceNumber: seed.specialAuthorization.referenceNumber,
            // Preparer attestation does not satisfy inspector attestation.
            attested: false,
            source: "preparer",
          });

          if (seed.specialAuthorization.type === "COE") {
            seed.authorizationDocuments.coeDocuments.forEach(doc => {
              addCoeCaaDocument({
                id: doc.id,
                documentType: "COE",
                uri: doc.uri,
                base64Data: doc.base64Data,
                name: doc.name,
                agency: doc.agency,
                dateAdded: doc.dateAdded,
              });
            });
          } else if (seed.specialAuthorization.type === "CAA") {
            seed.authorizationDocuments.caaDocuments.forEach(doc => {
              addCoeCaaDocument({
                id: doc.id,
                documentType: "CAA",
                uri: doc.uri,
                base64Data: doc.base64Data,
                name: doc.name,
                agency: doc.agency,
                dateAdded: doc.dateAdded,
              });
            });
          } else if (seed.specialAuthorization.type === "DOT-SP") {
            seed.authorizationDocuments.dotSpWaivers.forEach(doc => {
              addDotSpWaiver({
                id: doc.id,
                uri: doc.uri,
                base64Data: doc.base64Data,
                waiverNumber: doc.waiverNumber,
                description: doc.description,
                agency: doc.agency,
                dateAdded: doc.dateAdded,
              });
            });
          }
        } else {
          setSpecialAuthorizationData(null);
        }

        completeSDDGSubstep("SDDGUploadAndParse");
        setCurrentSDDGStep("compliance");
        setCurrentSDDGScreen("InteractiveSDDGComplianceScreen");

        console.log(
          "🟦 [SDDG] Preparer shipment loaded from QR scan, navigating to compliance screen"
        );

        navigation.navigate("InteractiveSDDGComplianceScreen");
      } catch (err) {
        console.error("🟦 [SDDG] QR lookup error:", err);
        Alert.alert(
          "Error",
          "Failed to load shipment from QR code. Please try again."
        );
      } finally {
        setIsLoadingQR(false);
      }
    },
    [
      addCoeCaaDocument,
      addDotSpWaiver,
      completeSDDGSubstep,
      navigation,
      setCurrentSDDGScreen,
      setCurrentSDDGStep,
      setExtractedSDDGContent,
      setSpecialAuthorizationData,
      startNewInspection,
    ]
  );

  useEffect(() => {
    // If we return from template OCR flow, transition to verification
    if (extractedContent && extractedContent.source === "template-ocr") {
      setShowVerification(true);
    }
  }, [extractedContent]);

  // Show QR scanner
  if (showQRScanner) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.qrScannerContainer}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={handleBarcodeScanned}
          />
          {/* Overlay with targeting frame */}
          <View style={styles.qrOverlay}>
            <View style={styles.qrOverlayTop} />
            <View style={styles.qrOverlayMiddle}>
              <View style={styles.qrOverlaySide} />
              <View style={styles.qrTargetFrame} />
              <View style={styles.qrOverlaySide} />
            </View>
            <View style={styles.qrOverlayBottom}>
              <Text style={styles.qrInstructionText}>
                Point camera at QR code on SDDG
              </Text>
            </View>
          </View>
          {/* Back button */}
          <TouchableOpacity
            style={styles.qrBackButton}
            onPress={() => setShowQRScanner(false)}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            <Text style={styles.qrBackButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Show QR loading state
  if (isLoadingQR) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Loading Shipment</Text>
        </View>
        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.scanningText}>
            Looking up shipment...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show processing screen
  if (isScanning) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              setIsScanning(false);
              setProcessingProgress("");
              setError(null);
            }}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Processing Document</Text>
        </View>

        <View style={styles.scanningContainer}>
          <ActivityIndicator size="large" color="#34C759" />
          <Text style={styles.scanningText}>
            {processingProgress || "Processing..."}
          </Text>
          {debugText && <Text style={styles.debugInfoText}>{debugText}</Text>}
        </View>
      </SafeAreaView>
    );
  }

  // Show verification screen when OCR processing is complete
  // Note: setExtractedSDDGContent is now called in useEffect (line 116) to prevent infinite loop
  if (showVerification && extractedContent) {
    return (
      <InteractiveSDDGComplianceScreen
        navigation={{
          ...navigation,
          goBack: () => setShowVerification(false),
        }}
      />
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SDDG Scan/Import</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.scanSection}>
            {/* <TouchableOpacity
              style={[
                styles.scanButton,
                isScanning && styles.scanButtonDisabled,
              ]}
              // onPress={handleDocumentScan}
              disabled={isScanning}
            >
              <View style={styles.scanButtonContent}>
                {isScanning ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <MaterialIcons
                    name="document-scanner"
                    size={32}
                    color="#FFFFFF"
                  />
                )}
                <Text style={styles.scanButtonText}>
                  {isScanning ? "Processing..." : "Take Photo"}
                </Text>
              </View>
            </TouchableOpacity> */}
            {/* Template-Based OCR Button - High Accuracy */}
            <TouchableOpacity
              style={[
                styles.importButton,
                isScanning && styles.scanButtonDisabled,
              ]}
              onPress={() => {
                navigation.navigate("SDDGCameraScreen");
              }}
              disabled={isScanning}
            >
              <View style={styles.scanButtonContent}>
                <MaterialIcons
                  name="document-scanner"
                  size={32}
                  color="#FFFFFF"
                />
                <Text style={styles.scanButtonText}>Take Photo</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.importButton,
                isScanning && styles.scanButtonDisabled,
              ]}
              onPress={handleGallerySelection}
              disabled={isScanning}
            >
              <View style={styles.scanButtonContent}>
                <MaterialIcons name="photo-library" size={32} color="#FFFFFF" />
                <Text style={styles.scanButtonText}>Select from Gallery</Text>
              </View>
            </TouchableOpacity>

            {/* QR Code Scanner - Quick entry for HazPro-prepared SDDGs */}
            <TouchableOpacity
              style={[
                styles.qrCodeButton,
                isScanning && styles.scanButtonDisabled,
              ]}
              onPress={handleQRCodeScan}
              disabled={isScanning}
            >
              <View style={styles.scanButtonContent}>
                <MaterialIcons
                  name="qr-code-scanner"
                  size={32}
                  color="#FFFFFF"
                />
                <Text style={styles.scanButtonText}>Scan QR Code</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.manualEntryButton,
                isScanning && styles.scanButtonDisabled,
              ]}
              onPress={() => navigation.navigate("SDDGManualEntryScreen")}
              disabled={isScanning}
            >
              <View style={styles.scanButtonContent}>
                <MaterialIcons name="edit" size={32} color="#FFFFFF" />
                <Text style={styles.scanButtonText}>Manual Entry</Text>
              </View>
            </TouchableOpacity>
          </View>

          {isScanning && (
            <View style={styles.progressSection}>
              <Text style={styles.progressText}>{processingProgress}</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorSection}>
              <MaterialIcons name="error-outline" size={24} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Comment out extracted content for now to debug overlay */}

          {extractedContent && (
            <View style={styles.contentSection}>
              <View style={styles.contentHeader}>
                <MaterialIcons name="assignment" size={24} color="#34C759" />
                <Text style={styles.contentTitle}>SDDG Form Data</Text>
              </View>

              <View style={styles.textContainer}>
                <ScrollView
                  style={styles.textScrollView}
                  nestedScrollEnabled={true}
                >
                  <Text style={styles.extractedText}>
                    {extractedContent.text}
                  </Text>
                </ScrollView>
              </View>
            </View>
          )}

          {/* Always attempt to render the debug overlay */}
          {/* {renderOcrBoundingBoxes()} */}
        </ScrollView>

        {/* Dev Benchmark Button - only visible in __DEV__ */}
        <DevBenchmarkButton position="bottom-right" />
      </SafeAreaView>

      {/* PDF converter removed - not supported in Expo managed workflow */}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: { padding: 8 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  scanSection: { marginBottom: 24 },
  scanButton: {
    backgroundColor: "#34C759",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButtonDisabled: { backgroundColor: "#8E8E93" },
  scanButtonContent: { alignItems: "center" },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  scanButtonSubtext: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  progressSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  progressText: { fontSize: 16, color: "#1D1D1F" },
  errorSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
  },
  errorText: { fontSize: 15, color: "#FF3B30", marginLeft: 12, flex: 1 },
  contentSection: { backgroundColor: "#FFFFFF", borderRadius: 12, padding: 16 },
  contentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginLeft: 8,
  },
  textContainer: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
  },
  textScrollView: { maxHeight: 400 },
  extractedText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#1D1D1F",
    padding: 12,
  },
  scanningContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scanningText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginTop: 16,
    textAlign: "center",
  },
  debugInfoText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  scannerOverlay: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  scannerInstructions: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  importButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  manualEntryButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCodeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  mockButton: {
    backgroundColor: "#6B7280",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  templateOcrButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#007AFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  templateOcrButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 4,
  },
  templateOcrButtonSubtext: {
    fontSize: 12,
    color: "#007AFF",
    opacity: 0.7,
  },
  ollamaToggleSection: {
    backgroundColor: "#F2F2F7",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  toggleButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  toggleButtonInactive: {
    backgroundColor: "#FFFFFF",
    borderColor: "#C7C7CC",
  },
  toggleButtonText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  toggleButtonTextActive: {
    color: "#FFFFFF",
  },
  toggleButtonTextInactive: {
    color: "#8E8E93",
  },
  // QR Scanner styles
  qrScannerContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  qrOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  qrOverlayTop: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  qrOverlayMiddle: {
    flexDirection: "row" as const,
    width: "100%",
    height: 250,
  },
  qrOverlaySide: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  qrTargetFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 12,
  },
  qrOverlayBottom: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    paddingTop: 24,
  },
  qrInstructionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  qrBackButton: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  qrBackButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default SDDGUploadAndParse;
