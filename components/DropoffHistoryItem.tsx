import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Dropoff } from "@/types/dropoff.types";

interface DropoffHistoryItemProps {
  item: Dropoff;
}

export default function DropoffHistoryItem({ item }: DropoffHistoryItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMMM yyyy", { locale: id });
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View style={styles.dropoffItem}>
      <LinearGradient
        colors={["#f0fff0", "#e8f5e8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.dropoffHeader}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerDate}>{formatDate(item.createdAt)}</Text>
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>Selesai</Text>
          </View>
        </View>
        <Text style={styles.headerAmount}>{formatMoney(item.totalAmount)}</Text>
      </LinearGradient>

      <View style={styles.dropoffContent}>
        <View style={styles.contentRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="scale-outline" size={20} color="#00AA00" />
          </View>
          <View style={styles.contentDetail}>
            <Text style={styles.contentLabel}>Total Berat:</Text>
            <Text style={styles.contentValue}>{item.totalWeight} kg</Text>
          </View>
        </View>

        <View style={styles.contentRow}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={
                item.pickupMethod === "PICKUP" ? "car-outline" : "walk-outline"
              }
              size={20}
              color="#00AA00"
            />
          </View>
          <View style={styles.contentDetail}>
            <Text style={styles.contentLabel}>Metode:</Text>
            <Text style={styles.contentValue}>
              {item.pickupMethod === "PICKUP" ? "Dijemput" : "Antar Sendiri"}
            </Text>
          </View>
        </View>

        <View style={styles.contentRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="location-outline" size={20} color="#00AA00" />
          </View>
          <View style={styles.contentDetail}>
            <Text style={styles.contentLabel}>Alamat:</Text>
            <Text style={styles.contentValue} numberOfLines={2}>
              {item.pickupAddress}
            </Text>
          </View>
        </View>

        {item.wasteItems && item.wasteItems.length > 0 && (
          <View style={styles.wasteItemsContainer}>
            <Text style={styles.wasteItemsTitle}>
              Sampah yang Didaur Ulang:
            </Text>
            {item.wasteItems.map((wasteItem) => (
              <View key={wasteItem.id} style={styles.wasteItem}>
                <View style={styles.wasteItemHeader}>
                  <FontAwesome5 name="recycle" size={14} color="#00AA00" />
                  <Text style={styles.wasteItemType}>
                    {wasteItem.wasteType?.name || "Jenis sampah"}
                  </Text>
                </View>
                <View style={styles.wasteItemDetails}>
                  <Text style={styles.wasteItemText}>
                    {wasteItem.weight} kg ({formatMoney(wasteItem.amount)})
                  </Text>
                  {wasteItem.notes && (
                    <Text style={styles.wasteItemNotes}>
                      Catatan: {wasteItem.notes}
                    </Text>
                  )}
                  {wasteItem.image && (
                    <Image
                      source={{ uri: wasteItem.image }}
                      style={styles.wasteItemImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dropoffItem: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
    overflow: "hidden",
  },
  dropoffHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0F2E0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerDate: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#333333",
  },
  completedBadge: {
    backgroundColor: "#00AA00",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
  },
  completedText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 10,
    color: "white",
  },
  headerAmount: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    color: "#00AA00",
  },
  dropoffContent: {
    padding: 16,
  },
  contentRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F0F9F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentDetail: {
    flex: 1,
    justifyContent: "center",
  },
  contentLabel: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#666666",
  },
  contentValue: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#333333",
    marginTop: 2,
  },
  wasteItemsContainer: {
    marginTop: 8,
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
  },
  wasteItemsTitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 13,
    color: "#444444",
    marginBottom: 8,
  },
  wasteItem: {
    borderLeftWidth: 2,
    borderLeftColor: "#00AA00",
    paddingLeft: 10,
    marginBottom: 10,
  },
  wasteItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  wasteItemType: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 13,
    color: "#444444",
    marginLeft: 8,
  },
  wasteItemDetails: {
    paddingLeft: 22,
  },
  wasteItemText: {
    fontFamily: "Montserrat-Medium",
    fontSize: 13,
    color: "#666666",
  },
  wasteItemNotes: {
    fontFamily: "Montserrat-Medium",
    fontSize: 12,
    color: "#888888",
    marginTop: 2,
  },
  wasteItemImage: {
    marginTop: 8,
    width: "100%",
    height: 120,
    borderRadius: 6,
  },
});
