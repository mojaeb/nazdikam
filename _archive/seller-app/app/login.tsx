import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useSeller } from "@/contexts/SellerContext";

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useSeller();

  const [businessId, setBusinessId] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleLogin = async () => {
    const trimId = businessId.trim();
    const trimName = businessName.trim();

    if (!trimId) {
      Alert.alert("خطا", "لطفاً شناسه کسب‌وکار را وارد کنید");
      return;
    }
    if (!trimName) {
      Alert.alert("خطا", "لطفاً نام کسب‌وکار را وارد کنید");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/seller/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId: trimId, businessName: trimName }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? "خطا در ورود");
      }

      const data = await res.json();
      await login(trimId, trimName, data.token);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)");
    } catch (e: unknown) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "خطا در ورود",
        e instanceof Error ? e.message : "لطفاً دوباره امتحان کنید"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.container,
        { paddingTop: topPad + 20, paddingBottom: bottomPad + 20 },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
          <Feather name="shopping-bag" size={36} color="#fff" />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>نزدیکام</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          پنل فروشنده
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          ورود به پنل فروشنده
        </Text>
        <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>
          شناسه و نام کسب‌وکار خود را وارد کنید
        </Text>

        <View style={styles.fields}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>شناسه کسب‌وکار</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              value={businessId}
              onChangeText={setBusinessId}
              placeholder="مثلاً: b001"
              placeholderTextColor={colors.textTertiary}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              testID="businessId-input"
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>نام کسب‌وکار</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="مثلاً: فروشگاه بهاری"
              placeholderTextColor={colors.textTertiary}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              textAlign="right"
              testID="businessName-input"
            />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.loginBtn,
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.85 },
            isLoading && { opacity: 0.7 },
          ]}
          onPress={handleLogin}
          disabled={isLoading}
          testID="login-button"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Feather name="log-in" size={18} color="#fff" />
              <Text style={styles.loginBtnText}>ورود</Text>
            </>
          )}
        </Pressable>
      </View>

      <Text style={[styles.hint, { color: colors.textTertiary }]}>
        برای دسترسی به پنل فروشنده، شناسه کسب‌وکار خود را از تیم نزدیکام دریافت کنید
      </Text>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 24,
  },
  header: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800" as const,
    textAlign: "center",
    writingDirection: "rtl",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    textAlign: "right",
    writingDirection: "rtl",
  },
  cardDesc: {
    fontSize: 13,
    textAlign: "right",
    writingDirection: "rtl",
    marginTop: -8,
  },
  fields: {
    gap: 12,
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
    fontSize: 15,
    textAlign: "right",
  },
  loginBtn: {
    height: 52,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700" as const,
  },
  hint: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 20,
    writingDirection: "rtl",
  },
});
