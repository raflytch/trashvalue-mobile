import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { WasteType } from "@/types/dropoff.types";

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
