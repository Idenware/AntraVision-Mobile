import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home/HomeScreen";
import HistoryScreen from "../screens/History/HistoryScreen";
import ScanRedirect from "./ScanRedirect";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color }) => {
        let iconName;
        if (route.name === "Home") iconName = "home";
        else if (route.name === "Scan") iconName = "scan";
        else if (route.name === "History") iconName = "time";
        return <Ionicons name={iconName} size={24} color={color} />;
      },
      tabBarActiveTintColor: "#59C893",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Scan" component={ScanRedirect} />
    <Tab.Screen name="History" component={HistoryScreen} />
  </Tab.Navigator>
);

export default TabNavigator;
