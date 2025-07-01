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
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useChat } from "@/hooks/useChat";
import Markdown from "react-native-markdown-display";

const { width } = Dimensions.get("window");

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
    <View style={styles.typingContainer}>
      <View style={styles.typingBubble}>
        <View style={styles.aiAvatarSmall}>
          <Ionicons name="hardware-chip" size={16} color="#00AA00" />
        </View>
        <View style={styles.typingDots}>
          <ActivityIndicator size="small" color="#00AA00" />
          <Text style={styles.typingText}>
            TrashValue AI sedang mengetik...
          </Text>
        </View>
      </View>
    </View>
  );

  const MessageBubble = ({ message: msg }: { message: ChatMessage }) => (
    <View
      style={[
        styles.messageContainer,
        msg.type === "user" ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {msg.type === "ai" && (
        <View style={styles.aiAvatar}>
          <Ionicons name="hardware-chip" size={20} color="#00AA00" />
        </View>
      )}

      <View
        style={[
          styles.messageBubble,
          msg.type === "user" ? styles.userBubble : styles.aiBubble,
        ]}
      >
        {msg.type === "ai" && (
          <View style={styles.aiHeader}>
            <Text style={styles.aiLabel}>TrashValue AI</Text>
            <View style={styles.onlineIndicator} />
          </View>
        )}

        {msg.imageUrl && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: msg.imageUrl }}
              style={styles.messageImage}
              resizeMode="cover"
            />
          </View>
        )}

        <View style={styles.messageContent}>
          {msg.type === "ai" ? (
            <Markdown style={markdownStyles}>{msg.message}</Markdown>
          ) : (
            <Text
              style={[
                styles.messageText,
                msg.type === "user" ? styles.userText : styles.aiText,
              ]}
            >
              {msg.message}
            </Text>
          )}
        </View>

        <Text
          style={[
            styles.timestamp,
            msg.type === "user" ? styles.userTimestamp : styles.aiTimestamp,
          ]}
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00AA00" />

      <LinearGradient
        colors={["#08A92B", "#088F27"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Ionicons name="hardware-chip" size={28} color="white" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>TrashValue AI</Text>
              <View style={styles.headerStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.headerSubtitle}>
                  Online • Asisten Cerdas
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.headerAction}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <View style={styles.flex1}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {chatHistory.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {isAiTyping && <TypingIndicator />}
          </ScrollView>

          <View style={styles.inputContainer}>
            {selectedImage && (
              <View style={styles.imagePreview}>
                <Image
                  source={{ uri: selectedImage.uri }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={removeImage}
                >
                  <Ionicons name="close" size={18} color="white" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputRow}>
              <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
                <Ionicons name="camera" size={24} color="#00AA00" />
              </TouchableOpacity>

              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Tanyakan kepada TrashValue AI..."
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  maxLength={500}
                  placeholderTextColor="#999"
                  textAlignVertical="center"
                  underlineColorAndroid="transparent"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (message.trim() || selectedImage) && !chatMutation.isPending
                    ? styles.sendButtonActive
                    : styles.sendButtonInactive,
                ]}
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

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FFFE",
  },
  header: {
    paddingTop: Platform.OS === "android" ? 32 : 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    width: "100%",
  },
  headerLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    flex: 1,
  },
  headerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold" as const,
    color: "white",
    fontFamily: "Montserrat-Bold",
  },
  headerStatus: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4ADE80",
    marginRight: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "Montserrat-Medium",
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginLeft: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 0,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: "row" as const,
  },
  userMessage: {
    justifyContent: "flex-end" as const,
  },
  aiMessage: {
    justifyContent: "flex-start" as const,
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8F5E8",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    borderRadius: 20,
    padding: 16,
  },
  userBubble: {
    backgroundColor: "#00AA00",
    borderBottomRightRadius: 8,
  },
  aiBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  aiHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 8,
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#00AA00",
    fontFamily: "Montserrat-Bold",
  },
  onlineIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4ADE80",
    marginLeft: 6,
  },
  imageContainer: {
    marginBottom: 12,
  },
  messageImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  messageContent: {
    marginBottom: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Montserrat-Regular",
  },
  userText: {
    color: "white",
  },
  aiText: {
    color: "#1F2937",
  },
  timestamp: {
    fontSize: 11,
    fontFamily: "Montserrat-Medium",
  },
  userTimestamp: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "right" as const,
  },
  aiTimestamp: {
    color: "#9CA3AF",
  },
  typingContainer: {
    marginBottom: 16,
    flexDirection: "row" as const,
    justifyContent: "flex-start" as const,
  },
  typingBubble: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "white",
    borderRadius: 20,
    borderBottomLeftRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  aiAvatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E8F5E8",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 8,
  },
  typingDots: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
  },
  typingText: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Montserrat-Medium",
    marginLeft: 8,
  },
  inputContainer: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingBottom: Platform.OS === "android" ? 8 : 0,
  },
  imagePreview: {
    padding: 16,
    paddingBottom: 8,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute" as const,
    top: 8,
    right: 8,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  inputRow: {
    flexDirection: "row" as const,
    alignItems: "flex-end" as const,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 12,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    maxHeight: 120,
    justifyContent: "center" as const,
  },
  textInput: {
    fontSize: 16,
    color: "#1F2937",
    fontFamily: "Montserrat-Regular",
    textAlignVertical: "center" as const,
    padding: 0,
    margin: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  sendButtonActive: {
    backgroundColor: "#00AA00",
  },
  sendButtonInactive: {
    backgroundColor: "#D1D5DB",
  },
});

const markdownStyles = {
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1F2937",
    fontFamily: "Montserrat-Regular",
  },
  strong: {
    fontWeight: "600" as const,
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
  heading1: {
    fontSize: 18,
    fontWeight: "bold" as const,
    color: "#00AA00",
    marginVertical: 8,
    fontFamily: "Montserrat-Bold",
  },
  heading2: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#00AA00",
    marginVertical: 6,
    fontFamily: "Montserrat-SemiBold",
  },
  code_inline: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: "monospace",
  },
  blockquote: {
    backgroundColor: "#F0F9F0",
    borderLeftWidth: 4,
    borderLeftColor: "#00AA00",
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 8,
  },
};
