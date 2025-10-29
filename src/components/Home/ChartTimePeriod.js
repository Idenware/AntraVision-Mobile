import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";

const timeRanges = ["Últimas horas", "Últimas semanas", "Últimos meses"];
const screenWidth = Dimensions.get("window").width;
const padding = 27;

const CHART_DATA = {
  "Últimas horas": [70, 65, 40, 55, 60],
  "Últimas semanas": [50, 60, 45, 70, 55],
  "Últimos meses": [30, 40, 60, 50, 70],
};

const generateLabels = (range) => {
  const now = new Date();
  switch (range) {
    case "Últimas horas": {
      const labels = [];
      for (let i = 4; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 60 * 60 * 1000);
        labels.push(`${d.getHours().toString().padStart(2, "0")}:00`);
      }
      return labels;
    }
    case "Últimas semanas": {
      return ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"];
    }
    case "Últimos meses": {
      const labels = [];
      const monthNames = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez",
      ];
      const currentMonth = now.getMonth(); // 0-11
      for (let i = 4; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        labels.push(monthNames[monthIndex]);
      }
      return labels;
    }
    default:
      return [];
  }
};

const ChartTimePeriod = () => {
  const [selectedRange, setSelectedRange] = useState("Últimas horas");

  const values = CHART_DATA[selectedRange];

  const labels = useMemo(() => generateLabels(selectedRange), [selectedRange]);

  const chartData = values.map((value, i) => ({
    value,
    label: labels[i],
    hideDataPoint: true,
  }));

  const spacing =
    chartData.length > 1
      ? (screenWidth - padding * 2) / (chartData.length - 1)
      : 50;

  return (
    <View style={styles.container}>
      <View style={styles.rangeSelector}>
        {timeRanges.map((range) => {
          const isSelected = selectedRange === range;

          return (
            <TouchableOpacity
              key={range}
              onPress={() => setSelectedRange(range)}
            >
              {isSelected ? (
                <LinearGradient
                  start={{ x: 1, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  colors={["#B8DF78", "#69C098"]}
                  style={styles.gradientButton}
                >
                  <Text style={[styles.rangeText, styles.activeRangeText]}>
                    {range}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.rangeButton}>
                  <Text style={styles.rangeText}>{range}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <LineChart
        key={selectedRange}
        data={chartData}
        areaChart
        width={screenWidth}
        height={200}
        thickness={2}
        color="#6bdc91"
        startFillColor="#6bdc91"
        endFillColor="#6bdc91"
        startOpacity={0.1}
        endOpacity={0.05}
        hideYAxisText
        yAxisColor="transparent"
        xAxisColor="transparent"
        xAxisLabelTextStyle={styles.xAxisLabel}
        showDataPoint
        dataPointsColor="#00c389"
        dataPointsRadius={4}
        hideRules
        isAnimated
        animationDuration={500}
        noOfSections={4}
        spacing={spacing}
        initialSpacing={0}
        endSpacing={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  rangeSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  rangeButton: {
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderRadius: 6,
    backgroundColor: "#F2F0EE",
    alignItems: "center",
    justifyContent: "center",
  },
  gradientButton: {
    paddingHorizontal: 12,
    paddingVertical: 13,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  rangeText: {
    color: "#424242",
    fontSize: 11,
  },
  activeRangeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  xAxisLabel: {
    color: "#888",
    fontSize: 12,
  },
});

export default ChartTimePeriod;
