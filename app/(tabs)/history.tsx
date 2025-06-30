import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCompletedDropoffs } from "@/hooks/useCompletedDropoffs";
import { useUserTransactions } from "@/hooks/useUserTransactions";
import DropoffHistoryItem from "@/components/DropoffHistoryItem";
import TransactionHistoryItem from "@/components/TransactionHistoryItem";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const { width } = Dimensions.get("window");

function TransactionHistorySkeleton() {
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
      {[...Array(5)].map((_, idx) => (
        <Animated.View
          key={idx}
          entering={FadeIn}
          exiting={FadeOut}
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            marginBottom: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 2,
            overflow: "hidden",
            width: width - 32,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#F3F4F6",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 100,
                  height: 16,
                  backgroundColor: "#E5E7EB",
                  borderRadius: 8,
                }}
              />
              <View
                style={{
                  width: 60,
                  height: 20,
                  backgroundColor: "#E5E7EB",
                  borderRadius: 8,
                  marginLeft: 12,
                }}
              />
            </View>
            <View
              style={{
                width: 80,
                height: 20,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
              }}
            />
          </View>
          <View style={{ padding: 16 }}>
            {[...Array(3)].map((__, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#F3F4F6",
                    marginRight: 12,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      width: "60%",
                      height: 14,
                      backgroundColor: "#E5E7EB",
                      borderRadius: 8,
                      marginBottom: 6,
                    }}
                  />
                  <View
                    style={{
                      width: "80%",
                      height: 16,
                      backgroundColor: "#E5E7EB",
                      borderRadius: 8,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

function DropoffHistorySkeleton() {
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
      {[...Array(3)].map((_, idx) => (
        <Animated.View
          key={idx}
          entering={FadeIn}
          exiting={FadeOut}
          style={{
            backgroundColor: "white",
            borderRadius: 16,
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 3.84,
            elevation: 2,
            overflow: "hidden",
            width: width - 32,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#E0F2E0",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 100,
                  height: 16,
                  backgroundColor: "#E5E7EB",
                  borderRadius: 8,
                }}
              />
              <View
                style={{
                  width: 50,
                  height: 20,
                  backgroundColor: "#E5E7EB",
                  borderRadius: 8,
                  marginLeft: 12,
                }}
              />
            </View>
            <View
              style={{
                width: 80,
                height: 20,
                backgroundColor: "#E5E7EB",
                borderRadius: 8,
              }}
            />
          </View>
          <View style={{ padding: 16 }}>
            {[...Array(3)].map((__, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    backgroundColor: "#F0F9F0",
                    marginRight: 12,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      width: "60%",
                      height: 14,
                      backgroundColor: "#E5E7EB",
                      borderRadius: 8,
                      marginBottom: 6,
                    }}
                  />
                  <View
                    style={{
                      width: "80%",
                      height: 16,
                      backgroundColor: "#E5E7EB",
                      borderRadius: 8,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<"dropoffs" | "transactions">(
    "dropoffs"
  );
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "COMPLETED" | "PENDING" | "REJECTED"
  >("all");

  const {
    data: dropoffData,
    isLoading: isDropoffLoading,
    isError: isDropoffError,
    refetch: refetchDropoffs,
    isRefetching: isRefetchingDropoffs,
  } = useCompletedDropoffs(page, limit);

  const {
    data: transactionData,
    isLoading: isTransactionLoading,
    isError: isTransactionError,
    refetch: refetchTransactions,
    isRefetching: isRefetchingTransactions,
  } = useUserTransactions(page, limit, sortDirection);

  const handleNextPage = () => {
    const data = activeTab === "dropoffs" ? dropoffData : transactionData;
    if (data && page < data.metadata.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "desc" ? "asc" : "desc");
    setPage(1);
  };

  const cycleStatusFilter = () => {
    switch (statusFilter) {
      case "all":
        setStatusFilter("COMPLETED");
        break;
      case "COMPLETED":
        setStatusFilter("PENDING");
        break;
      case "PENDING":
        setStatusFilter("REJECTED");
        break;
      case "REJECTED":
        setStatusFilter("all");
        break;
    }
    setPage(1);
  };

  const getStatusFilterLabel = () => {
    switch (statusFilter) {
      case "all":
        return "Semua";
      case "COMPLETED":
        return "Selesai";
      case "PENDING":
        return "Pending";
      case "REJECTED":
        return "Ditolak";
    }
  };

  const getStatusFilterIcon = () => {
    switch (statusFilter) {
      case "all":
        return "filter-outline";
      case "COMPLETED":
        return "checkmark-circle";
      case "PENDING":
        return "time";
      case "REJECTED":
        return "close-circle";
    }
  };

  const getStatusFilterColor = () => {
    switch (statusFilter) {
      case "all":
        return "#00AA00";
      case "COMPLETED":
        return "#00AA00";
      case "PENDING":
        return "#F59E0B";
      case "REJECTED":
        return "#EF4444";
    }
  };

  const getFilteredTransactions = () => {
    if (!transactionData) return [];
    if (statusFilter === "all") return transactionData.data;
    return transactionData.data.filter((item) => item.status === statusFilter);
  };

  const renderContent = () => {
    if (activeTab === "transactions") {
      if (isTransactionLoading) {
        return <TransactionHistorySkeleton />;
      }

      if (isTransactionError) {
        return (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={60} color="#EF4444" />
            <Text style={styles.errorTitle}>Gagal memuat data</Text>
            <Text style={styles.errorMessage}>
              Terjadi kesalahan saat mengambil riwayat transaksi
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetchTransactions()}
            >
              <Ionicons name="refresh" size={20} color="white" />
              <Text style={styles.retryButtonText}>Coba lagi</Text>
            </TouchableOpacity>
          </View>
        );
      }

      if (!transactionData || transactionData.data.length === 0) {
        return (
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={80} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>Belum ada transaksi</Text>
            <Text style={styles.emptyMessage}>
              Riwayat transaksi Anda akan muncul di sini
            </Text>
          </View>
        );
      }

      const filteredTransactions = getFilteredTransactions();

      if (filteredTransactions.length === 0) {
        return (
          <>
            <View style={styles.sortContainer}>
              <View style={styles.filterActions}>
                <TouchableOpacity
                  style={[
                    styles.sortButton,
                    {
                      backgroundColor:
                        statusFilter !== "all"
                          ? `${getStatusFilterColor()}15`
                          : "#F0F9F0",
                    },
                  ]}
                  onPress={cycleStatusFilter}
                >
                  <Text
                    style={[
                      styles.sortButtonText,
                      { color: getStatusFilterColor() },
                    ]}
                  >
                    {getStatusFilterLabel()}
                  </Text>
                  <Ionicons
                    name={getStatusFilterIcon()}
                    size={16}
                    color={getStatusFilterColor()}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.emptyFilterContainer}>
              <Ionicons
                name={getStatusFilterIcon()}
                size={60}
                color={getStatusFilterColor()}
              />
              <Text style={styles.emptyFilterTitle}>
                Tidak ada transaksi {getStatusFilterLabel().toLowerCase()}
              </Text>
              <TouchableOpacity
                style={[
                  styles.resetFilterButton,
                  { backgroundColor: `${getStatusFilterColor()}20` },
                ]}
                onPress={() => setStatusFilter("all")}
              >
                <Ionicons
                  name="refresh"
                  size={16}
                  color={getStatusFilterColor()}
                />
                <Text
                  style={[
                    styles.resetFilterText,
                    { color: getStatusFilterColor() },
                  ]}
                >
                  Tampilkan semua transaksi
                </Text>
              </TouchableOpacity>
            </View>
          </>
        );
      }

      return (
        <>
          <View style={styles.sortContainer}>
            <View style={styles.filterActions}>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  {
                    backgroundColor:
                      statusFilter !== "all"
                        ? `${getStatusFilterColor()}15`
                        : "#F0F9F0",
                  },
                ]}
                onPress={cycleStatusFilter}
              >
                <Text
                  style={[
                    styles.sortButtonText,
                    { color: getStatusFilterColor() },
                  ]}
                >
                  {getStatusFilterLabel()}
                </Text>
                <Ionicons
                  name={getStatusFilterIcon()}
                  size={16}
                  color={getStatusFilterColor()}
                />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={filteredTransactions}
            renderItem={({ item }) => <TransactionHistoryItem item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetchingTransactions}
                onRefresh={refetchTransactions}
                colors={["#00AA00"]}
              />
            }
          />

          {transactionData.metadata.totalPages > 1 && (
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
                  size={18}
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
                  {transactionData.metadata.currentPage} /{" "}
                  {transactionData.metadata.totalPages}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.paginationButton,
                  page === transactionData.metadata.totalPages
                    ? styles.disabledButton
                    : {},
                ]}
                onPress={handleNextPage}
                disabled={page === transactionData.metadata.totalPages}
              >
                <Text
                  style={[
                    styles.paginationButtonText,
                    page === transactionData.metadata.totalPages
                      ? styles.disabledButtonText
                      : {},
                  ]}
                >
                  Selanjutnya
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={
                    page === transactionData.metadata.totalPages
                      ? "#AAAAAA"
                      : "#00AA00"
                  }
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      );
    }

    if (isDropoffLoading) {
      return <DropoffHistorySkeleton />;
    }

    if (isDropoffError) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color="#EF4444" />
          <Text style={styles.errorTitle}>Gagal memuat data</Text>
          <Text style={styles.errorMessage}>
            Terjadi kesalahan saat mengambil riwayat dropoff
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetchDropoffs()}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <Text style={styles.retryButtonText}>Coba lagi</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!dropoffData || dropoffData.data.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="trash-bin-outline" size={80} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>Belum ada riwayat</Text>
          <Text style={styles.emptyMessage}>
            Anda belum memiliki dropoff yang selesai diproses
          </Text>
        </View>
      );
    }

    return (
      <>
        <FlatList
          data={dropoffData.data}
          renderItem={({ item }) => <DropoffHistoryItem item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetchingDropoffs}
              onRefresh={refetchDropoffs}
              colors={["#00AA00"]}
            />
          }
        />

        {dropoffData.metadata.totalPages > 1 && (
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
                size={18}
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
                {dropoffData.metadata.currentPage} /{" "}
                {dropoffData.metadata.totalPages}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.paginationButton,
                page === dropoffData.metadata.totalPages
                  ? styles.disabledButton
                  : {},
              ]}
              onPress={handleNextPage}
              disabled={page === dropoffData.metadata.totalPages}
            >
              <Text
                style={[
                  styles.paginationButtonText,
                  page === dropoffData.metadata.totalPages
                    ? styles.disabledButtonText
                    : {},
                ]}
              >
                Selanjutnya
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={
                  page === dropoffData.metadata.totalPages
                    ? "#AAAAAA"
                    : "#00AA00"
                }
              />
            </TouchableOpacity>
          </View>
        )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00AA00" />
      <LinearGradient
        colors={["#08A92B", "#088F27"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerIconBg}>
          <MaterialCommunityIcons
            name="history"
            size={width * 0.28}
            color="white"
            style={{ opacity: 0.18 }}
          />
        </View>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Riwayat</Text>
            <Text style={styles.headerSubtitle}>
              Lihat riwayat aktivitas daur ulang Anda
            </Text>
          </View>
          <View style={styles.headerIconContainer}>
            <MaterialCommunityIcons name="history" size={36} color="white" />
          </View>
        </View>
        <View style={styles.wavePattern} />
      </LinearGradient>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "dropoffs" && styles.activeTab]}
          onPress={() => {
            setActiveTab("dropoffs");
            setPage(1);
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "dropoffs" && styles.activeTabText,
            ]}
          >
            Dropoff
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "transactions" && styles.activeTab]}
          onPress={() => {
            setActiveTab("transactions");
            setPage(1);
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "transactions" && styles.activeTabText,
            ]}
          >
            Transaksi
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>{renderContent()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 20,
    overflow: "hidden",
    width: "100%",
    minHeight: 160,
    justifyContent: "flex-end",
  },
  headerIconBg: {
    position: "absolute",
    top: -10,
    right: -10,
    zIndex: 0,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  headerTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 28,
    color: "white",
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  wavePattern: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    zIndex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 5,
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#E8F5E9",
  },
  tabText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: "#666666",
  },
  activeTabText: {
    color: "#00AA00",
  },
  contentContainer: {
    flex: 1,
    paddingTop: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  paginationButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#F5F5F5",
  },
  paginationButtonText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#00AA00",
    marginHorizontal: 4,
  },
  disabledButtonText: {
    color: "#AAAAAA",
  },
  paginationInfo: {
    backgroundColor: "#E8F5E9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  paginationInfoText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#00AA00",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#666666",
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FEEFEF",
    borderRadius: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: "#FFCCCC",
  },
  errorTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    color: "#EF4444",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontFamily: "Montserrat-Bold",
    fontSize: 14,
    color: "#EF5555",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "white",
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 20,
    color: "#333333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontFamily: "Montserrat-Medium",
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  emptyFilterContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyFilterTitle: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    color: "#333333",
    marginTop: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  resetFilterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  resetFilterText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    marginLeft: 6,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterActions: {
    flexDirection: "row",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9F0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0F0E0",
  },
  sortButtonText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 13,
    color: "#00AA00",
    marginRight: 4,
  },
});
