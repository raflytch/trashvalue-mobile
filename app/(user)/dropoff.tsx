import { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useWasteTypes } from "@/hooks/useWasteTypes";
import WasteTypeCard from "@/components/WasteTypeCard";
import WasteTypeDetailModal from "@/components/WasteTypeDetailModal";
import DropoffModal from "@/components/DropoffModal";
import DropoffList from "@/components/DropoffList";
import DropoffSelectionModal from "@/components/DropoffSelectionModal";
import { WasteType } from "@/types/waste.types";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

function WasteTypeSkeleton() {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 18,
        marginBottom: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#f0f0f0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        width: "100%",
      }}
    >
      <View
        style={{
          width: "100%",
          height: 160,
          backgroundColor: "#E5E7EB",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <LinearGradient
          colors={["#f3f4f6", "#e5e7eb", "#f3f4f6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            opacity: 0.7,
          }}
        />
        <MaterialCommunityIcons
          name="recycle"
          size={64}
          color="#D1D5DB"
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
            opacity: 0.25,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: 16,
            top: 16,
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "#F1F5F9",
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.5,
          }}
        >
          <FontAwesome5 name="leaf" size={28} color="#D1D5DB" />
        </View>
      </View>
      <View style={{ padding: 16 }}>
        <View
          style={{
            width: 140,
            height: 20,
            backgroundColor: "#E5E7EB",
            borderRadius: 8,
            marginBottom: 14,
          }}
        />
        <View
          style={{
            width: 90,
            height: 14,
            backgroundColor: "#E5E7EB",
            borderRadius: 8,
            marginBottom: 10,
          }}
        />
        <View
          style={{
            width: "100%",
            height: 12,
            backgroundColor: "#E5E7EB",
            borderRadius: 8,
            marginBottom: 8,
          }}
        />
        <View
          style={{
            width: "85%",
            height: 12,
            backgroundColor: "#E5E7EB",
            borderRadius: 8,
            marginBottom: 8,
          }}
        />
        <View
          style={{
            width: "60%",
            height: 12,
            backgroundColor: "#E5E7EB",
            borderRadius: 8,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            marginTop: 18,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#E5E7EB",
              marginRight: 12,
            }}
          />
          <View
            style={{
              width: 80,
              height: 14,
              backgroundColor: "#E5E7EB",
              borderRadius: 8,
            }}
          />
        </View>
      </View>
    </View>
  );
}

