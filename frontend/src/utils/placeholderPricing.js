/**
 * PLACEHOLDER PRICING -- NOT REAL DATA.
 *
 * There is currently no per-size price on the backend: `product.sizes` is a
 * flat array of strings (e.g. "5 x 6 ft") and `product.price` is a single
 * product-wide value. This helper fabricates a plausible-looking price per
 * size purely so the size-swap interaction has something to display.
 *
 * Every price this produces is clearly marked "Estimated" in the UI -- see
 * ProductPage.jsx -- so it can never be mistaken for a confirmed price even
 * if this ships before the backend catches up.
 *
 * Replace this entirely once `product.sizes` becomes `[{ size, price }, ...]`
 * from the backend (see REPLACE-GUIDE.md §4 Step 4 / the admin second-section
 * discussion) -- at that point just read `size.price` directly and delete
 * this file.
 */

// Roughly +/-45% spread across up to 6 sizes, smallest to largest.
const SIZE_PRICE_STEPS = [0.82, 0.9, 1, 1.12, 1.28, 1.45];

function parsePrice(raw) {
  if (!raw) return null;
  const digits = String(raw).replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : null;
}

export function formatUgx(n) {
  return `UGX ${n.toLocaleString('en-UG')}`;
}

/**
 * Returns a display string for the given size index, or `null` if the
 * base price couldn't be parsed (caller should fall back to the raw
 * product.price string in that case).
 */
export function getPlaceholderSizePrice(basePrice, sizeIndex) {
  const base = parsePrice(basePrice);
  if (base === null) return null;
  const step = SIZE_PRICE_STEPS[Math.min(sizeIndex, SIZE_PRICE_STEPS.length - 1)];
  const rounded = Math.round((base * step) / 1000) * 1000;
  return formatUgx(rounded);
}
