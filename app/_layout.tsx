import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { ReduxProvider } from "@/providers/redux-provider";
import { QueryProvider } from "@/providers/query-provider";
import "./global.css";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("@/assets/images/logotrashvalue.png")}
            style={{ width: 100, height: 100, marginBottom: 20 }}
            resizeMode="contain"
          />
          <ActivityIndicator
            size="large"
            color="#00FF00"
            style={{ marginBottom: 16 }}
          />
        </View>
      </View>
    );
  }

  return (
    <ReduxProvider>
      <QueryProvider>
        <Slot />
      </QueryProvider>
    </ReduxProvider>
  );
}
