import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOccurrenceHistory } from "../../services/Api";

const { width } = Dimensions.get("window");

const CardHistoryProgressBar = ({ farmId }) => {
  const [progress, setProgress] = useState(0);
  const [infectedCount, setInfectedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (farmId) {
      loadOccurrenceData();
    }
  }, [farmId]);

  const loadOccurrenceData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const occurrences = await getOccurrenceHistory(farmId, token);

      if (occurrences && occurrences.length > 0) {
        // Calcula a média diária de plantas infectadas
        const totalInfected = occurrences.reduce(
          (sum, occ) => sum + (occ.infectedCounts || 0),
          0
        );
        const totalPlants = occurrences.reduce(
          (sum, occ) => sum + (occ.totalCounts || 0),
          0
        );

        const avgInfected = Math.round(totalInfected / occurrences.length);
        const avgTotal = Math.round(totalPlants / occurrences.length);

        setInfectedCount(avgInfected);
        setTotalCount(avgTotal);

        const calculatedProgress = avgTotal > 0 ? avgInfected / avgTotal : 0;
        setProgress(calculatedProgress);
      }
    } catch (error) {
      console.error("Erro ao carregar dados de ocorrências:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.cardContainer}>
        <ActivityIndicator size="small" color="#69C098" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.textContent}>
        <Text style={styles.title}>
          Média de plantas com Antracnose por dia
        </Text>
        <Text style={styles.subtitle}>
          {infectedCount} de {totalCount} mudas
        </Text>
      </View>
      <ProgressBar
        progress={progress}
        color="#FFBF08"
        style={styles.progress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width - 40,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 21,
    alignSelf: "center",
    gap: 14,
    backgroundColor: "#FDFDFD",
    shadowColor: "#BABABA",
    shadowOpacity: 0.7,
    shadowRadius: 25,
    elevation: 20,
  },
  textContent: {
    gap: 6,
  },
  title: {
    color: "#747474",
    fontSize: 15,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#848484",
    fontSize: 12,
    flexShrink: 1,
  },
  progress: {
    height: 7,
    borderRadius: 5,
    backgroundColor: "#FFF2CE",
  },
  loadingText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});

export default CardHistoryProgressBar;