export default function DropoffScreen() {
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [selectedWasteType, setSelectedWasteType] = useState<WasteType | null>(
    null
  );
  const [wasteTypeModalVisible, setWasteTypeModalVisible] = useState(false);
  const [dropoffModalVisible, setDropoffModalVisible] = useState(false);
  const [dropoffSelectionModalVisible, setDropoffSelectionModalVisible] =
    useState(false);

  const { data, isLoading, isError, refetch, isRefetching } = useWasteTypes(
    page,
    limit
  );

  const handleNextPage = () => {
    if (data && page < data.metadata.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleSelectWasteType = (wasteType: WasteType) => {
    setSelectedWasteType(wasteType);
    setWasteTypeModalVisible(true);
  };

  const handleCloseWasteTypeModal = () => {
    setWasteTypeModalVisible(false);
  };

  const handleContinue = () => {
    setWasteTypeModalVisible(false);
    setDropoffSelectionModalVisible(true);
  };

  const handleCloseDropoffModal = () => {
    setDropoffModalVisible(false);
  };

  const handleCloseDropoffSelectionModal = () => {
    setDropoffSelectionModalVisible(false);
  };

  const handleCreateDropoff = () => {
    setSelectedWasteType(null);
    setDropoffModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#00CC00" />

      <LinearGradient
        colors={["#08A92B", "#088F27"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-12 pb-8 px-5 relative"
      >
        <View className="absolute top-0 right-0 opacity-20">
          <MaterialCommunityIcons name="recycle" size={120} color="white" />
        </View>

        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-montserrat-bold text-2xl text-white mb-1">
              Jenis Sampah
            </Text>
            <Text className="font-montserrat-medium text-white text-opacity-80">
              Daur ulang untuk masa depan lebih baik
            </Text>
          </View>
          <View className="bg-white/30 px-4 py-3 rounded-xl backdrop-blur-lg border border-white/30">
            <FontAwesome5 name="recycle" size={24} color="white" />
          </View>
        </View>
      </LinearGradient>

      <View className="bg-white mx-4 rounded-2xl -mt-5 p-4 shadow-md border border-gray-100">
        <Text className="font-montserrat-semibold text-gray-800 text-center">
          Pilih jenis sampah untuk didaur ulang dan dapatkan uang
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={["#00CC00"]}
          />
        }
      >
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-montserrat-bold text-xl text-gray-800">
              Daftar Dropoff
            </Text>
          </View>
          <DropoffList hideHeader onCreateDropoff={handleCreateDropoff} />
        </View>

        <View className="mb-4">
          <Text className="font-montserrat-bold text-xl text-gray-800 mb-3">
            Pilih Jenis Sampah
          </Text>
        </View>

        {isLoading ? (
          <View style={{ paddingBottom: 24 }}>
            {[...Array(3)].map((_, idx) => (
              <WasteTypeSkeleton key={idx} />
            ))}
          </View>
        ) : isError ? (
          <View className="bg-red-50 p-6 rounded-xl mb-4 border border-red-100">
            <View className="items-center mb-3">
              <Ionicons name="warning-outline" size={48} color="#EF4444" />
            </View>
            <Text className="font-montserrat-semibold text-red-600 text-center text-base mb-2">
              Gagal memuat data
            </Text>
            <Text className="font-montserrat text-red-500 text-center mb-4">
              Terjadi kesalahan saat mengambil data jenis sampah
            </Text>
            <TouchableOpacity
              className="bg-red-500 p-3 rounded-xl mt-1 flex-row items-center justify-center"
              onPress={() => refetch()}
            >
              <Ionicons
                name="refresh"
                size={20}
                color="white"
                className="mr-2"
              />
              <Text className="font-montserrat-bold text-white text-center ml-2">
                Coba lagi
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View className="pb-4">
              {data?.data.map((wasteType) => (
                <WasteTypeCard
                  key={wasteType.id}
                  wasteType={wasteType}
                  onSelect={handleSelectWasteType}
                />
              ))}
            </View>

            {data && data.metadata.totalPages > 1 && (
              <View className="bg-white rounded-xl shadow-sm border border-gray-100 py-3 px-2 mb-8 mt-2">
                <View className="flex-row justify-between items-center px-3">
                  <TouchableOpacity
                    className={`flex-row items-center bg-gray-50 py-2 px-3 rounded-lg ${
                      page === 1 ? "opacity-40" : "opacity-100"
                    }`}
                    onPress={handlePrevPage}
                    disabled={page === 1}
                  >
                    <Ionicons name="chevron-back" size={20} color="#00AA00" />
                    <Text className="font-montserrat-semibold text-[#00AA00] ml-1">
                      Sebelumnya
                    </Text>
                  </TouchableOpacity>

                  <View className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                    <Text className="font-montserrat-bold text-green-700">
                      {data.metadata.currentPage} / {data.metadata.totalPages}
                    </Text>
                  </View>

                  <TouchableOpacity
                    className={`flex-row items-center bg-gray-50 py-2 px-3 rounded-lg ${
                      page === data.metadata.totalPages
                        ? "opacity-40"
                        : "opacity-100"
                    }`}
                    onPress={handleNextPage}
                    disabled={page === data.metadata.totalPages}
                  >
                    <Text className="font-montserrat-semibold text-[#00AA00] mr-1">
                      Selanjutnya
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#00AA00"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <WasteTypeDetailModal
        visible={wasteTypeModalVisible}
        wasteType={selectedWasteType}
        onClose={handleCloseWasteTypeModal}
        onContinue={handleContinue}
      />

      <DropoffSelectionModal
        visible={dropoffSelectionModalVisible}
        onClose={handleCloseDropoffSelectionModal}
        wasteType={selectedWasteType}
      />

      <DropoffModal
        visible={dropoffModalVisible}
        onClose={handleCloseDropoffModal}
        wasteType={selectedWasteType}
      />
    </SafeAreaView>
  );
}
