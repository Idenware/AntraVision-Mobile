import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Menu from "../../../assets/icons/menu/menu.svg";
import CarouselCardOverview from "../../components/Home/CarouselCardOverview";
import CardComparing from "../../components/Home/CardComparing";
import ChartTimePeriod from "../../components/Home/ChartTimePeriod";

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [username, setUsername] = useState("Usuário");

  const loadUserData = async () => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      if (userJson) {
        const username = JSON.parse(userJson);
        setUsername(
          username.name || username.firstName || username.username || "Usuário"
        );
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.firstSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Menu width={24} height={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.greetingContent}>
          <View style={styles.greetingTextContent}>
            <Text style={styles.greeting}>
              <Text style={styles.bold}>Olá,</Text> {username}
            </Text>
            <Text style={styles.subtitle}>
              Vamos verificar suas mudas de pupunha
            </Text>
          </View>
        </View>
      </View>

      <ChartTimePeriod />
      <CarouselCardOverview />
      <CardComparing />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 75,
    paddingBottom: 30,
    gap: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  firstSection: {
    gap: 40,
  },
  greetingContent: {
    gap: 20,
  },
  greetingTextContent: {
    gap: 4,
  },
  greeting: {
    fontSize: 28,
    color: "#484C52",
  },
  bold: {
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    color: "#484C52",
  },
});

export default HomeScreen;
