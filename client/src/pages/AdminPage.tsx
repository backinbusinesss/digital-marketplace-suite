import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BarChart3, Boxes, CircleHelp, CreditCard, Package, Settings } from 'lucide-react';
import { api } from '../api/client';
import { HelpPanel } from '../components/HelpPanel';
import { AdminSettings, Order, Product } from '../types';

const defaultProduct = {
  title: '',
  platform: 'Community',
  category: 'Reserved Handle',
  rarity: 'Rare',
  meaningLanguage: 'English',
  priceUsd: 0,
  featured: true,
  status: 'published',
  tags: 'premium, instant',
  shortDescription: '',
  deliveryDescription: 'Delivery record is released after paid status is confirmed.',
  previewDetails: 'Instant release\nEncrypted stock\nPremium support'
};

const defaultSettings: AdminSettings = {
  brandName: 'Nova Vault Market',
  heroLabel: 'Premium digital inventory',
  supportEmail: 'support@example.com',
  payments: ['BTC', 'LTC', 'ETH', 'XMR', 'TON', 'USDT', 'SOL']
};

const defaultInventory = {
  accessId: '',
  secret: '',
  email: '',
  emailSecret: '',
  note: ''
};

type Section = 'overview' | 'products' | 'inventory' | 'orders' | 'settings' | 'help';

