import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "@/src/contexts/AuthContext";

export interface BusinessRow {
  id: number;
  slug: string;
  name: string;
  province: string;
  city: string;
  phone: string;
  whatsapp: string | null;
  logo: string | null;
  coverImage: string | null;
  description: string | null;
  status: string;
  categoryId: number | null;
  ownerId: number;
  address: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

interface ActiveBusinessContextValue {
  business: BusinessRow | null;
  allBusinesses: BusinessRow[];
  isLoading: boolean;
  switchBusiness: (id: number) => Promise<void>;
  reload: () => void;
}

const ActiveBusinessContext = createContext<ActiveBusinessContextValue>({
  business: null,
  allBusinesses: [],
  isLoading: true,
  switchBusiness: async () => {},
  reload: () => {},
});

export function ActiveBusinessProvider({ children }: { children: ReactNode }) {
  const { user, refresh } = useAuth();
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/businesses/my", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load businesses");
      const data = await res.json() as { data: BusinessRow[] };
      setBusinesses(data.data ?? []);
    } catch {
      setBusinesses([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    setIsLoading(true);
    void load();
  }, [load]);

  const activeBusiness =
    businesses.find((b) => b.id === user?.activeBusinessId) ??
    businesses[0] ??
    null;

  const switchBusiness = useCallback(
    async (id: number) => {
      await fetch("/api/businesses/switch-active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ businessId: id }),
      });
      await refresh();
    },
    [refresh],
  );

  return (
    <ActiveBusinessContext.Provider
      value={{
        business: activeBusiness,
        allBusinesses: businesses,
        isLoading,
        switchBusiness,
        reload: load,
      }}
    >
      {children}
    </ActiveBusinessContext.Provider>
  );
}

export function useActiveBusiness() {
  return useContext(ActiveBusinessContext);
}
