import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/hooks/useSearch";
import { SearchHeader } from "@/components/search/SearchHeader";
import { FilterBar } from "@/components/search/FilterBar";
import { ResultTypeTabs } from "@/components/search/ResultTypeTabs";
import { SearchIdleState } from "@/components/search/SearchIdleState";
import { UniversalResultsBlock } from "@/components/search/UniversalResultsBlock";
import { FilterDrawer } from "@/components/search/FilterDrawer";
import { SortSheet } from "@/components/search/SortSheet";
import { VoiceSearchOverlay } from "@/components/search/VoiceSearchOverlay";
import { EmptySearch } from "@/components/search/EmptySearch";
import { BusinessCardHorizontal } from "@/components/business/BusinessCardHorizontal";
import { ItemCard } from "@/components/cards/ItemCard";
import { serviceImage } from "@/lib/api-service-adapter";

function productImage(p: { gallery?: string[]; coverGradient: string }): string {
  const first = p.gallery?.[0];
  if (first?.trim()) return first;
  return p.coverGradient;
}

function ResultsSkeleton({ grid = false }: { grid?: boolean }) {
  if (grid) {
    return (
      <div className="grid grid-cols-2 gap-3 px-4 pt-3 pb-24">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-neutral-100 animate-pulse h-52" />
        ))}
      </div>
    );
  }
  return (
    <div className="px-4 pt-3 pb-24 space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 rounded-2xl bg-neutral-100 animate-pulse" />
      ))}
    </div>
  );
}

function ResultsError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <p className="font-iran-yekan-x font-bold text-neutral-800 text-sm mb-1">خطا در دریافت نتایج</p>
      <p className="font-vazirmatn text-neutral-500 text-sm">{message}</p>
    </div>
  );
}

