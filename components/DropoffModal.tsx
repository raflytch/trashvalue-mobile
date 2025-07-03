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
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCreateDropoff } from "@/hooks/useCreateDropoff";
import { useWasteBanks } from "@/hooks/useWasteBank";
import { WasteType } from "@/types/dropoff.types";
import { WasteBank } from "@/types/waste-bank.types";

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

const WasteBankSkeleton = () => (
  <View className="p-4 border-b border-gray-100">
    <View className="bg-gray-200 h-5 w-3/4 rounded mb-2 animate-pulse" />
    <View className="bg-gray-200 h-4 w-full rounded animate-pulse" />
  </View>
);

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
  const [selectedWasteBank, setSelectedWasteBank] = useState<WasteBank | null>(
    null
  );
  const [wasteBankDropdownVisible, setWasteBankDropdownVisible] =
    useState(false);
  const [wasteBankPage, setWasteBankPage] = useState(1);
  const [allWasteBanks, setAllWasteBanks] = useState<WasteBank[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    data: wasteBankData,
    isLoading: wasteBankLoading,
    refetch: refetchWasteBanks,
  } = useWasteBanks(wasteBankPage, 5);
  const createDropoffMutation = useCreateDropoff();

  React.useEffect(() => {
    if (wasteBankData?.data) {
      if (wasteBankPage === 1) {
        setAllWasteBanks(wasteBankData.data);
      } else {
        setAllWasteBanks((prev) => {
          const existingIds = prev.map((bank) => bank.id);
          const newBanks = wasteBankData.data.filter(
            (bank) => !existingIds.includes(bank.id)
          );
          return [...prev, ...newBanks];
        });
      }
    }
  }, [wasteBankData, wasteBankPage]);

  React.useEffect(() => {
    if (
      wasteBankDropdownVisible &&
      wasteBankPage === 1 &&
      allWasteBanks.length === 0
    ) {
      setWasteBankPage(1);
    }
  }, [wasteBankDropdownVisible]);

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

    const payload: any = {
      pickupMethod,
      pickupDate: date.toISOString(),
    };

    if (pickupMethod === "PICKUP" && pickupAddress.trim()) {
      payload.pickupAddress = pickupAddress;
    }

    if (notes.trim()) {
      payload.notes = notes.trim();
    }

    if (selectedWasteBank) {
      payload.wasteBankId = selectedWasteBank.id;
    }

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
    setSelectedWasteBank(null);
    setWasteBankDropdownVisible(false);
    setWasteBankPage(1);
    setAllWasteBanks([]);
    setRefreshKey(0);
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

  const handleLoadMore = () => {
    if (wasteBankData?.metadata.hasNextPage && !wasteBankLoading) {
      setWasteBankPage((prev) => prev + 1);
    }
  };

  const handleOpenWasteBankDropdown = () => {
    setWasteBankDropdownVisible(true);
    if (allWasteBanks.length === 0) {
      setWasteBankPage(1);
    }
  };

  const handleRefreshWasteBanks = () => {
    setAllWasteBanks([]);
    setWasteBankPage(1);
    setRefreshKey((prev) => prev + 1);
    refetchWasteBanks();
  };

  const renderWasteBankItem = ({ item }: { item: WasteBank }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-100 active:bg-gray-50"
      onPress={() => {
        setSelectedWasteBank(item);
        setWasteBankDropdownVisible(false);
      }}
    >
      <View className="flex-row items-start">
        <View className="w-10 h-10 bg-green-100 rounded-lg items-center justify-center mr-3">
          <Ionicons name="business" size={20} color="#00AA00" />
        </View>
        <View className="flex-1">
          <Text className="font-montserrat-semibold text-gray-800 text-base">
            {item.name}
          </Text>
          <Text className="font-montserrat text-gray-600 text-sm mt-1 leading-5">
            {item.address}
          </Text>
          <View className="flex-row items-center mt-2">
            <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <Text className="font-montserrat text-green-600 text-xs">
              Aktif
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  const renderSkeletonItems = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <WasteBankSkeleton key={index} />
    ));
  };

  return (
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
                      <Ionicons name="trash-outline" size={24} color="white" />
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
                    {errors.pickupAddress && (
                      <Text className="text-red-500 font-montserrat text-xs mt-1">
                        {errors.pickupAddress}
                      </Text>
                    )}
                  </View>
                )}

                <View className="mb-5">
                  <Text className="font-montserrat-semibold text-gray-700 mb-2">
                    Bank Sampah
                  </Text>
                  <TouchableOpacity
                    className="border border-gray-300 rounded-xl p-4 flex-row justify-between items-center bg-gray-50 active:bg-gray-100"
                    onPress={handleOpenWasteBankDropdown}
                  >
                    {selectedWasteBank ? (
                      <View className="flex-1 flex-row items-center">
                        <View className="w-8 h-8 bg-green-100 rounded-lg items-center justify-center mr-3">
                          <Ionicons name="business" size={16} color="#00AA00" />
                        </View>
                        <View className="flex-1">
                          <Text className="font-montserrat-semibold text-gray-800">
                            {selectedWasteBank.name}
                          </Text>
                          <Text className="font-montserrat text-gray-600 text-sm mt-1">
                            {selectedWasteBank.address}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View className="flex-1 flex-row items-center">
                        <View className="w-8 h-8 bg-gray-200 rounded-lg items-center justify-center mr-3">
                          <Ionicons
                            name="business-outline"
                            size={16}
                            color="#9CA3AF"
                          />
                        </View>
                        <Text className="font-montserrat text-gray-500">
                          Pilih Bank Sampah
                        </Text>
                      </View>
                    )}
                    <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

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
                  className="bg-green-500 py-4 rounded-xl items-center shadow-lg"
                  onPress={handleSubmit}
                  disabled={createDropoffMutation.isPending}
                  style={{
                    shadowColor: "#00AA00",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}
                >
                  {createDropoffMutation.isPending ? (
                    <View className="flex-row items-center">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="font-montserrat-bold text-white text-base ml-2">
                        Membuat Dropoff...
                      </Text>
                    </View>
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

        <Modal
          visible={wasteBankDropdownVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setWasteBankDropdownVisible(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white rounded-2xl mx-4 w-full max-w-md h-[600px] shadow-2xl">
              <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
                <Text className="font-montserrat-bold text-lg text-gray-800">
                  Pilih Bank Sampah
                </Text>
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    className="p-2 bg-green-50 rounded-lg active:bg-green-100"
                    onPress={handleRefreshWasteBanks}
                    disabled={wasteBankLoading}
                  >
                    <Ionicons
                      name="refresh"
                      size={20}
                      color={wasteBankLoading ? "#9CA3AF" : "#00AA00"}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="p-2 active:bg-gray-100 rounded-lg"
                    onPress={() => setWasteBankDropdownVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-1">
                {wasteBankLoading && allWasteBanks.length === 0 ? (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {renderSkeletonItems()}
                  </ScrollView>
                ) : (
                  <FlatList
                    data={allWasteBanks}
                    renderItem={renderWasteBankItem}
                    keyExtractor={(item, index) => `${item.id}_${index}`}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListHeaderComponent={
                      allWasteBanks.length > 0 ? (
                        <View className="p-3 bg-green-50 border-b border-green-100">
                          <Text className="font-montserrat text-green-700 text-sm text-center">
                            {allWasteBanks.length} bank sampah tersedia
                          </Text>
                        </View>
                      ) : null
                    }
                    ListFooterComponent={
                      wasteBankLoading && wasteBankPage > 1 ? (
                        <View className="p-4 items-center">
                          <ActivityIndicator size="small" color="#00AA00" />
                          <Text className="font-montserrat text-gray-500 text-xs mt-2">
                            Memuat lebih banyak...
                          </Text>
                        </View>
                      ) : wasteBankData?.metadata.hasNextPage ? (
                        <TouchableOpacity
                          className="p-4 items-center border-t border-gray-100 active:bg-gray-50"
                          onPress={handleLoadMore}
                        >
                          <Text className="font-montserrat-semibold text-green-600">
                            Muat Lebih Banyak
                          </Text>
                        </TouchableOpacity>
                      ) : null
                    }
                    ListEmptyComponent={
                      !wasteBankLoading ? (
                        <View className="flex-1 justify-center items-center p-8">
                          <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
                            <Ionicons
                              name="business-outline"
                              size={32}
                              color="#9CA3AF"
                            />
                          </View>
                          <Text className="font-montserrat-semibold text-gray-500 mb-2 text-center">
                            Tidak ada bank sampah tersedia
                          </Text>
                          <Text className="font-montserrat text-gray-400 text-sm text-center mb-4">
                            Coba refresh untuk memuat ulang data
                          </Text>
                          <TouchableOpacity
                            className="mt-2 px-6 py-3 bg-green-500 rounded-xl active:bg-green-600"
                            onPress={handleRefreshWasteBanks}
                          >
                            <Text className="font-montserrat-semibold text-white">
                              Coba Lagi
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : null
                    }
                  />
                )}
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Modal>
  );
}
