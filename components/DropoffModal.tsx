import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useCreateDropoff } from "@/hooks/useCreateDropoff";
import { WasteType } from "@/types/dropoff.types";

interface DropoffModalProps {
  visible: boolean;
  onClose: () => void;
  wasteType: WasteType | null;
}

const DATE_OPTIONS = [
  { label: "Hari ini", value: 0 },
  { label: "Besok", value: 1 },
  { label: "Lusa", value: 2 },
];

const TIME_OPTIONS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function DropoffModal({
  visible,
  onClose,
  wasteType,
}: DropoffModalProps) {
  const [pickupAddress, setPickupAddress] = useState("");
  const [selectedDateOption, setSelectedDateOption] = useState(0);
  const [selectedTimeOption, setSelectedTimeOption] = useState("09:00");
  const [pickupMethod, setPickupMethod] = useState<"PICKUP" | "DROPOFF">(
    "PICKUP"
  );
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: -6.2,
    longitude: 106.816666,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markerPosition, setMarkerPosition] = useState({
    latitude: -6.2,
    longitude: 106.816666,
  });

  const createDropoffMutation = useCreateDropoff();

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    if (pickupMethod === "PICKUP" && !pickupAddress.trim()) {
      newErrors.pickupAddress = "Alamat pickup diperlukan";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const date = new Date();
    date.setDate(date.getDate() + selectedDateOption);

    const [hours, minutes] = selectedTimeOption.split(":").map(Number);
    date.setHours(hours, minutes, 0, 0);

    const payload = {
      pickupAddress: pickupMethod === "DROPOFF" ? "" : pickupAddress,
      pickupDate: date.toISOString(),
      pickupMethod,
      notes: notes.trim() || undefined,
    };

    createDropoffMutation.mutate(payload, {
      onSuccess: () => {
        Alert.alert("Sukses", "Dropoff berhasil dibuat!", [
          {
            text: "OK",
            onPress: () => {
              resetForm();
              onClose();
            },
          },
        ]);
      },
      onError: (error) => {
        Alert.alert("Error", "Gagal membuat dropoff. Silakan coba lagi.", [
          { text: "OK" },
        ]);
      },
    });
  };

  const resetForm = () => {
    setPickupAddress("");
    setSelectedDateOption(0);
    setSelectedTimeOption("09:00");
    setPickupMethod("PICKUP");
    setNotes("");
    setErrors({});
  };

  const formatDate = (daysToAdd: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission", "Izin lokasi diperlukan");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setSelectedLocation(newLocation);
      setMarkerPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert("Error", "Tidak dapat mengambil lokasi saat ini");
    }
  };

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (address.length > 0) {
        const addr = address[0];
        const fullAddress = `${addr.street || ""} ${addr.streetNumber || ""}, ${
          addr.district || ""
        }, ${addr.subregion || ""}, ${addr.region || ""}, ${
          addr.postalCode || ""
        }`.trim();
        return fullAddress;
      }
      return "Alamat tidak ditemukan";
    } catch (error) {
      return "Tidak dapat mengambil alamat";
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerPosition({ latitude, longitude });
  };

  const confirmLocation = async () => {
    const address = await getAddressFromCoordinates(
      markerPosition.latitude,
      markerPosition.longitude
    );
    setPickupAddress(address);
    setShowMapModal(false);
  };

  const openMapModal = () => {
    setShowMapModal(true);
    getCurrentLocation();
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-black/60 justify-end">
            <View
              className="bg-white rounded-t-3xl"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
                <Text className="font-montserrat-bold text-xl text-gray-800">
                  Buat Dropoff
                </Text>
                <TouchableOpacity
                  className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                  onPress={onClose}
                >
                  <Ionicons name="close" size={22} color="#666" />
                </TouchableOpacity>
              </View>

              <ScrollView className="max-h-[80vh]">
                <View className="p-5">
                  {wasteType && (
                    <View className="bg-green-50 p-4 rounded-xl mb-5 border border-green-100 flex-row items-center">
                      <View className="h-12 w-12 rounded-lg bg-green-500 items-center justify-center mr-4">
                        <Ionicons
                          name="trash-outline"
                          size={24}
                          color="white"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="font-montserrat-semibold text-gray-700">
                          Jenis Sampah
                        </Text>
                        <Text className="font-montserrat-bold text-green-700 text-lg">
                          {wasteType.name}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View className="mb-5">
                    <Text className="font-montserrat-semibold text-gray-700 mb-2">
                      Metode Pengambilan
                    </Text>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        className={`flex-1 py-4 rounded-xl ${
                          pickupMethod === "PICKUP"
                            ? "bg-green-500"
                            : "bg-gray-100"
                        } items-center justify-center`}
                        onPress={() => setPickupMethod("PICKUP")}
                      >
                        <Ionicons
                          name="car-outline"
                          size={24}
                          color={pickupMethod === "PICKUP" ? "white" : "#666"}
                        />
                        <Text
                          className={`font-montserrat-medium mt-2 ${
                            pickupMethod === "PICKUP"
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          Dijemput
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className={`flex-1 py-4 rounded-xl ${
                          pickupMethod === "DROPOFF"
                            ? "bg-green-500"
                            : "bg-gray-100"
                        } items-center justify-center`}
                        onPress={() => setPickupMethod("DROPOFF")}
                      >
                        <Ionicons
                          name="walk-outline"
                          size={24}
                          color={pickupMethod === "DROPOFF" ? "white" : "#666"}
                        />
                        <Text
                          className={`font-montserrat-medium mt-2 ${
                            pickupMethod === "DROPOFF"
                              ? "text-white"
                              : "text-gray-700"
                          }`}
                        >
                          Antar Sendiri
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="mt-3 bg-blue-50 p-3 rounded-xl border border-blue-200">
                      <Text className="font-montserrat text-blue-600 text-sm">
                        {pickupMethod === "PICKUP"
                          ? "Jika Anda memilih dijemput, akan dikenakan biaya Rp 5.000 per kg sampah."
                          : "Jika Anda memilih antar sendiri, tidak dikenakan biaya (gratis)."}
                      </Text>
                    </View>
                  </View>

                  {pickupMethod === "PICKUP" && (
                    <View className="mb-5">
                      <Text className="font-montserrat-semibold text-gray-700 mb-2">
                        Alamat Pengambilan
                      </Text>
                      <View className="flex-row gap-2 mb-2">
                        <View className="flex-1">
                          <TextInput
                            className={`border ${
                              errors.pickupAddress
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-xl p-4 font-montserrat text-gray-800 min-h-[100px]`}
                            multiline
                            textAlignVertical="top"
                            value={pickupAddress}
                            onChangeText={setPickupAddress}
                            placeholder="Masukkan alamat lengkap pengambilan sampah"
                          />
                        </View>
                        <TouchableOpacity
                          className="bg-green-500 rounded-xl px-4 py-4 justify-center items-center"
                          onPress={openMapModal}
                        >
                          <Ionicons name="location" size={24} color="white" />
                          <Text className="font-montserrat-medium text-white text-xs mt-1">
                            Maps
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {errors.pickupAddress && (
                        <Text className="text-red-500 font-montserrat text-xs mt-1">
                          {errors.pickupAddress}
                        </Text>
                      )}
                    </View>
                  )}

                  <View className="mb-5">
                    <Text className="font-montserrat-semibold text-gray-700 mb-2">
                      Tanggal Pengambilan
                    </Text>
                    <View className="flex-row gap-2 mb-4">
                      {DATE_OPTIONS.map((option, index) => (
                        <TouchableOpacity
                          key={index}
                          className={`flex-1 border rounded-xl py-3 items-center ${
                            selectedDateOption === option.value
                              ? "bg-green-50 border-green-500"
                              : "border-gray-300"
                          }`}
                          onPress={() => setSelectedDateOption(option.value)}
                        >
                          <Text
                            className={`font-montserrat-medium ${
                              selectedDateOption === option.value
                                ? "text-green-700"
                                : "text-gray-700"
                            }`}
                          >
                            {option.label}
                          </Text>
                          <Text className="font-montserrat text-xs text-gray-500 mt-1">
                            {formatDate(option.value)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text className="font-montserrat-semibold text-gray-700 mb-2">
                      Waktu Pengambilan
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingRight: 20 }}
                    >
                      <View className="flex-row gap-2">
                        {TIME_OPTIONS.map((time) => (
                          <TouchableOpacity
                            key={time}
                            className={`border rounded-xl py-3 px-4 ${
                              selectedTimeOption === time
                                ? "bg-green-50 border-green-500"
                                : "border-gray-300"
                            }`}
                            onPress={() => setSelectedTimeOption(time)}
                          >
                            <Text
                              className={`font-montserrat-medium ${
                                selectedTimeOption === time
                                  ? "text-green-700"
                                  : "text-gray-700"
                              }`}
                            >
                              {time}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </View>

                  <View className="mb-8">
                    <Text className="font-montserrat-semibold text-gray-700 mb-2">
                      Catatan (Opsional)
                    </Text>
                    <TextInput
                      className="border border-gray-300 rounded-xl p-4 font-montserrat text-gray-800 min-h-[80px]"
                      multiline
                      textAlignVertical="top"
                      value={notes}
                      onChangeText={setNotes}
                      placeholder="Tambahkan catatan untuk petugas"
                    />
                  </View>

                  <TouchableOpacity
                    className="bg-green-500 py-4 rounded-xl items-center"
                    onPress={handleSubmit}
                    disabled={createDropoffMutation.isPending}
                  >
                    {createDropoffMutation.isPending ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text className="font-montserrat-bold text-white text-base">
                        Buat Dropoff
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={showMapModal}
        animationType="slide"
        onRequestClose={() => setShowMapModal(false)}
      >
        <View className="flex-1">
          <View className="bg-white p-4 pt-12 border-b border-gray-200 flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => setShowMapModal(false)}
              className="p-2 rounded-full bg-gray-100"
            >
              <Ionicons name="arrow-back" size={24} color="#666" />
            </TouchableOpacity>
            <Text className="font-montserrat-bold text-lg text-gray-800">
              Pilih Lokasi
            </Text>
            <TouchableOpacity
              onPress={confirmLocation}
              className="bg-green-500 px-4 py-2 rounded-full"
            >
              <Text className="font-montserrat-bold text-white">Pilih</Text>
            </TouchableOpacity>
          </View>

          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            region={selectedLocation}
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker
              coordinate={markerPosition}
              draggable
              onDragEnd={handleMapPress}
            />
          </MapView>

          <View className="absolute bottom-6 left-6 right-6 bg-white p-4 rounded-xl shadow-lg">
            <Text className="font-montserrat-semibold text-gray-700 mb-2">
              Lokasi Terpilih
            </Text>
            <Text className="font-montserrat text-gray-600 text-sm">
              Lat: {markerPosition.latitude.toFixed(6)}, Lng:{" "}
              {markerPosition.longitude.toFixed(6)}
            </Text>
            <TouchableOpacity
              onPress={getCurrentLocation}
              className="bg-green-500 py-3 px-4 rounded-lg mt-3 flex-row items-center justify-center"
            >
              <Ionicons name="locate" size={20} color="white" />
              <Text className="font-montserrat-medium text-white ml-2">
                Gunakan Lokasi Saat Ini
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
