import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./CustomDrawerContent";
import TabNavigator from "../TabNavigator";
import ProfileScreen from "../../screens/Profile/ProfileScreen";

import Home from "../../../assets/icons/menu/home.svg";
import Profile from "../../../assets/icons/menu/user.svg";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#59C893",
        drawerLabelStyle: {
          color: "#898989",
          gap: 4,
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          drawerIcon: () => <Home />,
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          drawerIcon: () => <Profile />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
