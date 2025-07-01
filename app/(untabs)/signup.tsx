import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router, Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRegister } from "@/hooks/useRegister";
import SuccessModal from "@/components/SuccessModal";
import { LinearGradient } from "expo-linear-gradient";

export default function SignUp() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [backgroundPhoto, setBackgroundPhoto] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeField, setActiveField] = useState<string | null>(null);

  const registerMutation = useRegister();

  const pickImage = async (type: "profile" | "background") => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === "profile" ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        if (asset.fileSize && asset.fileSize > 3 * 1024 * 1024) {
          Alert.alert("Maximum image size is 3MB");
          return;
        }
        if (type === "profile") {
          setProfileImage(asset.uri);
        } else {
          setBackgroundPhoto(asset.uri);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await registerMutation.mutateAsync({
        name,
        phone,
        email,
        password,
        address,
        profileImage,
        backgroundPhoto,
      });
      setShowSuccessModal(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      alert(errorMessage);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.replace("/");
  };

  const handleFocus = (field: string) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={["#08A92B", "#088F27"]}
            className="pt-14 pb-8 px-6"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => router.back()}
                className="h-10 w-10 rounded-full bg-black/30 backdrop-blur-sm items-center justify-center"
              >
                <Ionicons name="arrow-back" size={20} color="white" />
              </TouchableOpacity>
              <Text className="text-3xl font-montserrat-bold text-white">
                Create Account
              </Text>
              <View className="w-10" />
            </View>
          </LinearGradient>
          <View className="bg-white flex-1 px-6 pt-8 pb-10 -mt-6 rounded-t-[30px]">
            <View className="mb-8 items-center">
              <View className="relative">
                <TouchableOpacity
                  onPress={() => pickImage("profile")}
                  className="items-center"
                >
                  <View
                    className={`w-28 h-28 rounded-full items-center justify-center ${
                      profileImage ? "" : "bg-gray-100"
                    }`}
                    style={{
                      borderWidth: 3,
                      borderColor: "#08A92B",
                      overflow: "hidden",
                      shadowColor: "#00FF00",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                    }}
                  >
                    {profileImage ? (
                      <Image
                        source={{ uri: profileImage }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <Ionicons name="person" size={50} color="#08A92B" />
                    )}
                  </View>
                  <View
                    className="absolute bottom-0 right-0 bg-[#08A92B] p-2.5 rounded-full"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 3,
                    }}
                  >
                    <Ionicons name="camera" size={16} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
              <Text className="text-gray-700 font-montserrat-medium text-sm mt-3">
                Upload profile photo
              </Text>
              <Text className="text-gray-500 font-montserrat text-xs mt-1">
                Maximum image size is 3MB
              </Text>
            </View>
            <View className="mb-5">
              <Text className="text-gray-700 mb-2 font-montserrat-semibold text-base pl-1">
                Full Name
              </Text>
              <View
                className={`flex-row items-center border rounded-2xl px-4 py-3 ${
                  errors.name
                    ? "border-red-500"
                    : activeField === "name"
                    ? "border-[#00FF00]"
                    : "border-gray-200"
                }`}
                style={{
                  borderWidth: 1,
                  shadowColor: activeField === "name" ? "#00FF00" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: activeField === "name" ? 0.2 : 0,
                  shadowRadius: 2,
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={activeField === "name" ? "#00FF00" : "#9CA3AF"}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="flex-1 text-gray-800 font-montserrat"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => handleFocus("name")}
                  onBlur={handleBlur}
                />
              </View>
              {errors.name && (
                <Text className="text-red-500 text-xs mt-1 font-montserrat ml-1">
                  {errors.name}
                </Text>
              )}
            </View>
            <View className="mb-5">
              <Text className="text-gray-700 mb-2 font-montserrat-semibold text-base pl-1">
                Phone Number
              </Text>
              <View
                className={`flex-row items-center border rounded-2xl px-4 py-3 ${
                  errors.phone
                    ? "border-red-500"
                    : activeField === "phone"
                    ? "border-[#00FF00]"
                    : "border-gray-200"
                }`}
                style={{
                  borderWidth: 1,
                  shadowColor: activeField === "phone" ? "#00FF00" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: activeField === "phone" ? 0.2 : 0,
                  shadowRadius: 2,
                }}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={activeField === "phone" ? "#00FF00" : "#9CA3AF"}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="flex-1 text-gray-800 font-montserrat"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => handleFocus("phone")}
                  onBlur={handleBlur}
                />
              </View>
              {errors.phone && (
                <Text className="text-red-500 text-xs mt-1 font-montserrat ml-1">
                  {errors.phone}
                </Text>
              )}
            </View>
            <View className="mb-5">
              <Text className="text-gray-700 mb-2 font-montserrat-semibold text-base pl-1">
                Email Address
              </Text>
              <View
                className={`flex-row items-center border rounded-2xl px-4 py-3 ${
                  errors.email
                    ? "border-red-500"
                    : activeField === "email"
                    ? "border-[#00FF00]"
                    : "border-gray-200"
                }`}
                style={{
                  borderWidth: 1,
                  shadowColor: activeField === "email" ? "#00FF00" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: activeField === "email" ? 0.2 : 0,
                  shadowRadius: 2,
                }}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={activeField === "email" ? "#00FF00" : "#9CA3AF"}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="flex-1 text-gray-800 font-montserrat"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => handleFocus("email")}
                  onBlur={handleBlur}
                />
              </View>
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1 font-montserrat ml-1">
                  {errors.email}
                </Text>
              )}
            </View>
            <View className="mb-5">
              <Text className="text-gray-700 mb-2 font-montserrat-semibold text-base pl-1">
                Password
              </Text>
              <View
                className={`flex-row items-center border rounded-2xl px-4 py-3 ${
                  errors.password
                    ? "border-red-500"
                    : activeField === "password"
                    ? "border-[#00FF00]"
                    : "border-gray-200"
                }`}
                style={{
                  borderWidth: 1,
                  shadowColor: activeField === "password" ? "#00FF00" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: activeField === "password" ? 0.2 : 0,
                  shadowRadius: 2,
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={activeField === "password" ? "#00FF00" : "#9CA3AF"}
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="flex-1 text-gray-800 font-montserrat"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => handleFocus("password")}
                  onBlur={handleBlur}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-xs mt-1 font-montserrat ml-1">
                  {errors.password}
                </Text>
              )}
            </View>
            <View className="mb-5">
              <Text className="text-gray-700 mb-2 font-montserrat-semibold text-base pl-1">
                Confirm Password
              </Text>
              <View
                className={`flex-row items-center border rounded-2xl px-4 py-3 ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : activeField === "confirmPassword"
                    ? "border-[#00FF00]"
                    : "border-gray-200"
                }`}
                style={{
                  borderWidth: 1,
                  shadowColor:
                    activeField === "confirmPassword" ? "#00FF00" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: activeField === "confirmPassword" ? 0.2 : 0,
                  shadowRadius: 2,
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={
                    activeField === "confirmPassword" ? "#00FF00" : "#9CA3AF"
                  }
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  className="flex-1 text-gray-800 font-montserrat"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => handleFocus("confirmPassword")}
                  onBlur={handleBlur}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text className="text-red-500 text-xs mt-1 font-montserrat ml-1">
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
            <View className="mb-8">
              <Text className="text-gray-700 mb-2 font-montserrat-semibold text-base pl-1">
                Address
              </Text>
              <View
                className={`border rounded-2xl px-4 py-3 ${
                  errors.address
                    ? "border-red-500"
                    : activeField === "address"
                    ? "border-[#00FF00]"
                    : "border-gray-200"
                }`}
                style={{
                  borderWidth: 1,
                  shadowColor: activeField === "address" ? "#00FF00" : "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: activeField === "address" ? 0.2 : 0,
                  shadowRadius: 2,
                }}
              >
                <View className="flex-row items-center mb-1">
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={activeField === "address" ? "#00FF00" : "#9CA3AF"}
                    style={{ marginRight: 10 }}
                  />
                  <Text className="text-gray-600 font-montserrat-medium">
                    Your Address
                  </Text>
                </View>
                <TextInput
                  className="text-gray-800 font-montserrat"
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your complete address"
                  multiline
                  numberOfLines={3}
                  style={{ height: 80, textAlignVertical: "top" }}
                  placeholderTextColor="#9CA3AF"
                  onFocus={() => handleFocus("address")}
                  onBlur={handleBlur}
                />
              </View>
              {errors.address && (
                <Text className="text-red-500 text-xs mt-1 font-montserrat ml-1">
                  {errors.address}
                </Text>
              )}
            </View>
            <TouchableOpacity
              className="mb-7"
              onPress={() => pickImage("background")}
            >
              <Text className="text-gray-700 mb-2 font-montserrat-semibold text-base">
                Background Image (Optional)
              </Text>
              <Text className="text-gray-500 font-montserrat text-xs mb-2">
                Maximum image size is 3MB
              </Text>
              <View
                className="h-32 rounded-xl overflow-hidden"
                style={{
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: backgroundPhoto ? "#00FF00" : "#ddd",
                }}
              >
                {backgroundPhoto ? (
                  <Image
                    source={{ uri: backgroundPhoto }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Ionicons name="image-outline" size={40} color="#9CA3AF" />
                    <Text className="text-gray-500 font-montserrat-medium mt-2">
                      Tap to upload image
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="mb-6"
              onPress={handleSignUp}
              disabled={registerMutation.isPending}
              style={{ borderRadius: 12, overflow: "hidden" }}
            >
              <LinearGradient
                colors={["#08A92B", "#088F27"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 px-6"
                style={{
                  shadowColor: "#00AA00",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                }}
              >
                {registerMutation.isPending ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white text-center text-lg font-montserrat-bold">
                    Create Account
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <View className="flex-row items-center justify-center">
              <Text className="text-gray-600 font-montserrat">
                Already have an account?{" "}
              </Text>
              <Link href="/(untabs)/login" asChild>
                <TouchableOpacity>
                  <Text className="text-[#00CC00] font-montserrat-bold">
                    Login
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleSuccessModalClose}
        message="Your account has been created successfully!"
      />
    </View>
  );
}
