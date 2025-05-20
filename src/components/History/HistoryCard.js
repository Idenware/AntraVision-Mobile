import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";

const { width } = Dimensions.get("window");

const getBarColor = (value) => {
  if (value >= 35) return "#FF6B6B";    
  if (value >= 20) return "#FFD868";    
  return "#BCEC9F";                     
};

const HistoryCard = ({ onPress }) => {
  const rawData = [5, 21, 15, 30, 40, 10]; 

  const data = rawData.map((value, index) => ({
    value,
    label: String(index + 1).padStart(2, "0"),
    frontColor: getBarColor(value),
    topLabelComponent: () => <Text style={styles.labelText}>{value}</Text>,
  }));

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.textContent}>
        <View style={styles.historyTextContent}>
          <Text style={styles.title}>Intensidade da doença por Setor</Text>
          <Text style={styles.subtitle}>Propriedade 1</Text>
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: "#ccc" }} />
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    alignSelf: "center",
    paddingHorizontal: 15,
    paddingVertical: 14,
    gap: 12,
    borderRadius: 3,
    shadowColor: "#6F6F6F",
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 20,
    backgroundColor: "#fff",
  },
  historyTextContent: {
    gap: 1,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: "#5C5C5C",
  },
  subtitle: {
    fontSize: 13,
    color: "#5C5C5C",
  },
  chartContainer: {
    alignItems: "flex-start",
  },
  labelText: {
    fontSize: 12,
    color: "#5C5C5C",
    marginBottom: 4,
    textAlign: "center",
  },
});

export default HistoryCard;
