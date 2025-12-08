import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalysisHistory, getOccurrenceHistory } from "../../services/Api";

const { width } = Dimensions.get("window");

const CardChartHistoryDetails = ({ farmId }) => {
  const [chartData, setChartData] = useState({
    greenLine: [],
    redLine: [],
    maxYValue: 100,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("CardChartHistoryDetails - farmId recebido:", farmId);
    if (farmId) {
      loadOccurrenceData();
    } else {
      console.log("CardChartHistoryDetails - farmId não fornecido");
      setLoading(false);
    }
  }, [farmId]);

  const loadOccurrenceData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      console.log("Buscando dados para farmId:", farmId);

      const [analyses, occurrences] = await Promise.all([
        getAnalysisHistory(farmId, token),
        getOccurrenceHistory(farmId, token),
      ]);

      console.log("Análises da IA recebidas:", analyses?.length || 0);
      console.log("Ocorrências recebidas:", occurrences?.length || 0);

      if (analyses && analyses.length > 0) {
        console.log("Primeira análise:", analyses[0]);
      }
      if (occurrences && occurrences.length > 0) {
        console.log("Primeira ocorrência:", occurrences[0]);
      }

      const monthlyData = processMonthlyData(analyses, occurrences);
      console.log(
        "Dados processados - Verde (Saudável):",
        monthlyData.greenLine
      );
      console.log(
        "Dados processados - Vermelho (Doente):",
        monthlyData.redLine
      );
      console.log("Máximo do eixo Y:", monthlyData.maxYValue);
      setChartData(monthlyData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setChartData({ greenLine: [], redLine: [], maxYValue: 100 });
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = (analyses, occurrences) => {
    const months = Array.from({ length: 12 }, (_, i) => i);
    const monthlyStats = months.map(() => ({
      healthy: 0,
      infected: 0,
      count: 0,
    }));

    if (analyses && analyses.length > 0) {
      analyses.forEach((analysis) => {
        const date = new Date(
          analysis.timestamp ||
            analysis.createdAt ||
            analysis._id.toString().substring(0, 8)
        );
        const month = date.getMonth();

        if (month >= 0 && month < 12) {
          const prediction = analysis.prediction?.toLowerCase() || "";

          if (
            prediction.includes("saudável") ||
            prediction.includes("saudavel") ||
            prediction === "planta saudável"
          ) {
            monthlyStats[month].healthy += 1;
          } else if (
            prediction.includes("doente") ||
            prediction === "planta doente"
          ) {
            monthlyStats[month].infected += 1;
          }
        }
      });
    }

    if (occurrences && occurrences.length > 0) {
      occurrences.forEach((occurrence) => {
        const date = new Date(occurrence.date || occurrence.createdAt);
        const month = date.getMonth();

        if (month >= 0 && month < 12) {
          monthlyStats[month].infected += occurrence.infectedCounts || 0;
          monthlyStats[month].healthy += occurrence.healthyCounts || 0;
          monthlyStats[month].count += 1;
        }
      });
    }

    // Calcula o máximo do eixo Y: 100 * número de ocorrências no mês com mais registros
    const maxOccurrencesInMonth = Math.max(
      ...monthlyStats.map((stats) => stats.count),
      1
    );
    const maxYValue = maxOccurrencesInMonth * 100;

    const greenLine = monthlyStats.map((stats) => ({
      value: stats.healthy || 0,
      dataPointText: stats.healthy > 0 ? stats.healthy.toString() : "",
      textShiftY: -10,
      textShiftX: -5,
      textColor: "#A6E143",
      textFontSize: 10,
      showDataPoint: stats.healthy > 0,
      dataPointColor: "#A6E143",
    }));

    const redLine = monthlyStats.map((stats) => ({
      value: stats.infected || 0,
      dataPointText: stats.infected > 0 ? stats.infected.toString() : "",
      textShiftY: -10,
      textShiftX: -5,
      textColor: "#FA8585",
      textFontSize: 10,
      showDataPoint: stats.infected > 0,
      dataPointColor: "#FA8585",
    }));

    return { greenLine, redLine, maxYValue };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#69C098" />
      </View>
    );
  }

  const hasData =
    chartData.greenLine.length > 0 || chartData.redLine.length > 0;

  return (
    <View style={styles.container}>
      {hasData ? (
        <LineChart
          data={chartData.greenLine}
          data2={chartData.redLine}
          width={width - 80}
          height={250}
          maxValue={chartData.maxYValue}
          color1="#A6E143"
          color2="#FA8585"
          thickness={2}
          areaChart
          startFillColor="#d1d1d1"
          endFillColor="#bdbdbd"
          startOpacity={0.05}
          endOpacity={0.1}
          yAxisColor="#E0E0E0"
          yAxisThickness={1}
          yAxisTextStyle={styles.yAxisLabel}
          yAxisLabelWidth={35}
          xAxisColor="#E0E0E0"
          xAxisThickness={1}
          xAxisLabelTexts={[
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez",
          ]}
          xAxisLabelTextStyle={styles.xAxisLabel}
          isAnimated
          animateOnDataChange
          animationDuration={500}
          rulesColor="#E0E0E0"
          rulesType="solid"
          showVerticalLines
          verticalLinesColor="#E0E0E0"
          noOfSections={4}
          initialSpacing={5}
          endSpacing={10}
          showDataPoint={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum dado disponível</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    overflow: "hidden",
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontSize: 14,
  },
  xAxisLabel: {
    color: "#888",
    fontSize: 12,
  },
  yAxisLabel: {
    color: "#888",
    fontSize: 11,
  },
});

export default CardChartHistoryDetails;
