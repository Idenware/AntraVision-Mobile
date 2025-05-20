import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Menu from "../../../assets/icons/menu/menu.svg";
import Search from "../../../assets/icons/search/search.svg";
import CarouselCardOverview from "../../components/Home/CarouselCardOverview";
import { LinearGradient } from "expo-linear-gradient";
import CardComparing from "../../components/Home/CardComparing";
import ChartTimePeriod from "../../components/Home/ChartTimePeriod";
import HistoryCard from "../../components/History/HistoryCard";

const { width } = Dimensions.get("window");

const HistoryScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.firstSection}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Menu />
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greetingContent}>
          <View style={styles.greetingTextContent}>
            <Text style={styles.greeting}>
              <Text>Histórico de Ocorrência</Text>
            </Text>
            <Text style={styles.subtitle}>
              Verifique suas plantações por Propriedade
            </Text>
          </View>
        </View>
      </View>
      <HistoryCard onPress={() => navigation.navigate("HistoryDetails")}/>
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
    alignItems: "center"
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
  chartHeaderContainer: {
    gap: 4,
  },
  chartSpan: {
    color: "#8B8B8B",
    fontSize: 16,
    fontWeight: "bold",
  },
  chartTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#555555",
  },
  chartDate: {
    fontSize: 14,
    color: "#8B8B8B",
  },
});

export default HistoryScreen;
