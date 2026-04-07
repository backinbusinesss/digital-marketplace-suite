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

  return (
    <div className="page-shell">
      <section className="hero-card">
        <span className="pill pill--accent">{t('heroLabel')}</span>
        <h1>{t('heroTitle')}</h1>
        <p>{t('heroText')}</p>
      </section>

      <div className="store-layout">
        <FilterSidebar {...store} />

        <section className="products-panel">
          {store.loading ? <div className="empty-state">Loading storefront...</div> : null}
          {store.error ? <div className="empty-state">{store.error}</div> : null}
          {!store.loading && !store.error && store.filteredProducts.length === 0 ? (
            <div className="empty-state">{t('noResults')}</div>
          ) : null}

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
