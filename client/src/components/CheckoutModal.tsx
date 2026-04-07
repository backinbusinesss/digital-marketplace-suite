import { useState } from 'react';
import { api } from '../api/client';
import { useLanguage } from '../context/LanguageContext';
import { Order, PaymentMethod, Product } from '../types';

const paymentMethods: PaymentMethod[] = ['BTC', 'LTC', 'ETH', 'XMR', 'TON', 'USDT', 'SOL'];

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
        <button className="modal-close" onClick={onClose} type="button">
          ×
        </button>

        <div className="modal-header">
          <span className="pill pill--accent">{product.platform}</span>
          <h3>{product.title}</h3>
          <p>{product.deliveryDescription}</p>
        </div>

        <div className="detail-grid">
          <div>
            <span>{t('price')}</span>
            <strong>${product.priceUsd.toFixed(2)}</strong>
          </div>
          <div>
            <span>{t('rarity')}</span>
            <strong>{product.rarity}</strong>
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

        <div className="field-stack">
          <label>{t('orderEmail')}</label>
          <input
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            placeholder="client@example.com"
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
          <button disabled={working || !customerEmail} onClick={createOrder} type="button">
            {t('createOrder')}
          </button>
          <button disabled={working || !order} onClick={confirmPayment} type="button" className="secondary">
            {t('simulatePayment')}
          </button>
        </div>

        {message ? <p className="status-message">{message}</p> : null}

        {order ? (
          <div className="note-card">
            <strong>Order #{order.publicId}</strong>
            <p>Status: {order.status}</p>
            {order.delivery ? (
              <div className="delivery-reveal">
                <div>
                  <span>Access ID</span>
                  <strong>{order.delivery.accessId}</strong>
                </div>
                <div>
                  <span>Secret</span>
                  <strong>{order.delivery.secret}</strong>
                </div>
                <div>
                  <span>Email</span>
                  <strong>{order.delivery.email}</strong>
                </div>
                <div>
                  <span>Email secret</span>
                  <strong>{order.delivery.emailSecret}</strong>
                </div>
                <div>
                  <span>Note</span>
                  <strong>{order.delivery.note}</strong>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
