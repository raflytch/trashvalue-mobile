import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { Redirect } from "expo-router";
import { RootState } from "@/features/store";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const checkToken = async () => {
      await SecureStore.getItemAsync("token");
    };

    checkToken();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#00FF00" />
        <Text className="mt-4 font-montserrat text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    if (user?.role === "USER") {
      return <Redirect href="/(tabs)/index" />;
    }
  }

  return <Redirect href="/(untabs)/login" />;
}
