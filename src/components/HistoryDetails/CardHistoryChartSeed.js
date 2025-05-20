import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

const CardHistoryChartSeed = () => {
  const data = [
    {
      value: 40,
      label: "06",
      frontColor: "#ADF9AC",
      topLabelComponent: () => <Text style={styles.labelText}>40</Text>,
    },
    {
      value: 30,
      label: "07",
      frontColor: "#FFD868",
      topLabelComponent: () => <Text style={styles.labelText}>30</Text>,
    },
    {
      value: 45,
      label: "08",
      frontColor: "#BCEC9F",
      topLabelComponent: () => <Text style={styles.labelText}>45</Text>,
    },
    {
      value: 70,
      label: "09",
      frontColor: "#ADF9AC",
      topLabelComponent: () => <Text style={styles.labelText}>70</Text>,
    },
    {
      value: 55,
      label: "10",
      frontColor: "#BCEC9F",
      topLabelComponent: () => <Text style={styles.labelText}>55</Text>,
    },
    {
      value: 60,
      label: "11",
      frontColor: "#FFD868",
      topLabelComponent: () => <Text style={styles.labelText}>60</Text>,
    },
  ];

  return (
    <View style={styles.cardContainer}>
      <View style={styles.textContent}>
        <Text style={styles.title}>Idade da Planta (meses)</Text>
        <Text style={styles.subtitle}>
          Índices de idade em meses de plantas contaminadas
        </Text>
      </View>
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
    backgroundColor: "#FDFDFD",
    shadowColor: "#BABABA",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  textContent: {
    marginBottom: 12,
  },
  title: {
    color: "#2F2F2F",
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#848484",
    fontSize: 12,
  },
  chartContainer: {
    alignItems: "flex-start",
  },
  labelText: {
    color: "#333",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
});

export default CardHistoryChartSeed;
