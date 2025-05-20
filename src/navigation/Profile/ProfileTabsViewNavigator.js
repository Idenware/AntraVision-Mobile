import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ProfileForm from "../../components/Profile/ProfileForm";
import AddressForm from "../../components/Profile/AddressForm";
import { LinearGradient } from "expo-linear-gradient";

const ProfileTabsViewNavigator = () => {
  const [activeTab, setActiveTab] = useState("cadastro");

  const renderTabContent = () => {
    if (activeTab === "cadastro") return <ProfileForm />;
    return <AddressForm />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabWrapper}>
        <View style={styles.tabBackground}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "cadastro" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("cadastro")}
          >
            {activeTab === "cadastro" ? (
              <LinearGradient
                colors={["#B8DF78", "#5ED6A5"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientTab}
              >
                <Text style={styles.activeTabText}>CADASTRO</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.inactiveTabText}>CADASTRO</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "enderecos" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("enderecos")}
          >
            {activeTab === "enderecos" ? (
              <LinearGradient
                colors={["#B8DF78", "#5ED6A5"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientTab}
              >
                <Text style={styles.activeTabText}>ENDEREÇOS</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.inactiveTabText}>ENDEREÇOS</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>{renderTabContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  tabWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  tabBackground: {
    flexDirection: "row",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 30,
  },
  tabButton: {
    borderRadius: 30,
    overflow: "hidden",
    alignItems: "center",
  },
  gradientTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  inactiveTabText: {
    color: "#26C488",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  contentContainer: {
    paddingBottom: 75,
  },
});

export default ProfileTabsViewNavigator;
