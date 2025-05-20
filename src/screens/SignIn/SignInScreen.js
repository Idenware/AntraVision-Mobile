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

import LeftArrow from "../../../assets/icons/arrow/left-arrow.svg";
import User from "../../../assets/icons/profile/user.svg";
import Password from "../../../assets/icons/profile/password.svg";
import Enter from "../../../assets/icons/profile/enter.svg";

const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://192.168.3.101:3000/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erro", data.error || "Erro ao autenticar");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Erro", "Erro ao conectar ao servidor.");
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
                <Text style={styles.title}>Bem-vindo de volta!</Text>
                <Text style={styles.subtitle}>Vamos fazer o seu login</Text>
              </View>

              <View style={styles.formContainerWrap}>
                <View style={styles.formContainer}>
                  <View style={styles.inputMainContainer}>
                    <Text style={styles.label}>Nome de Usuário/Email</Text>
                    <View style={styles.inputContainer}>
                      <View style={styles.inputText}>
                        <User />
                        <TextInput
                          style={styles.input}
                          value={username}
                          onChangeText={setUsername}
                          keyboardType="default"
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
                </View>
                <View style={styles.signWrap}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignIn}
                  >
                    <LinearGradient
                      colors={["#B8DF78", "#5ED6A5"]}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientBackground}
                    >
                      <View style={styles.buttonTextContainer}>
                        <Text style={styles.buttonText}>Entrar</Text>
                        <Enter />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                  <Text style={styles.signupText}>
                    Não tem uma conta? Faça o{" "}
                    <Text
                      style={styles.link}
                      onPress={() => navigation.navigate("SignUp")}
                    >
                      Cadastro
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
    paddingHorizontal: 22,
    paddingVertical: 71,
  },
  mainContainer: {
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
    display: "flex",
    flexDirection: "column",
    gap: 35,
  },
  inputMainContainer: {
    display: "flex",
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
  resetPasswordContainer: {
    width: "100%",
    paddingTop: 3,
    alignItems: "flex-end",
  },
  passwordLabel: {
    fontSize: 12,
    color: "#6A6F7D",
    textAlign: "right",
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

export default SignInScreen;
