import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface BrowseCardData {
  id: number;
  name: string;
  businessName: string;
  category: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  coverGradient: string;
  isFeatured: boolean;
  isNew: boolean;
}

interface Props {
  product: BrowseCardData;
  onPress?: () => void;
}

const GRADIENT_BG: Record<string, string> = {
  "gradient-blue": "#EEF3FE",
  "gradient-teal": "#E8F6FB",
  "gradient-amber": "#FFFBEB",
  "gradient-green": "#ECFDF5",
  "gradient-rose": "#FFF1F2",
  "gradient-purple": "#F3F0FF",
};

const GRADIENT_FG: Record<string, string> = {
  "gradient-blue": "#1860DB",
  "gradient-teal": "#0A7EA4",
  "gradient-amber": "#D97706",
  "gradient-green": "#059669",
  "gradient-rose": "#E11D48",
  "gradient-purple": "#7C3AED",
};

function getCardBg(gradient: string): string {
  for (const [key, bg] of Object.entries(GRADIENT_BG)) {
    if (gradient.includes(key)) return bg;
  }
  for (const [hex, bg] of Object.entries(GRADIENT_BG)) {
    if (gradient.includes(hex)) return bg;
  }
  return "#EEF3FE";
}

function getCardFg(gradient: string): string {
  for (const [key, fg] of Object.entries(GRADIENT_FG)) {
    if (gradient.includes(key)) return fg;
  }
  return "#1860DB";
}

export function BrowseCard({ product, onPress }: Props) {
  const colors = useColors();
  const bg = getCardBg(product.coverGradient);
  const fg = getCardFg(product.coverGradient);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && { opacity: 0.9 },
      ]}
      onPress={onPress}
    >
      <View style={[styles.cover, { backgroundColor: bg }]}>
        <Feather name="package" size={28} color={fg} />
        {product.isFeatured && (
          <View style={[styles.featuredBadge, { backgroundColor: colors.amber }]}>
            <Text style={styles.featuredText}>ویژه</Text>
          </View>
        )}
        {product.isNew && (
          <View style={[styles.newBadge, { backgroundColor: colors.primary }]}>
            <Text style={styles.newText}>جدید</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={[styles.business, { color: colors.mutedForeground }]} numberOfLines={1}>
          {product.businessName}
        </Text>

        <View style={styles.ratingRow}>
          <Feather name="star" size={11} color={colors.amber} />
          <Text style={[styles.rating, { color: colors.mutedForeground }]}>
            {product.rating.toFixed(1)} ({product.reviewCount.toLocaleString("fa-IR")})
          </Text>
        </View>

        <Text style={[styles.price, { color: colors.amber }]}>
          {product.price.toLocaleString("fa-IR")} {product.currency}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  cover: {
    height: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  featuredText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700" as const,
  },
  newBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700" as const,
  },
  info: {
    padding: 10,
    gap: 3,
    alignItems: "flex-end",
  },
  name: {
    fontSize: 13,
    fontWeight: "600" as const,
    textAlign: "right",
    writingDirection: "rtl",
  },
  business: {
    fontSize: 11,
    textAlign: "right",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  rating: {
    fontSize: 11,
  },
  price: {
    fontSize: 13,
    fontWeight: "700" as const,
    marginTop: 2,
  },
});
