import { motion } from 'framer-motion';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const PLATFORM_ICON: Record<string, string> = {
  Instagram: '📸',
  TikTok: '🎵',
  Snapchat: '👻',
  Discord: '💬',
  GitHub: '⚡',
  Roblox: '🎮',
};

export const PLATFORM_COLOR: Record<string, string> = {
  Instagram: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366)',
  TikTok: 'linear-gradient(135deg, #111, #69C9D0)',
  Snapchat: 'linear-gradient(135deg, #FFFC00, #e8e000)',
  Discord: 'linear-gradient(135deg, #5865F2, #7289da)',
  GitHub: 'linear-gradient(135deg, #2d333b, #768390)',
  Roblox: 'linear-gradient(135deg, #e53935, #b71c1c)',
};

export const RARITY_CLASS: Record<string, string> = {
  Legendary: 'pill--legendary',
  Epic: 'pill--epic',
  Rare: 'pill--rare',
  Common: '',
};

const STOCK_MAX = 5;

export function ProductCard({
  product,
  onOpen
}: {
  product: Product;
  onOpen: (product: Product) => void;
}) {
  const { t } = useLanguage();
  const icon = PLATFORM_ICON[product.platform] ?? '🔷';
  const platformGradient = PLATFORM_COLOR[product.platform] ?? 'linear-gradient(135deg, #667eea, #764ba2)';
  const stockDots = Math.min(product.stockAvailable, STOCK_MAX);
  const soldOut = product.stockAvailable === 0;

  return (
    <motion.article
      layout
      className={`product-card ${soldOut ? 'product-card--sold-out' : ''}`}
      data-rarity={product.rarity}
      whileHover={{ y: soldOut ? 0 : -8, scale: soldOut ? 1 : 1.015 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
    >
      <div className="product-card__glow" />

      {soldOut && (
        <div className="sold-out-overlay">
          <span>Sold Out</span>
        </div>
      )}

      <div className="product-card__top">
        <span
          className="pill pill--platform"
          style={{ background: platformGradient, border: 'none', color: product.platform === 'Snapchat' ? '#111' : '#fff' }}
        >
          {icon} {product.platform}
        </span>
        {product.featured && !soldOut && (
          <span className="pill pill--featured">★ Featured</span>
        )}
      </div>

      <h3>{product.title}</h3>
      <p>{product.shortDescription}</p>

      <div className="product-card__rarity-row">
        <span className={`pill ${RARITY_CLASS[product.rarity] ?? ''}`}>
          {product.rarity}
        </span>
        <span className="pill">{product.category}</span>
      </div>

      <div className="product-card__stock-row">
        <span className="stock-label">{t('stock')}</span>
        <div className="stock-dots">
          {Array.from({ length: STOCK_MAX }).map((_, i) => (
            <span
              key={i}
              className={`stock-dot ${i < stockDots ? 'stock-dot--filled' : ''}`}
            />
          ))}
          <span className="stock-count">{product.stockAvailable}</span>
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
        <div className="product-card__price">
          <span>{t('price')}</span>
          <strong>${product.priceUsd.toLocaleString()}</strong>
        </div>
        <button
          type="button"
          onClick={() => onOpen(product)}
          disabled={soldOut}
          className={soldOut ? 'btn-sold-out' : ''}
        >
          {soldOut ? 'Sold Out' : t('buyNow')}
        </button>
      </div>
    </motion.article>
  );
}
