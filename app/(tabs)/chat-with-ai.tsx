import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useChat } from "@/hooks/useChat";
import Markdown from "react-native-markdown-display";

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  message: string;
  imageUrl?: string;
  timestamp: Date;
}

export default function ChatWithAI() {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const chatMutation = useChat();

  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: "initial",
      type: "ai",
      message:
        "👋 Halo! Saya adalah **AI asisten TrashValue**.\n\nSaya siap membantu Anda dengan:\n• **Identifikasi jenis sampah** 📸\n• **Tips pengelolaan sampah** ♻️\n• **Informasi daur ulang** 🌱\n• **Edukasi lingkungan** 🌍\n\nSilakan kirim foto sampah atau tanyakan apapun seputar lingkungan!",
      timestamp: new Date(),
    };
    setChatHistory([initialMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isAiTyping]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const pickImage = async () => {
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
      const uri = result.assets[0].uri;
      const fileName = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(fileName || "");
      const type = match ? `image/${match[1]}` : "image";

      const formData = {
        uri,
        name: fileName,
        type,
      };

      setSelectedImage(formData);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const sendMessage = async () => {
    if (!message.trim() && !selectedImage) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: message.trim(),
      imageUrl: selectedImage?.uri,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setIsAiTyping(true);

    const payload = {
      message: message.trim(),
      image: selectedImage,
    };

    chatMutation.mutate(payload, {
      onSuccess: (response) => {
        setIsAiTyping(false);
        const aiMessage: ChatMessage = {
          id: response.data.id,
          type: "ai",
          message: response.data.response,
          timestamp: new Date(response.data.createdAt),
        };
        setChatHistory((prev) => [...prev, aiMessage]);
      },
      onError: () => {
        setIsAiTyping(false);
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          type: "ai",
          message: "Maaf, terjadi kesalahan. Silakan coba lagi.",
          timestamp: new Date(),
        };
        setChatHistory((prev) => [...prev, errorMessage]);
        Alert.alert("Error", "Gagal mengirim pesan. Silakan coba lagi.");
      },
    });

    setMessage("");
    setSelectedImage(null);
  };

  const TypingIndicator = () => (
    <View className="mb-4 flex-row justify-start">
      <View className="flex-row items-center bg-white rounded-[20px] rounded-bl-2 p-3 shadow-sm">
        <View className="w-6 h-6 rounded-full bg-green-100 items-center justify-center mr-2">
          <Ionicons name="hardware-chip" size={16} color="#00AA00" />
        </View>
        <View className="flex-row items-center">
          <ActivityIndicator size="small" color="#00AA00" />
          <Text className="font-montserrat-medium text-gray-600 text-sm ml-2">
            TrashValue AI sedang mengetik...
          </Text>
        </View>
      </View>
    </View>
  );

  const MessageBubble = ({ message: msg }: { message: ChatMessage }) => (
    <View
      className={`mb-4 flex-row ${
        msg.type === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {msg.type === "ai" && (
        <View className="w-9 h-9 rounded-full bg-green-100 items-center justify-center mr-2 mt-1">
          <Ionicons name="hardware-chip" size={20} color="#00AA00" />
        </View>
      )}

      <View
        className={`max-w-[75%] rounded-[20px] p-4 ${
          msg.type === "user"
            ? "bg-green-600 rounded-br-2"
            : "bg-white rounded-bl-2 shadow-sm"
        }`}
      >
        {msg.type === "ai" && (
          <View className="flex-row items-center mb-2">
            <Text className="font-montserrat-bold text-xs text-green-600">
              TrashValue AI
            </Text>
            <View className="w-1.5 h-1.5 rounded-full bg-green-400 ml-1.5" />
          </View>
        )}

        {msg.imageUrl && (
          <View className="mb-3">
            <Image
              source={{ uri: msg.imageUrl }}
              className="w-full h-48 rounded-3"
              resizeMode="cover"
            />
          </View>
        )}

        <View className="mb-2">
          {msg.type === "ai" ? (
            <Markdown
              style={{
                body: {
                  fontSize: 15,
                  lineHeight: 22,
                  color: "#1F2937",
                  fontFamily: "Montserrat-Regular",
                },
                strong: {
                  fontWeight: "600",
                  color: "#00AA00",
                  fontFamily: "Montserrat-SemiBold",
                },
                bullet_list: {
                  marginVertical: 8,
                },
                list_item: {
                  marginVertical: 2,
                },
                paragraph: {
                  marginVertical: 4,
                },
              }}
            >
              {msg.message}
            </Markdown>
          ) : (
            <Text
              className={`font-montserrat text-base leading-6 ${
                msg.type === "user" ? "text-white" : "text-gray-800"
              }`}
            >
              {msg.message}
            </Text>
          )}
        </View>

        <Text
          className={`font-montserrat-medium text-xs ${
            msg.type === "user" ? "text-white/70 text-right" : "text-gray-500"
          }`}
        >
          {msg.timestamp.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#00AA00" />

      <LinearGradient
        colors={["#08A92B", "#088F27"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-8 pb-4 px-5"
        style={{ paddingTop: Platform.OS === "android" ? 32 : 12 }}
      >
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center flex-1">
            <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center mr-3">
              <Ionicons name="hardware-chip" size={28} color="white" />
            </View>
            <View className="flex-1">
              <Text className="font-montserrat-bold text-xl text-white">
                TrashValue AI
              </Text>
              <View className="flex-row items-center mt-1">
                <View className="w-2 h-2 rounded-full bg-green-400 mr-1.5" />
                <Text className="font-montserrat-medium text-sm text-white/90">
                  Online • Asisten Cerdas
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 items-center justify-center ml-2">
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1">
          <ScrollView
            ref={scrollViewRef}
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingVertical: 20,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {chatHistory.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isAiTyping && <TypingIndicator />}
          </ScrollView>

          <View className="bg-white border-t border-gray-200">
            {selectedImage && (
              <View className="p-4 pb-2">
                <View className="relative">
                  <Image
                    source={{ uri: selectedImage.uri }}
                    className="w-20 h-20 rounded-3"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
                    onPress={removeImage}
                  >
                    <Ionicons name="close" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View className="flex-row items-center px-4 py-2">
              <TouchableOpacity
                className="w-11 h-11 rounded-full bg-gray-100 items-center justify-center mr-3"
                onPress={pickImage}
              >
                <Ionicons name="camera" size={24} color="#00AA00" />
              </TouchableOpacity>

              <View className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 mr-3 max-h-28 justify-center">
                <TextInput
                  className="font-montserrat text-base text-gray-800 py-2 m-0"
                  placeholder="Tanyakan kepada TrashValue AI..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  maxLength={500}
                  placeholderTextColor="#999"
                  textAlignVertical="center"
                />
              </View>

              <TouchableOpacity
                className={`w-11 h-11 rounded-full items-center justify-center ${
                  (message.trim() || selectedImage) && !chatMutation.isPending
                    ? "bg-green-600"
                    : "bg-gray-300"
                }`}
                onPress={sendMessage}
                disabled={
                  (!message.trim() && !selectedImage) || chatMutation.isPending
                }
              >
                {chatMutation.isPending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="send" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
