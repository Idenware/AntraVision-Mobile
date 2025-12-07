import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { getUserProfile, updateUserProfile } from "../../services/Api";
import User from "../../../assets/icons/profile/user.svg";
import Email from "../../../assets/icons/profile/email.svg";
import Phone from "../../../assets/icons/profile/phone.svg";
import Password from "../../../assets/icons/profile/password.svg";

const ProfileForm = ({ onProfileUpdate }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      const userToken = await AsyncStorage.getItem("token");

      if (userJson && userToken) {
        const user = JSON.parse(userJson);
        setUserId(user.id);
        setToken(userToken);

        const profileData = await getUserProfile(user.id, userToken);

        setUsername(profileData.username || "");
        setEmail(profileData.email || "");
        setPhone(profileData.phone || "");

        const addressValue =
          typeof profileData.address === "string"
            ? profileData.address
            : profileData.address?.text || "";
        setAddress(addressValue);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      Alert.alert("Erro", "Não foi possível carregar os dados do perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const updateData = {
        username,
        email,
        phone,
        address: {
          text: address,
          lat: 0.0,
          lng: 0.0,
        },
      };

      if (password && password.trim() !== "") {
        updateData.password = password;
      }

      const updatedProfile = await updateUserProfile(userId, updateData, token);

      const updatedUser = {
        id: userId,
        username: updatedProfile.username || username,
        email: updatedProfile.email || email,
        phone: updatedProfile.phone || phone,
        address: updatedProfile.address || {
          text: address,
          lat: 0.0,
          lng: 0.0,
        },
        profileImage: updatedProfile.profileImage || "",
      };
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

      if (onProfileUpdate) {
        onProfileUpdate();
      }

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      setPassword("••••••••");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <View style={styles.inputMainContainer}>
        <Text style={styles.label}>NOME DE USUÁRIO</Text>
        <View style={styles.inputContainer}>
          <User />
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            keyboardType="default"
            placeholderTextColor="#A4A8B1"
            placeholder="Digite seu nome de usuário"
          />
        </View>
      </View>

      <View style={styles.inputMainContainer}>
        <Text style={styles.label}>EMAIL</Text>
        <View style={styles.inputContainer}>
          <Email />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#A4A8B1"
            placeholder="Digite seu email"
          />
        </View>
      </View>

      <View style={styles.inputMainContainer}>
        <Text style={styles.label}>CELULAR</Text>
        <View style={styles.inputContainer}>
          <Phone />
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor="#A4A8B1"
            placeholder="Digite seu celular"
          />
        </View>
      </View>

      <View style={styles.inputMainContainer}>
        <Text style={styles.label}>ENDEREÇO</Text>
        <View style={styles.inputContainer}>
          <User />
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            keyboardType="default"
            placeholderTextColor="#A4A8B1"
            placeholder="Digite seu endereço"
          />
        </View>
      </View>

      <View style={styles.inputMainContainer}>
        <Text style={styles.label}>SENHA (deixe vazio para não alterar)</Text>
        <View style={styles.inputContainer}>
          <Password />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            keyboardType="default"
            secureTextEntry
            placeholderTextColor="#A4A8B1"
            placeholder="Digite uma nova senha"
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={saving}
      >
        <LinearGradient
          colors={["#B8DF78", "#5ED6A5"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <View style={styles.buttonTextContainer}>
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    paddingTop: 15,
    paddingHorizontal: 20,
    gap: 15,
  },
  inputMainContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 17,
    paddingVertical: 15,
    gap: 10,
    borderRadius: 10,
    shadowColor: "#BEBEBE",
    shadowOpacity: 0.13,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 9,
  },
  label: {
    fontSize: 11,
    color: "#9B9FA3",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D9DBDF",
    paddingHorizontal: 5,
    paddingBottom: 4,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
    color: "#000",
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  gradientBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    textTransform: "uppercase",
  },
});

export default ProfileForm;
