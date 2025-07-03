import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { useTopUp } from "@/hooks/useTopUp";

interface TopUpModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get("window");

export default function TopUpModal({ visible, onClose }: TopUpModalProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "BANK_TRANSFER" | "E_WALLET"
  >("BANK_TRANSFER");
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ amount?: string }>({});

  const topUpMutation = useTopUp();

  const resetForm = () => {
    setAmount("");
    setPaymentMethod("BANK_TRANSFER");
    setPaymentUrl(null);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors: { amount?: string } = {};

    const numAmount = Number(amount.replace(/[^0-9]/g, ""));
    if (!amount || numAmount <= 0) {
      newErrors.amount = "Masukkan jumlah yang valid";
    } else if (numAmount < 10000) {
      newErrors.amount = "Jumlah minimum top up adalah Rp10.000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTopUp = async () => {
    if (!validateForm()) return;

    try {
      const numAmount = Number(amount.replace(/[^0-9]/g, ""));

      const result = await topUpMutation.mutateAsync({
        amount: numAmount,
        paymentMethod,
      });

      setPaymentUrl(result.data.redirectUrl);
    } catch (error) {
      console.error("Top-up error:", error);
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

  const handleWebViewNavigationStateChange = (newNavState: any) => {
    if (
      newNavState.url.includes("transaction_status=settlement") ||
      newNavState.url.includes("transaction_status=capture") ||
      newNavState.url.includes("transaction_status=success")
    ) {
      handleClose();
    }
  };

  if (paymentUrl) {
    return (
      <Modal
        visible={visible}
        onRequestClose={handleClose}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View className="flex-1">
          <View className="bg-white py-4 px-4 flex-row items-center border-b border-gray-200">
            <TouchableOpacity onPress={handleClose} className="p-2">
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
            <Text className="font-montserrat-bold text-lg ml-2">
              Pembayaran
            </Text>
          </View>
          <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
          />
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View
            className="w-full bg-white rounded-3xl overflow-hidden"
            style={{ elevation: 10, maxWidth: width * 0.9 }}
          >
            <View className="px-6 py-5 border-b border-gray-100">
              <View className="flex-row justify-between items-center">
                <Text className="font-montserrat-bold text-xl text-gray-800">
                  Isi Saldo
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
                      className={`flex-1 ml-2 py-4 rounded-xl border-2 items-center ${
                        paymentMethod === "E_WALLET"
                          ? "bg-green-50 border-[#00CC00]"
                          : "border-gray-200"
                      }`}
                      onPress={() => setPaymentMethod("E_WALLET")}
                    >
                      <Ionicons
                        name="wallet-outline"
                        size={24}
                        color={
                          paymentMethod === "E_WALLET" ? "#00CC00" : "#777"
                        }
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
                  </View>
                </View>
              </View>
            </ScrollView>

            <View className="px-6 py-5 border-t border-gray-100">
              <TouchableOpacity
                className="bg-[#00CC00] py-4 rounded-xl"
                onPress={handleTopUp}
                disabled={topUpMutation.isPending}
              >
                {topUpMutation.isPending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-montserrat-bold text-center text-base">
                    Isi Saldo Sekarang
                  </Text>
                )}
              </TouchableOpacity>
              {topUpMutation.isError && (
                <Text className="text-red-500 text-center mt-2 font-montserrat">
                  Gagal memproses top up. Silakan coba lagi.
                </Text>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
