import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLeituraWebSocket } from "../../hooks/UseLeituraWebSocket";
import Drop from "../../../assets/icons/thing/drop.svg";

const { width } = Dimensions.get("window");

const CarouselCardOverview = () => {
  // const leitura = useLeituraWebSocket();
  return (
    <LinearGradient
      start={{ x: 1, y: 0 }}
      end={{ x: 1, y: 1 }}
      colors={["#B9E177", "#69C098"]}
      style={styles.cardContainer}
    >
      <View style={styles.mainContent}>
        <View style={styles.textContent}>
          <Text style={styles.title}>Umidade do Solo</Text>
          <Text style={styles.subtitle}>
            Verifique a umidade do solo da sua plantação.
          </Text>
        </View>

        <View style={styles.percentContent}>
          <Text style={styles.percent}>00%</Text>
          <Drop style={styles.drop} />
        </View>
      </View>

      <View style={styles.pagination}>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: width - 40,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 23,
    alignSelf: "center",
    gap: 14,
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 38,
  },
  textContent: {
    flex: 1,
    gap: 6,
  },
  title: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#fff",
    fontSize: 14,
  },
  percentContent: {
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  percent: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  drop: {
    marginVertical: 8,
  },
  pagination: {
    // marginTop: 20,
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
    opacity: 0.5,
  },
  dotActive: {
    width: 14,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
});

export default CarouselCardOverview;
