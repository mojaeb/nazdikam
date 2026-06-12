import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useListProducts } from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { BrowseCard } from "@/components/BrowseCard";
import { EmptyState } from "@/components/EmptyState";

const CATEGORIES = [
  { key: "", label: "همه" },
  { key: "خوراک", label: "خوراکی" },
  { key: "پوشاک", label: "پوشاک" },
  { key: "الکترونیک", label: "الکترونیک" },
  { key: "خانه", label: "خانه" },
  { key: "زیبایی", label: "زیبایی" },
  { key: "کشاورزی", label: "کشاورزی" },
  { key: "خدمات", label: "خدمات" },
];

export default function BrowseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const params = {
    ...(debouncedSearch ? { q: debouncedSearch } : {}),
    ...(activeCategory ? { category: activeCategory } : {}),
    per_page: 30,
  };

  const { data, isLoading, refetch, isRefetching } = useListProducts(params, {
    query: { queryKey: ["browse-products", params] },
  });

  const products = data?.data ?? [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, paddingTop: topPad + 12, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.searchRow}>
          <View style={[styles.searchBox, { backgroundColor: colors.input, borderColor: colors.border }]}>
            <Feather name="search" size={16} color={colors.mutedForeground} />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              value={search}
              onChangeText={setSearch}
              placeholder="جستجو در محصولات..."
              placeholderTextColor={colors.textTertiary}
              returnKeyType="search"
              textAlign="right"
              testID="browse-search"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")} hitSlop={8}>
                <Feather name="x" size={16} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.key}
              style={[
                styles.catChip,
                {
                  backgroundColor: activeCategory === cat.key ? colors.primary : colors.muted,
                  borderColor: activeCategory === cat.key ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setActiveCategory(cat.key)}
            >
              <Text
                style={[
                  styles.catText,
                  { color: activeCategory === cat.key ? "#fff" : colors.mutedForeground },
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : products.length === 0 ? (
        <EmptyState
          icon="search"
          title="محصولی پیدا نشد"
          subtitle="با کلمات دیگر جستجو کنید"
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <BrowseCard
                product={{
                  id: item.id,
                  name: item.name,
                  businessName: item.businessName,
                  category: item.category,
                  price: item.price,
                  currency: item.currency,
                  rating: item.rating,
                  reviewCount: item.reviewCount,
                  coverGradient: item.coverGradient,
                  isFeatured: item.isFeatured,
                  isNew: item.isNew,
                }}
              />
            </View>
          )}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!!products.length}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
        />
      )}
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
    gap: 10,
  },
  searchRow: {
    flexDirection: "row",
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    textAlign: "right",
  },
  categories: {
    gap: 8,
    paddingRight: 4,
    paddingLeft: 4,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 99,
    borderWidth: 1,
  },
  catText: {
    fontSize: 13,
    fontWeight: "500" as const,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  grid: {
    padding: 12,
    paddingBottom: 100,
    gap: 10,
  },
  row: {
    gap: 10,
  },
  cardWrapper: {
    flex: 1,
  },
});
