import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const ScanRedirect = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.navigate("Camera");
  }, []);

  return null;
};

export default ScanRedirect;
