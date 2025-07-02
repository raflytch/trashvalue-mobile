import React from "react";
import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

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
          height: 90 + insets.bottom,
          paddingBottom: insets.bottom + 5,
          paddingTop: 15,
          paddingHorizontal: 10,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
        tabBarActiveTintColor: "#00CC00",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontFamily: "Montserrat-SemiBold",
          fontSize: 11,
          marginTop: 6,
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
            android_ripple={{ color: "rgba(0, 204, 0, 0.1)", radius: 30 }}
            style={[
              style,
              {
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 8,
                borderRadius: 20,
                marginHorizontal: 2,
              },
            ]}
          >
            {children}
          </Pressable>
        ),
        tabBarLabel: ({ focused, color }) => {
          const routeName = route.name;
          let label = "";

          if (routeName === "index") label = "Home";
          else if (routeName === "dropoff") label = "Drop Off";
          else if (routeName === "history") label = "History";
          else if (routeName === "chat-with-ai") label = "TrashValue";
          else if (routeName === "profile") label = "Profile";

          return (
            <Text
              style={{
                color: focused ? "#00CC00" : "#9CA3AF",
                fontFamily: focused ? "Montserrat-Bold" : "Montserrat-Medium",
                fontSize: 11,
                marginTop: 6,
                textAlign: "center",
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
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 45,
                height: 45,
                borderRadius: 15,
                backgroundColor: focused
                  ? "rgba(0, 204, 0, 0.1)"
                  : "transparent",
                marginBottom: 4,
              }}
            >
              {focused ? (
                <LinearGradient
                  colors={["#00CC00", "#00AA00"]}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="home" size={20} color="white" />
                </LinearGradient>
              ) : (
                <Ionicons name="home-outline" size={24} color={color} />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="dropoff"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 45,
                height: 45,
                borderRadius: 15,
                backgroundColor: focused
                  ? "rgba(0, 204, 0, 0.1)"
                  : "transparent",
                marginBottom: 4,
              }}
            >
              {focused ? (
                <LinearGradient
                  colors={["#00CC00", "#00AA00"]}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="cube" size={20} color="white" />
                </LinearGradient>
              ) : (
                <Ionicons name="cube-outline" size={24} color={color} />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat-with-ai"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 45,
                height: 45,
                borderRadius: 15,
                backgroundColor: focused
                  ? "rgba(0, 204, 0, 0.1)"
                  : "transparent",
                marginBottom: 4,
              }}
            >
              {focused ? (
                <LinearGradient
                  colors={["#00CC00", "#00AA00"]}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={20}
                    color="white"
                  />
                </LinearGradient>
              ) : (
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color={color}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 45,
                height: 45,
                borderRadius: 15,
                backgroundColor: focused
                  ? "rgba(0, 204, 0, 0.1)"
                  : "transparent",
                marginBottom: 4,
              }}
            >
              {focused ? (
                <LinearGradient
                  colors={["#00CC00", "#00AA00"]}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="time" size={20} color="white" />
                </LinearGradient>
              ) : (
                <Ionicons name="time-outline" size={24} color={color} />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 45,
                height: 45,
                borderRadius: 15,
                backgroundColor: focused
                  ? "rgba(0, 204, 0, 0.1)"
                  : "transparent",
                marginBottom: 4,
              }}
            >
              {focused ? (
                <LinearGradient
                  colors={["#00CC00", "#00AA00"]}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 12,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="person" size={20} color="white" />
                </LinearGradient>
              ) : (
                <Ionicons name="person-outline" size={24} color={color} />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
