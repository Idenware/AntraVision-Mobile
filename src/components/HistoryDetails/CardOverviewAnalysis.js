import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOccurrenceHistory, getAnalysisHistory } from "../../services/Api";
import Anthracnose from "../../../assets/icons/thing/fungus.svg";
import Heart from "../../../assets/icons/thing/heart.svg";
import PalmHeart from "../../../assets/icons/thing/palm-heart.svg";

const CardOverviewAnalysis = ({ farmId }) => {
  const [anthracnoseCount, setAnthracnoseCount] = useState(0);
  const [healthyCount, setHealthyCount] = useState(0);
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

      let healthyTotal = 0;
      let infectedTotal = 0;
      let totalSum = 0;

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
              healthyTotal += 1;
            } else if (
              prediction.includes("doente") ||
              prediction === "planta doente"
            ) {
              infectedTotal += 1;
            }
          }
        });
      }

      if (occurrences && occurrences.length > 0) {
        occurrences.forEach((occurrence) => {
          const occDate = new Date(occurrence.date || occurrence.createdAt);

          if (occDate >= today && occDate <= todayEnd) {
            infectedTotal += occurrence.infectedCounts || 0;
            healthyTotal += occurrence.healthyCounts || 0;
            totalSum += occurrence.totalCounts || 0;
          }
        });
      }

      const calculatedTotal = healthyTotal + infectedTotal;

      if (totalSum > 0 && calculatedTotal > totalSum) {
        const ratio = totalSum / calculatedTotal;
        healthyTotal = Math.round(healthyTotal * ratio);
        infectedTotal = Math.round(infectedTotal * ratio);
      }

      const finalTotal = Math.max(calculatedTotal, totalSum);

      setAnthracnoseCount(infectedTotal);
      setHealthyCount(healthyTotal);
      setTotalCount(finalTotal);

      console.log("CardOverviewAnalysis - Dados do dia:", {
        infectedTotal,
        healthyTotal,
        finalTotal,
      });
    } catch (error) {
      console.error("Erro ao carregar dados de ocorrências:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#69C098" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={["#81C3A2", "#81C3A2"]}
        style={styles.cardInfo}
      >
        <View style={styles.cardContentInfo}>
          <Anthracnose />
          <View style={styles.cardTextInfo}>
            <Text style={styles.statNumber}>{anthracnoseCount}</Text>
            <Text style={styles.statLabel}>Antracnose</Text>
          </View>
        </View>
      </LinearGradient>
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={["#AACC9A", "#AACC9A"]}
        style={styles.cardInfo}
      >
        <View style={styles.cardContentInfo}>
          <Heart />
          <View style={styles.cardTextInfo}>
            <Text style={styles.statNumber}>{healthyCount}</Text>
            <Text style={styles.statLabel}>Saudável</Text>
          </View>
        </View>
      </LinearGradient>
      <LinearGradient
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={["#97CDA1", "#97CDA1"]}
        style={styles.cardInfo}
      >
        <View style={styles.cardContentInfo}>
          <PalmHeart />
          <View style={styles.cardTextInfo}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total de Mudas</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardInfo: {
    borderRadius: 5,
    paddingHorizontal: 9,
    paddingVertical: 12,
  },
  cardContentInfo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },
  cardTextInfo: {
    width: "auto",
    flexDirection: "column",
  },
  statNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
});

export default CardOverviewAnalysis;
