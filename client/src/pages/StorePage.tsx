import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FilterSidebar } from '../components/FilterSidebar';
import { ProductCard } from '../components/ProductCard';
import { CheckoutModal } from '../components/CheckoutModal';
import { useLanguage } from '../context/LanguageContext';
import { useStorefront } from '../hooks/useStorefront';
import { Product } from '../types';

export function StorePage() {
  const { t } = useLanguage();
  const store = useStorefront();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const hasFilters =
    store.search.trim() ||
    store.selectedPlatforms.length > 0 ||
    store.selectedCategories.length > 0 ||
    store.selectedRarity.length > 0 ||
    store.selectedLanguages.length > 0;

  return (
    <div className="page-shell">
      <section className="hero-card">
        <span className="pill pill--accent">{t('heroLabel')}</span>
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroText')}</p>

        <div className="platform-ticker">
          {['📸 Instagram', '🎵 TikTok', '👻 Snapchat', '💬 Discord', '⚡ GitHub', '🎮 Roblox'].map((label) => (
            <span key={label} className="ticker-chip">{label}</span>
          ))}
        </div>
      </section>

      <div className="store-layout">
        <FilterSidebar {...store} />

        <section className="products-panel">
          {store.loading ? <div className="empty-state">Loading storefront…</div> : null}
          {store.error ? <div className="empty-state">{store.error}</div> : null}

          {!store.loading && !store.error && (
            <div className="results-bar">
              <span className="results-count">
                {store.filteredProducts.length === 0
                  ? t('noResults')
                  : `${store.filteredProducts.length} product${store.filteredProducts.length !== 1 ? 's' : ''}`}
              </span>
              {hasFilters && (
                <button className="results-clear" onClick={store.clearFilters} type="button">
                  ✕ Clear filters
                </button>
              )}
            </div>
          )}

          <div className="products-grid">
            {store.filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedProduct ? (
          <CheckoutModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
