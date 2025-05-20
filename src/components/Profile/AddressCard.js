import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Farm from "../../../assets/icons/thing/farm.svg";

const AddressCard = () => {
  return (
    <TouchableOpacity style={styles.farmContainer}>
      <Text style={styles.addressText}>Endereço</Text>
      <View style={styles.farmContent}>
        <Farm />
        <Text style={styles.farmText}>Sítio A</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          //   value={username}
          //   onChangeText={setUsername}
          value="Av. Rua Dr. Sizenando de Carvalho, 105"
          keyboardType="default"
          placeholderTextColor="#A4A8B1"
        />
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
