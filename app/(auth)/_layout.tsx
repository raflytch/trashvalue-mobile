import React from "react";
import { Redirect, Stack } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";

export default function AuthLayout() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (isAuthenticated) {
    if (user?.role === "USER") {
      return <Redirect href="/(user)" />;
    }
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
