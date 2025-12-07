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
import Back from "../../../assets/icons/arrow/left-arrow-white.svg";
import { BlurView } from "expo-blur";

const { height } = Dimensions.get("window");

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

  const slideAnim = useRef(new Animated.Value(height)).current;

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
        quality: 0.5,
      });

      const base64Image = photo.base64;
      const sizeMB = checkBase64Size(base64Image);

      if (sizeMB > 2) {
        Alert.alert(
          "Imagem Muito Grande",
          "A imagem é muito grande. Por favor, tente novamente com uma imagem menor."
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

  const sendPhotoToAPI = async (base64Image) => {
    try {
      const response = await fetch("http://3.135.213.245:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const htmlText = await response.text();
        data = htmlToJson(htmlText);
      }

      if (data.resultado || data.content) {
        const resultadoFinal = data.resultado || data.content;
        setResultado(resultadoFinal);
        openModal();
      } else {
        Alert.alert("Erro", data.error || "Resposta inválida da API");
      }
    } catch (error) {
      console.error("Error sending photo:", error);
      Alert.alert(
        "Erro de Conexão",
        "Não foi possível conectar à API. Verifique sua conexão."
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
          <Text style={styles.title}>Scan Plant</Text>
        </View>

        <BlurView intensity={50} tint="dark" style={styles.overlayTop} />
        <BlurView intensity={50} tint="dark" style={styles.overlayBottom} />
        <BlurView intensity={50} tint="dark" style={styles.overlayLeft} />
        <BlurView intensity={50} tint="dark" style={styles.overlayRight} />

        <View style={styles.captureContainer} pointerEvents="auto">
          <TouchableOpacity
            style={[styles.captureButton, loading && { opacity: 0.5 }]}
            onPress={takePicture}
            disabled={loading}
          >
            {loading && <ActivityIndicator size="large" color="#4CAF50" />}
          </TouchableOpacity>
        </View>
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
});

export default CameraScreen;
