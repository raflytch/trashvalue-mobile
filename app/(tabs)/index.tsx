import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "@/hooks/useUserDetail";
import { LinearGradient } from "expo-linear-gradient";
import { useWasteTypes } from "@/hooks/useWasteTypes";
import { useCompletedDropoffs } from "@/hooks/useCompletedDropoffs";
import { router } from "expo-router";
import DropoffModal from "@/components/DropoffModal";
import WithdrawalModal from "@/components/WithdrawalModal";
import { Dropoff } from "@/types/dropoff.types";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface StatsData {
  totalDropoffs: number;
  totalPoints: number;
}

function SkeletonBox({ style }: { style?: any }) {
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        {
          backgroundColor: "#E5E7EB",
          borderRadius: 8,
          overflow: "hidden",
        },
        style,
      ]}
    />
  );
}

function DashboardSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#00CC00" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#08A92B", "#088F27"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-4 pb-10"
        >
          <View className="px-6 mb-2">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <SkeletonBox
                  style={{ width: 120, height: 28, marginBottom: 8 }}
                />
                <SkeletonBox style={{ width: 160, height: 20 }} />
              </View>
              <SkeletonBox
                style={{ width: 56, height: 56, borderRadius: 28 }}
              />
            </View>
          </View>
        </LinearGradient>
        <View className="px-4 -mt-6">
          <View
            className="bg-white rounded-2xl p-5 flex-row justify-between"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 5,
            }}
          >
            {[1, 2, 3].map((_, idx) => (
              <View key={idx} className="items-center flex-1 px-2 py-1">
                <SkeletonBox
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    marginBottom: 8,
                  }}
                />
                <SkeletonBox
                  style={{ width: 40, height: 18, marginBottom: 4 }}
                />
                <SkeletonBox style={{ width: 36, height: 12 }} />
              </View>
            ))}
          </View>
        </View>
        <View className="px-5 py-6">
          <View className="flex-row items-center mb-4">
            <SkeletonBox
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                marginRight: 8,
              }}
            />
            <SkeletonBox style={{ width: 120, height: 20 }} />
          </View>
          <View className="flex-row justify-between">
            {[1, 2].map((_, idx) => (
              <SkeletonBox
                key={idx}
                style={{
                  width: "48%",
                  height: 80,
                  borderRadius: 16,
                  marginBottom: 8,
                }}
              />
            ))}
          </View>
        </View>
        <View className="px-5 py-2">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <SkeletonBox
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  marginRight: 8,
                }}
              />
              <SkeletonBox style={{ width: 140, height: 20 }} />
            </View>
            <SkeletonBox style={{ width: 60, height: 18 }} />
          </View>
          <View
            className="bg-white rounded-2xl overflow-hidden mb-5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {[1, 2, 3].map((_, idx) => (
              <View
                key={idx}
                className={`p-4 ${idx < 2 ? "border-b border-gray-100" : ""}`}
              >
                <View className="flex-row items-center">
                  <SkeletonBox
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      marginRight: 12,
                    }}
                  />
                  <View className="flex-1">
                    <SkeletonBox
                      style={{ width: 100, height: 16, marginBottom: 6 }}
                    />
                    <SkeletonBox style={{ width: 80, height: 12 }} />
                  </View>
                  <SkeletonBox
                    style={{ width: 60, height: 18, borderRadius: 8 }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
        <View className="px-5 py-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <SkeletonBox
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  marginRight: 8,
                }}
              />
              <SkeletonBox style={{ width: 120, height: 20 }} />
            </View>
            <SkeletonBox style={{ width: 60, height: 18 }} />
          </View>
          {[1, 2, 3].map((_, idx) => (
            <SkeletonBox
              key={idx}
              style={{
                width: "100%",
                height: 70,
                borderRadius: 16,
                marginBottom: 12,
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function HomeScreen() {
  const { user: userDetails } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<StatsData>({
    totalDropoffs: 0,
    totalPoints: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dropoffModalVisible, setDropoffModalVisible] = useState(false);
  const [withdrawalModalVisible, setWithdrawalModalVisible] = useState(false);

  const {
    data: wasteTypes,
    isLoading: isLoadingWasteTypes,
    refetch: refetchWasteTypes,
  } = useWasteTypes(1, 5);

  const {
    data: completedDropoffs,
    isLoading: isLoadingCompletedDropoffs,
    refetch: refetchCompletedDropoffs,
  } = useCompletedDropoffs(1, 5);

  useEffect(() => {
    fetchDashboardData();
  }, [completedDropoffs]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      setStats({
        totalDropoffs: completedDropoffs?.metadata?.totalDropoffs || 0,
        totalPoints: userDetails?.points || 0,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchWasteTypes(), refetchCompletedDropoffs()]);
    setRefreshing(false);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const navigateToDropoff = () => {
    router.push("/dropoff");
  };

  const navigateToHistory = () => {
    router.push("/history");
  };

  const navigateToProfile = () => {
    router.push("/profile");
  };

  const openDropoffModal = () => {
    setDropoffModalVisible(true);
  };

  const closeDropoffModal = () => {
    setDropoffModalVisible(false);
  };

  const openWithdrawalModal = () => {
    setWithdrawalModalVisible(true);
  };

  const closeWithdrawalModal = () => {
    setWithdrawalModalVisible(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading || isLoadingWasteTypes || isLoadingCompletedDropoffs) {
    return <DashboardSkeleton />;
  }

  const totalRecycledWeight = completedDropoffs?.data
    ? completedDropoffs.data.reduce(
        (total, dropoff) => total + dropoff.totalWeight,
        0
      )
    : 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#00CC00" />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <LinearGradient
          colors={["#08A92B", "#088F27"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="pt-4 pb-10"
        >
          <View className="px-6 mb-2">
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="font-montserrat-bold text-2xl text-white">
                  Halo, {userDetails?.name?.split(" ")[0] || "Pengguna"}
                </Text>
                <Text className="font-montserrat-bold text-white/90 text-lg mt-1">
                  Selamat datang di TrashValue
                </Text>
              </View>
              <TouchableOpacity
                className="h-14 w-14 rounded-full border-2 border-white/30 overflow-hidden"
                activeOpacity={0.8}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                }}
                onPress={navigateToProfile}
              >
                {userDetails?.profileImage ? (
                  <Image
                    source={{ uri: userDetails.profileImage }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="flex-1 items-center justify-center bg-white/20">
                    <Ionicons name="person" size={30} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
        <View className="px-4 -mt-6">
          <View
            className="bg-white rounded-2xl p-5 flex-row justify-between"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 5,
            }}
          >
            <View className="items-center flex-1 px-2 py-1 min-w-[80px]">
              <View className="h-14 w-14 rounded-full bg-green-50 items-center justify-center mb-2 border border-green-100">
                <Ionicons name="wallet-outline" size={24} color="#00CC00" />
              </View>
              <Text
                className="font-montserrat-bold text-xs text-gray-800"
                style={{
                  fontSize: 14,
                  textAlign: "center",
                  flexWrap: "wrap",
                  width: "100%",
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatRupiah(userDetails?.balance || 0)}
              </Text>
              <Text
                className="font-montserrat-medium text-[10px] text-gray-500 uppercase"
                style={{
                  fontSize: 10,
                  textAlign: "center",
                  flexWrap: "wrap",
                  width: "100%",
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Saldo
              </Text>
            </View>
            <View className="items-center flex-1 px-2 py-1 border-l border-r border-gray-100 min-w-[80px]">
              <View className="h-14 w-14 rounded-full bg-green-50 items-center justify-center mb-2 border border-green-100">
                <Ionicons name="star-outline" size={24} color="#00CC00" />
              </View>
              <Text
                className="font-montserrat-bold text-xs text-gray-800"
                style={{
                  fontSize: 14,
                  textAlign: "center",
                  flexWrap: "wrap",
                  width: "100%",
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {userDetails?.points
                  ? userDetails.points.toLocaleString()
                  : "0"}
              </Text>
              <Text
                className="font-montserrat text-[10px] text-gray-500 uppercase"
                style={{
                  fontSize: 10,
                  textAlign: "center",
                  flexWrap: "wrap",
                  width: "100%",
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Poin
              </Text>
            </View>
            <View className="items-center flex-1 px-2 py-1 min-w-[80px]">
              <View className="h-14 w-14 rounded-full bg-green-50 items-center justify-center mb-2 border border-green-100">
                <Ionicons name="cube-outline" size={24} color="#00CC00" />
              </View>
              <Text
                className="font-montserrat-bold text-xs text-gray-800"
                style={{
                  fontSize: 14,
                  textAlign: "center",
                  flexWrap: "wrap",
                  width: "100%",
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {stats.totalDropoffs}
              </Text>
              <Text
                className="font-montserrat text-[10px] text-gray-500 uppercase"
                style={{
                  fontSize: 10,
                  textAlign: "center",
                  flexWrap: "wrap",
                  width: "100%",
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                Dropoff
              </Text>
            </View>
          </View>
        </View>
        <View className="px-5 py-6">
          <View className="flex-row items-center mb-4">
            <View className="w-6 h-6 rounded-full bg-[#00CC00]/10 items-center justify-center mr-2">
              <Ionicons name="flash" size={16} color="#00CC00" />
            </View>
            <Text className="font-montserrat-bold text-lg text-gray-800">
              Aksi Cepat
            </Text>
          </View>
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="rounded-2xl overflow-hidden w-[48%]"
              activeOpacity={0.9}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
              onPress={openDropoffModal}
            >
              <LinearGradient
                colors={["#08A92B", "#088F27"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-4 items-center"
              >
                <View className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md items-center justify-center mb-2">
                  <Ionicons name="add-circle" size={24} color="white" />
                </View>
                <Text className="font-montserrat-semibold text-white text-center">
                  Buat Dropoff
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-2xl overflow-hidden w-[48%]"
              activeOpacity={0.9}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
              }}
              onPress={openWithdrawalModal}
            >
              <LinearGradient
                colors={["#08A92B", "#088F27"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="p-4 items-center"
              >
                <View className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md items-center justify-center mb-2">
                  <Ionicons name="cash" size={24} color="white" />
                </View>
                <Text className="font-montserrat-semibold text-white text-center">
                  Tarik Saldo
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-5 py-2">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-6 h-6 rounded-full bg-[#00CC00]/10 items-center justify-center mr-2">
                <Ionicons name="checkmark-circle" size={16} color="#00CC00" />
              </View>
              <Text className="font-montserrat-bold text-lg text-gray-800">
                Dropoff Selesai
              </Text>
            </View>
            <TouchableOpacity onPress={navigateToHistory}>
              <Text className="font-montserrat-medium text-sm text-[#00CC00]">
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </View>
          <View
            className="bg-white rounded-2xl overflow-hidden mb-5"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {completedDropoffs?.data && completedDropoffs.data.length > 0 ? (
              <View>
                {completedDropoffs.data.map(
                  (dropoff: Dropoff, index: number) => (
                    <View
                      key={dropoff.id}
                      className={`p-4 ${
                        index < completedDropoffs.data.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <View className="flex-row items-center">
                        <View className="bg-green-50 p-2 rounded-xl mr-3">
                          {dropoff.wasteItems &&
                          dropoff.wasteItems.length > 0 &&
                          dropoff.wasteItems[0].wasteType?.image ? (
                            <Image
                              source={{
                                uri: dropoff.wasteItems[0].wasteType.image,
                              }}
                              style={{ width: 36, height: 36 }}
                              className="rounded-lg"
                            />
                          ) : (
                            <MaterialCommunityIcons
                              name="check-circle"
                              size={28}
                              color="#00CC00"
                            />
                          )}
                        </View>
                        <View className="flex-1">
                          <Text className="font-montserrat-semibold text-gray-800 text-base">
                            {dropoff.wasteItems && dropoff.wasteItems.length > 0
                              ? dropoff.wasteItems[0].wasteType?.name
                              : "Sampah Campuran"}
                          </Text>
                          <View className="flex-row items-center mt-1">
                            <Text className="font-montserrat text-xs text-gray-500 mr-3">
                              {formatDate(dropoff.updatedAt)}
                            </Text>
                            <View className="bg-green-50 px-2 py-1 rounded-md">
                              <Text className="font-montserrat-medium text-green-700 text-xs">
                                {dropoff.totalWeight} kg
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View>
                          <Text className="font-montserrat-bold text-green-600 text-base">
                            +{formatRupiah(dropoff.totalAmount)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  )
                )}
                <TouchableOpacity
                  className="p-4 bg-gray-50 border-t border-gray-100 items-center"
                  onPress={navigateToHistory}
                >
                  <Text className="font-montserrat-semibold text-gray-600">
                    Lihat Semua Riwayat
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center py-8">
                <MaterialCommunityIcons
                  name="recycle"
                  size={48}
                  color="#CCCCCC"
                />
                <Text className="font-montserrat text-gray-500 mt-2">
                  Belum ada dropoff yang selesai
                </Text>
                <TouchableOpacity
                  className="bg-green-500 px-4 py-2 rounded-full mt-4"
                  onPress={openDropoffModal}
                >
                  <Text className="font-montserrat-semibold text-white">
                    Buat Dropoff Pertama
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View className="px-5 py-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-6 h-6 rounded-full bg-[#00CC00]/10 items-center justify-center mr-2">
                <MaterialCommunityIcons
                  name="recycle"
                  size={16}
                  color="#00CC00"
                />
              </View>
              <Text className="font-montserrat-bold text-lg text-gray-800">
                Jenis Sampah
              </Text>
            </View>
            <TouchableOpacity onPress={navigateToDropoff}>
              <Text className="font-montserrat-medium text-sm text-[#00CC00]">
                Lihat Semua
              </Text>
            </TouchableOpacity>
          </View>
          {wasteTypes?.data.map((wasteType) => (
            <TouchableOpacity
              key={wasteType.id}
              className="bg-white rounded-xl p-4 mb-3 flex-row items-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 5,
                elevation: 2,
                borderWidth: 1,
                borderColor: "#F0F0F0",
              }}
              activeOpacity={0.8}
              onPress={navigateToDropoff}
            >
              {wasteType.image ? (
                <Image
                  source={{ uri: wasteType.image }}
                  style={{ width: 60, height: 60 }}
                  className="rounded-xl mr-4"
                />
              ) : (
                <View
                  className="relative mr-4 bg-green-50 p-3 rounded-xl"
                  style={{ width: 60, height: 60 }}
                >
                  <MaterialCommunityIcons
                    name="recycle"
                    size={32}
                    color="#00CC00"
                  />
                </View>
              )}
              <View className="flex-1">
                <Text className="font-montserrat-bold text-gray-800 text-base">
                  {wasteType.name}
                </Text>
                <View className="mt-1">
                  <Text className="font-montserrat-medium text-green-700 text-xs">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(wasteType.pricePerKg)}
                    /kg
                  </Text>
                </View>
                <Text
                  className="font-montserrat text-gray-500 text-xs mt-1"
                  numberOfLines={1}
                >
                  {wasteType.description}
                </Text>
              </View>
              <View className="bg-green-50 h-8 w-8 rounded-full items-center justify-center">
                <Ionicons name="chevron-forward" size={18} color="#00CC00" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <DropoffModal
        visible={dropoffModalVisible}
        onClose={closeDropoffModal}
        wasteType={null}
      />
      <WithdrawalModal
        visible={withdrawalModalVisible}
        onClose={closeWithdrawalModal}
      />
    </SafeAreaView>
  );
}
