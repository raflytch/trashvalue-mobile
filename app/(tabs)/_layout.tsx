import React from "react";
import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  withSequence,
  withDelay,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function UserTabLayout() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const insets = useSafeAreaInsets();

  if (!isAuthenticated) {
    return <Redirect href="/(untabs)/login" />;
  }

  const TabButton = ({
    children,
    style,
    onPress,
    onLongPress,
    accessibilityState,
    accessibilityLabel,
    testID,
  }: any) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.92, {
        damping: 20,
        stiffness: 350,
        mass: 0.3,
      });
      opacity.value = withTiming(0.8, { duration: 100 });
    };

    const handlePressOut = () => {
      scale.value = withSpring(1, {
        damping: 20,
        stiffness: 350,
        mass: 0.3,
      });
      opacity.value = withTiming(1, { duration: 100 });
    };

    return (
      <AnimatedPressable
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityState={accessibilityState}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
        android_ripple={{ color: "rgba(0, 204, 0, 0.08)", radius: 35 }}
        style={[
          style,
          animatedStyle,
          {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 14,
            borderRadius: 25,
            marginHorizontal: 3,
          },
        ]}
      >
        {children}
      </AnimatedPressable>
    );
  };

  const TabIcon = ({ color, focused, iconName, iconNameFocused }: any) => {
    const scale = useSharedValue(focused ? 1 : 0.75);
    const translateY = useSharedValue(focused ? -4 : 0);
    const backgroundScale = useSharedValue(focused ? 1 : 0);
    const rotation = useSharedValue(0);
    const pulseScale = useSharedValue(1);

    React.useEffect(() => {
      if (focused) {
        scale.value = withSequence(
          withSpring(1.1, { damping: 15, stiffness: 400, mass: 0.4 }),
          withSpring(1, { damping: 18, stiffness: 300, mass: 0.5 })
        );

        translateY.value = withSpring(-4, {
          damping: 16,
          stiffness: 280,
          mass: 0.6,
        });

        backgroundScale.value = withSpring(1, {
          damping: 20,
          stiffness: 320,
          mass: 0.5,
        });

        rotation.value = withSequence(
          withTiming(10, { duration: 150 }),
          withTiming(-10, { duration: 150 }),
          withTiming(0, { duration: 150 })
        );

        pulseScale.value = withSequence(
          withTiming(1.15, { duration: 200 }),
          withTiming(1, { duration: 200 })
        );
      } else {
        scale.value = withSpring(0.75, {
          damping: 18,
          stiffness: 250,
          mass: 0.6,
        });

        translateY.value = withSpring(0, {
          damping: 16,
          stiffness: 280,
          mass: 0.6,
        });

        backgroundScale.value = withSpring(0, {
          damping: 20,
          stiffness: 320,
          mass: 0.5,
        });

        rotation.value = withTiming(0, { duration: 200 });
        pulseScale.value = withTiming(1, { duration: 200 });
      }
    }, [focused]);

    const animatedIconStyle = useAnimatedStyle(() => ({
      transform: [
        { scale: scale.value * pulseScale.value },
        { translateY: translateY.value },
        { rotate: `${rotation.value}deg` },
      ],
    }));

    const animatedGradientStyle = useAnimatedStyle(() => ({
      transform: [{ scale: backgroundScale.value }],
      opacity: interpolate(backgroundScale.value, [0, 1], [0, 1]),
    }));

    return (
      <AnimatedView
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 52,
          height: 52,
          borderRadius: 18,
          marginBottom: 2,
        }}
      >
        <AnimatedView style={animatedIconStyle}>
          {focused ? (
            <AnimatedView style={animatedGradientStyle}>
              <LinearGradient
                colors={["#00CC00", "#00AA00"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#00BB00",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.35,
                  shadowRadius: 8,
                  elevation: 10,
                }}
              >
                <Ionicons name={iconNameFocused} size={22} color="white" />
              </LinearGradient>
            </AnimatedView>
          ) : (
            <Ionicons name={iconName} size={26} color={color} />
          )}
        </AnimatedView>
      </AnimatedView>
    );
  };

  const TabLabel = ({ focused, color, label }: any) => {
    const translateY = useSharedValue(focused ? 0 : 5);
    const opacity = useSharedValue(focused ? 1 : 0.65);
    const scale = useSharedValue(focused ? 1 : 0.8);
    const letterSpacing = useSharedValue(focused ? 0.3 : 0);

    React.useEffect(() => {
      if (focused) {
        translateY.value = withSequence(
          withSpring(-2, { damping: 15, stiffness: 300, mass: 0.4 }),
          withSpring(0, { damping: 18, stiffness: 250, mass: 0.5 })
        );

        opacity.value = withTiming(1, { duration: 250 });

        scale.value = withSequence(
          withSpring(1.1, { damping: 15, stiffness: 350, mass: 0.4 }),
          withSpring(1, { damping: 18, stiffness: 280, mass: 0.5 })
        );

        letterSpacing.value = withTiming(0.3, { duration: 200 });
      } else {
        translateY.value = withSpring(5, {
          damping: 16,
          stiffness: 220,
          mass: 0.6,
        });

        opacity.value = withTiming(0.65, { duration: 200 });

        scale.value = withSpring(0.8, {
          damping: 18,
          stiffness: 250,
          mass: 0.6,
        });

        letterSpacing.value = withTiming(0, { duration: 150 });
      }
    }, [focused]);

    const animatedLabelStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }, { scale: scale.value }],
      opacity: opacity.value,
      letterSpacing: letterSpacing.value,
    }));

    return (
      <Animated.Text
        style={[
          animatedLabelStyle,
          {
            color: focused ? "#00BB00" : "#9CA3AF",
            fontFamily: focused ? "Montserrat-Bold" : "Montserrat-Bold",
            fontSize: 12,
            marginTop: 4,
            textAlign: "center",
            fontWeight: focused ? "700" : "500",
          },
        ]}
      >
        {label}
      </Animated.Text>
    );
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          height: 92 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 12,
          paddingHorizontal: 8,
          borderTopWidth: 0,
          elevation: 25,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        },
        tabBarActiveTintColor: "#00BB00",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontFamily: "Montserrat-Medium",
          fontSize: 12,
          marginTop: 4,
        },
        tabBarShowLabel: true,
        tabBarButton: TabButton,
        tabBarLabel: ({ focused, color }) => {
          const routeName = route.name;
          let label = "";

          if (routeName === "index") label = "Beranda";
          else if (routeName === "dropoff") label = "Dropoff";
          else if (routeName === "history") label = "Riwayat";
          else if (routeName === "chat-with-ai") label = "Chat AI";
          else if (routeName === "profile") label = "Profil";

          return <TabLabel focused={focused} color={color} label={label} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              iconName="home-outline"
              iconNameFocused="home"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dropoff"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              iconName="cube-outline"
              iconNameFocused="cube"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat-with-ai"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              iconName="chatbubble-ellipses-outline"
              iconNameFocused="chatbubble-ellipses"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              iconName="time-outline"
              iconNameFocused="time"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              iconName="person-outline"
              iconNameFocused="person"
            />
          ),
        }}
      />
    </Tabs>
  );
}
