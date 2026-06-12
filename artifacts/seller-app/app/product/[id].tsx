import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useGetProduct,
  useUpdateBusinessProduct,
  useDeleteBusinessProduct,
} from "@workspace/api-client-react";
import { useColors } from "@/hooks/useColors";
import { useSeller } from "@/contexts/SellerContext";

const CATEGORIES = [
  "خوراک و نوشیدنی",
  "پوشاک و کفش",
  "الکترونیک",
  "خانه و زندگی",
  "زیبایی و سلامت",
  "ورزش و سرگرمی",
  "محصولات کشاورزی",
  "خدمات",
  "هنر و صنایع دستی",
  "سایر",
];

const GRADIENTS = [
  { key: "gradient-blue", label: "آبی", color: "#1860DB" },
  { key: "gradient-teal", label: "فیروزه‌ای", color: "#0A7EA4" },
  { key: "gradient-amber", label: "طلایی", color: "#F59E0B" },
  { key: "gradient-green", label: "سبز", color: "#10B981" },
  { key: "gradient-rose", label: "قرمز", color: "#F43F5E" },
  { key: "gradient-purple", label: "بنفش", color: "#8B5CF6" },
];

const INVENTORY_OPTIONS: { key: "in-stock" | "low-stock" | "out-of-stock" | "pre-order"; label: string }[] = [
  { key: "in-stock", label: "موجود" },
  { key: "low-stock", label: "کم‌موجود" },
  { key: "out-of-stock", label: "ناموجود" },
  { key: "pre-order", label: "پیش‌فروش" },
];

const GRADIENT_MAP: Record<string, string> = {
  "gradient-blue": "linear-gradient(135deg, #1860DB 0%, #061540 100%)",
  "gradient-teal": "linear-gradient(135deg, #0A7EA4 0%, #032E3B 100%)",
  "gradient-amber": "linear-gradient(135deg, #F59E0B 0%, #92400E 100%)",
  "gradient-green": "linear-gradient(135deg, #10B981 0%, #064E3B 100%)",
  "gradient-rose": "linear-gradient(135deg, #F43F5E 0%, #881337 100%)",
  "gradient-purple": "linear-gradient(135deg, #8B5CF6 0%, #4C1D95 100%)",
};

function detectGradientKey(coverGradient: string): string {
  for (const [key, val] of Object.entries(GRADIENT_MAP)) {
    if (coverGradient === val || coverGradient.includes(key)) return key;
  }
  if (coverGradient.includes("#1860DB")) return "gradient-blue";
  if (coverGradient.includes("#0A7EA4")) return "gradient-teal";
  if (coverGradient.includes("#F59E0B")) return "gradient-amber";
  if (coverGradient.includes("#10B981")) return "gradient-green";
  if (coverGradient.includes("#F43F5E")) return "gradient-rose";
  if (coverGradient.includes("#8B5CF6")) return "gradient-purple";
  return "gradient-blue";
}

