import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Menu from "../../../assets/icons/actions/menu-light.svg";
import User from "../../../assets/icons/profile/user.svg";
import ProfileCard from "../../components/Profile/ProfileCard";
import ProfileTabsViewNavigator from "../../navigation/Profile/ProfileTabsViewNavigator";

const { width } = Dimensions.get("window");

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("cadastro");
  const profileCardRef = useRef(null);

  const handleProfileUpdate = () => {
    if (profileCardRef.current?.loadUserProfile) {
      profileCardRef.current.loadUserProfile();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={["#B8DF78", "#5ED6A5"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTextContent}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Menu />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Seu Perfil</Text>
        </View>
        <ProfileCard ref={profileCardRef} />
      </LinearGradient>

      <View style={{ flex: 1 }}>
        <ProfileTabsViewNavigator onProfileUpdate={handleProfileUpdate} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 75,
    paddingBottom: 30,
    gap: 24,
  },
  headerTextContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 96,
  },
  headerTitle: {
    fontSize: 19,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