export function AdminPage() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin-token'));
  const [email, setEmail] = useState('admin@marketplace.local');
  const [password, setPassword] = useState('ChangeThisNow!123');
  const [section, setSection] = useState<Section>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalRevenueUsd: 0, totalOrders: 0, paidOrders: 0, lowStockProducts: 0 });
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [productForm, setProductForm] = useState(defaultProduct);
  const [inventoryForm, setInventoryForm] = useState(defaultInventory);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [message, setMessage] = useState('');

  const loadDashboard = async (authToken: string) => {
    const [productsPayload, ordersPayload, statsPayload, settingsPayload] = await Promise.all([
      api.getAdminProducts(authToken),
      api.getOrders(authToken),
      api.getStats(authToken),
      api.getSettings(authToken)
    ]);

    setProducts(productsPayload.products);
    setOrders(ordersPayload.orders);
    setStats(statsPayload.stats);
    setSettings(settingsPayload.settings);
    setSelectedProductId(productsPayload.products[0]?.id || '');
  };

  useEffect(() => {
    if (!token) return;
    loadDashboard(token).catch((error) => {
      setMessage(error instanceof Error ? error.message : 'Unable to load dashboard');
      localStorage.removeItem('admin-token');
      setToken(null);
    });
  }, [token]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const payload = await api.adminLogin({ email, password });
      localStorage.setItem('admin-token', payload.token);
      setToken(payload.token);
      setMessage('Signed in successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('admin-token');
    setToken(null);
    setMessage('Signed out.');
  };

  const createProduct = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;

    try {
      await api.createProduct(token, {
        ...productForm,
        tags: productForm.tags.split(',').map((value) => value.trim()).filter(Boolean),
        previewDetails: productForm.previewDetails
          .split('\n')
          .map((value) => value.trim())
          .filter(Boolean)
      });
      await loadDashboard(token);
      setProductForm(defaultProduct);
      setMessage('Product created.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to create product');
    }
  };

  const addInventory = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !selectedProductId) return;

    try {
      await api.addInventory(token, selectedProductId, inventoryForm);
      await loadDashboard(token);
      setInventoryForm(defaultInventory);
      setMessage('Inventory record encrypted and added.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to add inventory');
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!token) return;
    try {
      await api.deleteProduct(token, productId);
      await loadDashboard(token);
      setMessage('Product deleted.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  const saveSettings = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    try {
      await api.updateSettings(token, settings);
      setMessage('Settings saved.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save settings');
    }
  };

  const lowStockProducts = useMemo(
    () => products.filter((product) => product.stockAvailable <= 2),
    [products]
  );

  if (!token) {
    return (
      <div className="page-shell admin-auth-shell">
        <section className="auth-card">
          <h1>Admin dashboard</h1>
          <p>English is the default dashboard language. Update credentials in server/.env before production.</p>
          <form onSubmit={login} className="auth-form">
            <div className="field-stack">
              <label>Email</label>
              <input value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <div className="field-stack">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button type="submit">Sign in</button>
          </form>
          {message ? <p className="status-message">{message}</p> : null}
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell admin-shell">
      <aside className="admin-sidebar">
        <div>
          <h2>Control center</h2>
          <p>Secure operations for products, encrypted inventory, and orders.</p>
        </div>

        <div className="admin-nav">
          <button className={section === 'overview' ? 'active' : ''} onClick={() => setSection('overview')}>
            <BarChart3 size={16} /> Overview
          </button>
          <button className={section === 'products' ? 'active' : ''} onClick={() => setSection('products')}>
            <Package size={16} /> Products
          </button>
          <button className={section === 'inventory' ? 'active' : ''} onClick={() => setSection('inventory')}>
            <Boxes size={16} /> Inventory
          </button>
          <button className={section === 'orders' ? 'active' : ''} onClick={() => setSection('orders')}>
            <CreditCard size={16} /> Orders
          </button>
          <button className={section === 'settings' ? 'active' : ''} onClick={() => setSection('settings')}>
            <Settings size={16} /> Settings
          </button>
          <button className={section === 'help' ? 'active' : ''} onClick={() => setSection('help')}>
            <CircleHelp size={16} /> Help
          </button>
        </div>

        <button type="button" className="logout-button" onClick={logout}>
          Sign out
        </button>
      </aside>

      <main className="admin-content">
        {message ? <div className="status-banner">{message}</div> : null}

        {section === 'overview' ? (
          <section className="admin-panel">
            <div className="section-heading">
              <h3>Overview</h3>
              <p>Snapshot of revenue, orders, and inventory pressure.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span>Total revenue</span>
                <strong>${stats.totalRevenueUsd.toFixed(2)}</strong>
              </div>
              <div className="stat-card">
                <span>Total orders</span>
                <strong>{stats.totalOrders}</strong>
              </div>
              <div className="stat-card">
                <span>Paid or delivered orders</span>
                <strong>{stats.paidOrders}</strong>
              </div>
              <div className="stat-card">
                <span>Low stock products</span>
                <strong>{stats.lowStockProducts}</strong>
              </div>
            </div>

            <div className="admin-grid-two">
              <article className="note-card">
                <strong>Low stock watch</strong>
                {lowStockProducts.length === 0 ? <p>No products are currently low on stock.</p> : null}
                <ul className="bullet-list">
                  {lowStockProducts.map((product) => (
                    <li key={product.id}>
                      {product.title} · {product.stockAvailable} left
                    </li>
                  ))}
                </ul>
              </article>

              <article className="note-card">
                <strong>Operational checklist</strong>
                <ul className="bullet-list">
                  <li>Rotate admin password and JWT secret before launch.</li>
                  <li>Move encrypted inventory into a production database.</li>
                  <li>Replace demo payment confirmation with a real crypto webhook.</li>
                  <li>Enable HTTPS and place admin on a separate protected subdomain.</li>
                </ul>
              </article>
            </div>
          </section>
        ) : null}

        {section === 'products' ? (
          <section className="admin-panel">
            <div className="section-heading">
              <h3>Products</h3>
              <p>Create storefront items with fields that directly map to the public UI.</p>
            </div>

            <div className="admin-grid-two">
              <form className="editor-card" onSubmit={createProduct}>
                <div className="form-grid two-columns">
                  <div className="field-stack">
                    <label>Product title</label>
                    <input
                      value={productForm.title}
                      onChange={(event) => setProductForm((prev) => ({ ...prev, title: event.target.value }))}
                      placeholder="Aurora Handle Pack"
                    />
                  </div>
                  <div className="field-stack">
                    <label>Platform</label>
                    <input
                      value={productForm.platform}
                      onChange={(event) => setProductForm((prev) => ({ ...prev, platform: event.target.value }))}
                    />
                  </div>
                  <div className="field-stack">
                    <label>Product type</label>
                    <select
                      value={productForm.category}
                      onChange={(event) => setProductForm((prev) => ({ ...prev, category: event.target.value }))}
                    >
                      <option>Reserved Handle</option>
                      <option>Vanity Link</option>
                      <option>Access Package</option>
                      <option>License Drop</option>
                    </select>
                  </div>
                  <div className="field-stack">
                    <label>Rarity</label>
                    <select
                      value={productForm.rarity}
                      onChange={(event) => setProductForm((prev) => ({ ...prev, rarity: event.target.value }))}
                    >
                      <option>Common</option>
                      <option>Rare</option>
                      <option>Epic</option>
                      <option>Legendary</option>
                    </select>
                  </div>
                  <div className="field-stack">
                    <label>Meaning language</label>
                    <select
                      value={productForm.meaningLanguage}
                      onChange={(event) =>
                        setProductForm((prev) => ({ ...prev, meaningLanguage: event.target.value }))
                      }
                    >
                      <option>English</option>
                      <option>Italian</option>
                      <option>Universal</option>
                    </select>
                  </div>
                  <div className="field-stack">
                    <label>Price in USD</label>
                    <input
                      type="number"
                      value={productForm.priceUsd}
                      onChange={(event) =>
                        setProductForm((prev) => ({ ...prev, priceUsd: Number(event.target.value) }))
                      }
                    />
                  </div>
                </div>

                <div className="form-grid two-columns">
                  <div className="field-stack">
                    <label>Status</label>
                    <select
                      value={productForm.status}
                      onChange={(event) => setProductForm((prev) => ({ ...prev, status: event.target.value }))}
                    >
                      <option>published</option>
                      <option>draft</option>
                      <option>hidden</option>
                    </select>
                  </div>
                  <div className="field-stack inline-check">
                    <label>
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(event) =>
                          setProductForm((prev) => ({ ...prev, featured: event.target.checked }))
                        }
                      />
                      Featured on storefront
                    </label>
                  </div>
                </div>

                <div className="field-stack">
                  <label>Tags (comma separated)</label>
                  <input
                    value={productForm.tags}
                    onChange={(event) => setProductForm((prev) => ({ ...prev, tags: event.target.value }))}
                  />
                </div>

                <div className="field-stack">
                  <label>Short description</label>
                  <textarea
                    rows={3}
                    value={productForm.shortDescription}
                    onChange={(event) =>
                      setProductForm((prev) => ({ ...prev, shortDescription: event.target.value }))
                    }
                  />
                </div>

                <div className="field-stack">
                  <label>Delivery description</label>
                  <textarea
                    rows={3}
                    value={productForm.deliveryDescription}
                    onChange={(event) =>
                      setProductForm((prev) => ({ ...prev, deliveryDescription: event.target.value }))
                    }
                  />
                </div>

                <div className="field-stack">
                  <label>Preview details (one line per item)</label>
                  <textarea
                    rows={4}
                    value={productForm.previewDetails}
                    onChange={(event) =>
                      setProductForm((prev) => ({ ...prev, previewDetails: event.target.value }))
                    }
                  />
                </div>

                <button type="submit">Create product</button>
              </form>

              <div className="table-card">
                <div className="table-head">
                  <strong>Current products</strong>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Platform</th>
                        <th>Rarity</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.title}</td>
                          <td>{product.platform}</td>
                          <td>{product.rarity}</td>
                          <td>${product.priceUsd.toFixed(2)}</td>
                          <td>{product.stockAvailable}</td>
                          <td>
                            <button type="button" className="danger-link" onClick={() => deleteProduct(product.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {section === 'inventory' ? (
          <section className="admin-panel">
            <div className="section-heading">
              <h3>Inventory</h3>
              <p>Add encrypted delivery records linked to a specific product.</p>
            </div>

            <form className="editor-card" onSubmit={addInventory}>
              <div className="field-stack">
                <label>Select product</label>
                <select value={selectedProductId} onChange={(event) => setSelectedProductId(event.target.value)}>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-grid two-columns">
                <div className="field-stack">
                  <label>Access ID</label>
                  <input
                    value={inventoryForm.accessId}
                    onChange={(event) =>
                      setInventoryForm((prev) => ({ ...prev, accessId: event.target.value }))
                    }
                    placeholder="example-access-id"
                  />
                </div>
                <div className="field-stack">
                  <label>Secret</label>
                  <input
                    value={inventoryForm.secret}
                    onChange={(event) => setInventoryForm((prev) => ({ ...prev, secret: event.target.value }))}
                    placeholder="example-secret"
                  />
                </div>
                <div className="field-stack">
                  <label>Email</label>
                  <input
                    value={inventoryForm.email}
                    onChange={(event) => setInventoryForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="deliverable@example.com"
                  />
                </div>
                <div className="field-stack">
                  <label>Email secret</label>
                  <input
                    value={inventoryForm.emailSecret}
                    onChange={(event) =>
                      setInventoryForm((prev) => ({ ...prev, emailSecret: event.target.value }))
                    }
                    placeholder="email-secret"
                  />
                </div>
              </div>

              <div className="field-stack">
                <label>Private note</label>
                <textarea
                  rows={3}
                  value={inventoryForm.note}
                  onChange={(event) => setInventoryForm((prev) => ({ ...prev, note: event.target.value }))}
                  placeholder="Any internal note to deliver with the record"
                />
              </div>

              <button type="submit">Add encrypted inventory</button>
            </form>
          </section>
        ) : null}

        {section === 'orders' ? (
          <section className="admin-panel">
            <div className="section-heading">
              <h3>Orders</h3>
              <p>Track created orders and verify which deliveries have been assigned.</p>
            </div>

            <div className="table-card">
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.publicId}</td>
                        <td>{order.customerEmail}</td>
                        <td>{order.productTitle}</td>
                        <td>{order.paymentMethod}</td>
                        <td>{order.status}</td>
                        <td>${order.totalUsd.toFixed(2)}</td>
                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ) : null}

        {section === 'settings' ? (
          <section className="admin-panel">
            <div className="section-heading">
              <h3>Settings</h3>
              <p>Storefront brand copy and available payment methods.</p>
            </div>

            <form className="editor-card" onSubmit={saveSettings}>
              <div className="form-grid two-columns">
                <div className="field-stack">
                  <label>Brand name</label>
                  <input
                    value={settings.brandName}
                    onChange={(event) => setSettings((prev) => ({ ...prev, brandName: event.target.value }))}
                  />
                </div>
                <div className="field-stack">
                  <label>Hero label</label>
                  <input
                    value={settings.heroLabel}
                    onChange={(event) => setSettings((prev) => ({ ...prev, heroLabel: event.target.value }))}
                  />
                </div>
              </div>
              <div className="field-stack">
                <label>Support email</label>
                <input
                  value={settings.supportEmail}
                  onChange={(event) => setSettings((prev) => ({ ...prev, supportEmail: event.target.value }))}
                />
              </div>
              <div className="field-stack">
                <label>Active payment methods</label>
                <input
                  value={settings.payments.join(', ')}
                  onChange={(event) =>
                    setSettings((prev) => ({
                      ...prev,
                      payments: event.target.value
                        .split(',')
                        .map((value) => value.trim().toUpperCase())
                        .filter(Boolean) as AdminSettings['payments']
                    }))
                  }
                />
              </div>
              <button type="submit">Save settings</button>
            </form>
          </section>
        ) : null}

        {section === 'help' ? <HelpPanel /> : null}
      </main>
    </div>
  );
}