export default function EditProductScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { seller } = useSeller();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: productData, isLoading } = useGetProduct(id ?? "", {
    query: {
      queryKey: ["product-detail", id],
      enabled: !!id,
    },
  });

  const product = productData?.data;

  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [inventoryStatus, setInventoryStatus] =
    useState<"in-stock" | "low-stock" | "out-of-stock" | "pre-order">("in-stock");
  const [gradient, setGradient] = useState("gradient-blue");
  const [isPublished, setIsPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (product && !initialized) {
      setName(product.name);
      setCategory(product.category);
      setPrice(String(product.price));
      setOriginalPrice(product.originalPrice ? String(product.originalPrice) : "");
      setDescription(product.description ?? "");
      setTags((product.tags ?? []).join(", "));
      setInventoryStatus(
        (product.inventoryStatus as "in-stock" | "low-stock" | "out-of-stock" | "pre-order") ?? "in-stock"
      );
      setGradient(detectGradientKey(product.coverGradient));
      setIsPublished(product.isPublished ?? false);
      setIsFeatured(product.isFeatured ?? false);
      setIsNew(product.isNew ?? false);
      if (product.gallery && product.gallery.length > 0) {
        setPhotoUri(product.gallery[0]);
      }
      setInitialized(true);
    }
  }, [product, initialized]);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const updateMutation = useUpdateBusinessProduct({
    mutation: {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
      },
      onError: (err) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("خطا", err?.message ?? "خطا در ویرایش محصول");
      },
    },
  });

  const deleteMutation = useDeleteBusinessProduct({
    mutation: {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
      },
    },
  });

  if (!seller) return null;

  const handlePickImage = async () => {
    if (Platform.OS === "web") {
      Alert.alert("انتخاب تصویر", "این ویژگی در نسخه موبایل در دسترس است");
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("حذف محصول", "آیا مطمئن هستید؟", [
      { text: "انصراف", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: () => {
          deleteMutation.mutate({
            businessId: seller.businessId,
            productId: String(product?.id),
          });
        },
      },
    ]);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("خطا", "نام محصول الزامی است");
      return;
    }
    const parsedPrice = parseInt(price.replace(/,/g, ""), 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert("خطا", "قیمت معتبر وارد کنید");
      return;
    }

    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const gallery = photoUri ? [photoUri] : product?.gallery ?? [];

    updateMutation.mutate({
      businessId: seller.businessId,
      productId: String(product?.id),
      data: {
        name: name.trim(),
        category,
        price: parsedPrice,
        originalPrice: originalPrice ? parseInt(originalPrice.replace(/,/g, ""), 10) : undefined,
        description: description.trim() || undefined,
        tags: tagList.length > 0 ? tagList : undefined,
        inventoryStatus,
        coverGradient: GRADIENT_MAP[gradient] ?? GRADIENT_MAP["gradient-blue"],
        isPublished,
        isFeatured,
        isNew,
        gallery: gallery.length > 0 ? gallery : undefined,
      },
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.container, { paddingBottom: bottomPad + 24 }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.photoSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {photoUri ? (
          <Pressable onPress={handlePickImage} style={styles.photoPreview}>
            <Image source={{ uri: photoUri }} style={styles.photoImage} contentFit="cover" />
            <View style={styles.photoOverlay}>
              <Feather name="edit-2" size={20} color="#fff" />
            </View>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.photoPlaceholder,
              { backgroundColor: colors.secondary },
              pressed && { opacity: 0.8 },
            ]}
            onPress={handlePickImage}
          >
            <Feather name="camera" size={24} color={colors.primary} />
            <Text style={[styles.photoHint, { color: colors.primary }]}>افزودن تصویر</Text>
          </Pressable>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>اطلاعات اصلی</Text>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>نام محصول *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            value={name}
            onChangeText={setName}
            placeholder="نام محصول"
            placeholderTextColor={colors.textTertiary}
            textAlign="right"
            testID="edit-product-name"
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>توضیحات</Text>
          <TextInput
            style={[styles.input, styles.textarea, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            value={description}
            onChangeText={setDescription}
            placeholder="توضیح کوتاهی از محصول..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={3}
            textAlign="right"
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>تگ‌ها (با کاما جدا کنید)</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            value={tags}
            onChangeText={setTags}
            placeholder="مثلاً: تازه, طبیعی"
            placeholderTextColor={colors.textTertiary}
            textAlign="right"
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>قیمت</Text>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>قیمت (تومان) *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            textAlign="right"
            testID="edit-product-price"
          />
        </View>

        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>قیمت قبل از تخفیف</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            value={originalPrice}
            onChangeText={setOriginalPrice}
            placeholder="اختیاری"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            textAlign="right"
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>دسته‌بندی</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.chip,
                { backgroundColor: category === cat ? colors.primary : colors.muted, borderColor: category === cat ? colors.primary : colors.border },
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.chipText, { color: category === cat ? "#fff" : colors.mutedForeground }]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>وضعیت موجودی</Text>
        <View style={styles.inventoryRow}>
          {INVENTORY_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              style={[
                styles.invChip,
                { backgroundColor: inventoryStatus === opt.key ? colors.primary + "20" : colors.muted, borderColor: inventoryStatus === opt.key ? colors.primary : colors.border },
              ]}
              onPress={() => setInventoryStatus(opt.key)}
            >
              <Text style={[styles.invChipText, { color: inventoryStatus === opt.key ? colors.primary : colors.mutedForeground }]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>رنگ کارت</Text>
        <View style={styles.gradientRow}>
          {GRADIENTS.map((g) => (
            <Pressable
              key={g.key}
              style={[styles.gradientSwatch, { backgroundColor: g.color }, gradient === g.key && styles.gradientSwatchActive]}
              onPress={() => setGradient(g.key)}
            >
              {gradient === g.key && <Feather name="check" size={16} color="#fff" />}
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>تنظیمات انتشار</Text>

        <View style={styles.toggleRow}>
          <Switch
            value={isPublished}
            onValueChange={setIsPublished}
            trackColor={{ false: colors.border, true: colors.primary + "80" }}
            thumbColor={isPublished ? colors.primary : colors.textTertiary}
            testID="edit-toggle-published"
          />
          <View style={styles.toggleLabels}>
            <Text style={[styles.toggleLabel, { color: colors.foreground }]}>انتشار محصول</Text>
          </View>
        </View>
        <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
        <View style={styles.toggleRow}>
          <Switch
            value={isFeatured}
            onValueChange={setIsFeatured}
            trackColor={{ false: colors.border, true: colors.primary + "80" }}
            thumbColor={isFeatured ? colors.primary : colors.textTertiary}
          />
          <View style={styles.toggleLabels}>
            <Text style={[styles.toggleLabel, { color: colors.foreground }]}>محصول ویژه</Text>
          </View>
        </View>
        <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
        <View style={styles.toggleRow}>
          <Switch
            value={isNew}
            onValueChange={setIsNew}
            trackColor={{ false: colors.border, true: colors.primary + "80" }}
            thumbColor={isNew ? colors.primary : colors.textTertiary}
          />
          <View style={styles.toggleLabels}>
            <Text style={[styles.toggleLabel, { color: colors.foreground }]}>محصول جدید</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.saveBtn,
            { backgroundColor: colors.primary, flex: 1 },
            pressed && { opacity: 0.85 },
            updateMutation.isPending && { opacity: 0.7 },
          ]}
          onPress={handleSave}
          disabled={updateMutation.isPending}
          testID="update-product-button"
        >
          {updateMutation.isPending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Feather name="check" size={20} color="#fff" />
              <Text style={styles.saveBtnText}>ذخیره</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.deleteBtn,
            { borderColor: colors.destructive },
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleDelete}
          testID="delete-product-button"
        >
          <Feather name="trash-2" size={20} color={colors.destructive} />
        </Pressable>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    textAlign: "right",
    writingDirection: "rtl",
  },
  photoSection: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  photoHint: {
    fontSize: 13,
    fontWeight: "500" as const,
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "500" as const,
    textAlign: "right",
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  textarea: {
    height: 88,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  chipRow: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500" as const,
  },
  inventoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
  },
  invChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  invChipText: {
    fontSize: 13,
    fontWeight: "500" as const,
  },
  gradientRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  gradientSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  gradientSwatchActive: {
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  toggleLabels: {
    flex: 1,
    alignItems: "flex-end",
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "500" as const,
    textAlign: "right",
    writingDirection: "rtl",
  },
  rowDivider: {
    height: 1,
    marginHorizontal: -16,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  saveBtn: {
    height: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700" as const,
  },
  deleteBtn: {
    height: 54,
    width: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
});
