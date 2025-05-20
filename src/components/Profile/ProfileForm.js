import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import User from "../../../assets/icons/profile/user.svg";
import Email from "../../../assets/icons/profile/email.svg";
import Phone from "../../../assets/icons/profile/phone.svg";
import Password from "../../../assets/icons/profile/password.svg";

const ProfileForm = () => {
  return (
    <View style={styles.form}>
      <View style={styles.inputMainContainer}>
        <Text style={styles.label}>NOME DE USUÁRIO</Text>
        <View style={styles.inputContainer}>
          <User />
          <TextInput
            style={styles.input}
            //   value={username}
            //   onChangeText={setUsername}
            value="Sergio Pereira"
            keyboardType="default"
            placeholderTextColor="#A4A8B1"
          />
        </View>
      </View>

      <View style={styles.inputMainContainer}>
        <Text style={styles.label}>EMAIL</Text>
        <View style={styles.inputContainer}>
          <Email />
          <TextInput
            style={styles.input}
            //   value={username}
            //   onChangeText={setUsername}
            value="sergiopereira@gmail.com"
            keyboardType="default"
            placeholderTextColor="#A4A8B1"
          />
        </View>
      </View>

      <View style={styles.inputMainContainer}>
        <Text style={styles.label}>CELULAR</Text>
        <View style={styles.inputContainer}>
          <Phone />
          <TextInput
            style={styles.input}
            //   value={username}
            //   onChangeText={setUsername}
            value="+55 (13) 99875-2591"
            keyboardType="numeric"
            placeholderTextColor="#A4A8B1"
          />
        </View>
      </View>

      <View style={styles.inputMainContainer}>
        <Text style={styles.label}>SENHA</Text>
        <View style={styles.inputContainer}>
          <Password />
          <TextInput
            style={styles.input}
            //   value={username}
            //   onChangeText={setUsername}
            value="+55 (13) 99875-2591"
            keyboardType="default"
            secureTextEntry
            placeholderTextColor="#A4A8B1"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <LinearGradient
          colors={["#B8DF78", "#5ED6A5"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    paddingTop: 15,
    paddingHorizontal: 20,
    gap: 15,
  },
  inputMainContainer: {
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

export default ProfileForm;
