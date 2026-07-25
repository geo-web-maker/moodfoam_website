/**
 * FirmnessBar
 * Renders the gradient soft->firm scale used on mattress cards and the
 * product page. `percent` is 0-100 (0 = softest, 100 = firmest).
 *
 * Once the backend's `firmness_percent` field exists, pass it straight
 * through: <FirmnessBar percent={product.firmness_percent} />
 */
export default function FirmnessBar({ percent }) {
  if (percent === null || percent === undefined) return null;
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div className="firmness">
      <div className="firmness-bar">
        <i style={{ width: `${clamped}%` }} />
      </div>
      <div className="firmness-label">
        <span>Soft</span>
        <span>Firm</span>
      </div>
    </div>
  );
}
