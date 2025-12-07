import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { register } from "../../services/Api";

import LeftArrow from "../../../assets/icons/arrow/left-arrow.svg";
import Email from "../../../assets/icons/profile/email.svg";
import Password from "../../../assets/icons/profile/password.svg";
import Enter from "../../../assets/icons/profile/enter.svg";

const SignUpValidationScreen = ({ navigation, route }) => {
  const { username, phone, location } = route.params;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSignUp = async () => {
    if (!email || !password || !passwordConfirm) {
      Alert.alert("Erro", "Por favor, preencha todos os campos!");
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert("Erro", "As senhas não coincidem!");
      return;
    }

    if (!location || location.length < 10) {
      Alert.alert("Erro", "O endereço deve ter pelo menos 10 caracteres!");
      return;
    }

    try {
      const data = await register({
        username,
        email,
        phone,
        password,
        confirmPassword: passwordConfirm,
        address: {
          text: location,
          lat: 0.0,
          lng: 0.0,
        },
      });

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Erro", error.response?.data?.error || "Falha no cadastro");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <LeftArrow />
            </TouchableOpacity>

            <View style={styles.infoContainer}>
              <View style={styles.welcomeContainer}>
                <Text style={styles.title}>Olá!</Text>
                <Text style={styles.subtitle}>Vamos criar sua conta</Text>
              </View>

              <View style={styles.formContainerWrap}>
                <View style={styles.formContainer}>
                  <View style={styles.inputMainContainer}>
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputContainer}>
                      <View style={styles.inputText}>
                        <Email />
                        <TextInput
                          style={styles.input}
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          placeholderTextColor="#A4A8B1"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputMainContainer}>
                    <Text style={styles.label}>Senha</Text>
                    <View style={styles.inputContainer}>
                      <View style={styles.inputText}>
                        <Password />
                        <TextInput
                          style={styles.input}
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry
                          placeholderTextColor="#A4A8B1"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputMainContainer}>
                    <Text style={styles.label}>Confirmar Senha</Text>
                    <View style={styles.inputContainer}>
                      <View style={styles.inputText}>
                        <Password />
                        <TextInput
                          style={styles.input}
                          value={passwordConfirm}
                          onChangeText={setPasswordConfirm}
                          secureTextEntry
                          placeholderTextColor="#A4A8B1"
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.signWrap}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignUp}
                  >
                    <LinearGradient
                      colors={["#B8DF78", "#5ED6A5"]}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientBackground}
                    >
                      <View style={styles.buttonTextContainer}>
                        <Text style={styles.buttonText}>Register</Text>
                        <Enter />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  <Text style={styles.signupText}>
                    Already have an account?{" "}
                    <Text
                      style={styles.link}
                      onPress={() => navigation.navigate("SignIn")}
                    >
                      Sign In
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  mainContainer: {
    width: "100%",
    paddingHorizontal: 22,
    paddingVertical: 71,
    flexDirection: "column",
    gap: 49,
  },
  infoContainer: {
    flexDirection: "column",
    gap: 41,
  },
  welcomeContainer: {
    flexDirection: "column",
    gap: 2,
  },
  title: {
    fontSize: 29.5,
    fontWeight: "bold",
    color: "#9DBF65",
    fontFamily: "Poppins-Regular",
  },
  subtitle: {
    fontSize: 16,
    color: "#495566",
  },
  formContainerWrap: {
    gap: 80,
  },
  formContainer: {
    flexDirection: "column",
    gap: 35,
  },
  inputMainContainer: {
    flexDirection: "column",
  },
  label: {
    fontSize: 12,
    color: "#6A6F7D",
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#A4A8B1",
    paddingHorizontal: 10,
  },
  inputText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  input: {
    width: "90%",
    fontSize: 14,
  },
  signWrap: {
    gap: 20,
    alignItems: "center",
  },
  button: {
    height: 45,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 28,
  },
  buttonTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    flex: 1,
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    lineHeight: 20,
    paddingLeft: 15,
  },
  signupText: {
    color: "#495566",
  },
  link: {
    color: "#5ED6A5",
    textDecorationLine: "underline",
  },
});

export default SignUpValidationScreen;
