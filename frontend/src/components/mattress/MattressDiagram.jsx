import './MattressDiagram.css';

const COIL_X = [40, 120, 200, 280, 360, 440];

function coilPath(x) {
  return `M${x} 104 C ${x - 16} 116, ${x + 16} 116, ${x} 128 C ${x - 16} 140, ${x + 16} 140, ${x} 152 C ${x - 16} 164, ${x + 16} 164, ${x} 176`;
}

/**
 * MattressDiagram
 * Decorative/generic cutaway -- not per-product data. Pick a variant with
 * `type`, based on the product's core_type once that field exists on the
 * backend model; until then, default to 'spring'.
 *
 * Props:
 *  - type   'spring' | 'foam'
 */
export default function MattressDiagram({ type = 'spring' }) {
  const isFoam = type === 'foam';

  return (
    <div className="diagram-block">
      <span className="mono-tag">Cross-section</span>
      <svg viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">
        {/* Quilted cover */}
        <rect x="10" y="14" width="500" height="22" rx="6" fill="#FBFAF6" stroke="#224349" strokeWidth="1.2" />
        {/* Comfort foam */}
        <rect x="10" y="40" width="500" height="30" fill="#F1EEE3" stroke="#224349" strokeWidth="1.2" />
        {/* Transition layer */}
        <rect x="10" y="74" width="500" height="18" fill="#E9E6DC" stroke="#224349" strokeWidth="1.2" />
        {/* Core: springs or solid foam */}
        <rect x="10" y="96" width="500" height="90" fill="#FBFAF6" stroke="#224349" strokeWidth="1.2" />

        {isFoam ? (
          <g stroke="#2D5961" strokeWidth="1.2" fill="none">
            <line x1="10" y1="118" x2="510" y2="118" strokeDasharray="4 6" />
            <line x1="10" y1="140" x2="510" y2="140" strokeDasharray="4 6" />
            <line x1="10" y1="162" x2="510" y2="162" strokeDasharray="4 6" />
          </g>
        ) : (
          <g stroke="#2D5961" strokeWidth="1.6" fill="none">
            {COIL_X.map((x) => (
              <path key={x} d={coilPath(x)} />
            ))}
          </g>
        )}

        {/* Base */}
        <rect x="10" y="186" width="500" height="14" fill="#224349" />

        <text x="516" y="30" textAnchor="end" fontFamily="Space Mono, monospace" fontSize="10" fill="#66646B">Quilted cover</text>
        <text x="516" y="59" textAnchor="end" fontFamily="Space Mono, monospace" fontSize="10" fill="#66646B">Comfort foam</text>
        <text x="516" y="87" textAnchor="end" fontFamily="Space Mono, monospace" fontSize="10" fill="#66646B">Transition layer</text>
        <text x="516" y="145" textAnchor="end" fontFamily="Space Mono, monospace" fontSize="10" fill="#66646B">
          {isFoam ? 'Foam core' : 'Pocket springs'}
        </text>
        <text x="516" y="197" textAnchor="end" fontFamily="Space Mono, monospace" fontSize="10" fill="#66646B">Base</text>
      </svg>
    </div>
  );
}
