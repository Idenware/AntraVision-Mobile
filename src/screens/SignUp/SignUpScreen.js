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

import RightArrow from "../../../assets/icons/arrow/right-arrow-white.svg";
import LeftArrow from "../../../assets/icons/arrow/left-arrow.svg";
import User from "../../../assets/icons/profile/user.svg";
import Phone from "../../../assets/icons/profile/phone.svg";
import Location from "../../../assets/icons/profile/location.svg";

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const handleNext = () => {
    if (!username || !phone || !location) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    navigation.navigate("SignUpValidation", {
      username,
      phone,
      location,
    });
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
                <Text style={styles.subtitle}>
                  Vamos criar uma conta para você
                </Text>
              </View>

              <View style={styles.formContainerWrap}>
                <View style={styles.formContainer}>
                  <View style={styles.inputMainContainer}>
                    <Text style={styles.label}>Nome de Usuário</Text>
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
                    <Text style={styles.label}>Número de Celular</Text>
                    <View style={styles.inputContainer}>
                      <View style={styles.inputText}>
                        <Phone />
                        <TextInput
                          style={styles.input}
                          value={phone}
                          onChangeText={setPhone}
                          keyboardType="numeric"
                          placeholderTextColor="#A4A8B1"
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.inputMainContainer}>
                    <Text style={styles.label}>Endereço</Text>
                    <View style={styles.inputContainer}>
                      <View style={styles.inputText}>
                        <Location />
                        <TextInput
                          style={styles.input}
                          value={location}
                          onChangeText={setLocation}
                          placeholderTextColor="#A4A8B1"
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.signWrap}>
                  <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <LinearGradient
                      colors={["#B8DF78", "#5ED6A5"]}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientBackground}
                    >
                      <View style={styles.buttonTextContainer}>
                        <Text style={styles.buttonText}>Próximo Passo</Text>
                        <RightArrow />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  <Text style={styles.signupText}>
                    Já tem uma conta? Faça o{" "}
                    <Text
                      style={styles.link}
                      onPress={() => navigation.navigate("SignIn")}
                    >
                      Login
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
    display: "flex",
    flexDirection: "column",
    gap: 49,
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 41,
  },
  welcomeContainer: {
    display: "flex",
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

export default SignUpScreen;
