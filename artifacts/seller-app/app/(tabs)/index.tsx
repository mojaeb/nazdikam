import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useListBusinessProductsOwner,
  useDeleteBusinessProduct,
} from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { useSeller } from "@/contexts/SellerContext";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { EmptyState } from "@/components/EmptyState";

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { seller } = useSeller();

  useEffect(() => {
    if (!seller) router.replace("/login");
  }, [seller]);

  const businessId = seller?.businessId ?? "";

  const { data, isLoading, refetch, isRefetching } = useListBusinessProductsOwner(
    businessId,
    {},
    {
      query: {
        queryKey: ["business-products-owner", businessId],
        enabled: !!businessId,
      },
    }
  );

  const deleteMutation = useDeleteBusinessProduct({
    mutation: {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        refetch();
      },
    },
  });

  const products: ProductCardData[] = (data?.data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    currency: p.currency,
    inventoryStatus: p.inventoryStatus as ProductCardData["inventoryStatus"],
    isPublished: p.isPublished ?? false,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    coverGradient: p.coverGradient,
  }));

  const published = products.filter((p) => p.isPublished).length;
  const drafts = products.filter((p) => !p.isPublished).length;

  const handleEdit = useCallback((id: number) => {
    router.push(`/product/${id}`);
  }, []);

  const handleDelete = useCallback(
    (id: number) => {
      deleteMutation.mutate({ businessId, productId: String(id) });
    },
    [businessId, deleteMutation]
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  if (!seller) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, paddingTop: topPad + 12, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={[styles.storeName, { color: colors.foreground }]}>
              {seller.businessName}
            </Text>
            <Text style={[styles.storeId, { color: colors.mutedForeground }]}>
              @{seller.businessId}
            </Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: colors.secondary }]}>
            <Feather name="shopping-bag" size={20} color={colors.primary} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatItem label="کل محصولات" value={products.length} colors={colors} />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <StatItem label="منتشرشده" value={published} colors={colors} accent={colors.success} />
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <StatItem label="پیش‌نویس" value={drafts} colors={colors} accent={colors.mutedForeground} />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : products.length === 0 ? (
        <EmptyState
          icon="package"
          title="هنوز محصولی ندارید"
          subtitle="اولین محصول خود را اضافه کنید"
          action={
            <Pressable
              style={[styles.addBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/product/new")}
            >
              <Feather name="plus" size={16} color="#fff" />
              <Text style={styles.addBtnText}>افزودن محصول</Text>
            </Pressable>
          }
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductCard product={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          scrollEnabled={products.length > 0}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
        />
      )}

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: colors.primary },
          pressed && { transform: [{ scale: 0.94 }] },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push("/product/new");
        }}
        testID="add-product-fab"
      >
        <Feather name="plus" size={26} color="#fff" />
      </Pressable>
    </View>
  );
}

function StatItem({
  label,
  value,
  colors,
  accent,
}: {
  label: string;
  value: number;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  accent?: string;
}) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: accent ?? colors.primary }]}>
        {value.toLocaleString("fa-IR")}
      </Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    gap: 2,
    alignItems: "flex-end",
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    fontWeight: "700" as const,
    textAlign: "right",
    writingDirection: "rtl",
  },
  storeId: {
    fontSize: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingVertical: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700" as const,
  },
  statLabel: {
    fontSize: 11,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingVertical: 12,
    paddingBottom: 100,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600" as const,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    left: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1860DB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
});
