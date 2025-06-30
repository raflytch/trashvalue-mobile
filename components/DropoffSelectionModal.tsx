import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDropoffs } from "@/hooks/useDropoffs";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import AddWasteItemModal from "./AddWasteItemModal";
import DropoffModal from "./DropoffModal";
import { Dropoff, WasteType } from "@/types/dropoff.types";

interface DropoffSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  wasteType: WasteType | null;
}

export default function DropoffSelectionModal({
  visible,
  onClose,
  wasteType,
}: DropoffSelectionModalProps) {
  const [selectedDropoffId, setSelectedDropoffId] = useState<string | null>(
    null
  );
  const [addWasteModalVisible, setAddWasteModalVisible] = useState(false);
  const [createDropoffModalVisible, setCreateDropoffModalVisible] =
    useState(false);

  const { data, isLoading, isError, refetch, isRefetching } = useDropoffs(
    1,
    10,
    "PENDING"
  );

  const handleSelectDropoff = (dropoffId: string) => {
    setSelectedDropoffId(dropoffId);
    setAddWasteModalVisible(true);
  };

  const handleCloseAddWasteModal = () => {
    setAddWasteModalVisible(false);
    setSelectedDropoffId(null);
    onClose();
  };

  const handleCreateNewDropoff = () => {
    setCreateDropoffModalVisible(true);
  };

  const handleCloseCreateDropoffModal = () => {
    setCreateDropoffModalVisible(false);
    onClose();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEEE, dd MMMM yyyy", { locale: id });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm", { locale: id });
  };

  const renderDropoffItem = (item: Dropoff) => (
    <TouchableOpacity
      key={item.id}
      style={styles.itemContainer}
      onPress={() => handleSelectDropoff(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.itemHeader}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {formatDate(item.pickupDate)} · {formatTime(item.pickupDate)}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>PENDING</Text>
        </View>
      </View>

      <View style={styles.itemDetails}>
        <View style={styles.detailRow}>
          <Ionicons
            name={
              item.pickupMethod === "PICKUP" ? "car-outline" : "walk-outline"
            }
            size={18}
            color="#00AA00"
            style={styles.icon}
          />
          <Text style={styles.detailText}>
            {item.pickupMethod === "PICKUP" ? "Dijemput" : "Antar Sendiri"}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name="location-outline"
            size={18}
            color="#00AA00"
            style={styles.icon}
          />
          <Text style={styles.detailText} numberOfLines={2}>
            {item.pickupAddress}
          </Text>
        </View>

        {item.notes && (
          <View style={styles.detailRow}>
            <Ionicons
              name="document-text-outline"
              size={18}
              color="#00AA00"
              style={styles.icon}
            />
            <Text style={styles.detailText} numberOfLines={1}>
              {item.notes}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.selectButton}>
        <Text style={styles.selectButtonText}>Pilih</Text>
        <Ionicons name="chevron-forward" size={16} color="#00AA00" />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View
            className="bg-white rounded-t-3xl max-h-[90%]"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="font-montserrat-bold text-xl text-gray-800">
                Pilih Dropoff
              </Text>
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                onPress={onClose}
              >
                <Ionicons name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            <View className="p-4">
              {wasteType && (
                <View className="bg-green-50 p-4 rounded-xl mb-4 border border-green-100 flex-row items-center">
                  {wasteType.image ? (
                    <Image
                      source={{ uri: wasteType.image }}
                      className="h-12 w-12 rounded-lg mr-4"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-12 w-12 rounded-lg bg-green-500 items-center justify-center mr-4">
                      <Ionicons name="trash-outline" size={24} color="white" />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="font-montserrat-semibold text-gray-700">
                      Jenis Sampah
                    </Text>
                    <Text className="font-montserrat-bold text-green-700 text-lg">
                      {wasteType.name}
                    </Text>
                  </View>
                </View>
              )}

              <TouchableOpacity
                className="bg-green-500 py-4 rounded-xl mb-4 flex-row justify-center items-center"
                onPress={handleCreateNewDropoff}
              >
                <Ionicons name="add-circle-outline" size={20} color="white" />
                <Text className="font-montserrat-bold text-white ml-2">
                  Buat Dropoff Baru
                </Text>
              </TouchableOpacity>

              <Text className="font-montserrat-semibold text-gray-700 mb-2">
                Atau pilih dari dropoff yang tersedia:
              </Text>
            </View>

            {isLoading ? (
              <View className="p-10 items-center">
                <ActivityIndicator size="large" color="#00AA00" />
                <Text className="font-montserrat text-gray-600 mt-4">
                  Memuat daftar dropoff...
                </Text>
              </View>
            ) : isError ? (
              <View className="p-6 items-center">
                <Ionicons name="alert-circle" size={60} color="#EF4444" />
                <Text className="font-montserrat-bold text-red-500 text-lg mt-4">
                  Gagal memuat data
                </Text>
                <Text className="font-montserrat text-red-400 text-center mt-2">
                  Terjadi kesalahan saat mengambil data dropoff
                </Text>
                <TouchableOpacity
                  className="bg-red-500 py-3 px-6 rounded-xl mt-4 flex-row items-center"
                  onPress={() => refetch()}
                >
                  <Ionicons name="refresh" size={18} color="white" />
                  <Text className="font-montserrat-bold text-white ml-2">
                    Coba lagi
                  </Text>
                </TouchableOpacity>
              </View>
            ) : data && data.data.length === 0 ? (
              <View className="p-10 items-center">
                <Ionicons
                  name="folder-open-outline"
                  size={60}
                  color="#CCCCCC"
                />
                <Text className="font-montserrat-bold text-gray-700 text-lg mt-4">
                  Belum ada dropoff
                </Text>
                <Text className="font-montserrat text-gray-500 text-center mt-2">
                  Anda belum memiliki permintaan dropoff yang tertunda
                </Text>
              </View>
            ) : (
              <ScrollView
                className="pb-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefetching}
                    onRefresh={refetch}
                    colors={["#00AA00"]}
                  />
                }
              >
                <View className="px-4">
                  {data?.data.map((item) => renderDropoffItem(item))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {selectedDropoffId && (
        <AddWasteItemModal
          visible={addWasteModalVisible}
          onClose={handleCloseAddWasteModal}
          dropoffId={selectedDropoffId}
          wasteType={wasteType}
        />
      )}

      <DropoffModal
        visible={createDropoffModalVisible}
        onClose={handleCloseCreateDropoffModal}
        wasteType={wasteType}
      />
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#1F2937",
  },
  statusBadge: {
    backgroundColor: "rgba(0, 170, 0, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 170, 0, 0.2)",
  },
  statusText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 12,
    color: "#007700",
  },
  itemDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  detailText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#4B5563",
    flex: 1,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  selectButtonText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#00AA00",
    marginRight: 4,
  },
});
