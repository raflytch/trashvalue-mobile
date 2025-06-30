import React from "react";
import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UserTabLayout() {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const insets = useSafeAreaInsets();

  if (!isAuthenticated) {
    return <Redirect href="/(untabs)/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          height: 80 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          elevation: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        tabBarActiveTintColor: "#00CC00",
        tabBarInactiveTintColor: "#AAAAAA",
        tabBarLabelStyle: {
          fontFamily: "Montserrat-Medium",
          fontSize: 12,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 3,
        },
        tabBarItemStyle: {
          padding: 5,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
        },
        tabBarShowLabel: true,
        tabBarButton: ({
          children,
          style,
          onPress,
          onLongPress,
          accessibilityState,
          accessibilityLabel,
          testID,
        }) => (
          <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            accessibilityState={accessibilityState}
            accessibilityLabel={accessibilityLabel}
            testID={testID}
            android_ripple={{ color: "transparent" }}
            style={style}
          >
            {children}
          </Pressable>
        ),
        tabBarLabel: ({ focused, color }) => {
          const routeName = route.name;
          let label = "";

          if (routeName === "index") label = "Home";
          else if (routeName === "dropoff") label = "Dropoff";
          else if (routeName === "history") label = "History";
          else if (routeName === "profile") label = "Profile";

          return (
            <Text
              style={{
                color,
                fontFamily: "Montserrat-Medium",
                fontSize: 12,
                fontWeight: focused ? "600" : "400",
              }}
            >
              {label}
            </Text>
          );
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                padding: 8,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                marginBottom: 10,
              }}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="dropoff"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                padding: 8,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                marginBottom: 10,
              }}
            >
              <Ionicons
                name={focused ? "cube" : "cube-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                padding: 8,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                marginBottom: 10,
              }}
            >
              <Ionicons
                name={focused ? "time" : "time-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                padding: 8,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                marginBottom: 10,
              }}
            >
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
