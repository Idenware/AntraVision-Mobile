import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSectorStatsByFarm } from "../../services/Api";

const { width } = Dimensions.get("window");

const getBarColor = (value) => {
  if (value >= 35) return "#FF6B6B";
  if (value >= 20) return "#FFD868";
  return "#BCEC9F";
};

const HistoryCard = ({ farm, onPress }) => {
  const [sectorData, setSectorData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSectorStats();
  }, [farm]);

  const loadSectorStats = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const stats = await getSectorStatsByFarm(farm._id, token);

      const sectorMap = {};
      stats.forEach((stat) => {
        const intensity =
          (stat.attention || 0) + (stat.severe || 0) + (stat.critical || 0);
        if (!sectorMap[stat.sectorName]) {
          sectorMap[stat.sectorName] = intensity;
        } else {
          sectorMap[stat.sectorName] += intensity;
        }
      });

      setSectorData(
        Object.entries(sectorMap).map(([name, value]) => ({
          sectorName: name,
          value,
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar estatísticas de setor:", error);
      setSectorData([]);
    } finally {
      setLoading(false);
    }
  };

  const data = sectorData.map((sector, index) => ({
    value: sector.value,
    label: sector.sectorName,
    frontColor: getBarColor(sector.value),
    topLabelComponent: () => (
      <Text style={styles.labelText}>{sector.value}</Text>
    ),
  }));

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#69C098" />
        <Text style={styles.loadingText}>Carregando estatísticas...</Text>
      </View>
    );
  }

  if (!sectorData.length) {
    return (
      <View style={styles.container}>
        <View style={styles.textContent}>
          <View style={styles.historyTextContent}>
            <Text style={styles.title}>Intensidade da doença por Setor</Text>
            <Text style={styles.subtitle}>{farm.name}</Text>
          </View>
        </View>
        <View style={{ height: 1, backgroundColor: "#ccc" }} />
        <Text style={styles.noDataText}>
          Nenhum dado disponível para esta fazenda
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={() => onPress(farm)} style={styles.container}>
      <View style={styles.textContent}>
        <View style={styles.historyTextContent}>
          <Text style={styles.title}>Intensidade da doença por Setor</Text>
          <Text style={styles.subtitle}>{farm.name}</Text>
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: "#ccc" }} />
      <View style={styles.chartContainer}>
        <BarChart
          data={data}
          noOfSections={3}
          hideRules
          barBorderRadius={6}
          initialSpacing={0}
          yAxisThickness={0}
          yAxisLabelWidth={0}
          xAxisThickness={0}
          xAxisLabelTextStyle={{ color: "#747474", fontSize: 12 }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    alignSelf: "center",
    paddingHorizontal: 15,
    paddingVertical: 14,
    gap: 12,
    borderRadius: 3,
    shadowColor: "#6F6F6F",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 20,
    backgroundColor: "#fff",
  },
  historyTextContent: {
    gap: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "#5C5C5C",
  },
  subtitle: {
    fontSize: 13,
    color: "#5C5C5C",
  },
  chartContainer: {
    alignItems: "flex-start",
  },
  labelText: {
    fontSize: 12,
    color: "#5C5C5C",
    marginBottom: 4,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  noDataText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingVertical: 20,
  },
});

export default HistoryCard;
