import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import LeftArrow from "../../../assets/icons/arrow/left-arrow.svg";
import CardChartHistoryDetails from "../../components/HistoryDetails/CardChartHistoryDetails";
import CardOverviewAnalysis from "../../components/HistoryDetails/CardOverviewAnalysis";
import CardHistoryProgressBar from "../../components/HistoryDetails/CardHistoryProgressBar";
import CardHistoryChartSeed from "../../components/HistoryDetails/CardHistoryChartSeed";

const { width } = Dimensions.get("window");

const HistoryDetailsScreen = ({ navigation, route }) => {
  const { farm } = route.params || {};
  const today = new Date();
  const formattedDate = today
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .replace(" de ", " de ")
    .replace(/ de (\d{4})$/, ", $1");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.firstSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <LeftArrow />
          </TouchableOpacity>
          <Text style={styles.headerText}>Histórico de Ocorrência</Text>
          <TouchableOpacity></TouchableOpacity>
        </View>

        <View style={styles.statisticContent}>
          <View style={styles.statisticTextContent}>
            <View style={styles.statisticMainText}>
              <Text style={styles.span}>{farm?.name || "Fazenda"}</Text>
              <Text style={styles.title}>Estatísticas de ocorrência</Text>
            </View>
            <Text style={styles.subtitle}>{formattedDate}</Text>
          </View>
        </View>
      </View>
      <View style={styles.overviewStatisticsContent}>
        <View style={styles.overviewStatisticsChart}>
          <CardChartHistoryDetails />
          <CardOverviewAnalysis farmId={farm?._id} />
        </View>
        <View style={styles.overviewStatistics}>
          <CardHistoryProgressBar farmId={farm?._id} />
          <CardHistoryChartSeed farmId={farm?._id} />
        </View>
      </View>
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
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#505050",
  },
  firstSection: {
    gap: 40,
  },
  statisticContent: {
    gap: 20,
  },
  statisticTextContent: {
    gap: 8,
  },
  span: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B8B8B",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#535353",
  },
  subtitle: {
    fontSize: 14,
    color: "#8B8B8B",
  },
  overviewStatisticsContent: {
    gap: 20,
  },
  overviewStatisticsChart: {
    gap: 30,
  },
  overviewStatistics: {
    gap: 25,
  },
});

export default HistoryDetailsScreen;
