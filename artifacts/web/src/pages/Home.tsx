import { HomeHeader } from "@/components/sections/HomeHeader";
import { SearchBar } from "@/components/sections/SearchBar";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { CategoryTiles } from "@/components/sections/CategoryTiles";
import { VideoDiscoveryRow } from "@/components/sections/VideoDiscoveryRow";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { DealsSection } from "@/components/sections/DealsSection";
import { InstallmentSection } from "@/components/sections/InstallmentSection";
import { FeaturedBusinesses } from "@/components/sections/FeaturedBusinesses";
import { ProvinceStrip } from "@/components/sections/ProvinceStrip";
import { HomeFooter } from "@/components/sections/HomeFooter";
import { BottomNav } from "@/components/sections/BottomNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-page-bg pb-20" dir="rtl">
      {/* 1. Sticky Header */}
      <HomeHeader />

      {/* 2. Search Bar */}
      <SearchBar />

      {/* 3. Hero Banner / CMS Carousel */}
      <HeroBanner />

      {/* 4. Category Tiles */}
      <CategoryTiles />

      {/* 5. Video Discovery Row */}
      <VideoDiscoveryRow />

      {/* 6. Featured Products */}
      <FeaturedProducts />

      {/* 7. Featured Services */}
      <FeaturedServices />

      {/* 8. Deals Section */}
      <DealsSection />

      {/* 9. Installment Section */}
      <InstallmentSection />

      {/* 10. Featured Businesses */}
      <FeaturedBusinesses />

      {/* 11. Province Strip */}
      <ProvinceStrip />

      {/* 12. Footer */}
      <HomeFooter />

      {/* 13. Bottom Navigation (fixed) */}
      <BottomNav />
    </div>
  );
}
