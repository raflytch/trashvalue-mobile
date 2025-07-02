import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useWasteTypes } from "@/hooks/useWasteTypes";
import { useAddWasteItem } from "@/hooks/useWasteItems";
import { WasteType } from "@/types/dropoff.types";

interface AddWasteItemModalProps {
  visible: boolean;
  onClose: () => void;
  dropoffId: string;
  wasteType?: WasteType | null;
  pickupMethod?: "PICKUP" | "DROPOFF";
}

export default function AddWasteItemModal({
  visible,
  onClose,
  dropoffId,
  wasteType,
  pickupMethod = "PICKUP",
}: AddWasteItemModalProps) {
  const [selectedWasteType, setSelectedWasteType] = useState<WasteType | null>(
    wasteType || null
  );
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<any>(null);
  const [wasteTypesVisible, setWasteTypesVisible] = useState(false);

  const { data: wasteTypesData, isLoading: wasteTypesLoading } = useWasteTypes(
    1,
    100
  );
  const { mutate: addWasteItem, isPending } = useAddWasteItem(dropoffId);

  useEffect(() => {
    if (wasteType) {
      setSelectedWasteType(wasteType);
    }
  }, [wasteType]);

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Izin Diperlukan",
        "Anda perlu memberikan izin untuk mengakses galeri foto"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > 3 * 1024 * 1024) {
        Alert.alert("Ukuran gambar maksimal 3MB");
        return;
      }
      const uri = asset.uri;
      const fileName = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(fileName || "");
      const type = match ? `image/${match[1]}` : "image";
      const formData = {
        uri,
        name: fileName,
        type,
      };
      setImage(formData);
    }
  };

  const handleSubmit = () => {
    if (!selectedWasteType) {
      Alert.alert("Error", "Pilih jenis sampah terlebih dahulu");
      return;
    }
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0) {
      Alert.alert("Error", "Masukkan berat sampah yang valid");
      return;
    }
    addWasteItem(
      {
        wasteTypeId: selectedWasteType.id,
        weight: parseFloat(weight),
        notes,
        image,
      },
      {
        onSuccess: () => {
          Alert.alert("Sukses", "Sampah berhasil ditambahkan");
          resetForm();
          onClose();
        },
        onError: (error) => {
          Alert.alert(
            "Error",
            "Gagal menambahkan sampah: " + (error as any).message
          );
        },
      }
    );
  };

  const resetForm = () => {
    if (!wasteType) {
      setSelectedWasteType(null);
    }
    setWeight("");
    setNotes("");
    setImage(null);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateReward = () => {
    if (
      !(wasteType || selectedWasteType) ||
      !weight ||
      isNaN(parseFloat(weight))
    ) {
      return 0;
    }

    const basePrice =
      (wasteType || selectedWasteType)!.pricePerKg * parseFloat(weight);
    const pickupFee = pickupMethod === "PICKUP" ? 5000 * parseFloat(weight) : 0;
    return basePrice - pickupFee;
  };

  useEffect(() => {
    if (!visible) {
      resetForm();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          <View className="px-6 py-4 border-b border-gray-200 flex-row justify-between items-center">
            <Text className="font-montserrat-bold text-xl text-gray-800">
              Tambah Sampah
            </Text>
            <TouchableOpacity
              className="p-2 rounded-full bg-gray-100"
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>
          <ScrollView className="p-6">
            <View className="mb-6">
              <Text className="font-montserrat-medium text-gray-700 mb-2">
                Jenis Sampah
              </Text>
              {wasteType ? (
                <View className="border border-gray-300 bg-gray-50 rounded-xl p-4 flex-row items-center">
                  <Image
                    source={{ uri: wasteType.image }}
                    className="w-10 h-10 rounded-lg mr-3"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="font-montserrat-semibold text-gray-800">
                      {wasteType.name}
                    </Text>
                    <Text className="font-montserrat text-green-600">
                      {formatRupiah(wasteType.pricePerKg)}/kg
                    </Text>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  className="border border-gray-300 rounded-xl p-4 flex-row justify-between items-center"
                  onPress={() => setWasteTypesVisible(true)}
                >
                  {selectedWasteType ? (
                    <View className="flex-row items-center">
                      <Image
                        source={{ uri: selectedWasteType.image }}
                        className="w-10 h-10 rounded-lg mr-3"
                      />
                      <View>
                        <Text className="font-montserrat-semibold text-gray-800">
                          {selectedWasteType.name}
                        </Text>
                        <Text className="font-montserrat text-green-600">
                          {formatRupiah(selectedWasteType.pricePerKg)}/kg
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <Text className="font-montserrat text-gray-500">
                      Pilih jenis sampah
                    </Text>
                  )}
                  <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            <View className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-200">
              <View className="flex-row items-center mb-2">
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <Text className="font-montserrat-semibold text-blue-700 ml-2">
                  Informasi Biaya Pengambilan
                </Text>
              </View>
              <Text className="font-montserrat text-blue-600 text-sm leading-5">
                • Dijemput: Biaya Rp 5.000/kg{"\n"}• Antar Sendiri: Gratis
              </Text>
            </View>

            <View className="mb-6">
              <Text className="font-montserrat-medium text-gray-700 mb-2">
                Berat (kg)
              </Text>
              <View className="border border-gray-300 rounded-xl flex-row items-center px-4">
                <TextInput
                  className="flex-1 font-montserrat py-4"
                  placeholder="Masukkan berat sampah"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
                <Text className="font-montserrat-semibold text-gray-600">
                  kg
                </Text>
              </View>
              {(wasteType || selectedWasteType) &&
                weight &&
                !isNaN(parseFloat(weight)) && (
                  <View className="bg-green-50 mt-2 p-3 rounded-lg border border-green-200">
                    <View className="mb-2">
                      <Text className="font-montserrat text-gray-600 text-sm">
                        Harga dasar:{" "}
                        {formatRupiah(
                          (wasteType || selectedWasteType)!.pricePerKg *
                            parseFloat(weight)
                        )}
                      </Text>
                      {pickupMethod === "PICKUP" && (
                        <Text className="font-montserrat text-red-600 text-sm">
                          Biaya dijemput: -
                          {formatRupiah(5000 * parseFloat(weight))}
                        </Text>
                      )}
                    </View>
                    <Text className="font-montserrat-semibold text-green-700">
                      Perkiraan Reward: {formatRupiah(calculateReward())}
                    </Text>
                  </View>
                )}
            </View>
            <View className="mb-6">
              <Text className="font-montserrat-medium text-gray-700 mb-2">
                Catatan (Opsional)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl p-4 font-montserrat min-h-[100px] text-gray-800"
                placeholder="Tambahkan catatan tentang sampah ini"
                value={notes}
                onChangeText={setNotes}
                multiline
                textAlignVertical="top"
              />
            </View>
            <View className="mb-6">
              <Text className="font-montserrat-medium text-gray-700 mb-2">
                Foto Sampah (Opsional)
              </Text>
              <Text className="text-gray-500 font-montserrat text-xs mb-2">
                Maksimal ukuran gambar 3MB
              </Text>
              {image ? (
                <View className="relative">
                  <Image
                    source={{ uri: image.uri }}
                    className="w-full h-56 rounded-xl"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
                    onPress={() => setImage(null)}
                  >
                    <Ionicons name="trash" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  className="border-2 border-dashed border-gray-300 rounded-xl h-56 justify-center items-center bg-gray-50"
                  onPress={handleImagePick}
                >
                  <Ionicons name="camera-outline" size={42} color="#9CA3AF" />
                  <Text className="font-montserrat text-gray-500 mt-2">
                    Tambahkan Foto Sampah
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
          <View className="p-6 border-t border-gray-200">
            <TouchableOpacity
              className="bg-green-600 py-4 rounded-xl flex-row justify-center items-center"
              onPress={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="recycle"
                    size={20}
                    color="white"
                  />
                  <Text className="font-montserrat-bold text-white ml-2">
                    Tambah Sampah
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          {!wasteType && (
            <Modal
              visible={wasteTypesVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setWasteTypesVisible(false)}
            >
              <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-t-3xl max-h-[80%]">
                  <View className="px-6 py-4 border-b border-gray-200 flex-row justify-between items-center">
                    <Text className="font-montserrat-bold text-xl text-gray-800">
                      Pilih Jenis Sampah
                    </Text>
                    <TouchableOpacity
                      className="p-2 rounded-full bg-gray-100"
                      onPress={() => setWasteTypesVisible(false)}
                    >
                      <Ionicons name="close" size={24} color="#4B5563" />
                    </TouchableOpacity>
                  </View>
                  <ScrollView className="p-6">
                    {wasteTypesLoading ? (
                      <View className="py-20 justify-center items-center">
                        <ActivityIndicator size="large" color="#00AA00" />
                        <Text className="font-montserrat text-gray-600 mt-4">
                          Memuat jenis sampah...
                        </Text>
                      </View>
                    ) : (
                      <View>
                        {wasteTypesData?.data.map((wasteType) => (
                          <TouchableOpacity
                            key={wasteType.id}
                            className={`border ${
                              selectedWasteType?.id === wasteType.id
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                            } rounded-xl p-4 mb-4 flex-row items-center`}
                            onPress={() => {
                              setSelectedWasteType(wasteType);
                              setWasteTypesVisible(false);
                            }}
                          >
                            <Image
                              source={{ uri: wasteType.image }}
                              className="w-16 h-16 rounded-lg"
                            />
                            <View className="ml-4 flex-1">
                              <Text className="font-montserrat-bold text-gray-800">
                                {wasteType.name}
                              </Text>
                              <Text className="font-montserrat-semibold text-green-600 mt-1">
                                {formatRupiah(wasteType.pricePerKg)}/kg
                              </Text>
                            </View>
                            {selectedWasteType?.id === wasteType.id && (
                              <View className="bg-green-500 rounded-full p-2">
                                <Ionicons
                                  name="checkmark"
                                  size={20}
                                  color="white"
                                />
                              </View>
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </View>
    </Modal>
  );
}
