import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { getFarms, getUserProfile, createFarm } from "../../services/Api";
import Add from "../../../assets/icons/actions/add.svg";
import Farm from "../../../assets/icons/thing/farm.svg";
import AddressCard from "./AddressCard";

const AddressForm = () => {
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newFarmName, setNewFarmName] = useState("");
  const [newFarmAddress, setNewFarmAddress] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");

      if (token && userJson) {
        const user = JSON.parse(userJson);
        const profileData = await getUserProfile(user.id, token);
        setSelectedFarmId(profileData.selectedFarm);

        const farmsData = await getFarms(token);
        setFarms(farmsData);
      }
    } catch (error) {
      console.error("Erro ao carregar fazendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFarmSelect = (farmId) => {
    setSelectedFarmId(farmId);
  };

  const handleAddFarm = () => {
    setIsCreating(true);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewFarmName("");
    setNewFarmAddress("");
  };

  const handleSaveFarm = async () => {
    if (!newFarmName.trim() || !newFarmAddress.trim()) {
      Alert.alert("Atenção", "Preencha o nome e o endereço da fazenda");
      return;
    }

    try {
      setSaving(true);
      const token = await AsyncStorage.getItem("token");

      if (token) {
        const newFarm = await createFarm(
          {
            name: newFarmName,
            address: newFarmAddress,
          },
          token
        );

        setFarms([...farms, newFarm]);
        setIsCreating(false);
        setNewFarmName("");
        setNewFarmAddress("");
        Alert.alert("Sucesso", "Fazenda criada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao criar fazenda:", error);
      Alert.alert("Erro", "Não foi possível criar a fazenda");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28C182" />
      </View>
    );
  }

  return (
    <View style={styles.form}>
      {isCreating ? (
        <View style={styles.farmContainer}>
          <Text style={styles.addressText}>Nova Fazenda</Text>
          <View style={styles.farmContent}>
            <Farm />
            <TextInput
              style={styles.farmInput}
              value={newFarmName}
              onChangeText={setNewFarmName}
              placeholder="Nome da Fazenda"
              placeholderTextColor="#A4A8B1"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newFarmAddress}
              onChangeText={setNewFarmAddress}
              placeholder="Endereço completo"
              placeholderTextColor="#A4A8B1"
            />
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelCreate}
              disabled={saving}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveFarm}
              disabled={saving}
            >
              <LinearGradient
                colors={["#B8DF78", "#5ED6A5"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.saveButtonGradient}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Salvar</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={styles.farmContainer} onPress={handleAddFarm}>
          <View style={styles.farmContent}>
            <Add />
            <Text style={styles.farmText}>Adicionar outro Endereço</Text>
          </View>
        </TouchableOpacity>
      )}

      {farms.map((farm) => (
        <AddressCard
          key={farm._id}
          farm={farm}
          isSelected={farm._id === selectedFarmId}
          onSelect={handleFarmSelect}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    paddingTop: 15,
    paddingHorizontal: 20,
    gap: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
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
    gap: 10,
  },
  farmText: {
    fontSize: 10.5,
    color: "#9B9FA3",
    textTransform: "uppercase",
  },
  addressText: {
    fontSize: 10.5,
    color: "#9B9FA3",
    textTransform: "uppercase",
  },
  farmInput: {
    flex: 1,
    fontSize: 14,
    color: "#28C182",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#EFEFF0",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 12,
    color: "#5C5B5B",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  saveButton: {
    flex: 1,
    borderRadius: 6,
    overflow: "hidden",
  },
  saveButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
    textTransform: "uppercase",
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

export default AddressForm;
