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
import { ProductCardHorizontal } from "@/components/product/ProductCardHorizontal";
import { ProductCardStandard } from "@/components/product/ProductCardStandard";

export default function SearchPage() {
  const [, navigate] = useLocation();
  const search = useSearch();

  const handleBack = () => navigate("/");

  return (
    <div dir="rtl" className="flex flex-col bg-white" style={{ height: "100dvh" }}>
      {/* ─── Sticky top controls ──────────────────────── */}
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
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Scrollable content ────────────────────────── */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <AnimatePresence mode="wait" initial={false}>
          {/* Idle state */}
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
                onSearch={q => { search.setQuery(q); search.addRecentSearch(q); }}
                onRemoveRecent={search.removeRecentSearch}
                onClearRecent={search.clearRecentSearches}
              />
            </motion.div>
          )}

          {/* Active: All tab */}
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
                onTabChange={search.setActiveTab}
                onSearch={q => { search.setQuery(q); }}
              />
            </motion.div>
          )}

          {/* Active: Businesses tab */}
          {!search.isIdle && search.activeTab === "businesses" && (
            <motion.div
              key="businesses"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {search.businessResults.length === 0 ? (
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
                      <BusinessCardHorizontal business={b} onPress={() => navigate(`/businesses/${b.slug}`)} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Active: Products tab */}
          {!search.isIdle && search.activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {search.productResults.length === 0 ? (
                <EmptySearch query={search.debouncedQuery} onSuggestionClick={search.setQuery} />
              ) : search.viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-3 px-4 pt-3 pb-24">
                  {search.productResults.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <ProductCardStandard product={p} className="w-full" onPress={() => navigate(`/products/${p.slug}`)} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="px-4 pt-3 pb-24 space-y-3">
                  {search.productResults.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <ProductCardHorizontal product={p} onPress={() => navigate(`/products/${p.slug}`)} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Overlays ──────────────────────────────────── */}
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
