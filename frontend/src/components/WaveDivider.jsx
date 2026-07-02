/**
 * WaveDivider -- the site's signature motif. A soft layered wave standing in
 * for the stacked foam/quilting layers inside every mattress. Used between
 * sections so "night" (ink) and "day" (bg) surfaces meet along a quilted
 * seam rather than a hard edge.
 */
export default function WaveDivider({ from = 'var(--ink)', to = 'var(--bg)', flip = false }) {
  return (
    <div
      aria-hidden="true"
      style={{
        lineHeight: 0,
        background: from,
        transform: flip ? 'scaleY(-1)' : 'none',
      }}
    >
      <svg
        viewBox="0 0 1200 84"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '64px', display: 'block' }}
      >
        <path
          d="M0,32 C120,72 240,0 360,28 C480,56 600,8 720,24 C840,40 960,72 1080,40 C1140,24 1170,16 1200,28 L1200,84 L0,84 Z"
          fill={to}
        />
      </svg>
    </div>
  );
}
