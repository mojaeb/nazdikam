import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useListBusinessProductsOwner } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { useSeller } from "@/contexts/SellerContext";

function avatarColor(name: string): string {
  const palette = [
    "#1860DB", "#F59E0B", "#10B981", "#8B5CF6",
    "#F43F5E", "#06B6D4", "#84CC16", "#EC4899",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % palette.length;
  return palette[Math.abs(hash) % palette.length];
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { seller, logout } = useSeller();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const { data } = useListBusinessProductsOwner(
    seller?.businessId ?? "",
    {},
    {
      query: {
        queryKey: ["profile-products", seller?.businessId],
        enabled: !!seller?.businessId,
      },
    }
  );

  const products = data?.data ?? [];
  const published = products.filter((p) => p.isPublished).length;
  const featured = products.filter((p) => p.isFeatured).length;

  if (!seller) {
    router.replace("/login");
    return null;
  }

  const initials = seller.businessName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  const bgColor = avatarColor(seller.businessId);

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("خروج از حساب", "آیا مطمئن هستید؟", [
      { text: "انصراف", style: "cancel" },
      {
        text: "خروج",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.container,
        { paddingTop: topPad + 20, paddingBottom: bottomPad + 20 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: bgColor }]}>
          <Text style={styles.avatarText}>{initials || "؟"}</Text>
        </View>
        <Text style={[styles.businessName, { color: colors.foreground }]}>
          {seller.businessName}
        </Text>
        <View style={[styles.idBadge, { backgroundColor: colors.muted }]}>
          <Feather name="hash" size={12} color={colors.mutedForeground} />
          <Text style={[styles.idText, { color: colors.mutedForeground }]}>{seller.businessId}</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard label="کل محصولات" value={products.length} icon="package" colors={colors} />
        <StatCard label="منتشرشده" value={published} icon="check-circle" colors={colors} accent={colors.success} />
        <StatCard label="ویژه" value={featured} icon="star" colors={colors} accent={colors.amber} />
      </View>

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>تنظیمات</Text>

        <MenuItem
          icon="package"
          label="مدیریت محصولات"
          colors={colors}
          onPress={() => router.push("/(tabs)")}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <MenuItem
          icon="plus-circle"
          label="افزودن محصول جدید"
          colors={colors}
          onPress={() => router.push("/product/new")}
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <MenuItem
          icon="shopping-bag"
          label="مرور محصولات بازار"
          colors={colors}
          onPress={() => router.push("/(tabs)/browse")}
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.logoutBtn,
          { borderColor: colors.destructive },
          pressed && { opacity: 0.8 },
        ]}
        onPress={handleLogout}
        testID="logout-button"
      >
        <Feather name="log-out" size={18} color={colors.destructive} />
        <Text style={[styles.logoutText, { color: colors.destructive }]}>خروج از حساب</Text>
      </Pressable>

      <Text style={[styles.version, { color: colors.textTertiary }]}>
        نزدیکام — پنل فروشنده v1.0
      </Text>
    </ScrollView>
  );
}

function StatCard({
  label, value, icon, colors, accent,
}: {
  label: string;
  value: number;
  icon: keyof typeof Feather.glyphMap;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  accent?: string;
}) {
  const fg = accent ?? colors.primary;
  return (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Feather name={icon} size={20} color={fg} />
      <Text style={[styles.statValue, { color: fg }]}>{value.toLocaleString("fa-IR")}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

function MenuItem({
  icon, label, colors, onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.7 }]}
      onPress={onPress}
    >
      <Feather name="chevron-left" size={16} color={colors.mutedForeground} />
      <Text style={[styles.menuLabel, { color: colors.foreground }]}>{label}</Text>
      <Feather name={icon} size={18} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700" as const,
  },
  businessName: {
    fontSize: 20,
    fontWeight: "700" as const,
    textAlign: "center",
    writingDirection: "rtl",
  },
  idBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  idText: {
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  statLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textAlign: "right",
    writingDirection: "rtl",
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    textAlign: "right",
    writingDirection: "rtl",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 14,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
  },
});
