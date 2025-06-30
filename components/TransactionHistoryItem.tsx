import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Transaction } from "@/types/transaction.types";

interface TransactionHistoryItemProps {
  item: Transaction;
}

export default function TransactionHistoryItem({
  item,
}: TransactionHistoryItemProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "#00AA00";
      case "PENDING":
        return "#F59E0B";
      case "REJECTED":
        return "#EF4444";
      default:
        return "#666666";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "#E8F5E9";
      case "PENDING":
        return "#FEF3C7";
      case "REJECTED":
        return "#FEE2E2";
      default:
        return "#F3F4F6";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Ionicons name="checkmark-circle" size={16} color="#00AA00" />;
      case "PENDING":
        return <Ionicons name="time" size={16} color="#F59E0B" />;
      case "REJECTED":
        return <Ionicons name="close-circle" size={16} color="#EF4444" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string, method: string | null) => {
    if (type === "DEPOSIT") {
      if (method === "BANK_TRANSFER") {
        return <FontAwesome5 name="university" size={16} color="#3B82F6" />;
      } else if (method === "E_WALLET") {
        return <FontAwesome5 name="wallet" size={16} color="#8B5CF6" />;
      } else {
        return <Ionicons name="cash-outline" size={16} color="#10B981" />;
      }
    } else if (type === "WITHDRAWAL") {
      return <FontAwesome5 name="money-bill-wave" size={16} color="#EF4444" />;
    }
    return <Ionicons name="swap-horizontal" size={16} color="#6B7280" />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerDate}>
            {format(new Date(item.createdAt), "dd MMM yyyy • HH:mm", {
              locale: id,
            })}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBgColor(item.status) },
            ]}
          >
            {getStatusIcon(item.status)}
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
        <Text
          style={[
            styles.amount,
            {
              color: item.type === "DEPOSIT" ? "#00AA00" : "#EF4444",
            },
          ]}
        >
          {item.type === "DEPOSIT" ? "+" : "-"}
          {formatCurrency(item.amount)}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.contentRow}>
          <View style={styles.iconContainer}>
            {getTypeIcon(item.type, item.paymentMethod)}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {item.type === "DEPOSIT" ? "Top Up" : "Penarikan"}
            </Text>
            <Text style={styles.description}>
              {item.description || "Tidak ada deskripsi"}
            </Text>
          </View>
        </View>

        <View style={styles.contentRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="card-outline" size={16} color="#6B7280" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Metode</Text>
            <Text style={styles.description}>
              {item.paymentMethod
                ? item.paymentMethod === "BANK_TRANSFER"
                  ? "Transfer Bank"
                  : "E-Wallet"
                : "Sistem"}
            </Text>
          </View>
        </View>

        <View style={styles.contentRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="pricetag-outline" size={16} color="#6B7280" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>ID Transaksi</Text>
            <Text style={styles.description}>{item.id}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
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
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 8,
  },
  statusText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 10,
    marginLeft: 4,
  },
  amount: {
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  contentRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Montserrat-Medium",
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  description: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 15,
    color: "#374151",
  },
});
