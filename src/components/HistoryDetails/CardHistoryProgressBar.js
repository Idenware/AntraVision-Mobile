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
import { getOccurrenceHistory, getAnalysisHistory } from "../../services/Api";

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

      const [analyses, occurrences] = await Promise.all([
        getAnalysisHistory(farmId, token),
        getOccurrenceHistory(farmId, token),
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);

      let healthyCount = 0;
      let infectedCountTotal = 0;
      let totalCountSum = 0;

      if (analyses && analyses.length > 0) {
        analyses.forEach((analysis) => {
          const analysisDate = new Date(
            analysis.timestamp ||
              analysis.createdAt ||
              analysis._id.toString().substring(0, 8)
          );

          if (analysisDate >= today && analysisDate <= todayEnd) {
            const prediction = analysis.prediction?.toLowerCase() || "";

            if (
              prediction.includes("saudável") ||
              prediction.includes("saudavel") ||
              prediction === "planta saudável"
            ) {
              healthyCount += 1;
            } else if (
              prediction.includes("doente") ||
              prediction === "planta doente"
            ) {
              infectedCountTotal += 1;
            }
          }
        });
      }

      if (occurrences && occurrences.length > 0) {
        occurrences.forEach((occurrence) => {
          const occDate = new Date(occurrence.date || occurrence.createdAt);

          if (occDate >= today && occDate <= todayEnd) {
            infectedCountTotal += occurrence.infectedCounts || 0;
            healthyCount += occurrence.healthyCounts || 0;
            totalCountSum += occurrence.totalCounts || 0;
          }
        });
      }

      const totalPlants = healthyCount + infectedCountTotal;

      if (totalCountSum > 0 && totalPlants > totalCountSum) {
        const ratio = totalCountSum / totalPlants;
        healthyCount = Math.round(healthyCount * ratio);
        infectedCountTotal = Math.round(infectedCountTotal * ratio);
      }

      const finalTotal = Math.max(totalPlants, totalCountSum);

      setInfectedCount(infectedCountTotal);
      setTotalCount(finalTotal);

      const calculatedProgress =
        finalTotal > 0 ? infectedCountTotal / finalTotal : 0;
      setProgress(calculatedProgress);

      console.log("Dados do dia atual:", {
        healthyCount,
        infectedCountTotal,
        finalTotal,
        progress: calculatedProgress,
      });
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
