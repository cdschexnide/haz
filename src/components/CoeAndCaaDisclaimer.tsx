import { useHazProStore } from "@/stores/useHazProStore";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

const CoeAndCaaDisclaimer = ({ navigation }: { navigation: any }) => {
  const { state, store } = useHazProStore();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const handleAcknowledge = () => {
    navigation.navigate("CoeAndCaaScreen");
  };

  const handleReject = () => {
    navigation.goBack();
  };

  const SCROLL_DETECTION_SCRIPT = `
    window.addEventListener('scroll', function() {
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 10) {
        window.ReactNativeWebView.postMessage('SCROLL_END');
      }
    });
    true;
  `;

  const handleWebViewMessage = (event: any) => {
    if (event.nativeEvent.data === "SCROLL_END") {
      setHasScrolledToBottom(true);
    }
  };

  const generateHtmlContent = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.5;
              padding: 15px;
              color: #333;
              /* Add extra padding to ensure scrolling */
              padding-bottom: 50px;
            }
            h2 {
              color: #0057B7;
              margin-top: 20px;
            }
            p {
              margin-bottom: 15px;
            }
            ul {
              padding-left: 20px;
            }
            li {
              margin-bottom: 8px;
            }
            .warning {
              color: #f57c00;
              font-weight: bold;
            }
            .acknowledgement {
              margin-top: 30px;
              padding: 15px;
              background-color: #f8f9fa;
              border-left: 4px solid #28a745;
              font-weight: bold;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <h2>DOD Certification of Equivalency (COE)</h2>
          <p>Certifies that packaging equals or exceeds 49 CFR Part 100-199 requirements.</p>
          <ul>
            <li>Must accompany shipment in Defense Transportation System</li>
          </ul>
          
          <h2>Competent Authority Approvals (CAA)</h2>
          <p>Approval issued by national agency for hazardous materials transportation.</p>
          <ul>
            <li>Use as packaging authority for military air shipment</li>
            <li>Must accompany cargo in Defense Transportation System</li>
          </ul>
          
          <div class="acknowledgement">
            By proceeding, you confirm that this shipment is packaged and prepared according to all requirements of the certification/waiver.
          </div>
        </body>
      </html>
    `;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Certification Requirements</Text>

      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: generateHtmlContent() }}
        style={styles.webView}
        injectedJavaScript={SCROLL_DETECTION_SCRIPT}
        onMessage={handleWebViewMessage}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !hasScrolledToBottom && styles.disabledButton,
          ]}
          onPress={handleAcknowledge}
          disabled={!hasScrolledToBottom}
        >
          <Text style={styles.buttonText}>
            {hasScrolledToBottom
              ? "Acknowledge Requirements"
              : "Please scroll to the bottom"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleReject}>
          <Text style={styles.cancelButtonText}>Reject Requirements</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    paddingBottom: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  cancelButton: {
    flex: 1,
    height: 55,
    borderRadius: 4,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  continueButton: {
    flex: 1,
    height: 55,
    backgroundColor: "#28a745",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  webView: {
    flex: 1,
    height: "75%",
  },
});

export default CoeAndCaaDisclaimer;
