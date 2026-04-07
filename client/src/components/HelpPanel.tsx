export function HelpPanel() {
  return (
    <section className="admin-panel">
      <div className="section-heading">
        <h3>Help center</h3>
        <p>Operational notes for you or anyone you authorize to manage the dashboard.</p>
      </div>

      <div className="help-grid">
        <article className="note-card">
          <strong>1. Creating a product</strong>
          <p>
            Go to Products, fill in title, platform, product type, rarity, meaning language, price,
            tags, short description, and delivery description. Publish it when ready.
          </p>
        </article>

        <article className="note-card">
          <strong>2. Adding secure stock</strong>
          <p>
            Use the inventory form tied to a product. Sensitive fields are encrypted before storage and
            only revealed after successful delivery.
          </p>
        </article>

        <article className="note-card">
          <strong>3. Auto-delivery flow</strong>
          <p>
            When an order is paid, one available record is assigned automatically. The same record is
            never returned to stock after delivery.
          </p>
        </article>

        <article className="note-card">
          <strong>4. Payments</strong>
          <p>
            This starter includes BTC, LTC, ETH, XMR, TON, USDT, and SOL as UI-ready methods. Replace
            the demo confirmation route with your production crypto verification flow.
          </p>
        </article>

        <article className="note-card">
          <strong>5. Security basics</strong>
          <p>
            Change admin credentials, store secrets outside Git, use HTTPS, add 2FA, and keep the admin
            panel on a separate protected subdomain before production launch.
          </p>
        </article>

        <article className="note-card">
          <strong>6. Translation</strong>
          <p>
            The storefront opens in English by default. The top-right language toggle instantly switches
            visible store text to Italian.
          </p>
        </article>
      </div>
    </section>
  );
}
