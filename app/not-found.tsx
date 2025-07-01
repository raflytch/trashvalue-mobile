import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function NotFound() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white px-8">
      <View className="items-center mb-8 justify-center w-40 h-40 rounded-full bg-red-50 border-4 border-red-100">
        <Ionicons name="alert-circle" size={100} color="#EF4444" />
      </View>
      <Text className="font-montserrat-bold text-3xl text-gray-800 mb-2 text-center">
        Oops!
      </Text>
      <Text className="font-montserrat-semibold text-lg text-gray-700 mb-2 text-center">
        Halaman Tidak Ditemukan
      </Text>
      <Text className="font-montserrat text-gray-500 text-center mb-8">
        Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
        Silakan periksa kembali URL atau kembali ke beranda.
      </Text>
      <TouchableOpacity
        className="bg-green-600 px-8 py-4 rounded-xl flex-row items-center shadow-lg"
        onPress={() => router.replace("/")}
        activeOpacity={0.85}
      >
        <Ionicons name="arrow-back" size={20} color="white" />
        <Text className="font-montserrat-bold text-white ml-2">
          Kembali ke Beranda
        </Text>
      </TouchableOpacity>
    </View>
  );
}
