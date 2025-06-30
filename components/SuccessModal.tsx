import React from "react";
import { View, Text, Modal, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  message: string;
}

const { width } = Dimensions.get("window");

export default function SuccessModal({
  visible,
  onClose,
  message,
}: SuccessModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-5">
        <View
          className="bg-white w-full max-w-[320px] rounded-2xl p-6"
          style={{
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
          }}
        >
          <View className="items-center mb-5">
            <View className="bg-[#00CF00]/15 w-20 h-20 rounded-full items-center justify-center mb-3">
              <Ionicons name="checkmark-circle" size={56} color="#00CF00" />
            </View>
            <Text className="text-2xl font-montserrat-bold text-center text-gray-800 mt-1">
              Success!
            </Text>
          </View>

          <Text className="text-gray-600 text-center mb-6 font-montserrat text-base">
            {message}
          </Text>

          <TouchableOpacity
            className="bg-[#00CF00] py-3.5 rounded-xl"
            onPress={onClose}
            style={{
              elevation: 2,
              shadowColor: "#00CF00",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text className="text-white text-center font-montserrat-bold text-base">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
