import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";

const CardChartHistoryDetails = () => {
  const greenLine = [
    { value: 90, hideDataPoint: true },
    { value: 85, hideDataPoint: true },
    { value: 100, hideDataPoint: true },
    { value: 110, hideDataPoint: true },
    { value: 95, hideDataPoint: true },
    { value: 105, hideDataPoint: true },
    { value: 104, hideDataPoint: true },
    { value: 102, hideDataPoint: true },
    { value: 108, hideDataPoint: true },
    { value: 101, hideDataPoint: true },
    { value: 97, hideDataPoint: true },
    { value: 88, hideDataPoint: true },
  ];

  const redLine = [
    { value: 60, hideDataPoint: true },
    { value: 62, hideDataPoint: true },
    { value: 55, hideDataPoint: true },
    { value: 45, hideDataPoint: true },
    { value: 40, hideDataPoint: true },
    { value: 50, hideDataPoint: true },
    { value: 48, hideDataPoint: true },
    { value: 44, hideDataPoint: true },
    { value: 39, hideDataPoint: true },
    { value: 47, hideDataPoint: true },
    { value: 53, hideDataPoint: true },
    { value: 55, hideDataPoint: true },
  ];
  return (
    <View style={styles.container}>
      <LineChart
        data={greenLine}
        data2={redLine}
        width={350}
        height={200}
        color1="#A6E143"
        color2="#FA8585"
        thickness={2}
        areaChart
        startFillColor="#d1d1d1"
        endFillColor="#bdbdbd"
        startOpacity={0.05}
        endOpacity={0.1}
        hideYAxisText
        yAxisColor="transparent"
        xAxisColor="transparent"
        xAxisLabelTexts={[
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]}
        xAxisLabelTextStyle={styles.xAxisLabel}
        isAnimated
        animateOnDataChange
        animationDuration={500}
        hideRules
        initialSpacing={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  rangeSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  rangeText: {
    color: "#424242",
    fontSize: 11,
  },
  xAxisLabel: {
    color: "#888",
    fontSize: 12,
  },
});

export default CardChartHistoryDetails;
