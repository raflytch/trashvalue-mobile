import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWithdrawal } from "@/hooks/useWithdrawal";

const { width } = Dimensions.get("window");

interface WithdrawalModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function WithdrawalModal({
  visible,
  onClose,
}: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "BANK_TRANSFER" | "E_WALLET" | "CASH"
  >("BANK_TRANSFER");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const withdrawalMutation = useWithdrawal();

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setPaymentMethod("BANK_TRANSFER");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    const numAmount = Number(amount.replace(/[^0-9]/g, ""));
    if (!amount || numAmount <= 0) {
      newErrors.amount = "Masukkan jumlah yang valid";
    } else if (numAmount < 10000) {
      newErrors.amount = "Jumlah minimum penarikan adalah Rp10.000";
    }

    if (!description.trim()) {
      newErrors.description = "Masukkan deskripsi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWithdrawal = async () => {
    if (!validateForm()) return;

    try {
      const numAmount = Number(amount.replace(/[^0-9]/g, ""));

      await withdrawalMutation.mutateAsync({
        amount: numAmount,
        paymentMethod,
        description,
      });

      handleClose();
      Alert.alert(
        "Berhasil",
        "Permintaan penarikan Anda telah berhasil dikirim",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      Alert.alert(
        "Penarikan Gagal",
        error.response?.data?.message || "Gagal memproses permintaan penarikan",
        [{ text: "OK" }]
      );
    }
  };

  const formatCurrency = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, "");

    if (numeric === "") {
      setAmount("");
      return;
    }

    const numericValue = parseInt(numeric, 10);
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);

    setAmount(formatted);
  };

  const presetAmounts = [50000, 100000, 250000, 500000, 1000000];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View
          className="bg-white rounded-t-3xl"
          style={{ elevation: 10, maxWidth: width }}
        >
          <View className="px-6 py-5 border-b border-gray-100">
            <View className="flex-row justify-between items-center">
              <Text className="font-montserrat-bold text-xl text-gray-800">
                Tarik Saldo
              </Text>
              <TouchableOpacity
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                onPress={handleClose}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="max-h-[500px]">
            <View className="px-6 py-5">
              <Text className="font-montserrat-medium text-gray-600 mb-2">
                Jumlah
              </Text>
              <View
                className={`border-2 rounded-xl ${
                  errors.amount ? "border-red-500" : "border-gray-200"
                }`}
              >
                <TextInput
                  className="p-4 text-base font-montserrat-semibold text-gray-800"
                  value={amount}
                  onChangeText={(text) => formatCurrency(text)}
                  placeholder="Rp0"
                  keyboardType="numeric"
                  placeholderTextColor="#aaaaaa"
                />
              </View>
              {errors.amount && (
                <Text className="text-red-500 mt-1 font-montserrat text-xs">
                  {errors.amount}
                </Text>
              )}

              <View className="flex-row flex-wrap justify-between mt-4">
                {presetAmounts.map((presetAmount) => (
                  <TouchableOpacity
                    key={presetAmount}
                    className="bg-gray-100 rounded-lg py-2 px-3 mb-3"
                    style={{ width: "48%" }}
                    onPress={() =>
                      setAmount(
                        new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(presetAmount)
                      )
                    }
                  >
                    <Text className="font-montserrat-medium text-center text-gray-700">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(presetAmount)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="mt-6 mb-4">
                <Text className="font-montserrat-medium text-gray-600 mb-3">
                  Metode Pembayaran
                </Text>
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    className={`flex-1 mr-2 py-4 rounded-xl border-2 items-center ${
                      paymentMethod === "BANK_TRANSFER"
                        ? "bg-green-50 border-[#00CC00]"
                        : "border-gray-200"
                    }`}
                    onPress={() => setPaymentMethod("BANK_TRANSFER")}
                  >
                    <Ionicons
                      name="card-outline"
                      size={24}
                      color={
                        paymentMethod === "BANK_TRANSFER" ? "#00CC00" : "#777"
                      }
                    />
                    <Text
                      className={`font-montserrat-medium mt-2 ${
                        paymentMethod === "BANK_TRANSFER"
                          ? "text-[#00CC00]"
                          : "text-gray-600"
                      }`}
                    >
                      Transfer Bank
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`flex-1 px-2 py-4 rounded-xl border-2 items-center ${
                      paymentMethod === "E_WALLET"
                        ? "bg-green-50 border-[#00CC00]"
                        : "border-gray-200"
                    }`}
                    onPress={() => setPaymentMethod("E_WALLET")}
                  >
                    <Ionicons
                      name="wallet-outline"
                      size={24}
                      color={paymentMethod === "E_WALLET" ? "#00CC00" : "#777"}
                    />
                    <Text
                      className={`font-montserrat-medium mt-2 ${
                        paymentMethod === "E_WALLET"
                          ? "text-[#00CC00]"
                          : "text-gray-600"
                      }`}
                    >
                      E-Wallet
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`flex-1 ml-2 py-4 rounded-xl border-2 items-center ${
                      paymentMethod === "CASH"
                        ? "bg-green-50 border-[#00CC00]"
                        : "border-gray-200"
                    }`}
                    onPress={() => setPaymentMethod("CASH")}
                  >
                    <Ionicons
                      name="cash-outline"
                      size={24}
                      color={paymentMethod === "CASH" ? "#00CC00" : "#777"}
                    />
                    <Text
                      className={`font-montserrat-medium mt-2 ${
                        paymentMethod === "CASH"
                          ? "text-[#00CC00]"
                          : "text-gray-600"
                      }`}
                    >
                      Tunai
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mt-4">
                <Text className="font-montserrat-medium text-gray-600 mb-2">
                  Deskripsi
                </Text>
                <View
                  className={`border-2 rounded-xl ${
                    errors.description ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <TextInput
                    className="p-4 font-montserrat text-gray-800 min-h-[100px]"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Masukkan detail penarikan (misal: nomor rekening bank, ID e-wallet)"
                    multiline
                    textAlignVertical="top"
                    placeholderTextColor="#aaaaaa"
                  />
                </View>
                {errors.description && (
                  <Text className="text-red-500 mt-1 font-montserrat text-xs">
                    {errors.description}
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>

          <View className="px-6 py-5 border-t border-gray-100">
            <TouchableOpacity
              className="bg-[#00CC00] py-4 rounded-xl"
              onPress={handleWithdrawal}
              disabled={withdrawalMutation.isPending}
            >
              {withdrawalMutation.isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-montserrat-bold text-white text-center">
                  Kirim Permintaan Penarikan
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
