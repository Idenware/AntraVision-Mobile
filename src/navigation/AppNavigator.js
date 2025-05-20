import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "../screens/Welcome/WelcomeScreen";
import SignInScreen from "../screens/SignIn/SignInScreen";
import SignUpScreen from "../screens/SignUp/SignUpScreen";
import SignUpValidationScreen from "../screens/SignUp/SignUpValidationScreen";
import HistoryDetailsScreen from "../screens/History/HistoryDetailsScreen";
import CameraScreen from "../screens/Camera/CameraScreen";
import ScanRedirect from "./ScanRedirect";

import DrawerNavigator from "./Drawer/DrawerNavigator";
import ProfileScreen from "../screens/Profile/ProfileScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen
        name="SignUpValidation"
        component={SignUpValidationScreen}
      />
      <Stack.Screen name="Home" component={DrawerNavigator} />
      <Stack.Screen name="HistoryDetails" component={HistoryDetailsScreen} />
      <Stack.Screen name="ScanRedirect" component={ScanRedirect} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
