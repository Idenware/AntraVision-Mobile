import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../../../assets/logo/antravision_logo.svg";
import RightArrow from "../../../assets/icons/arrow/right-arrow.svg";

const Background = ({ children }) => {
  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={["#B9E177", "#69C098"]}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get("window");
const COLORS = {
  primary: "#59C893",
  secondary: "#ADDE5C",
  white: "#FFFFFF",
  textPrimary: "#FFFFFF",
  buttonText: "#6FD476",
};

const WelcomeScreen = ({ navigation }) => {
  return (
    <Background>
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.logoContainer}>
          <Logo style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Bem-vindo ao AntraVision!</Text>
            <Text style={styles.subtitle}>
              Acompanhe a saúde das suas mudas de pupunha aqui!
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={() => navigation.navigate("SignIn")}
            accessibilityRole="button"
            accessibilityLabel="Continuar para AntraVision"
          >
            <View style={styles.buttonContent}>
              <View style={styles.iconWrapper}></View>
              <Text style={styles.buttonText}>Vamos lá!</Text>
              <View style={styles.iconWrapper}>
                <RightArrow />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 26,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingTop: 198,
    alignItems: "center",
  },
  logo: {
    width: width * 0.6,
    height: height * 0.2,
  },
  contentContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 45,
    paddingBottom: 83,
  },
  textContainer: {
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "400",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.white,
    width: width * 0.8,
    paddingVertical: 12,
    paddingHorizontal: 19,
    borderRadius: 30,
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "400",
    color: COLORS.buttonText,
  },
  iconWrapper: {
    width: 24,
    alignItems: "center",
  },
});

export default WelcomeScreen;
