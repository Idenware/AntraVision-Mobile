import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Menu from "../../../assets/icons/menu/menu.svg";
import HistoryCard from "../../components/History/HistoryCard";
import { getFarms } from "../../services/Api";

const { width } = Dimensions.get("window");

const HistoryScreen = ({ navigation }) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadFarms();
    }, [])
  );

  const loadFarms = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const farmsData = await getFarms(token);
      setFarms(farmsData || []);
    } catch (error) {
      console.error("Erro ao carregar fazendas:", error);
      setFarms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (farm) => {
    navigation.navigate("HistoryDetails", { farm });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.firstSection}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Menu />
          </TouchableOpacity>
        </View>

        <View style={styles.greetingContent}>
          <View style={styles.greetingTextContent}>
            <Text style={styles.greeting}>
              <Text>Histórico de Ocorrência</Text>
            </Text>
            <Text style={styles.subtitle}>
              Verifique suas plantações por Propriedade
            </Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#69C098" />
          <Text style={styles.loadingText}>Carregando fazendas...</Text>
        </View>
      ) : farms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhuma fazenda cadastrada. Adicione uma fazenda no seu perfil.
          </Text>
        </View>
      ) : (
        farms.map((farm) => (
          <HistoryCard key={farm._id} farm={farm} onPress={handleCardPress} />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 75,
    paddingBottom: 30,
    gap: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  firstSection: {
    gap: 40,
  },
  greetingContent: {
    gap: 20,
  },
  greetingTextContent: {
    gap: 4,
  },
  greeting: {
    fontSize: 28,
    color: "#484C52",
  },
  bold: {
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    color: "#484C52",
  },
  chartHeaderContainer: {
    gap: 4,
  },
  chartSpan: {
    color: "#8B8B8B",
    fontSize: 16,
    fontWeight: "bold",
  },
  chartTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#555555",
  },
  chartDate: {
    fontSize: 14,
    color: "#8B8B8B",
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: "#888",
  },
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});

export default HistoryScreen;
