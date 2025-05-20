import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Anthracnose from "../../../assets/icons/thing/fungus.svg";
import Heart from "../../../assets/icons/thing/heart.svg";
import PalmHeart from "../../../assets/icons/thing/palm-heart.svg";

const CardOverviewAnalysis = () => {
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
            <Text style={styles.statNumber}>70</Text>
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
            <Text style={styles.statNumber}>85</Text>
            <Text style={styles.statLabel}>Saudáveis</Text>
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
            <Text style={styles.statNumber}>155</Text>
            <Text style={styles.statLabel}>Total Plantas</Text>
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
    gap: 9
  },
  cardTextInfo: {
    width: "auto",
    flexDirection: "column",
  },
  statNumber: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff"
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff"
  }
});

export default CardOverviewAnalysis;
