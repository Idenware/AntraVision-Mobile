import React, { useState, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions, Camera } from "expo-camera";
import { BlurView } from "expo-blur";
import Exit from "../../../assets/icons/actions/exit.svg";
import Back from "../../../assets/icons/arrow/left-arrow-white.svg";
import FlashOff from "../../../assets/icons/actions/flash-off.svg";
import FlashOn from "../../../assets/icons/actions/flash-on.svg";

const CameraScreen = ({ navigation }) => {
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos de permissão para usar a câmera
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={styles.permissionText}>Conceder permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "torch" : "off"));
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log("Foto tirada:", photo.uri);
        // Aqui você pode navegar, salvar ou mostrar a imagem
      } catch (error) {
        console.error("Erro ao tirar foto:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        flash={flash}
        ref={cameraRef}
      >
        <View style={styles.topOverlay}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Back/>
          </TouchableOpacity>
          <Text style={styles.title}>Escanear a planta</Text>
          <TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View style={StyleSheet.absoluteFill}>
          <BlurView intensity={50} tint="dark" style={styles.overlayTop} />
          <BlurView intensity={50} tint="dark" style={styles.overlayBottom} />
          <BlurView intensity={50} tint="dark" style={styles.overlayLeft} />
          <BlurView intensity={50} tint="dark" style={styles.overlayRight} />
          <View style={styles.frameOverlay} />
        </View>

        {/* Botão de captura */}
        <View style={styles.captureContainer}>
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto} />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  permissionButton: {
    alignSelf: "center",
    backgroundColor: "#1e90ff",
    padding: 10,
    borderRadius: 8,
  },
  permissionText: {
    color: "white",
    fontWeight: "bold",
  },
  camera: {
    flex: 1,
  },
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
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  icon: {
    paddingHorizontal: 5,
    color: "white",
    fontSize: 24,
  },
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
  captureContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
  },
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
});

export default CameraScreen;
