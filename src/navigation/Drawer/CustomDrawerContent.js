import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Back from "../../../assets/icons/menu/back.svg";
import Exit from "../../../assets/icons/menu/exit.svg";

const CustomDrawerContent = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollArea}
      >
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.goBack}
        >
          <Back />
          <Text style={styles.goBackText}>Voltar</Text>
        </TouchableOpacity>

        <View style={styles.menuArea}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={styles.logoutArea}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Welcome')}>
          <View style={styles.logoutButton}>
            <Exit />
            <Text style={styles.logoutText}>Sair</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollArea: {
    paddingTop: 55,
  },
  goBack: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#59C893",
    gap: 15,
  },
  goBackText: {
    color: "#545555",
    fontSize: 16,
  },
  menuArea: {
    marginTop: 20,
  },
  logoutArea: {
    borderTopWidth: 1,
    borderColor: "#e4e4e4",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  logoutText: {
    fontSize: 16,
    color: "#898989",
  },
});

export default CustomDrawerContent;
