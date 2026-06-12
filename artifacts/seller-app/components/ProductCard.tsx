import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Alert,
  I18nManager,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";

export type ProductStatus = "in-stock" | "low-stock" | "out-of-stock" | "pre-order";

export interface ProductCardData {
  id: number;
  name: string;
  category: string;
  price: number;
  currency: string;
  inventoryStatus: ProductStatus;
  isPublished: boolean;
  isFeatured: boolean;
  isNew: boolean;
  coverGradient: string;
}

interface Props {
  product: ProductCardData;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const STATUS_LABELS: Record<ProductStatus, string> = {
  "in-stock": "موجود",
  "low-stock": "کم‌موجود",
  "out-of-stock": "ناموجود",
  "pre-order": "پیش‌فروش",
};

const GRADIENT_COLORS: Record<string, [string, string]> = {
  "gradient-blue": ["#1860DB", "#061540"],
  "gradient-teal": ["#0A7EA4", "#032E3B"],
  "gradient-amber": ["#F59E0B", "#92400E"],
  "gradient-green": ["#10B981", "#064E3B"],
  "gradient-rose": ["#F43F5E", "#881337"],
  "gradient-purple": ["#8B5CF6", "#4C1D95"],
};

function getGradientStart(gradient: string): string {
  for (const [key, [start]] of Object.entries(GRADIENT_COLORS)) {
    if (gradient.includes(key) || gradient.includes(start)) return start;
  }
  return "#1860DB";
}

export function ProductCard({ product, onEdit, onDelete }: Props) {
  const colors = useColors();

  const statusColor =
    product.inventoryStatus === "in-stock" ? colors.success :
    product.inventoryStatus === "low-stock" ? colors.amber :
    product.inventoryStatus === "out-of-stock" ? colors.destructive :
    colors.primary;

  const accentColor = getGradientStart(product.coverGradient);

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "حذف محصول",
      `آیا از حذف "${product.name}" مطمئن هستید؟`,
      [
        { text: "انصراف", style: "cancel" },
        {
          text: "حذف",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onDelete(product.id);
          },
        },
      ]
    );
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { opacity: 0.92, transform: [{ scale: 0.99 }] },
      ]}
      onPress={() => onEdit(product.id)}
    >
      <View style={[styles.colorBar, { backgroundColor: accentColor }]} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.nameSection}>
            <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={[styles.category, { color: colors.mutedForeground }]}>
              {product.category}
            </Text>
          </View>

          <Pressable
            style={[styles.deleteBtn]}
            onPress={handleDelete}
            hitSlop={8}
          >
            <Feather name="trash-2" size={16} color={colors.destructive} />
          </Pressable>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.badges}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {STATUS_LABELS[product.inventoryStatus]}
              </Text>
            </View>

            {!product.isPublished && (
              <View style={[styles.draftBadge, { backgroundColor: colors.muted }]}>
                <Text style={[styles.draftText, { color: colors.mutedForeground }]}>پیش‌نویس</Text>
              </View>
            )}
            {product.isNew && (
              <View style={[styles.newBadge, { backgroundColor: colors.primary + "15" }]}>
                <Text style={[styles.newText, { color: colors.primary }]}>جدید</Text>
              </View>
            )}
          </View>

          <Text style={[styles.price, { color: colors.amber }]}>
            {product.price.toLocaleString("fa-IR")} {product.currency}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const RTL = I18nManager.isRTL || true;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 5,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  colorBar: {
    width: 4,
    alignSelf: "stretch",
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  nameSection: {
    flex: 1,
    gap: 2,
    alignItems: "flex-end",
  },
  name: {
    fontSize: 15,
    fontWeight: "600" as const,
    textAlign: "right",
    writingDirection: "rtl",
  },
  category: {
    fontSize: 12,
    textAlign: "right",
  },
  deleteBtn: {
    padding: 4,
    marginTop: -2,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  badges: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "flex-end",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 99,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "500" as const,
  },
  draftBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  draftText: {
    fontSize: 11,
  },
  newBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  newText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  price: {
    fontSize: 14,
    fontWeight: "700" as const,
    textAlign: "left",
  },
});
