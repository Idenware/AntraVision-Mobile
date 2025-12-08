import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { getUserProfile, updateUserImage } from "../../services/Api";
import Change from "../../../assets/icons/actions/change.svg";
const { width } = Dimensions.get("window");

const ProfileCard = forwardRef((props, ref) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChangePhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos de permissão para acessar suas fotos"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        await uploadProfileImage(selectedImage);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Falha ao selecionar imagem");
    }
  };
  const uploadProfileImage = async (imageData) => {
    try {
      setUploadingImage(true);
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");

      if (!token || !userJson) {
        Alert.alert("Erro", "Usuário não autenticado");
        return;
      }

      const filename = imageData.uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      const formData = new FormData();
      formData.append("avatar", {
        uri: imageData.uri,
        type: type,
        name: filename,
      });

      console.log("Enviando imagem para servidor...");
      const response = await updateUserImage(formData, token);
      console.log("Resposta do servidor:", response);

      if (response && response.profileImage) {
        const imageUrlWithTimestamp = `${
          response.profileImage
        }?t=${new Date().getTime()}`;
        setProfileImage(imageUrlWithTimestamp);

        const user = JSON.parse(userJson);
        user.profileImage = response.profileImage;
        await AsyncStorage.setItem("user", JSON.stringify(user));

        Alert.alert("Sucesso", "Foto de perfil atualizada com sucesso!");

        await loadUserProfile();
      } else {
        console.log("Resposta não contém profileImage");
        Alert.alert("Aviso", "Imagem enviada, mas não foi retornada URL");
      }
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      Alert.alert(
        "Erro",
        "Não foi possível atualizar a foto. Tente novamente."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userJson = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (userJson && token) {
        const user = JSON.parse(userJson);
        const profileData = await getUserProfile(user.id, token);

        setUsername(profileData.username || "Usuário");
        setEmail(profileData.email || "N/A");
        setPhone(profileData.phone || "N/A");
        const addressValue =
          typeof profileData.address === "string"
            ? profileData.address
            : profileData.address?.text || "Localização não informada";
        setAddress(addressValue);

        setProfileImage(profileData.profileImage || "");
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    loadUserProfile,
  }));

  useFocusEffect(
    React.useCallback(() => {
      loadUserProfile();
    }, [])
  );

  if (loading) {
    return (
      <View style={[styles.profileCard, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.profileCard}>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri:
              profileImage ||
              "https://images.unsplash.com/photo-1535643302794-19c3804b874b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b2xkJTIwbWFufGVufDB8fDB8fHww",
          }}
          style={styles.avatar}
          key={profileImage}
        />
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.profileFirstSection}>
          <View>
            <Text style={styles.name}>{username}</Text>
            <Text style={styles.location}>{address}</Text>
          </View>
          <View>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
          <View>
            <Text style={styles.label}>Celular</Text>
            <Text style={styles.value}>{phone}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.photoButton,
            uploadingImage && styles.photoButtonDisabled,
          ]}
          onPress={handleChangePhoto}
          disabled={uploadingImage}
        >
          {uploadingImage ? (
            <>
              <ActivityIndicator size="small" color="#5C5B5B" />
              <Text style={styles.photoButtonText}>Enviando...</Text>
            </>
          ) : (
            <>
              <Text style={styles.photoButtonText}>Mudar Foto</Text>
              <Change />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: "row",
    gap: 15,
  },
  avatarContainer: {
    width: "40%",
    height: "100%",
  },
  avatar: {
    width: "100%",
    height: 185,
    borderRadius: 10,
    resizeMode: "cover",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "space-between",
    gap: 13,
  },
  profileFirstSection: {
    gap: 9,
  },
  name: {
    fontSize: 20,
    fontWeight: "500",
    color: "#6C6D6F",
  },
  location: {
    fontSize: 14,
    color: "#6C6D6E",
  },
  label: {
    fontSize: 12,
    color: "#6C6D6E",
    fontWeight: "500",
  },
  value: {
    fontSize: 13,
    color: "#6C6D6E",
  },
  photoButton: {
    paddingVertical: 11,
    paddingHorizontal: 8,
    backgroundColor: "#EFEFF0",
    borderRadius: 5,
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  photoButtonText: {
    fontSize: 13,
    color: "#5C5B5B",
  },
  photoButtonDisabled: {
    opacity: 0.6,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
});

export default ProfileCard;
