import { LocationBlock } from "./LocationBlock";
import { CategoryBlock } from "./CategoryBlock";
import { BusinessesBlock } from "./BusinessesBlock";
import { ProductsBlock } from "./ProductsBlock";
import { EmptySearch } from "./EmptySearch";
import type { Business } from "@/lib/business.types";
import type { Product } from "@/lib/product.types";
import type { CityData, CategoryData, QueryIntent, ResultTabType } from "@/lib/search.types";

interface UniversalResultsBlockProps {
  query: string;
  intent: QueryIntent[];
  locationResults: CityData[];
  categoryResults: CategoryData[];
  businessResults: Business[];
  productResults: Product[];
  onTabChange: (tab: ResultTabType) => void;
  onSearch: (q: string) => void;
}

export function UniversalResultsBlock({
  query,
  intent,
  locationResults,
  categoryResults,
  businessResults,
  productResults,
  onTabChange,
  onSearch,
}: UniversalResultsBlockProps) {
  const hasLocation = intent.includes("location") && locationResults.length > 0;
  const hasCategory = intent.includes("category") && categoryResults.length > 0;
  const hasBusinesses = businessResults.length > 0;
  const hasProducts = productResults.length > 0;
  const isEmpty = !hasLocation && !hasCategory && !hasBusinesses && !hasProducts;

  if (isEmpty) {
    return <EmptySearch query={query} onSuggestionClick={onSearch} />;
  }

  return (
    <div className="pb-24">
      {/* 1 — Location context block */}
      {hasLocation && (
        <LocationBlock
          locations={locationResults}
          onCitySelect={onSearch}
        />
      )}

      {/* 2 — Category context block */}
      {hasCategory && (
        <CategoryBlock
          categories={categoryResults}
          businessCount={businessResults.length}
          productCount={productResults.length}
          onCategorySelect={onSearch}
        />
      )}

      {/* 3 — Business results */}
      {hasBusinesses && (
        <BusinessesBlock
          businesses={businessResults}
          onTabChange={onTabChange}
        />
      )}

      {/* 4 — Product results */}
      {hasProducts && (
        <ProductsBlock
          products={productResults}
          onTabChange={onTabChange}
        />
      )}
    </div>
  );
}
