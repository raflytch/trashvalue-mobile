import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLogin } from "@/hooks/useLogin";
import { useSelector, useDispatch } from "react-redux";
import { clearError } from "@/features/slices/authSlice";
import { RootState } from "@/features/store";
import { images } from "../../constants/images";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeField, setActiveField] = useState<string | null>(null);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );

  const dispatch = useDispatch();
  const { isLoading, error, user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const loginMutation = useLogin();

  useEffect(() => {
    if (error) {
      Alert.alert("Login Gagal", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "USER") {
        router.replace("/(tabs)");
      }
    }
  }, [isAuthenticated, user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) newErrors.email = "Email wajib diisi";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Format email tidak valid";

    if (!password) newErrors.password = "Kata sandi wajib diisi";

    setErrors(newErrors);
    setTouchedFields({
      email: true,
      password: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await loginMutation.mutateAsync({
        email,
        password,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login gagal";
      Alert.alert("Error", errorMessage);
    }
  };

  const handleFocus = (field: string) => {
    setActiveField(field);
    setTouchedFields({ ...touchedFields, [field]: true });
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const navigateToSignup = () => {
    router.push("/(untabs)/signup");
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#00CF00" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={["#088F27", "#088F27"]}
            className="pt-14 pb-20"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View className="items-center">
              <Image
                source={images.logo}
                style={{ width: 120, height: 120 }}
                resizeMode="contain"
              />
              <Text className="text-white font-montserrat-bold text-3xl mt-4">
                TrashValue
              </Text>
              <Text className="text-white/80 font-montserrat-semibold text-lg mt-1">
                Ubah sampah jadi cuan
              </Text>
            </View>
          </LinearGradient>

          <View className="flex-1 px-6 -mt-12">
            <View className="bg-white rounded-3xl p-6 shadow-lg">
              <Text className="font-montserrat-bold text-2xl text-gray-800 mb-1">
                Selamat Datang
              </Text>
              <Text className="font-montserrat text-gray-500 mb-6">
                Masuk ke akun Anda
              </Text>

              <View className="mb-5">
                <Text className="font-montserrat-medium text-gray-600 mb-2 ml-1">
                  Email
                </Text>
                <View
                  className={`flex-row items-center rounded-xl px-4 py-3 ${
                    touchedFields.email && errors.email
                      ? "border border-red-500"
                      : activeField === "email"
                      ? "border border-[#00CF00] bg-green-50"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                  style={{
                    shadowColor: activeField === "email" ? "#00CF00" : "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: activeField === "email" ? 0.1 : 0,
                    shadowRadius: 2,
                  }}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={activeField === "email" ? "#00CF00" : "#777"}
                  />
                  <TextInput
                    className="flex-1 ml-3 font-montserrat text-gray-800"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Masukkan email Anda"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                  />
                </View>
                {touchedFields.email && errors.email && (
                  <Text className="text-red-500 text-xs mt-1 font-montserrat ml-1">
                    {errors.email}
                  </Text>
                )}
              </View>

              <View className="mb-6">
                <Text className="font-montserrat-medium text-gray-600 mb-2 ml-1">
                  Kata Sandi
                </Text>
                <View
                  className={`flex-row items-center rounded-xl px-4 py-3 ${
                    touchedFields.password && errors.password
                      ? "border border-red-500"
                      : activeField === "password"
                      ? "border border-[#00CF00] bg-green-50"
                      : "bg-gray-50 border border-gray-100"
                  }`}
                  style={{
                    shadowColor:
                      activeField === "password" ? "#00CF00" : "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: activeField === "password" ? 0.1 : 0,
                    shadowRadius: 2,
                  }}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={activeField === "password" ? "#00CF00" : "#777"}
                  />
                  <TextInput
                    className="flex-1 ml-3 font-montserrat text-gray-800"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Masukkan kata sandi"
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999"
                    onFocus={() => handleFocus("password")}
                    onBlur={handleBlur}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-1"
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={activeField === "password" ? "#00CF00" : "#777"}
                    />
                  </TouchableOpacity>
                </View>
                {touchedFields.password && errors.password && (
                  <Text className="text-red-500 text-xs mt-1 font-montserrat ml-1">
                    {errors.password}
                  </Text>
                )}
              </View>

              <View className="mt-2 overflow-hidden rounded-xl">
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.4}
                  className="w-full"
                >
                  <LinearGradient
                    colors={
                      isLoading
                        ? ["#80FF80", "#80CF80"]
                        : ["#08A92B", "#088F27"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-5 items-center justify-center w-full"
                    style={{
                      shadowColor: "#00CF00",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <View className="flex-row items-center">
                        <Text className="text-white font-montserrat-bold text-base mr-2">
                          Masuk
                        </Text>
                      </View>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-center mt-8">
                <Text className="text-gray-600 font-montserrat">
                  Belum punya akun?{" "}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={navigateToSignup}
                >
                  <Text className="text-[#00CF00] font-montserrat-bold">
                    Daftar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
