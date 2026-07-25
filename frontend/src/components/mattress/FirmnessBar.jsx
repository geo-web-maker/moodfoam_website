/**
 * FirmnessBar
 * Renders the gradient soft->firm scale used on mattress cards and the
 * product page. `percent` is 0-100 (0 = softest, 100 = firmest).
 *
 * Once the backend's `firmness_percent` field exists, pass it straight
 * through: <FirmnessBar percent={product.firmness_percent} />
 *
 * `labels` defaults to the compact 2-label card variant (Soft/Firm); pass
 * `['Soft', 'Medium', 'Firm']` for the product page's 3-label variant.
 */
export default function FirmnessBar({ percent, labels = ['Soft', 'Firm'] }) {
  if (percent === null || percent === undefined) return null;
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="firmness">
      <div className="firmness-bar">
        <i style={{ width: `${clamped}%` }} />
      </div>
      <div className="firmness-label">
        {labels.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}