export default function SearchPage() {
  const [, navigate] = useLocation();
  const search = useSearch();

  const handleBack = () => navigate("/");

  return (
    <div dir="rtl" className="flex flex-col bg-white" style={{ height: "100dvh" }}>
      <div className="shrink-0 bg-white z-20">
        <SearchHeader
          query={search.query}
          onQueryChange={search.setQuery}
          onBack={handleBack}
          onVoice={search.openVoice}
          onSubmit={search.submitSearch}
        />

        <AnimatePresence>
          {!search.isIdle && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
            >
              <FilterBar
                activeFilterCount={search.activeFilterCount}
                activeFilterChips={search.activeFilterChips}
                sortBy={search.sortBy}
                viewMode={search.viewMode}
                onFilterOpen={search.openFilter}
                onSortOpen={search.openSort}
                onViewToggle={search.toggleViewMode}
                onRemoveFilter={search.removeFilter}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!search.isIdle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <ResultTypeTabs
                activeTab={search.activeTab}
                onTabChange={search.setActiveTab}
                totalCount={search.totalCount}
                businessCount={search.businessResults.length}
                productCount={search.productResults.length}
                serviceCount={search.serviceResults.length}
                announcementCount={search.announcementResults.length}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait" initial={false}>
          {search.isIdle && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <SearchIdleState
                recentSearches={search.recentSearches}
                onSearch={(q) => {
                  search.setQuery(q);
                  search.addRecentSearch(q);
                }}
                onRemoveRecent={search.removeRecentSearch}
                onClearRecent={search.clearRecentSearches}
              />
            </motion.div>
          )}

          {!search.isIdle && search.activeTab === "all" && (
            <motion.div
              key="all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <UniversalResultsBlock
                query={search.debouncedQuery}
                intent={search.queryIntent}
                locationResults={search.locationResults}
                categoryResults={search.categoryResults}
                businessResults={search.businessResults}
                productResults={search.productResults}
                serviceResults={search.serviceResults}
                announcementResults={search.announcementResults}
                onTabChange={search.setActiveTab}
                onSearch={(q) => {
                  search.setQuery(q);
                }}
                isLoading={search.isResultsLoading}
              />
            </motion.div>
          )}

          {!search.isIdle && search.activeTab === "businesses" && (
            <motion.div
              key="businesses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {search.isBusinessesLoading ? (
                <ResultsSkeleton />
              ) : search.isBusinessesError ? (
                <ResultsError message="خطا در دریافت کسب‌وکارها. لطفاً دوباره تلاش کنید." />
              ) : search.businessResults.length === 0 ? (
                <EmptySearch query={search.debouncedQuery} onSuggestionClick={search.setQuery} />
              ) : (
                <div className="px-4 pt-3 pb-24 space-y-3">
                  {search.businessResults.map((b, i) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <BusinessCardHorizontal
                        business={b}
                        onPress={() => navigate(`/businesses/${b.slug}`)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {!search.isIdle && search.activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {search.isProductsLoading ? (
                <ResultsSkeleton grid />
              ) : search.isProductsError ? (
                <ResultsError message="خطا در دریافت نتایج. لطفاً دوباره تلاش کنید." />
              ) : search.productResults.length === 0 ? (
                <EmptySearch query={search.debouncedQuery} onSuggestionClick={search.setQuery} />
              ) : (
                <div className="grid grid-cols-2 gap-3 px-4 pt-3 pb-24">
                  {search.productResults.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <ItemCard
                        name={p.name}
                        image={productImage(p)}
                        discountPercent={p.discountPercent}
                        installmentMonths={p.installmentMonths}
                        price={p.price}
                        originalPrice={p.originalPrice}
                        className="w-full"
                        onPress={() => navigate(`/products/${p.slug}`)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {!search.isIdle && search.activeTab === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {search.isServicesLoading ? (
                <ResultsSkeleton grid />
              ) : search.isServicesError ? (
                <ResultsError message="خطا در دریافت خدمات. لطفاً دوباره تلاش کنید." />
              ) : search.serviceResults.length === 0 ? (
                <EmptySearch query={search.debouncedQuery} onSuggestionClick={search.setQuery} />
              ) : (
                <div className="grid grid-cols-2 gap-3 px-4 pt-3 pb-24">
                  {search.serviceResults.map((s, i) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <ItemCard
                        name={s.name}
                        image={serviceImage(s)}
                        price={s.price}
                        className="w-full"
                        onPress={() => navigate(`/services/${s.slug}`)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {!search.isIdle && search.activeTab === "announcements" && (
            <motion.div
              key="announcements"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {search.isAnnouncementsLoading ? (
                <ResultsSkeleton />
              ) : search.isAnnouncementsError ? (
                <ResultsError message="خطا در دریافت اطلاعیه‌ها. لطفاً دوباره تلاش کنید." />
              ) : search.announcementResults.length === 0 ? (
                <EmptySearch query={search.debouncedQuery} onSuggestionClick={search.setQuery} />
              ) : (
                <div className="px-4 pt-3 pb-24 space-y-3">
                  {search.announcementResults.map((item, i) => (
                    <motion.button
                      key={item.id}
                      type="button"
                      className="w-full text-start bg-white rounded-2xl border border-neutral-100 p-4 space-y-2"
                      style={{ boxShadow: "var(--shadow-elevation-1)" }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => navigate(`/businesses/${item.businessSlug}`)}
                    >
                      <p className="text-[11px] font-vazirmatn text-blue-600 font-medium truncate">
                        {item.businessName}
                      </p>
                      <p className="text-[14px] font-iran-yekan-x font-bold text-neutral-900">
                        {item.title}
                      </p>
                      <p className="text-[13px] font-vazirmatn text-neutral-500 leading-relaxed">
                        {item.description}
                      </p>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FilterDrawer
        isOpen={search.isFilterOpen}
        filters={search.filters}
        onClose={search.closeFilter}
        onApply={search.applyFilters}
        onReset={search.resetFilters}
      />
      <SortSheet
        isOpen={search.isSortOpen}
        sortBy={search.sortBy}
        onSelect={search.setSortBy}
        onClose={search.closeSort}
      />
      <VoiceSearchOverlay
        isOpen={search.isVoiceOpen}
        onClose={search.closeVoice}
        onResult={search.setQuery}
      />
    </div>
  );
}
