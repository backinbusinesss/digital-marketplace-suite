import { useState } from 'react';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { Order, PaymentMethod, Product } from '../types';
import { PLATFORM_COLOR, PLATFORM_ICON, RARITY_CLASS } from './ProductCard';

const CRYPTO_ICON: Record<string, string> = {
  BTC: '₿',
  LTC: 'Ł',
  ETH: 'Ξ',
  XMR: '⬡',
  TON: '◈',
  USDT: '₮',
  SOL: '◎',
};

const paymentMethods: PaymentMethod[] = ['BTC', 'LTC', 'ETH', 'XMR', 'TON', 'USDT', 'SOL'];

const STATUS_LABEL: Record<string, string> = {
  awaiting_payment: '⏳ Awaiting payment',
  paid: '✅ Paid',
  delivered: '🎉 Delivered',
  cancelled: '❌ Cancelled',
};

export function CheckoutModal({
  product,
  onClose
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BTC');
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState('');
  const [working, setWorking] = useState(false);

  if (!product) return null;

  const platformGradient = PLATFORM_COLOR[product.platform] ?? 'linear-gradient(135deg, #667eea, #764ba2)';
  const platformIcon = PLATFORM_ICON[product.platform] ?? '🔷';
  const snapchatText = product.platform === 'Snapchat';

  const createOrder = async () => {
    try {
      setWorking(true);
      const payload = await api.createOrder({ customerEmail, productId: product.id, paymentMethod });
      setOrder(payload.order);
      setMessage(t('orderCreated'));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Request failed');
    } finally {
      setWorking(false);
    }
  };

  const confirmPayment = async () => {
    if (!order) return;
    try {
      setWorking(true);
      const payload = await api.confirmPayment(order.id);
      setOrder(payload.order);
      setMessage(t('orderDelivered'));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Request failed');
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} type="button" aria-label="Close">
          ×
        </button>

        <div className="modal-header">
          <div className="modal-header__badges">
            <span
              className="pill pill--platform"
              style={{ background: platformGradient, border: 'none', color: snapchatText ? '#111' : '#fff' }}
            >
              {platformIcon} {product.platform}
            </span>
            <span className={`pill ${RARITY_CLASS[product.rarity] ?? ''}`}>
              {product.rarity}
            </span>
          </div>
          <h3>{product.title}</h3>
          <p>{product.deliveryDescription}</p>
        </div>

        <div className="modal-price-row">
          <div className="modal-price">
            <span>{t('price')}</span>
            <strong>${product.priceUsd.toLocaleString()}</strong>
          </div>
          <div className="detail-cell">
            <span>{t('stock')}</span>
            <strong>{product.stockAvailable} available</strong>
          </div>
          <div className="detail-cell">
            <span>{t('category')}</span>
            <strong>{product.category}</strong>
          </div>
        </div>

        {product.previewDetails.length > 0 && (
          <ul className="preview-list">
            {product.previewDetails.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        )}

        <div className="field-stack">
          <label>{t('orderEmail')}</label>
          <input
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            placeholder="client@example.com"
            type="email"
          />
        </div>

        <div className="field-stack">
          <label>{t('paymentMethod')}</label>
          <div className="payment-grid">
            {paymentMethods.map((method) => (
              <button
                key={method}
                type="button"
                className={paymentMethod === method ? 'payment-pill active' : 'payment-pill'}
                onClick={() => setPaymentMethod(method)}
              >
                <span className="crypto-icon">{CRYPTO_ICON[method]}</span>
                {method}
              </button>
            ))}
          </div>
        </div>

        <div className="note-card">
          <strong>{t('deliveryInfo')}</strong>
          <p>{t('instantDelivery')}</p>
          <p>{t('credentialsNotice')}</p>
        </div>

        <div className="button-row">
          <button disabled={working || !customerEmail || order !== null} onClick={createOrder} type="button">
            {working && !order ? '⏳ Creating…' : t('createOrder')}
          </button>
          <button disabled={working || !order || order.status === 'delivered'} onClick={confirmPayment} type="button" className="secondary">
            {working && order ? '⏳ Confirming…' : t('simulatePayment')}
          </button>
        </div>

        {message ? <p className="status-message">{message}</p> : null}

        {order ? (
          <div className="note-card order-result">
            <div className="order-result__header">
              <strong>Order #{order.publicId}</strong>
              <span className="order-status-badge">{STATUS_LABEL[order.status] ?? order.status}</span>
            </div>

            {order.delivery ? (
              <div className="delivery-reveal">
                <div>
                  <span>Access ID</span>
                  <strong>{order.delivery.accessId}</strong>
                </div>
                <div>
                  <span>Secret</span>
                  <strong className="delivery-secret">{order.delivery.secret}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{order.delivery.email}</strong>
                </div>
                <div>
                  <span>Email secret</span>
                  <strong className="delivery-secret">{order.delivery.emailSecret}</strong>
                </div>
                {order.delivery.note && (
                  <div className="delivery-note-full">
                    <span>Note</span>
                    <strong>{order.delivery.note}</strong>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
