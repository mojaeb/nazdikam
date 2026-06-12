import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import React, { useState } from "react";
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
import { useCreateBusinessProduct } from "@workspace/api-client-react";
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

function generateSlug(): string {
  return "p-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}

export default function NewProductScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { seller } = useSeller();

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
  const [isNew, setIsNew] = useState(true);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const createMutation = useCreateBusinessProduct({
    mutation: {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
      },
      onError: (err) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("خطا", err?.message ?? "خطا در ایجاد محصول");
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
    if (status !== "granted") {
      Alert.alert("دسترسی لازم است", "لطفاً دسترسی به گالری را فعال کنید");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    if (Platform.OS === "web") {
      Alert.alert("دوربین", "این ویژگی در نسخه موبایل در دسترس است");
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("دسترسی لازم است", "لطفاً دسترسی به دوربین را فعال کنید");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
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

    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const gallery = photoUri ? [photoUri] : [];

    const gradientMap: Record<string, string> = {
      "gradient-blue": "linear-gradient(135deg, #1860DB 0%, #061540 100%)",
      "gradient-teal": "linear-gradient(135deg, #0A7EA4 0%, #032E3B 100%)",
      "gradient-amber": "linear-gradient(135deg, #F59E0B 0%, #92400E 100%)",
      "gradient-green": "linear-gradient(135deg, #10B981 0%, #064E3B 100%)",
      "gradient-rose": "linear-gradient(135deg, #F43F5E 0%, #881337 100%)",
      "gradient-purple": "linear-gradient(135deg, #8B5CF6 0%, #4C1D95 100%)",
    };

    createMutation.mutate({
      businessId: seller.businessId,
      data: {
        slug: generateSlug(),
        name: name.trim(),
        category,
        price: parsedPrice,
        originalPrice: originalPrice ? parseInt(originalPrice.replace(/,/g, ""), 10) : undefined,
        description: description.trim() || undefined,
        businessName: seller.businessName,
        tags: tagList.length > 0 ? tagList : undefined,
        inventoryStatus,
        coverGradient: gradientMap[gradient] ?? gradientMap["gradient-blue"],
        isPublished,
        isFeatured,
        isNew,
        currency: "تومان",
        isInstallmentAvailable: false,
        gallery: gallery.length > 0 ? gallery : undefined,
      },
    });
  };

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
          <View style={styles.photoButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.photoBtn,
                { backgroundColor: colors.secondary },
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleTakePhoto}
            >
              <Feather name="camera" size={22} color={colors.primary} />
              <Text style={[styles.photoBtnText, { color: colors.primary }]}>دوربین</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.photoBtn,
                { backgroundColor: colors.secondary },
                pressed && { opacity: 0.8 },
              ]}
              onPress={handlePickImage}
            >
              <Feather name="image" size={22} color={colors.primary} />
              <Text style={[styles.photoBtnText, { color: colors.primary }]}>گالری</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SectionTitle title="اطلاعات اصلی" colors={colors} />

        <Field label="نام محصول *" colors={colors}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            value={name}
            onChangeText={setName}
            placeholder="نام محصول را وارد کنید"
            placeholderTextColor={colors.textTertiary}
            textAlign="right"
            testID="product-name"
          />
        </Field>

        <Field label="توضیحات" colors={colors}>
          <TextInput
            style={[
              styles.input,
              styles.textarea,
              { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="توضیح کوتاهی از محصول..."
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={3}
            textAlign="right"
            testID="product-description"
          />
        </Field>

        <Field label="تگ‌ها (با کاما جدا کنید)" colors={colors}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            value={tags}
            onChangeText={setTags}
            placeholder="مثلاً: تازه, طبیعی, ارگانیک"
            placeholderTextColor={colors.textTertiary}
            textAlign="right"
            testID="product-tags"
          />
        </Field>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SectionTitle title="قیمت" colors={colors} />

        <Field label="قیمت (تومان) *" colors={colors}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            value={price}
            onChangeText={setPrice}
            placeholder="مثلاً: 150000"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            textAlign="right"
            testID="product-price"
          />
        </Field>

        <Field label="قیمت قبل از تخفیف" colors={colors}>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.foreground }]}
            value={originalPrice}
            onChangeText={setOriginalPrice}
            placeholder="اختیاری"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            textAlign="right"
          />
        </Field>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SectionTitle title="دسته‌بندی" colors={colors} />
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
                {
                  backgroundColor: category === cat ? colors.primary : colors.muted,
                  borderColor: category === cat ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setCategory(cat)}
            >
              <Text
                style={[styles.chipText, { color: category === cat ? "#fff" : colors.mutedForeground }]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SectionTitle title="وضعیت موجودی" colors={colors} />
        <View style={styles.inventoryRow}>
          {INVENTORY_OPTIONS.map((opt) => (
            <Pressable
              key={opt.key}
              style={[
                styles.invChip,
                {
                  backgroundColor: inventoryStatus === opt.key ? colors.primary + "20" : colors.muted,
                  borderColor: inventoryStatus === opt.key ? colors.primary : colors.border,
                },
              ]}
              onPress={() => setInventoryStatus(opt.key)}
            >
              <Text
                style={[
                  styles.invChipText,
                  { color: inventoryStatus === opt.key ? colors.primary : colors.mutedForeground },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SectionTitle title="رنگ کارت" colors={colors} />
        <View style={styles.gradientRow}>
          {GRADIENTS.map((g) => (
            <Pressable
              key={g.key}
              style={[
                styles.gradientSwatch,
                { backgroundColor: g.color },
                gradient === g.key && styles.gradientSwatchActive,
              ]}
              onPress={() => setGradient(g.key)}
            >
              {gradient === g.key && <Feather name="check" size={16} color="#fff" />}
            </Pressable>
          ))}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <SectionTitle title="تنظیمات انتشار" colors={colors} />

        <ToggleRow
          label="انتشار محصول"
          sublabel="محصول برای خریداران نمایش داده می‌شود"
          value={isPublished}
          onValueChange={setIsPublished}
          colors={colors}
          testID="toggle-published"
        />
        <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
        <ToggleRow
          label="محصول ویژه"
          sublabel="نمایش در بخش ویژه"
          value={isFeatured}
          onValueChange={setIsFeatured}
          colors={colors}
          testID="toggle-featured"
        />
        <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
        <ToggleRow
          label="محصول جدید"
          sublabel="نمایش برچسب «جدید»"
          value={isNew}
          onValueChange={setIsNew}
          colors={colors}
          testID="toggle-new"
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.saveBtn,
          { backgroundColor: colors.primary },
          pressed && { opacity: 0.85 },
          createMutation.isPending && { opacity: 0.7 },
        ]}
        onPress={handleSave}
        disabled={createMutation.isPending}
        testID="save-product-button"
      >
        {createMutation.isPending ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <>
            <Feather name="check" size={20} color="#fff" />
            <Text style={styles.saveBtnText}>ذخیره محصول</Text>
          </>
        )}
      </Pressable>
    </KeyboardAwareScrollView>
  );
}

function SectionTitle({ title, colors }: { title: string; colors: ReturnType<typeof import("@/hooks/useColors").useColors> }) {
  return (
    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
  );
}

function Field({ label, colors, children }: { label: string; colors: ReturnType<typeof import("@/hooks/useColors").useColors>; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      {children}
    </View>
  );
}

function ToggleRow({
  label, sublabel, value, onValueChange, colors, testID,
}: {
  label: string;
  sublabel: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  testID?: string;
}) {
  return (
    <View style={styles.toggleRow}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary + "80" }}
        thumbColor={value ? colors.primary : colors.textTertiary}
        testID={testID}
      />
      <View style={styles.toggleLabels}>
        <Text style={[styles.toggleLabel, { color: colors.foreground }]}>{label}</Text>
        <Text style={[styles.toggleSublabel, { color: colors.mutedForeground }]}>{sublabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    letterSpacing: 0.2,
  },
  photoSection: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    minHeight: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  photoButtons: {
    flexDirection: "row",
    gap: 16,
  },
  photoBtn: {
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    padding: 16,
    borderRadius: 12,
    minWidth: 90,
  },
  photoBtnText: {
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
    textAlign: "right",
  },
  textarea: {
    height: 88,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  chipRow: {
    gap: 8,
    flexDirection: "row",
    paddingRight: 4,
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
    gap: 2,
    alignItems: "flex-end",
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "500" as const,
    textAlign: "right",
    writingDirection: "rtl",
  },
  toggleSublabel: {
    fontSize: 12,
    textAlign: "right",
  },
  rowDivider: {
    height: 1,
    marginHorizontal: -16,
  },
  saveBtn: {
    height: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700" as const,
  },
});
