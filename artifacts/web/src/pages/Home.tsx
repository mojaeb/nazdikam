import { HomeHeader } from "@/components/sections/HomeHeader";
import { SearchBar } from "@/components/sections/SearchBar";
import { HeroBanner } from "@/components/sections/HeroBanner";
import { CategoryTiles } from "@/components/sections/CategoryTiles";
import { HotDiscountsSection } from "@/components/sections/HotDiscountsSection";
import { BestInstallmentsSection } from "@/components/sections/BestInstallmentsSection";
import { AdBannerSection } from "@/components/sections/AdBannerSection";
import { NearYouSection } from "@/components/sections/NearYouSection";
import { FeaturedBusinesses } from "@/components/sections/FeaturedBusinesses";
import { VideoDiscoveryRow } from "@/components/sections/VideoDiscoveryRow";
import { LatestSection } from "@/components/sections/LatestSection";
import { RegisterBizBanner } from "@/components/sections/RegisterBizBanner";
import { HomeFooter } from "@/components/sections/HomeFooter";
import { BottomNav } from "@/components/sections/BottomNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-page-bg pb-24" dir="rtl">
      {/* Header — logo centered, minimal */}
      <HomeHeader />

      {/* S1: Search + City Selector */}
      <SearchBar />

      {/* S2: Hero Banner Slider */}
      <HeroBanner />

      {/* S3: Categories */}
      <CategoryTiles />

      {/* S4: Hot Discounts — sorted by discount% desc */}
      <HotDiscountsSection />

      {/* S5: Best Installments — sorted by best terms */}
      <BestInstallmentsSection />

      {/* S6: Advertising Banner */}
      <AdBannerSection />

      {/* S7: Near You — only when city is selected */}
      <NearYouSection />

      {/* S8: Popular Businesses */}
      <FeaturedBusinesses />

      {/* S9: Business Videos — discovery content, not at top */}
      <VideoDiscoveryRow />

      {/* S10: Latest Products & Services */}
      <LatestSection />

      {/* S11: Register Your Business Banner */}
      <RegisterBizBanner />

      <HomeFooter />
      <BottomNav />
    </div>
  );
}
