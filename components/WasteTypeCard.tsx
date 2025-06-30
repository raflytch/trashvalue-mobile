import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { WasteType } from "@/types/dropoff.types";

const { width } = Dimensions.get("window");

export function WasteTypeCardSkeleton() {
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={{
        backgroundColor: "white",
        borderRadius: 18,
        marginBottom: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#f0f0f0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        width: "100%",
      }}
    >
      <View
        style={{
          width: "100%",
          height: 160,
          backgroundColor: "#E5E7EB",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={["#f3f4f6", "#e5e7eb", "#f3f4f6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            opacity: 0.7,
          }}
        />
        <MaterialCommunityIcons
          name="recycle"
          size={64}
          color="#D1D5DB"
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            opacity: 0.25,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: 16,
            top: 16,
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#F1F5F9",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.5,
          }}
        >
          <FontAwesome5 name="leaf" size={28} color="#D1D5DB" />
        </View>
      </View>
      <View style={{ padding: 16 }}>
        <View
          style={{
            width: 140,
            height: 20,
            backgroundColor: "#E5E7EB",
            borderRadius: 8,
            marginBottom: 14,
          }}
        />
        <View
          style={{
            width: 90,
            height: 14,
            backgroundColor: "#E5E7EB",
            borderRadius: 8,
            marginBottom: 10,
          }}
        />
        <View
          style={{
            width: "100%",
            height: 12,
            backgroundColor: "#E5E7EB",
            borderRadius: 8,
            marginBottom: 8,
          }}
        />
        <View
          style={{
            width: "85%",
            height: 12,
            backgroundColor: "#E5E7EB",
            borderRadius: 8,
            marginBottom: 8,
          }}
        />
        <View
          style={{
            width: "60%",
            height: 12,
            backgroundColor: "#E5E7EB",
            borderRadius: 8,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            marginTop: 18,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#E5E7EB",
              marginRight: 12,
            }}
          />
          <View
            style={{
              width: 80,
              height: 14,
              backgroundColor: "#E5E7EB",
              borderRadius: 8,
            }}
          />
        </View>
      </View>
    </Animated.View>
  );
}

interface WasteTypeCardProps {
  wasteType: WasteType;
  onSelect: (wasteType: WasteType) => void;
}

export default function WasteTypeCard({
  wasteType,
  onSelect,
}: WasteTypeCardProps) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl mb-5 overflow-hidden"
      style={styles.card}
      activeOpacity={0.95}
      onPress={() => onSelect(wasteType)}
    >
      <View className="relative">
        <Image
          source={{ uri: wasteType.image }}
          className="w-full h-40"
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]}
          className="absolute bottom-0 left-0 right-0 h-16"
        />
        <View className="absolute top-3 right-3">
          <View className="bg-white/30 backdrop-blur-md rounded-full p-2">
            <MaterialCommunityIcons name="recycle" size={18} color="white" />
          </View>
        </View>
        <View className="absolute bottom-3 left-3">
          <Text className="font-montserrat-bold text-xl text-white">
            {wasteType.name}
          </Text>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row justify-between items-center mb-3">
          <View className="bg-green-50 px-3 py-1 rounded-lg border border-green-100">
            <Text className="font-montserrat-bold text-green-700">
              {formatRupiah(wasteType.pricePerKg)}/kg
            </Text>
          </View>

          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => onSelect(wasteType)}
          >
            <Text className="font-montserrat-medium text-[#00AA00] mr-2">
              Detail
            </Text>
            <View className="bg-green-500 rounded-full p-1">
              <Ionicons name="arrow-forward" size={14} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        <Text className="font-montserrat text-gray-500" numberOfLines={2}>
          {wasteType.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
});
