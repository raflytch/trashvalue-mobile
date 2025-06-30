import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useDropoffs } from "@/hooks/useDropoffs";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { LinearGradient } from "expo-linear-gradient";
import AddWasteItemModal from "./AddWasteItemModal";
import { Dropoff } from "@/types/dropoff.types";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;
const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

function DropoffListSkeleton() {
  return (
    <View style={{ marginBottom: 16 }}>
      {[...Array(2)].map((_, idx) => (
        <Animated.View
          key={idx}
          entering={FadeIn}
          exiting={FadeOut}
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 2,
            borderWidth: 1,
            borderColor: "#F0F0F0",
            width: width - 32,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 80,
                height: 20,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
              }}
            />
            <View
              style={{
                width: 100,
                height: 16,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
              }}
            />
          </View>
          <View
            style={{
              height: 12,
              backgroundColor: "#E5E7EB",
              borderRadius: 8,
              marginBottom: 12,
              width: "60%",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
                marginRight: 12,
              }}
            />
            <View
              style={{
                flex: 1,
                height: 14,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
                marginRight: 12,
              }}
            />
            <View
              style={{
                flex: 1,
                height: 14,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
                marginRight: 12,
              }}
            />
            <View
              style={{
                flex: 1,
                height: 14,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
                marginRight: 12,
              }}
            />
            <View
              style={{
                flex: 1,
                height: 14,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
              }}
            />
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <View
              style={{
                width: 120,
                height: 32,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
              }}
            />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

interface DropoffListProps {
  hideHeader?: boolean;
  onCreateDropoff?: () => void;
}

export default function DropoffList({
  hideHeader = false,
  onCreateDropoff,
}: DropoffListProps) {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [status, setStatus] = useState<"PENDING" | "PROCESSING">("PENDING");
  const [selectedDropoffId, setSelectedDropoffId] = useState<string | null>(
    null
  );
  const [addWasteModalVisible, setAddWasteModalVisible] = useState(false);

  const handleStatusChange = useCallback(
    (newStatus: "PENDING" | "PROCESSING") => {
      if (status !== newStatus) {
        setPage(1);
        setStatus(newStatus);
      }
    },
    [status]
  );

  const { data, isLoading, isError, refetch, isRefetching } = useDropoffs(
    page,
    limit,
    status
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

  const handleAddWaste = (dropoffId: string) => {
    setSelectedDropoffId(dropoffId);
    setAddWasteModalVisible(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEEE, dd MMMM yyyy", { locale: id });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm", { locale: id });
  };

  const renderDropoffItem = ({ item }: { item: Dropoff }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View
          style={[
            styles.statusBadge,
            item.status === "PENDING"
              ? styles.pendingBadge
              : styles.processingBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === "PENDING"
                ? styles.pendingText
                : styles.processingText,
            ]}
          >
            {item.status}
          </Text>
        </View>
        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="calendar"
              size={moderateScale(20)}
              color="#00AA00"
            />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Tanggal Pengambilan:</Text>
            <Text style={styles.infoValue}>
              {formatDate(item.pickupDate)} {formatTime(item.pickupDate)}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={
                item.pickupMethod === "PICKUP" ? "car-outline" : "walk-outline"
              }
              size={moderateScale(20)}
              color="#00AA00"
            />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Metode Pengambilan:</Text>
            <Text style={styles.infoValue}>
              {item.pickupMethod === "PICKUP" ? "Dijemput" : "Antar Sendiri"}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="location-outline"
              size={moderateScale(20)}
              color="#00AA00"
            />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Alamat:</Text>
            <Text style={styles.infoValue}>{item.pickupAddress}</Text>
          </View>
        </View>
        {item.notes && (
          <View style={styles.infoRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="document-text-outline"
                size={moderateScale(20)}
                color="#00AA00"
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Catatan:</Text>
              <Text style={styles.infoValue}>{item.notes}</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAddWaste(item.id)}
        >
          <Text style={styles.actionButtonText}>Tambah Sampah</Text>
          <Ionicons
            name="chevron-forward"
            size={moderateScale(16)}
            color="#00AA00"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return <DropoffListSkeleton />;
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons
          name="alert-circle"
          size={moderateScale(60)}
          color="#EF4444"
        />
        <Text style={styles.errorTitle}>Gagal memuat data</Text>
        <Text style={styles.errorMessage}>
          Terjadi kesalahan saat mengambil data dropoff
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Ionicons name="refresh" size={moderateScale(20)} color="white" />
          <Text style={styles.retryButtonText}>Coba lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          hideHeader ? styles.transparentBg : styles.defaultBg,
        ]}
      >
        {!hideHeader && (
          <LinearGradient
            colors={["#00DD00", "#00AA00"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Text style={styles.headerTitle}>Daftar Dropoff</Text>
            <Text style={styles.headerSubtitle}>
              Daftar permintaan pengambilan sampah Anda
            </Text>
          </LinearGradient>
        )}
        <View style={styles.filterContainer}>
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                status === "PENDING" ? styles.activeFilterTab : {},
              ]}
              onPress={() => handleStatusChange("PENDING")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  status === "PENDING" ? styles.activeFilterTabText : {},
                ]}
              >
                Pending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                status === "PROCESSING" ? styles.activeFilterTab : {},
              ]}
              onPress={() => handleStatusChange("PROCESSING")}
            >
              <Text
                style={[
                  styles.filterTabText,
                  status === "PROCESSING" ? styles.activeFilterTabText : {},
                ]}
              >
                Processing
              </Text>
            </TouchableOpacity>
          </View>
          {onCreateDropoff && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={onCreateDropoff}
            >
              <Ionicons
                name="add-circle-outline"
                size={moderateScale(18)}
                color="white"
              />
              <Text style={styles.createButtonText}>Buat Dropoff</Text>
            </TouchableOpacity>
          )}
        </View>
        {data && data.data.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="trash-bin-outline"
              size={moderateScale(80)}
              color="#CCCCCC"
            />
            <Text style={styles.emptyTitle}>Belum ada dropoff</Text>
            <Text style={styles.emptyMessage}>
              Anda belum memiliki permintaan dropoff yang{" "}
              {status === "PENDING" ? "tertunda" : "diproses"}
            </Text>
            {onCreateDropoff && (
              <TouchableOpacity
                style={styles.emptyCreateButton}
                onPress={onCreateDropoff}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={moderateScale(20)}
                  color="white"
                />
                <Text style={styles.emptyCreateButtonText}>
                  Buat Dropoff Baru
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <FlatList
              data={data?.data || []}
              keyExtractor={(item) => item.id}
              renderItem={renderDropoffItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                hideHeader ? {} : styles.listContainer,
                {
                  paddingBottom: verticalScale(Platform.OS === "ios" ? 32 : 16),
                  paddingHorizontal: 0,
                  width: width,
                  minWidth: width,
                  maxWidth: width,
                  alignSelf: "center",
                },
              ]}
              refreshControl={
                <RefreshControl
                  refreshing={isRefetching}
                  onRefresh={refetch}
                  colors={["#00AA00"]}
                />
              }
              scrollEnabled={!hideHeader}
              nestedScrollEnabled={true}
              removeClippedSubviews={false}
            />
            {data && data.metadata && data.metadata.totalPages > 1 && (
              <View style={styles.paginationContainer}>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    page === 1 ? styles.disabledButton : {},
                  ]}
                  onPress={handlePrevPage}
                  disabled={page === 1}
                >
                  <Ionicons
                    name="chevron-back"
                    size={moderateScale(18)}
                    color={page === 1 ? "#AAAAAA" : "#00AA00"}
                  />
                  <Text
                    style={[
                      styles.paginationButtonText,
                      page === 1 ? styles.disabledButtonText : {},
                    ]}
                  >
                    Sebelumnya
                  </Text>
                </TouchableOpacity>
                <View style={styles.paginationInfo}>
                  <Text style={styles.paginationInfoText}>
                    {data.metadata.currentPage} / {data.metadata.totalPages}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    page === data.metadata.totalPages
                      ? styles.disabledButton
                      : {},
                  ]}
                  onPress={handleNextPage}
                  disabled={page === data.metadata.totalPages}
                >
                  <Text
                    style={[
                      styles.paginationButtonText,
                      page === data.metadata.totalPages
                        ? styles.disabledButtonText
                        : {},
                    ]}
                  >
                    Selanjutnya
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={moderateScale(18)}
                    color={
                      page === data.metadata.totalPages ? "#AAAAAA" : "#00AA00"
                    }
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        {selectedDropoffId && (
          <AddWasteItemModal
            visible={addWasteModalVisible}
            onClose={() => {
              setAddWasteModalVisible(false);
              setSelectedDropoffId(null);
            }}
            dropoffId={selectedDropoffId}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    minWidth: width,
    maxWidth: width,
    alignSelf: "center",
  },
  transparentBg: {
    backgroundColor: "transparent",
  },
  defaultBg: {
    backgroundColor: "#F9F9F9",
  },
  headerGradient: {
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    borderBottomLeftRadius: moderateScale(16),
    borderBottomRightRadius: moderateScale(16),
    width: width,
    minWidth: width,
    maxWidth: width,
    alignSelf: "center",
  },
  headerTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: moderateScale(24),
    color: "white",
    marginBottom: verticalScale(4),
  },
  headerSubtitle: {
    fontFamily: "Montserrat-Medium",
    fontSize: moderateScale(14),
    color: "rgba(255, 255, 255, 0.8)",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(16),
    marginTop: verticalScale(8),
    paddingHorizontal: scale(16),
    width: width,
    minWidth: width,
    maxWidth: width,
    alignSelf: "center",
  },
  filterTabs: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: moderateScale(8),
    padding: scale(4),
  },
  filterTab: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    borderRadius: moderateScale(8),
  },
  activeFilterTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterTabText: {
    fontFamily: "Montserrat-Medium",
    fontSize: moderateScale(14),
    color: "#666666",
  },
  activeFilterTabText: {
    color: "#00AA00",
  },
  createButton: {
    backgroundColor: "#00AA00",
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
    flexDirection: "row",
    alignItems: "center",
  },
  createButtonText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: moderateScale(14),
    color: "white",
    marginLeft: scale(4),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(16),
    width: width,
    minWidth: width,
    maxWidth: width,
    alignSelf: "center",
  },
  loadingText: {
    fontFamily: "Montserrat-Medium",
    fontSize: moderateScale(14),
    color: "#666666",
    marginTop: verticalScale(12),
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(24),
    backgroundColor: "#FEEFEF",
    borderRadius: moderateScale(16),
    margin: scale(16),
    borderWidth: 1,
    borderColor: "#FFCCCC",
    width: width,
    minWidth: width,
    maxWidth: width,
    alignSelf: "center",
  },
  errorTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: moderateScale(18),
    color: "#EF4444",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  errorMessage: {
    fontFamily: "Montserrat",
    fontSize: moderateScale(14),
    color: "#EF5555",
    textAlign: "center",
    marginBottom: verticalScale(24),
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(24),
    borderRadius: moderateScale(12),
  },
  retryButtonText: {
    fontFamily: "Montserrat-Bold",
    fontSize: moderateScale(14),
    color: "white",
    marginLeft: scale(8),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(24),
    width: width,
    minWidth: width,
    maxWidth: width,
    alignSelf: "center",
  },
  emptyTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: moderateScale(18),
    color: "#4B5563",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  emptyMessage: {
    fontFamily: "Montserrat-Medium",
    fontSize: moderateScale(14),
    color: "#6B7280",
    textAlign: "center",
  },
  emptyCreateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00AA00",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(20),
    borderRadius: moderateScale(8),
    marginTop: verticalScale(24),
  },
  emptyCreateButtonText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: moderateScale(14),
    color: "white",
    marginLeft: scale(8),
  },
  itemContainer: {
    backgroundColor: "white",
    borderRadius: moderateScale(16),
    padding: scale(16),
    marginBottom: verticalScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginHorizontal: 0,
    width: width - scale(32),
    minWidth: width - scale(32),
    maxWidth: width - scale(32),
    alignSelf: "center",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
    paddingBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  statusBadge: {
    paddingVertical: verticalScale(4),
    paddingHorizontal: scale(10),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  pendingBadge: {
    backgroundColor: "rgba(0, 170, 0, 0.1)",
    borderColor: "rgba(0, 170, 0, 0.2)",
  },
  processingBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  statusText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: moderateScale(12),
  },
  pendingText: {
    color: "#007700",
  },
  processingText: {
    color: "#1D4ED8",
  },
  dateText: {
    fontFamily: "Montserrat-Medium",
    fontSize: moderateScale(12),
    color: "#6B7280",
  },
  contentContainer: {
    marginBottom: verticalScale(12),
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: verticalScale(12),
  },
  iconContainer: {
    width: moderateScale(28),
    height: moderateScale(28),
    backgroundColor: "rgba(0, 170, 0, 0.1)",
    borderRadius: moderateScale(8),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: "Montserrat-Medium",
    fontSize: moderateScale(12),
    color: "#6B7280",
    marginBottom: verticalScale(2),
  },
  infoValue: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: moderateScale(14),
    color: "#1F2937",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: verticalScale(12),
    alignItems: "flex-end",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(8),
  },
  actionButtonText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: moderateScale(14),
    color: "#00AA00",
    marginRight: scale(4),
  },
  listContainer: {
    paddingBottom: verticalScale(16),
    width: width,
    minWidth: width,
    maxWidth: width,
    alignSelf: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: moderateScale(12),
    padding: scale(12),
    marginHorizontal: scale(16),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    width: width - scale(32),
    minWidth: width - scale(32),
    maxWidth: width - scale(32),
    alignSelf: "center",
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(8),
  },
  paginationButtonText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: moderateScale(14),
    color: "#00AA00",
    marginHorizontal: scale(4),
  },
  disabledButton: {
    opacity: 0.4,
  },
  disabledButtonText: {
    color: "#999",
  },
  paginationInfo: {
    backgroundColor: "rgba(0, 170, 0, 0.1)",
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: "rgba(0, 170, 0, 0.2)",
  },
  paginationInfoText: {
    fontFamily: "Montserrat-Bold",
    fontSize: moderateScale(12),
    color: "#007700",
  },
});
