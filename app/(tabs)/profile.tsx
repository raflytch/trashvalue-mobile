import { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
  StatusBar,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/features/store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { logout } from "@/features/slices/authSlice";
import { useUser } from "@/hooks/useUserDetail";
import * as ImagePicker from "expo-image-picker";
import TopUpModal from "@/components/TopUpModal";
import WithdrawalModal from "@/components/WithdrawalModal";
import { LinearGradient } from "expo-linear-gradient";
import { images } from "@/constants/images";

const { width } = Dimensions.get("window");

const SkeletonBox = ({ width, height, style }: any) => (
  <View
    className="bg-gray-200 rounded-lg"
    style={[
      {
        width,
        height,
        backgroundColor: "#E5E7EB",
      },
      style,
    ]}
  />
);

const SkeletonProfile = () => (
  <SafeAreaView className="flex-1 bg-gray-50">
    <StatusBar barStyle="light-content" />
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <SkeletonBox width="100%" height={224} style={{ borderRadius: 0 }} />
      <View className="items-center -mt-16 px-5">
        <SkeletonBox width={128} height={128} style={{ borderRadius: 64 }} />
        <View className="items-center mt-3">
          <SkeletonBox width={200} height={32} style={{ marginBottom: 8 }} />
          <SkeletonBox width={150} height={20} />
        </View>
        <View
          className="w-full bg-white rounded-2xl mt-6 p-5 shadow-lg"
          style={{ elevation: 4 }}
        >
          <View className="flex-row">
            <View className="flex-1 items-center">
              <SkeletonBox width={60} height={24} style={{ marginBottom: 4 }} />
              <SkeletonBox width={40} height={16} />
            </View>
            <View className="h-full w-[1px] bg-gray-200" />
            <View className="flex-1 items-center">
              <SkeletonBox width={80} height={24} style={{ marginBottom: 4 }} />
              <SkeletonBox width={50} height={16} />
            </View>
          </View>
        </View>
        <View className="flex-row w-full mt-4 gap-3">
          <SkeletonBox width="48%" height={48} style={{ borderRadius: 12 }} />
          <SkeletonBox width="48%" height={48} style={{ borderRadius: 12 }} />
        </View>
      </View>
      <View className="px-5 py-4">
        <View
          className="bg-white rounded-2xl mt-5 p-6 shadow-lg"
          style={{ elevation: 3 }}
        >
          <SkeletonBox width={200} height={28} style={{ marginBottom: 20 }} />
          {Array.from({ length: 4 }).map((_, index) => (
            <View
              key={index}
              className="py-4 border-b border-gray-100 flex-row justify-between items-center"
            >
              <SkeletonBox width={80} height={20} />
              <SkeletonBox width={120} height={20} />
            </View>
          ))}
        </View>
        <SkeletonBox
          width="100%"
          height={56}
          style={{ marginTop: 32, borderRadius: 12 }}
        />
      </View>
    </ScrollView>
  </SafeAreaView>
);

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    user: userDetails,
    isLoading,
    updateUser,
    isUpdating,
    updatePassword,
    isUpdatingPassword,
    updateUserError,
    updatePasswordError,
    refetch,
  } = useUser();

  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTopUpModalVisible, setIsTopUpModalVisible] = useState(false);
  const [isWithdrawalModalVisible, setIsWithdrawalModalVisible] =
    useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (userDetails) {
      setName(userDetails.name || "");
      setPhone(userDetails.phone || "");
      setAddress(userDetails.address || "");
    }
  }, [userDetails]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handlePickImage = async (imageType = "profile") => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Izin Diperlukan",
          "Izin untuk mengakses galeri diperlukan!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: imageType === "profile" ? [1, 1] : [16, 9],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const formData = new FormData();
        const uri = result.assets[0].uri;
        const filename = uri.split("/").pop() || "image.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        if (imageType === "profile") {
          formData.append("profileImage", {
            uri,
            name: filename,
            type,
          } as any);
        } else {
          formData.append("backgroundPhoto", {
            uri,
            name: filename,
            type,
          } as any);
        }

        updateUser(formData as any, {
          onSuccess: () => {
            Alert.alert(
              "Berhasil",
              `${
                imageType === "profile" ? "Foto profil" : "Foto latar belakang"
              } berhasil diperbarui`
            );
          },
          onError: (error) => {
            Alert.alert(
              "Kesalahan",
              error.message ||
                `Gagal memperbarui ${
                  imageType === "profile"
                    ? "foto profil"
                    : "foto latar belakang"
                }`
            );
          },
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Kesalahan", "Gagal memilih gambar");
    }
  };

  const handleSaveChanges = () => {
    const updateData = {
      name,
      phone,
      address,
    };

    updateUser(updateData, {
      onSuccess: () => {
        setIsEditMode(false);
        Alert.alert("Berhasil", "Profil berhasil diperbarui");
      },
      onError: (error) => {
        Alert.alert("Kesalahan", error.message || "Gagal memperbarui profil");
      },
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Kesalahan", "Kata sandi baru dan konfirmasi tidak cocok");
      return;
    }

    updatePassword(newPassword, {
      onSuccess: () => {
        setIsPasswordModalVisible(false);
        resetPasswordFields();
        Alert.alert("Berhasil", "Kata sandi berhasil diperbarui");
      },
      onError: (error) => {
        Alert.alert(
          "Kesalahan",
          error.message || "Gagal memperbarui kata sandi"
        );
      },
    });
  };

  const resetPasswordFields = () => {
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading && !refreshing) {
    return <SkeletonProfile />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#00CC00"]}
          />
        }
      >
        <View className="w-full h-80 relative">
          {isUpdating ? (
            <View className="w-full h-80 bg-gray-200 items-center justify-center">
              <ActivityIndicator color="#00FF00" size="large" />
            </View>
          ) : (
            <>
              {userDetails?.backgroundPhoto ? (
                <Image
                  source={{ uri: userDetails.backgroundPhoto }}
                  className="w-full h-80"
                  resizeMode="cover"
                />
              ) : (
                <LinearGradient
                  colors={["#00CC00", "#00AA00", "#008800"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-full h-80"
                >
                  <View className="w-full h-full items-center justify-center relative">
                    <View className="absolute inset-0 opacity-10">
                      <View className="flex-row flex-wrap h-full">
                        {Array.from({ length: 50 }).map((_, i) => (
                          <MaterialCommunityIcons
                            key={i}
                            name="leaf"
                            size={24}
                            color="white"
                            style={{
                              margin: 8,
                              transform: [
                                { rotate: `${Math.random() * 360}deg` },
                              ],
                              opacity: Math.random() * 0.7 + 0.3,
                            }}
                          />
                        ))}
                      </View>
                    </View>
                    <View className="items-center z-10">
                      <View className="bg-white/20 rounded-full p-6 mb-4">
                        <Image
                          source={images.logo}
                          style={{
                            width: 64,
                            height: 64,
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                      <Text className="text-white font-montserrat-bold text-xl text-center">
                        TrashValue
                      </Text>
                      <Text className="text-white/80 font-montserrat text-sm text-center mt-1">
                        Mengubah Sampah Jadi Berkah
                      </Text>
                    </View>
                    <View className="absolute top-8 left-8 bg-white/10 rounded-full p-3">
                      <MaterialCommunityIcons
                        name="earth"
                        size={32}
                        color="white"
                      />
                    </View>
                    <View className="absolute bottom-8 right-8 bg-white/10 rounded-full p-3">
                      <MaterialCommunityIcons
                        name="cash"
                        size={32}
                        color="white"
                      />
                    </View>
                    <View className="absolute top-1/3 right-12 bg-white/10 rounded-full p-2">
                      <MaterialCommunityIcons
                        name="star"
                        size={24}
                        color="white"
                      />
                    </View>
                    <View className="absolute bottom-1/3 left-12 bg-white/10 rounded-full p-2">
                      <MaterialCommunityIcons
                        name="heart"
                        size={24}
                        color="white"
                      />
                    </View>
                  </View>
                </LinearGradient>
              )}
              <View className="absolute top-0 left-0 w-full h-full bg-black/5" />
              <TouchableOpacity
                className="absolute bottom-4 right-4 bg-white h-12 w-12 rounded-full items-center justify-center shadow-lg z-20"
                style={{ elevation: 8 }}
                onPress={() => handlePickImage("background")}
                disabled={isUpdating}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={22} color="#00CC00" />
              </TouchableOpacity>
            </>
          )}
          <View className="absolute top-0 right-0 flex-row justify-end p-4">
            <TouchableOpacity
              className="w-12 h-12 bg-black/20 rounded-full items-center justify-center backdrop-blur-sm"
              onPress={() => setIsSettingsOpen(!isSettingsOpen)}
              activeOpacity={0.7}
            >
              <Ionicons name="settings" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {isSettingsOpen && (
            <View
              className="absolute top-16 right-4 w-52 bg-white rounded-xl shadow-xl z-10 overflow-hidden"
              style={{ elevation: 10 }}
            >
              <TouchableOpacity
                className="px-5 py-4 border-b border-gray-100 flex-row items-center"
                onPress={() => {
                  setIsSettingsOpen(false);
                  setIsEditMode(true);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={18} color="#00CC00" />
                <Text className="font-montserrat-medium ml-3 text-gray-800">
                  Edit Profil
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-5 py-4 flex-row items-center"
                onPress={() => {
                  setIsSettingsOpen(false);
                  setIsPasswordModalVisible(true);
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#00CC00"
                />
                <Text className="font-montserrat-medium ml-3 text-gray-800">
                  Ubah Kata Sandi
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View
            className="absolute bottom-0 left-0 w-full items-center"
            style={{ transform: [{ translateY: 64 }] }}
          >
            <View className="relative">
              <View
                className="h-32 w-32 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden"
                style={{
                  elevation: 8,
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 999,
                    padding: 0,
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    shadowColor: "#000",
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 2 },
                  }}
                >
                  {isUpdating ? (
                    <View className="flex-1 items-center justify-center">
                      <ActivityIndicator color="#00FF00" size="large" />
                    </View>
                  ) : userDetails?.profileImage ? (
                    <Image
                      source={{ uri: userDetails.profileImage }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        borderRadius: 999,
                        backgroundColor: "#fff",
                      }}
                    >
                      <Image
                        source={images.logo}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 30,
                          resizeMode: "contain",
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity
                className="absolute bottom-1 right-1 bg-white h-12 w-12 rounded-full items-center justify-center shadow-lg border-2 border-green-100"
                style={{ elevation: 8 }}
                onPress={() => handlePickImage("profile")}
                disabled={isUpdating}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={20} color="#00CC00" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="items-center px-5 pt-16">
          <Text className="font-montserrat-bold text-2xl mt-3 text-gray-800">
            {userDetails?.name || "Nama Pengguna"}
          </Text>
          <Text className="font-montserrat text-gray-500 text-sm">
            {userDetails?.email || "user@example.com"}
          </Text>
          <View
            className="flex-row bg-white w-full rounded-2xl mt-6 p-5 shadow-lg"
            style={{ elevation: 4 }}
          >
            <View className="flex-1 items-center">
              <Text className="font-montserrat-bold text-lg text-[#00CC00]">
                {userDetails?.points || 0}
              </Text>
              <Text className="font-montserrat-medium text-gray-500 text-xs mt-1">
                POIN
              </Text>
            </View>
            <View className="h-full w-[1px] bg-gray-200" />
            <View className="flex-1 items-center">
              <Text className="font-montserrat-bold text-lg text-[#00CC00]">
                {formatRupiah(userDetails?.balance || 0)}
              </Text>
              <Text className="font-montserrat-medium text-gray-500 text-xs mt-1">
                SALDO
              </Text>
            </View>
          </View>
          <View className="flex-row w-full mt-4 gap-3">
            <TouchableOpacity
              className="flex-1 bg-white py-3 rounded-xl items-center flex-row justify-center shadow-md"
              style={{ elevation: 3 }}
              onPress={() => setIsTopUpModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={20} color="#00CC00" />
              <Text className="font-montserrat-bold text-gray-800 ml-2">
                Isi Saldo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-white py-3 rounded-xl items-center flex-row justify-center shadow-md"
              style={{ elevation: 3 }}
              onPress={() => setIsWithdrawalModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-down-circle-outline"
                size={20}
                color="#00CC00"
              />
              <Text className="font-montserrat-bold text-gray-800 ml-2">
                Tarik Saldo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {!isEditMode ? (
          <View className="px-5 py-4">
            <View
              className="bg-white rounded-2xl mt-5 p-6 shadow-lg"
              style={{ elevation: 3 }}
            >
              <View className="flex-row items-center mb-5">
                <Ionicons name="person-outline" size={22} color="#00CC00" />
                <Text className="font-montserrat-bold text-lg ml-3 text-gray-800">
                  Informasi Pribadi
                </Text>
              </View>
              <View className="py-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="font-montserrat text-gray-500">
                  Nama Lengkap
                </Text>
                <Text
                  className="font-montserrat-medium text-gray-800 flex-1 text-right ml-2"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userDetails?.name || "Belum diisi"}
                </Text>
              </View>
              <View className="py-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="font-montserrat text-gray-500">Email</Text>
                <Text
                  className="font-montserrat-medium text-gray-800 flex-1 text-right ml-2"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userDetails?.email || "Belum diisi"}
                </Text>
              </View>
              <View className="py-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="font-montserrat text-gray-500">Telepon</Text>
                <Text
                  className="font-montserrat-medium text-gray-800 flex-1 text-right ml-2"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userDetails?.phone || "Belum diisi"}
                </Text>
              </View>
              <View className="py-4 flex-row justify-between items-center">
                <Text className="font-montserrat text-gray-500">Alamat</Text>
                <Text
                  className="font-montserrat-medium text-gray-800 flex-1 text-right ml-2"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userDetails?.address || "Belum diisi"}
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                className="mt-8 mb-10 p-4 rounded-xl flex-row items-center justify-center border-2 border-red-500"
                onPress={() => setIsLogoutModalVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                <Text className="font-montserrat-bold text-red-500 ml-2">
                  Keluar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="px-5 py-4">
            <View
              className="bg-white rounded-2xl mt-4 p-6 shadow-lg"
              style={{ elevation: 5 }}
            >
              <Text className="font-montserrat-bold text-xl mb-5 text-gray-800">
                Edit Profil
              </Text>
              <View className="mb-5">
                <Text className="font-montserrat-medium text-gray-600 mb-2">
                  Nama Lengkap
                </Text>
                <TextInput
                  className="bg-gray-100 p-4 rounded-xl font-montserrat text-gray-800"
                  style={{ elevation: 1 }}
                  value={name}
                  onChangeText={setName}
                  placeholder="Masukkan nama lengkap Anda"
                  placeholderTextColor="#aaaaaa"
                />
              </View>
              <View className="mb-5">
                <Text className="font-montserrat-medium text-gray-600 mb-2">
                  Telepon
                </Text>
                <TextInput
                  className="bg-gray-100 p-4 rounded-xl font-montserrat text-gray-800"
                  style={{ elevation: 1 }}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Masukkan nomor telepon Anda"
                  keyboardType="phone-pad"
                  placeholderTextColor="#aaaaaa"
                />
              </View>
              <View className="mb-8">
                <Text className="font-montserrat-medium text-gray-600 mb-2">
                  Alamat
                </Text>
                <TextInput
                  className="bg-gray-100 p-4 rounded-xl font-montserrat text-gray-800 h-24"
                  style={{ elevation: 1 }}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Masukkan alamat Anda"
                  multiline
                  textAlignVertical="top"
                  placeholderTextColor="#aaaaaa"
                />
              </View>
              <View className="flex-row">
                <TouchableOpacity
                  className="flex-1 bg-gray-200 p-4 rounded-xl mr-2"
                  onPress={() => setIsEditMode(false)}
                  activeOpacity={0.8}
                >
                  <Text className="font-montserrat-bold text-gray-700 text-center">
                    Batal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-[#00CC00] p-4 rounded-xl ml-2"
                  onPress={handleSaveChanges}
                  disabled={isUpdating}
                  activeOpacity={0.8}
                >
                  {isUpdating ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="font-montserrat-bold text-white text-center">
                      Simpan Perubahan
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              {updateUserError && (
                <Text className="text-red-500 font-montserrat text-center mt-3">
                  {updateUserError.message || "Kesalahan memperbarui profil"}
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>
      <Modal
        visible={isPasswordModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View
            className="w-full bg-white rounded-3xl p-6 shadow-2xl"
            style={{ elevation: 10, maxWidth: width * 0.9 }}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="font-montserrat-bold text-lg text-gray-800">
                Ubah Kata Sandi
              </Text>
              <TouchableOpacity
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                onPress={() => {
                  setIsPasswordModalVisible(false);
                  resetPasswordFields();
                }}
              >
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            <View className="mb-5">
              <Text className="font-montserrat-medium text-gray-600 mb-2">
                Kata Sandi Baru
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
                <TextInput
                  className="flex-1 font-montserrat text-gray-800 p-4"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Masukkan kata sandi baru"
                  secureTextEntry={!showNewPassword}
                  placeholderTextColor="#aaaaaa"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={{ padding: 8 }}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View className="mb-7">
              <Text className="font-montserrat-medium text-gray-600 mb-2">
                Konfirmasi Kata Sandi Baru
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
                <TextInput
                  className="flex-1 font-montserrat text-gray-800 p-4"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Konfirmasi kata sandi baru"
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#aaaaaa"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ padding: 8 }}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={22}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              className="bg-[#00CC00] p-4 rounded-xl"
              onPress={handleChangePassword}
              disabled={isUpdatingPassword}
              activeOpacity={0.8}
            >
              {isUpdatingPassword ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="font-montserrat-bold text-white text-center text-base">
                  Perbarui Kata Sandi
                </Text>
              )}
            </TouchableOpacity>
            {updatePasswordError && (
              <Text className="text-red-500 font-montserrat text-center mt-3">
                {updatePasswordError.message ||
                  "Kesalahan memperbarui kata sandi"}
              </Text>
            )}
          </View>
        </View>
      </Modal>
      <Modal
        visible={isLogoutModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View
            className="w-full bg-white rounded-3xl p-6 shadow-2xl"
            style={{ elevation: 10, maxWidth: width * 0.9 }}
          >
            <View className="items-center mb-5">
              <View className="bg-red-100 w-20 h-20 rounded-full items-center justify-center mb-4">
                <Ionicons name="log-out" size={40} color="#FF3B30" />
              </View>
              <Text className="font-montserrat-bold text-xl text-gray-800">
                Konfirmasi Keluar
              </Text>
              <Text className="text-gray-600 text-center mt-3 font-montserrat">
                Apakah Anda yakin ingin keluar dari akun Anda?
              </Text>
            </View>
            <View className="flex-row mt-4">
              <TouchableOpacity
                className="flex-1 bg-gray-200 p-4 rounded-xl mr-2"
                onPress={() => setIsLogoutModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text className="font-montserrat-bold text-gray-700 text-center">
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-500 p-4 rounded-xl ml-2"
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text className="font-montserrat-bold text-white text-center">
                  Keluar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TopUpModal
        visible={isTopUpModalVisible}
        onClose={() => setIsTopUpModalVisible(false)}
      />
      <WithdrawalModal
        visible={isWithdrawalModalVisible}
        onClose={() => setIsWithdrawalModalVisible(false)}
      />
    </SafeAreaView>
  );
}
