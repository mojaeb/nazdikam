import { HomeHeader } from "@/components/sections/HomeHeader";
import { SearchBar } from "@/components/sections/SearchBar";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { CategoryTiles } from "@/components/sections/CategoryTiles";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { DealsSection } from "@/components/sections/DealsSection";
import { InstallmentSection } from "@/components/sections/InstallmentSection";
import { FeaturedBusinesses } from "@/components/sections/FeaturedBusinesses";
import { VideoDiscoveryRow } from "@/components/sections/VideoDiscoveryRow";
import { ProvinceStrip } from "@/components/sections/ProvinceStrip";
import { HomeFooter } from "@/components/sections/HomeFooter";
import { BottomNav } from "@/components/sections/BottomNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-page-bg pb-24" dir="rtl">
      {/* 1. Sticky Header — logo centered, minimal */}
      <HomeHeader />

      {/* 2. Search Bar + City Selector — side by side, above banner */}
      <SearchBar />

      {/* 3. Hero Banner */}
      <HeroBanner />

      {/* 4. Category Tiles */}
      <CategoryTiles />

      {/* 5. Featured Products & Services */}
      <FeaturedProducts />
      <FeaturedServices />

      {/* 6. Deals / Offers */}
      <DealsSection />

      {/* 7. Installment Section */}
      <InstallmentSection />

      {/* 8. Featured Businesses */}
      <FeaturedBusinesses />

      {/* 9. Videos — at bottom per spec ("ویدیو نباید بالای صفحه باشد") */}
      <VideoDiscoveryRow />

      {/* 10. Province Strip */}
      <ProvinceStrip />

      {/* 11. Footer */}
      <HomeFooter />

      {/* Bottom Navigation (floating pill) */}
      <BottomNav />
    </div>
  );
}
