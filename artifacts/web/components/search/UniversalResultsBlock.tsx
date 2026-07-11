import { LocationBlock } from "./LocationBlock";
import { CategoryBlock } from "./CategoryBlock";
import { BusinessesBlock } from "./BusinessesBlock";
import { ProductsBlock } from "./ProductsBlock";
import { ServicesBlock } from "./ServicesBlock";
import { AnnouncementsBlock } from "./AnnouncementsBlock";
import { EmptySearch } from "./EmptySearch";
import type { Business } from "@/lib/business.types";
import type { Product } from "@/lib/product.types";
import type { BusinessAnnouncement } from "@/lib/business-announcements";
import type { CityData, CategoryData, QueryIntent, ResultTabType } from "@/lib/search.types";

interface UniversalResultsBlockProps {
  query: string;
  intent: QueryIntent[];
  locationResults: CityData[];
  categoryResults: CategoryData[];
  businessResults: Business[];
  productResults: Product[];
  serviceResults: Product[];
  announcementResults: BusinessAnnouncement[];
  onTabChange: (tab: ResultTabType) => void;
  onSearch: (q: string) => void;
  isLoading?: boolean;
}

export function UniversalResultsBlock({
  query,
  intent,
  locationResults,
  categoryResults,
  businessResults,
  productResults,
  serviceResults,
  announcementResults,
  onTabChange,
  onSearch,
  isLoading = false,
}: UniversalResultsBlockProps) {
  const hasLocation = intent.includes("location") && locationResults.length > 0;
  const hasCategory = intent.includes("category") && categoryResults.length > 0;
  const hasBusinesses = businessResults.length > 0;
  const hasProducts = productResults.length > 0;
  const hasServices = serviceResults.length > 0;
  const hasAnnouncements = announcementResults.length > 0;
  const isEmpty =
    !hasLocation &&
    !hasCategory &&
    !hasBusinesses &&
    !hasProducts &&
    !hasServices &&
    !hasAnnouncements;

  if (isLoading && isEmpty) {
    return (
      <div className="px-4 pt-4 pb-24 space-y-4">
        <div className="h-5 w-28 rounded-lg bg-neutral-100 animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-52 rounded-2xl bg-neutral-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return <EmptySearch query={query} onSuggestionClick={onSearch} />;
  }

  return (
    <div className="pb-24">
      {hasLocation && (
        <LocationBlock locations={locationResults} onCitySelect={onSearch} />
      )}

      {hasCategory && (
        <CategoryBlock
          categories={categoryResults}
          businessCount={businessResults.length}
          productCount={productResults.length}
          onCategorySelect={onSearch}
        />
      )}

      {hasProducts && (
        <ProductsBlock products={productResults} onTabChange={onTabChange} />
      )}

      {hasServices && (
        <ServicesBlock services={serviceResults} onTabChange={onTabChange} />
      )}

      {hasBusinesses && (
        <BusinessesBlock businesses={businessResults} onTabChange={onTabChange} />
      )}

      {hasAnnouncements && (
        <AnnouncementsBlock
          announcements={announcementResults}
          onTabChange={onTabChange}
        />
      )}
    </div>
  );
}
