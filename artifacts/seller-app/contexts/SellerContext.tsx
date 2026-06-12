import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface SellerProfile {
  businessId: string;
  businessName: string;
  token: string;
}

interface SellerContextValue {
  seller: SellerProfile | null;
  isLoading: boolean;
  login: (businessId: string, businessName: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const SellerContext = createContext<SellerContextValue | null>(null);

const STORAGE_KEY = "@nazdikam_seller";

export function SellerProvider({ children }: { children: React.ReactNode }) {
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const profile: SellerProfile = JSON.parse(raw);
          setSeller(profile);
          setAuthTokenGetter(() => profile.token);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (businessId: string, businessName: string, token: string) => {
    const profile: SellerProfile = { businessId, businessName, token };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setAuthTokenGetter(() => token);
    setSeller(profile);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setAuthTokenGetter(null);
    setSeller(null);
  }, []);

  return (
    <SellerContext.Provider value={{ seller, isLoading, login, logout }}>
      {children}
    </SellerContext.Provider>
  );
}

export function useSeller() {
  const ctx = useContext(SellerContext);
  if (!ctx) throw new Error("useSeller must be used within SellerProvider");
  return ctx;
}
