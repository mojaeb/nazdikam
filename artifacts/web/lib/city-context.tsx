import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface City {
  name: string;
  province: string;
}

export const NORTHERN_CITIES: City[] = [
  { name: "ساری", province: "مازندران" },
  { name: "بابل", province: "مازندران" },
  { name: "آمل", province: "مازندران" },
  { name: "قائمشهر", province: "مازندران" },
  { name: "بابلسر", province: "مازندران" },
  { name: "فریدونکنار", province: "مازندران" },
  { name: "تنکابن", province: "مازندران" },
  { name: "نوشهر", province: "مازندران" },
  { name: "چالوس", province: "مازندران" },
  { name: "رامسر", province: "مازندران" },
  { name: "بهشهر", province: "مازندران" },
  { name: "نکا", province: "مازندران" },
  { name: "جویبار", province: "مازندران" },
  { name: "رشت", province: "گیلان" },
  { name: "لاهیجان", province: "گیلان" },
  { name: "لنگرود", province: "گیلان" },
  { name: "آستانه اشرفیه", province: "گیلان" },
  { name: "بندر انزلی", province: "گیلان" },
  { name: "رودسر", province: "گیلان" },
  { name: "صومعه‌سرا", province: "گیلان" },
  { name: "تالش", province: "گیلان" },
  { name: "فومن", province: "گیلان" },
  { name: "شفت", province: "گیلان" },
  { name: "گرگان", province: "گلستان" },
  { name: "گنبد کاووس", province: "گلستان" },
  { name: "علی‌آباد کتول", province: "گلستان" },
  { name: "بندر ترکمن", province: "گلستان" },
  { name: "کردکوی", province: "گلستان" },
  { name: "آق‌قلا", province: "گلستان" },
  { name: "رامیان", province: "گلستان" },
];

const PROVINCES = ["مازندران", "گیلان", "گلستان"] as const;

export function getCitiesByProvince(province: string) {
  return NORTHERN_CITIES.filter(c => c.province === province);
}

export { PROVINCES };

const LS_KEY = "nazdikam_selected_city";

function readLS(): string | null {
  try {
    return localStorage.getItem(LS_KEY);
  } catch {
    return null;
  }
}

function writeLS(city: string | null) {
  try {
    if (city) localStorage.setItem(LS_KEY, city);
    else localStorage.removeItem(LS_KEY);
  } catch {}
}

interface CityContextValue {
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
}

const CityContext = createContext<CityContextValue>({
  selectedCity: null,
  setSelectedCity: () => {},
});

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState<string | null>(readLS);

  const setSelectedCity = (city: string | null) => {
    setSelectedCityState(city);
    writeLS(city);
  };

  return (
    <CityContext.Provider value={{ selectedCity, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
