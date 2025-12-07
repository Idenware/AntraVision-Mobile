import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFarmById, selectUserFarm } from "../../services/Api";
import Farm from "../../../assets/icons/thing/farm.svg";

const AddressCard = ({ farm, isSelected, onSelect }) => {
  const [loading, setLoading] = useState(false);

  const handleSelectFarm = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");

      if (token && userJson) {
        await selectUserFarm(farm._id, token);

        const user = JSON.parse(userJson);
        const updatedUser = { ...user, selectedFarm: farm._id };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));

        if (onSelect) {
          onSelect(farm._id);
        }

        Alert.alert("Sucesso", `Fazenda "${farm.name}" selecionada!`);
      }
    } catch (error) {
      console.error("Erro ao selecionar fazenda:", error);
      Alert.alert("Erro", "Não foi possível selecionar a fazenda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.farmContainer, isSelected && styles.selectedFarmContainer]}
      onPress={handleSelectFarm}
      disabled={loading}
    >
      <Text style={styles.addressText}>
        {isSelected ? "Fazenda Selecionada" : "Endereço"}
      </Text>
      <View style={styles.farmContent}>
        <Farm />
        <Text style={[styles.farmText, isSelected && styles.selectedFarmText]}>
          {farm.name}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#28C182" />
        ) : (
          <TextInput
            style={styles.input}
            value={farm.address}
            keyboardType="default"
            placeholderTextColor="#A4A8B1"
            editable={false}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  form: {
    paddingTop: 15,
    paddingHorizontal: 20,
    gap: 15,
  },
  farmContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 17,
    paddingVertical: 15,
    gap: 10,
    borderRadius: 10,
    shadowColor: "#BEBEBE",
    shadowOpacity: 0.13,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 9,
  },
  farmContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addressText: {
    fontSize: 10.5,
    color: "#9B9FA3",
    textTransform: "uppercase",
  },
  farmText: {
    fontSize: 10.5,
    color: "#28C182",
    textTransform: "uppercase",
  },
  selectedFarmContainer: {
    borderWidth: 2,
    borderColor: "#28C182",
  },
  selectedFarmText: {
    fontWeight: "bold",
  },
  inputMainContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 17,
    paddingVertical: 15,
    gap: 10,
    borderRadius: 18,
    shadowColor: "#BEBEBE",
    shadowOpacity: 0.13,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 9,
  },
  label: {
    fontSize: 11,
    color: "#9B9FA3",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#D9DBDF",
    paddingHorizontal: 5,
    paddingBottom: 4,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
    color: "#000",
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  gradientBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    textTransform: "uppercase",
  },
});

export default AddressCard;
