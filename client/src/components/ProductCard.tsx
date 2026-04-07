import { motion } from 'framer-motion';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

export function ProductCard({
  product,
  onOpen
}: {
  product: Product;
  onOpen: (product: Product) => void;
}) {
  const { t } = useLanguage();

  return (
    <motion.article
      layout
      className="product-card"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
    >
      <div className="product-card__glow" />
      <div className="product-card__top">
        <span className="pill pill--accent">{product.platform}</span>
        <span className="pill">{product.rarity}</span>
      </div>

      <h3>{product.title}</h3>
      <p>{product.shortDescription}</p>

      <div className="product-card__meta">
        <div>
          <span>{t('category')}</span>
          <strong>{product.category}</strong>
        </div>
        <div>
          <span>{t('meaningLanguage')}</span>
          <strong>{product.meaningLanguage}</strong>
        </div>
        <div>
          <span>{t('stock')}</span>
          <strong>{product.stockAvailable}</strong>
        </div>
      </div>

      <div className="tag-row">
        {product.tags.map((tag) => (
          <span key={tag} className="tag-chip">
            {tag}
          </span>
        ))}
      </div>

      <div className="product-card__footer">
        <div>
          <span>{t('price')}</span>
          <strong>${product.priceUsd.toFixed(2)}</strong>
        </div>
        <button type="button" onClick={() => onOpen(product)}>
          {t('buyNow')}
        </button>
      </div>
    </motion.article>
  );
}
