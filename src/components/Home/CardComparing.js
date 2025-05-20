import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Sun from "../../../assets/icons/thing/sun.svg";

const { width } = Dimensions.get("window");

const CardComparing = () => {
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
            O Sítio B apresenta índices de ocorrência da doença maiores que o
            Sítio A.
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
