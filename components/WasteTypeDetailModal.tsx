import React from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { WasteType } from "@/types/dropoff.types";

interface WasteTypeDetailModalProps {
  visible: boolean;
  wasteType: WasteType | null;
  onClose: () => void;
  onContinue: () => void;
}

export default function WasteTypeDetailModal({
  visible,
  wasteType,
  onClose,
  onContinue,
}: WasteTypeDetailModalProps) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!wasteType) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70 justify-center items-center p-5">
        <View
          className="bg-white w-full rounded-3xl overflow-hidden"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,
            elevation: 16,
            maxWidth: 360,
          }}
        >
          <View className="relative">
            <Image
              source={{ uri: wasteType.image }}
              className="w-full h-56"
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              className="absolute bottom-0 left-0 right-0 h-24"
            />
            <View className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2">
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <View className="absolute bottom-4 left-4">
              <View className="flex-row items-center gap-2">
                <View className="bg-green-500 p-2 rounded-lg">
                  <MaterialCommunityIcons
                    name="recycle"
                    size={20}
                    color="white"
                  />
                </View>
                <Text className="font-montserrat-bold text-2xl text-green-300">
                  {wasteType.name}
                </Text>
              </View>
            </View>
          </View>

          <View className="p-5">
            <View className="bg-green-50 p-3 rounded-xl mb-4 border border-green-100">
              <View className="flex-row items-center justify-between">
                <Text className="font-montserrat-medium text-green-800">
                  Harga per kilogram
                </Text>
                <Text className="font-montserrat-bold text-xl text-green-700">
                  {formatRupiah(wasteType.pricePerKg)}
                </Text>
              </View>
            </View>

            <Text className="font-montserrat text-gray-700 mb-8 leading-5">
              {wasteType.description}
            </Text>

            <View className="flex-row gap-4 justify-between">
              <TouchableOpacity
                className="flex-1 bg-gray-100 p-4 rounded-xl flex-row items-center justify-center"
                onPress={onClose}
              >
                <Ionicons name="arrow-back-outline" size={20} color="#4B5563" />
                <Text className="font-montserrat-bold text-gray-700 text-center ml-2">
                  Kembali
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-[#00BB00] p-4 rounded-xl flex-row items-center justify-center"
                onPress={onContinue}
              >
                <Text className="font-montserrat-bold text-white text-center mr-2">
                  Lanjutkan
                </Text>
                <Ionicons
                  name="arrow-forward-outline"
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
