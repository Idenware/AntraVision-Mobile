import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { ProgressBar } from "react-native-paper";

const { width } = Dimensions.get("window");

const CardHistoryProgressBar = () => {
  const [progress, setProgress] = React.useState(0.3);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.textContent}>
        <Text style={styles.title}>
          Média de plantas com Antracnose por dia
        </Text>
        <Text style={styles.subtitle}>25 de 100 pupunheiras</Text>
      </View>
      <ProgressBar progress={progress} color="#FFBF08" style={styles.progress} />
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
});

export default CardHistoryProgressBar;
