import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import { BlurView } from "expo-blur";
import Back from "../../../assets/icons/arrow/left-arrow-white.svg";

// 🚨 Altere este IP para o IP da sua máquina local na mesma rede do celular
const SERVER_URL = "http://192.168.3.101:5000/";

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Solicita permissão da câmera ao iniciar
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) return <View />;
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Precisamos de permissão para usar a câmera</Text>
        <TouchableOpacity
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
          }}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionText}>Conceder permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Função principal: tira a foto e envia para o backend Flask (api_flask.py)
  const takePhotoAndUpload = async () => {
    if (!cameraRef.current) return;

    try {
      // Captura a foto
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      // Exibe modal de carregamento
      setModalVisible(true);
      setLoading(true);
      setResultado(null);

      // Prepara o FormData com a imagem
      const localUri = photo.uri;
      const filename = localUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const ext = match ? match[1] : "jpg";
      const mimeType = `image/${ext === "jpg" ? "jpeg" : ext}`;

      const formData = new FormData();
      formData.append("file", {
        uri: localUri,
        name: filename,
        type: mimeType,
      });

      // Faz o envio para a API Flask
      const response = await fetch(SERVER_URL, {
        method: "POST",
        body: formData,
        // ⚠️ Não defina o Content-Type manualmente — o fetch faz isso automaticamente.
      });

      if (!response.ok) {
        throw new Error("Falha ao se comunicar com o servidor: " + response.status);
      }

      const result = await response.json();

      // Exemplo esperado de retorno: { "class": "saudavel", "confidence": 0.93 }
      setResultado({
        resultado: result.class || result.resultado || "desconhecido",
        probabilidade: result.confidence ?? result.probabilidade ?? 0,
      });
    } catch (err) {
      console.error("Erro ao processar a imagem:", err);
      setResultado({ resultado: "Erro na análise", probabilidade: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={facing} ref={cameraRef}>
        {/* Topo da tela com botão de voltar */}
        <View style={styles.topOverlay}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Back />
          </TouchableOpacity>
          <Text style={styles.title}>Escanear a planta</Text>
          <TouchableOpacity
            onPress={() =>
              setFacing((f) =>
                f === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              )
            }
          >
            <Text style={{ color: "white" }}>Flip</Text>
          </TouchableOpacity>
        </View>

        {/* Moldura e efeito de blur */}
        <View style={StyleSheet.absoluteFill}>
          <BlurView intensity={50} tint="dark" style={styles.overlayTop} />
          <BlurView intensity={50} tint="dark" style={styles.overlayBottom} />
          <BlurView intensity={50} tint="dark" style={styles.overlayLeft} />
          <BlurView intensity={50} tint="dark" style={styles.overlayRight} />
          <View style={styles.frameOverlay} />
        </View>

        {/* Botão de captura */}
        <View style={styles.captureContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePhotoAndUpload} />
        </View>
      </Camera>

      {/* Modal de Resultado */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loading ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <>
                <Text style={styles.modalText}>
                  Resultado: {String((resultado?.resultado || "").toUpperCase())}
                </Text>
                <Text>
                  Confiança: {(Number(resultado?.probabilidade || 0) * 100).toFixed(2)}%
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// 🎨 Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  message: { textAlign: "center", paddingBottom: 10, color: "white" },
  permissionButton: {
    alignSelf: "center",
    backgroundColor: "#1e90ff",
    padding: 10,
    borderRadius: 8,
  },
  permissionText: { color: "white", fontWeight: "bold" },
  camera: { flex: 1 },
  topOverlay: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 1,
  },
  title: { fontSize: 18, color: "white", fontWeight: "bold" },
  frameOverlay: {
    position: "absolute",
    top: "25%",
    left: "10%",
    width: "80%",
    height: "50%",
    borderRadius: 10,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  captureContainer: { position: "absolute", bottom: 40, alignSelf: "center" },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderWidth: 4,
    borderColor: "#ccc",
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalText: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#1e90ff",
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: { color: "white", fontWeight: "bold" },
});

export default CameraScreen;
