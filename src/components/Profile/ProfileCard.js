import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Change from "../../../assets/icons/actions/change.svg";
const { width } = Dimensions.get("window");

const ProfileCard = () => {
  return (
    <View style={styles.profileCard}>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1535643302794-19c3804b874b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8b2xkJTIwbWFufGVufDB8fDB8fHww",
          }}
          style={styles.avatar}
        />
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.profileFirstSection}>
          <View>
            <Text style={styles.name}>Sergio Pereira</Text>
            <Text style={styles.location}>Juquiá-SP, Brasil</Text>
          </View>
          <View>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>sergiopereira@gmail.com</Text>
          </View>
          <View>
            <Text style={styles.label}>Celular</Text>
            <Text style={styles.value}>+55 (13) 99875-2591</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.photoButton}>
          <Text style={styles.photoButtonText}>Mudar Foto</Text>
          <Change/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 13,
    paddingHorizontal: 12,
    paddingVertical: 14,
    flexDirection: "row",
    gap: 15,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 4 },
    // shadowRadius: 8,
    // elevation: 6,
  },
  avatarContainer: {
    width: "40%",
    height: "100%",
  },
  avatar: {
    width: "100%",
    height: 185,
    borderRadius: 10,
    resizeMode: "cover",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "space-between",
    gap: 13,
  },
  profileFirstSection: {
    gap: 9,
  },
  name: {
    fontSize: 20,
    fontWeight: "500",
    color: "#6C6D6F",
  },
  location: {
    fontSize: 14,
    color: "#6C6D6E",
  },
  label: {
    fontSize: 12,
    color: "#6C6D6E",
    fontWeight: "500",
  },
  value: {
    fontSize: 13,
    color: "#6C6D6E",
  },
  photoButton: {
    paddingVertical: 11,
    paddingHorizontal: 8,
    backgroundColor: "#EFEFF0",
    borderRadius: 5,
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  photoButtonText: {
    fontSize: 13,
    color: "#5C5B5B",
  },
});

export default ProfileCard;
