import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  analyzeImage,
  createOccurrence,
  upsertSectorStats,
} from "../../services/Api";
import Back from "../../../assets/icons/arrow/left-arrow-white.svg";
import { BlurView } from "expo-blur";

const { height } = Dimensions.get("window");

const QR_CODE_DEBOUNCE = 3000;

const htmlToJson = (htmlString) => {
  try {
    const textContent = htmlString.replace(/<[^>]*>/g, "").trim();
    try {
      return JSON.parse(textContent);
    } catch {
      return { content: textContent, raw_html: htmlString };
    }
  } catch (error) {
    return { error: "Falha ao converter HTML", raw: htmlString };
  }
};

const checkBase64Size = (base64String) => {
  const sizeInBytes = (base64String.length * 3) / 4;
  const sizeInMB = sizeInBytes / (1024 * 1024);
  console.log(`Tamanho da imagem: ${sizeInMB.toFixed(2)} MB`);
  return sizeInMB;
};

const CameraScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [scanMode, setScanMode] = useState("photo");

  const slideAnim = useRef(new Animated.Value(height)).current;
  const qrSlideAnim = useRef(new Animated.Value(height)).current;
  const lastQrScan = useRef(0);

  useEffect(() => {
    if (!permission) requestPermission();
  }, []);

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const openQrModal = () => {
    setQrModalVisible(true);
    Animated.timing(qrSlideAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const closeQrModal = () => {
    Animated.timing(qrSlideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setQrModalVisible(false);
      setQrCodeData("");
    });
  };

  const handleBarcodeScanned = ({ type, data }) => {
    const now = Date.now();
    if (now - lastQrScan.current < QR_CODE_DEBOUNCE) {
      return;
    }

    lastQrScan.current = now;
    setQrCodeData("Setor 05");
    openQrModal();
  };

  const toggleScanMode = () => {
    setScanMode((prev) => (prev === "photo" ? "qrcode" : "photo"));
    setQrCodeData("");
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.message}>
          Precisamos da sua permissão para usar a câmera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionText}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || loading) return;

    try {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.2,
      });

      const base64Image = photo.base64;
      const sizeMB = checkBase64Size(base64Image);

      if (sizeMB > 1) {
        Alert.alert(
          "Imagem Muito Grande",
          "A imagem é muito grande. Por favor, tente novamente."
        );
        setLoading(false);
        return;
      }

      await sendPhotoToAPI(base64Image);
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Erro", "Falha ao capturar imagem.");
      setLoading(false);
    }
  };

  const createOccurrenceFromAnalysis = async (prediction, farmId, token) => {
    try {
      const predictionLower = prediction?.toLowerCase() || "";
      const sectorName = "Setor 05";

      let healthyCounts = 0;
      let attentionCounts = 0;

      if (
        predictionLower.includes("saudável") ||
        predictionLower.includes("saudavel") ||
        predictionLower === "planta saudável"
      ) {
        healthyCounts = 1;
      } else if (
        predictionLower.includes("doente") ||
        predictionLower === "planta doente"
      ) {
        attentionCounts = 1;
      }

      const occurrenceData = {
        farmId: farmId,
        date: new Date().toISOString(),
        infectedCounts: attentionCounts,
        healthyCounts: healthyCounts,
        totalCounts: 1,
        plantAgeMonths: 6,
      };

      await createOccurrence(occurrenceData, token);
      console.log("Ocorrência criada com sucesso:", occurrenceData);

      const sectorStatsData = {
        farm: farmId,
        sectorName: sectorName,
        healthy: healthyCounts,
        attention: attentionCounts,
        severe: 0,
        critical: 0,
        date: new Date().toISOString(),
      };

      await upsertSectorStats(sectorStatsData, token);
      console.log("Estatísticas do setor atualizadas:", sectorStatsData);
    } catch (error) {
      console.error("Erro ao criar ocorrência/estatísticas:", error);
    }
  };

  const sendPhotoToAPI = async (base64Image) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");

      if (!token || !userJson) {
        Alert.alert("Erro", "Usuário não autenticado");
        setLoading(false);
        return;
      }

      const user = JSON.parse(userJson);
      const farmId = user.selectedFarm;

      if (!farmId) {
        Alert.alert(
          "Atenção",
          "Selecione uma fazenda no seu perfil antes de analisar plantas."
        );
        setLoading(false);
        return;
      }

      const analysisData = {
        userId: user.id,
        farmId: farmId,
        location: "Camera",
        image: base64Image,
      };

      const response = await analyzeImage(analysisData, token);

      if (response.iaResult) {
        const { prediction, confidence } = response.iaResult;
        setResultado(`${prediction} (${confidence}% de confiança)`);

        await createOccurrenceFromAnalysis(prediction, farmId, token);

        openModal();
      } else {
        Alert.alert("Erro", "Resposta inválida da API");
      }
    } catch (error) {
      console.error("Error sending photo:", error);
      Alert.alert(
        "Erro de Conexão",
        "Não foi possível conectar à API. Verifique sua conexão e certifique-se de que o backend está rodando."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          flash={flash}
          barcodeScannerSettings={
            scanMode === "qrcode"
              ? {
                  barcodeTypes: ["qr"],
                }
              : undefined
          }
          onBarcodeScanned={
            scanMode === "qrcode" ? handleBarcodeScanned : undefined
          }
        />
      </View>

      <View style={styles.overlayContainer} pointerEvents="box-none">
        <View style={styles.topOverlay} pointerEvents="auto">
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Back />
          </TouchableOpacity>
          <Text style={styles.title}>
            {scanMode === "qrcode" ? "Scan QR Code" : "Scan Plant"}
          </Text>
        </View>

        <BlurView intensity={50} tint="dark" style={styles.overlayTop} />
        <BlurView intensity={50} tint="dark" style={styles.overlayBottom} />
        <BlurView intensity={50} tint="dark" style={styles.overlayLeft} />
        <BlurView intensity={50} tint="dark" style={styles.overlayRight} />

        <View style={styles.captureContainer} pointerEvents="auto">
          {scanMode === "photo" ? (
            <TouchableOpacity
              style={[styles.captureButton, loading && { opacity: 0.5 }]}
              onPress={takePicture}
              disabled={loading}
            >
              {loading && <ActivityIndicator size="large" color="#4CAF50" />}
            </TouchableOpacity>
          ) : (
            <View style={styles.qrScanIndicator}>
              <Text style={styles.qrScanText}>
                {qrCodeData ? "QR Code Detectado!" : "Aponte para um QR Code"}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.modeSwitchButton}
          onPress={toggleScanMode}
          pointerEvents="auto"
        >
          <Text style={styles.modeSwitchText}>
            {scanMode === "photo" ? "QR Code" : "Foto"}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.reportContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Text style={styles.reportHeader}>
              Hey, we just analyzed your plant!
            </Text>

            <Text style={styles.reportTitle}>Plant Report</Text>

            <Text style={styles.sectionTitle}>Description</Text>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Plant Status: </Text>
              <Text style={styles.statusValue}>{resultado}</Text>
            </View>

            <Text style={styles.descriptionText}></Text>

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={qrModalVisible}
        animationType="none"
        onRequestClose={closeQrModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.reportContainer,
              { transform: [{ translateY: qrSlideAnim }] },
            ]}
          >
            <Text style={styles.reportHeader}>QR Code Detectado!</Text>

            <Text style={styles.reportTitle}>Informação do QR Code</Text>

            <View style={styles.qrDataContainer}>
              <Text style={styles.qrDataLabel}>Conteúdo:</Text>
              <Text style={styles.qrDataText}>{qrCodeData}</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={closeQrModal}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  topOverlay: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
    zIndex: 30,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginRight: 40,
  },
  captureContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    zIndex: 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },

  overlayTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "25%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  overlayBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "25%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  overlayLeft: {
    position: "absolute",
    top: "25%",
    bottom: "25%",
    left: 0,
    width: "10%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  overlayRight: {
    position: "absolute",
    top: "25%",
    bottom: "25%",
    right: 0,
    width: "10%",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  reportContainer: {
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  reportHeader: {
    color: "#4CAF50",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "left",
    marginBottom: 10,
  },
  reportTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "left",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 15,
    color: "#94A3B8",
    fontWeight: "500",
  },
  statusValue: {
    fontSize: 15,
    color: "#4CAF50",
    fontWeight: "600",
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#374151",
    marginBottom: 25,
  },
  closeButton: {
    alignSelf: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F1F8E9",
  },
  permissionButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
  },
  permissionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  message: {
    textAlign: "center",
    color: "#333",
    marginBottom: 10,
  },
  modeSwitchButton: {
    position: "absolute",
    top: 120,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    zIndex: 20,
  },
  modeSwitchText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
  },
  qrScanIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  qrScanText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  qrDataContainer: {
    backgroundColor: "#F3F4F6",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  qrDataLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  qrDataText: {
    fontSize: 15,
    color: "#1F2937",
    lineHeight: 22,
  },
});

export default CameraScreen;
