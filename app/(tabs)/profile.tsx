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
  ImageBackground,
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

const { width } = Dimensions.get("window");

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

  const defaultBgPattern = {
    uri: "https://i.imgur.com/7GMYYxe.png",
  };

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
          "Permission Needed",
          "Permission to access media library is required!"
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
              "Success",
              `${
                imageType === "profile" ? "Profile image" : "Background photo"
              } updated successfully`
            );
          },
          onError: (error) => {
            Alert.alert(
              "Error",
              error.message ||
                `Failed to update ${
                  imageType === "profile" ? "profile image" : "background photo"
                }`
            );
          },
        });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
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
        Alert.alert("Success", "Profile updated successfully");
      },
      onError: (error) => {
        Alert.alert("Error", error.message || "Failed to update profile");
      },
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirmation don't match");
      return;
    }

    updatePassword(newPassword, {
      onSuccess: () => {
        setIsPasswordModalVisible(false);
        resetPasswordFields();
        Alert.alert("Success", "Password updated successfully");
      },
      onError: (error) => {
        Alert.alert("Error", error.message || "Failed to update password");
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
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#00FF00" />
        <Text className="font-montserrat mt-4">Loading profile...</Text>
      </SafeAreaView>
    );
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
        <View className="w-full h-56 relative">
          {isUpdating ? (
            <View className="w-full h-56 bg-gray-200 items-center justify-center">
              <ActivityIndicator color="#00FF00" size="large" />
            </View>
          ) : (
            <>
              {userDetails?.backgroundPhoto ? (
                <Image
                  source={{ uri: userDetails.backgroundPhoto }}
                  className="w-full h-56"
                  resizeMode="cover"
                />
              ) : (
                <ImageBackground
                  source={defaultBgPattern}
                  className="w-full h-56 bg-gradient-to-br from-[#00CC00] to-[#33FF33]"
                  imageStyle={{ opacity: 0.2 }}
                >
                  <View className="w-full h-full items-center justify-center">
                    <MaterialCommunityIcons
                      name="recycle"
                      size={80}
                      color="white"
                      style={{ opacity: 0.7 }}
                    />
                  </View>
                </ImageBackground>
              )}

              <View className="absolute top-0 left-0 w-full h-full bg-black/10" />

              <TouchableOpacity
                className="absolute bottom-4 right-4 bg-white h-10 w-10 rounded-full items-center justify-center shadow-lg z-20"
                style={{ elevation: 5 }}
                onPress={() => handlePickImage("background")}
                disabled={isUpdating}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={20} color="#00CC00" />
              </TouchableOpacity>

              <View className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-black/40 to-transparent">
                <View className="flex-row justify-between items-center px-5 h-full"></View>
              </View>
            </>
          )}

          <View className="absolute top-0 right-0 flex-row justify-end p-4">
            <TouchableOpacity
              className="w-10 h-10 bg-black/20 rounded-full items-center justify-center"
              onPress={() => setIsSettingsOpen(!isSettingsOpen)}
              activeOpacity={0.7}
            >
              <Ionicons name="settings" size={22} color="white" />
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
                  Edit Profile
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
                  Change Password
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="items-center -mt-16 px-5">
          <View className="relative">
            <View
              className="h-32 w-32 rounded-full border-4 border-white shadow-xl bg-gray-200 overflow-hidden"
              style={{ elevation: 8 }}
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
                <View className="flex-1 items-center justify-center bg-gradient-to-br from-[#00CC00] to-[#33FF33]">
                  <Ionicons name="person" size={56} color="white" />
                </View>
              )}
            </View>

            <TouchableOpacity
              className="absolute bottom-1 right-1 bg-white h-10 w-10 rounded-full items-center justify-center shadow-lg"
              style={{ elevation: 5 }}
              onPress={() => handlePickImage("profile")}
              disabled={isUpdating}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={18} color="#00CC00" />
            </TouchableOpacity>
          </View>

          <Text className="font-montserrat-bold text-2xl mt-3 text-gray-800">
            {userDetails?.name || "User Name"}
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
                POINTS
              </Text>
            </View>

            <View className="h-full w-[1px] bg-gray-200" />

            <View className="flex-1 items-center">
              <Text className="font-montserrat-bold text-lg text-[#00CC00]">
                {formatRupiah(userDetails?.balance || 0)}
              </Text>
              <Text className="font-montserrat-medium text-gray-500 text-xs mt-1">
                BALANCE
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
                Top Up
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
                Withdraw
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
                  Personal Information
                </Text>
              </View>

              <View className="py-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="font-montserrat text-gray-500">Full Name</Text>
                <Text
                  className="font-montserrat-medium text-gray-800 flex-1 text-right ml-2"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userDetails?.name || "Not provided"}
                </Text>
              </View>

              <View className="py-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="font-montserrat text-gray-500">Email</Text>
                <Text
                  className="font-montserrat-medium text-gray-800 flex-1 text-right ml-2"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userDetails?.email || "Not provided"}
                </Text>
              </View>

              <View className="py-4 border-b border-gray-100 flex-row justify-between items-center">
                <Text className="font-montserrat text-gray-500">Phone</Text>
                <Text
                  className="font-montserrat-medium text-gray-800 flex-1 text-right ml-2"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userDetails?.phone || "Not provided"}
                </Text>
              </View>

              <View className="py-4 flex-row justify-between items-center">
                <Text className="font-montserrat text-gray-500">Address</Text>
                <Text
                  className="font-montserrat-medium text-gray-800 flex-1 text-right ml-2"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userDetails?.address || "Not provided"}
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
                  Logout
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
                Edit Profile
              </Text>

              <View className="mb-5">
                <Text className="font-montserrat-medium text-gray-600 mb-2">
                  Full Name
                </Text>
                <TextInput
                  className="bg-gray-100 p-4 rounded-xl font-montserrat text-gray-800"
                  style={{ elevation: 1 }}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#aaaaaa"
                />
              </View>

              <View className="mb-5">
                <Text className="font-montserrat-medium text-gray-600 mb-2">
                  Phone
                </Text>
                <TextInput
                  className="bg-gray-100 p-4 rounded-xl font-montserrat text-gray-800"
                  style={{ elevation: 1 }}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor="#aaaaaa"
                />
              </View>

              <View className="mb-8">
                <Text className="font-montserrat-medium text-gray-600 mb-2">
                  Address
                </Text>
                <TextInput
                  className="bg-gray-100 p-4 rounded-xl font-montserrat text-gray-800 h-24"
                  style={{ elevation: 1 }}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter your address"
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
                    Cancel
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
                      Save Changes
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {updateUserError && (
                <Text className="text-red-500 font-montserrat text-center mt-3">
                  {updateUserError.message || "Error updating profile"}
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
                Change Password
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
                New Password
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
                <TextInput
                  className="flex-1 font-montserrat text-gray-800 p-4"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
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
                Confirm New Password
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
                <TextInput
                  className="flex-1 font-montserrat text-gray-800 p-4"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
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
                  Update Password
                </Text>
              )}
            </TouchableOpacity>

            {updatePasswordError && (
              <Text className="text-red-500 font-montserrat text-center mt-3">
                {updatePasswordError.message || "Error updating password"}
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
                Logout Confirmation
              </Text>
              <Text className="text-gray-600 text-center mt-3 font-montserrat">
                Are you sure you want to logout from your account?
              </Text>
            </View>

            <View className="flex-row mt-4">
              <TouchableOpacity
                className="flex-1 bg-gray-200 p-4 rounded-xl mr-2"
                onPress={() => setIsLogoutModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text className="font-montserrat-bold text-gray-700 text-center">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-red-500 p-4 rounded-xl ml-2"
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Text className="font-montserrat-bold text-white text-center">
                  Logout
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
