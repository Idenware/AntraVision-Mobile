import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFarms, getOccurrenceHistory } from "../../services/Api";
import Sun from "../../../assets/icons/thing/sun.svg";

const { width } = Dimensions.get("window");

const CardComparing = () => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComparison();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadComparison();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadComparison = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        const farms = await getFarms(token);

        if (farms.length === 0) {
          setComparison({
            message: "Nenhuma fazenda cadastrada",
          });
          setLoading(false);
          return;
        }

        if (farms.length === 1) {
          setComparison({
            message: "Adicione mais fazendas para comparar ocorrências",
          });
          setLoading(false);
          return;
        }

        const farmsWithOccurrences = await Promise.all(
          farms.map(async (farm) => {
            try {
              const occurrences = await getOccurrenceHistory(farm._id, token);
              const totalInfected = occurrences.reduce(
                (sum, occ) => sum + (occ.infectedCounts || 0),
                0
              );
              return {
                id: farm._id,
                name: farm.name,
                totalInfected,
                occurrenceCount: occurrences.length,
              };
            } catch (error) {
              return {
                id: farm._id,
                name: farm.name,
                totalInfected: 0,
                occurrenceCount: 0,
              };
            }
          })
        );

        const sorted = farmsWithOccurrences.sort(
          (a, b) => b.totalInfected - a.totalInfected
        );

        if (sorted[0].totalInfected === 0) {
          setComparison({
            message: "Nenhuma ocorrência registrada nas fazendas",
          });
        } else {
          const topFarm = sorted[0];
          const secondFarm = sorted[1];

          if (topFarm.totalInfected === secondFarm.totalInfected) {
            setComparison({
              message: `As propriedades ${topFarm.name} e ${secondFarm.name} têm índices similares de ocorrência`,
            });
          } else {
            const difference = topFarm.totalInfected - secondFarm.totalInfected;
            setComparison({
              message: `A propriedade ${topFarm.name} possui ${difference} plantas infectadas a mais que ${secondFarm.name}`,
            });
          }
        }
      }
    } catch (error) {
      console.error("Erro ao comparar fazendas:", error);
      setComparison({
        message: "Erro ao carregar comparação",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.cardContainer}>
        <ActivityIndicator size="small" color="#28C182" />
      </View>
    );
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.mainContent}>
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          colors={["#B8DF78", "#5ED6A5"]}
          style={styles.cardIcon}
        >
          <Sun />
        </LinearGradient>
        <View style={styles.textContent}>
          <Text style={styles.title}>Comparação entre Propriedades</Text>
          <Text style={styles.subtitle}>
            {comparison?.message || "Carregando..."}
          </Text>
        </View>
      </View>
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
  mainContent: {
    flexDirection: "row",
    gap: 16,
  },
  cardIcon: {
    padding: 13,
    borderRadius: 8,
  },
  textContent: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: "#484C52",
    fontSize: 14,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#848484",
    fontSize: 11,
    flexShrink: 1,
  },
});

export default CardComparing;
