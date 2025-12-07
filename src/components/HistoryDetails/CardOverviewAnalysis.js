import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getOccurrenceHistory } from "../../services/Api";
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
      const occurrences = await getOccurrenceHistory(farmId, token);

      if (occurrences && occurrences.length > 0) {
        const totalInfected = occurrences.reduce(
          (sum, occ) => sum + (occ.infectedCounts || 0),
          0
        );
        const totalHealthy = occurrences.reduce(
          (sum, occ) => sum + (occ.healthyCounts || 0),
          0
        );
        const totalPlants = occurrences.reduce(
          (sum, occ) => sum + (occ.totalCounts || 0),
          0
        );

        setAnthracnoseCount(totalInfected);
        setHealthyCount(totalHealthy);
        setTotalCount(totalPlants);
      }
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
