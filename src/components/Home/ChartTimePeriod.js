import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  DeviceEventEmitter,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";
import { getAnalysisHistory, getOccurrenceHistory } from "../../services/Api";

const TIME_RANGES = ["Últimas Horas", "Últimas Semanas", "Últimos Meses"];
const SCREEN_WIDTH = Dimensions.get("window").width;
const PADDING = 27;
const PERIODS_COUNT = 5;
const MONTH_NAMES = [
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
];

const getTimeRange = (range, index, now) => {
  const ranges = {
    "Últimas Horas": () => {
      const start = new Date(now);
      start.setHours(now.getHours() - index, 0, 0, 0);
      const end = new Date(start);
      end.setHours(start.getHours() + 1);
      return { start, end };
    },
    "Últimas Semanas": () => {
      const end = new Date(now);
      end.setDate(now.getDate() - index * 7);
      end.setHours(23, 59, 59, 999);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    },
    "Últimos Meses": () => {
      const targetDate = new Date(now);
      targetDate.setMonth(now.getMonth() - index);
      const start = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        1
      );
      const end = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      return { start, end };
    },
  };
  return ranges[range]();
};

const generateLabel = (range, index, now) => {
  const labels = {
    "Últimas Horas": () => {
      const d = new Date(now);
      d.setHours(now.getHours() - index);
      return `${d.getHours().toString().padStart(2, "0")}:00`;
    },
    "Últimas Semanas": () => {
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - index * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      return `${weekStart.getDate()}/${weekStart.getMonth() + 1}`;
    },
    "Últimos Meses": () => {
      const targetDate = new Date(now);
      targetDate.setMonth(now.getMonth() - index);
      return MONTH_NAMES[targetDate.getMonth()];
    },
  };
  return labels[range]();
};

const ChartTimePeriod = () => {
  const [selectedRange, setSelectedRange] = useState("Últimas Horas");
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [farmId, setFarmId] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userJson = await AsyncStorage.getItem("user");
        if (userJson) {
          const user = JSON.parse(userJson);
          setFarmId(user.selectedFarm);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "farmSelected",
      (selectedFarmId) => {
        setFarmId(selectedFarmId);
      }
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!farmId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await AsyncStorage.getItem("token");

        const [analysisData, occurrenceData] = await Promise.all([
          getAnalysisHistory(farmId, token),
          getOccurrenceHistory(farmId, token),
        ]);

        const diseaseAnalyses = (analysisData || []).filter(
          (item) => item.prediction === "Planta doente"
        );

        const processedData = [];

        diseaseAnalyses.forEach((analysis) => {
          const timestamp = analysis.timestamp
            ? new Date(analysis.timestamp)
            : analysis.createdAt
            ? new Date(analysis.createdAt)
            : new Date(
                parseInt(analysis._id.toString().substring(0, 8), 16) * 1000
              );

          processedData.push({
            timestamp,
            value: 1,
            type: "disease",
          });
        });

        (occurrenceData || []).forEach((occurrence) => {
          processedData.push({
            timestamp: new Date(occurrence.date),
            value: occurrence.infectedCounts || 0,
            type: "infection",
          });
        });

        setChartDataPoints(processedData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setChartDataPoints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [farmId]);

  const values = useMemo(() => {
    if (!chartDataPoints.length) return Array(PERIODS_COUNT).fill(0);

    const now = new Date();
    return Array.from({ length: PERIODS_COUNT }, (_, i) => {
      const index = PERIODS_COUNT - 1 - i;
      const { start, end } = getTimeRange(selectedRange, index, now);

      return chartDataPoints
        .filter((item) => {
          return item.timestamp >= start && item.timestamp <= end;
        })
        .reduce((sum, item) => sum + item.value, 0);
    });
  }, [chartDataPoints, selectedRange]);

  const labels = useMemo(() => {
    const now = new Date();
    return Array.from({ length: PERIODS_COUNT }, (_, i) => {
      const index = PERIODS_COUNT - 1 - i;
      return generateLabel(selectedRange, index, now);
    });
  }, [selectedRange]);

  const chartData = useMemo(
    () =>
      values.map((value, i) => ({
        value,
        label: labels[i],
        dataPointText: value.toString(),
      })),
    [values, labels]
  );

  const spacing = useMemo(
    () =>
      chartData.length > 1
        ? (SCREEN_WIDTH - PADDING * 2) / (chartData.length - 1)
        : 50,
    [chartData.length]
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#69C098" />
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.rangeSelector}>
        {TIME_RANGES.map((range) => {
          const isSelected = selectedRange === range;
          const ButtonWrapper = isSelected ? LinearGradient : View;
          const buttonProps = isSelected
            ? {
                start: { x: 1, y: 0 },
                end: { x: 1, y: 1 },
                colors: ["#B8DF78", "#69C098"],
                style: styles.gradientButton,
              }
            : { style: styles.rangeButton };

          return (
            <TouchableOpacity
              key={range}
              onPress={() => setSelectedRange(range)}
            >
              <ButtonWrapper {...buttonProps}>
                <Text
                  style={[
                    styles.rangeText,
                    isSelected && styles.activeRangeText,
                  ]}
                >
                  {range}
                </Text>
              </ButtonWrapper>
            </TouchableOpacity>
          );
        })}
      </View>

      <LineChart
        key={selectedRange}
        data={chartData}
        areaChart
        width={SCREEN_WIDTH}
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
        dataPointsRadius={5}
        textShiftY={-10}
        textShiftX={0}
        textColor="#484C52"
        textFontSize={12}
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
  loadingContainer: {
    minHeight: 250,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: "#888",
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
