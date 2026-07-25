/**
 * NightDayPanel
 * The "By night / By day" brand moment. Use once per page maximum, and
 * only where it earns its place with a real product claim.
 *
 * Props:
 *  - nightText   copy for the ink-deep "By night" panel
 *  - dayText     copy for the surface-alt "By day" panel
 */
export default function NightDayPanel({
  nightText = 'Edge support that holds when you turn, and quilting that stays cool instead of trapping heat.',
  dayText = "No sagging, no morning stiffness — a mattress that's ready to do it again tomorrow night.",
}) {
  return (
    <section className="nightday">
      <div className="nightday__row">
        <div className="nightday__panel nightday__panel--night">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke="#CB9D4D" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
          <div className="nightday__copy">
            <span className="mini-tag">By night</span>
            <p>{nightText}</p>
          </div>
        </div>
        <div className="nightday__panel nightday__panel--day">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="4.2" stroke="#B84730" strokeWidth="1.4" />
            <g stroke="#B84730" strokeWidth="1.4" strokeLinecap="round">
              <path d="M12 2v2.4M12 19.6V22M22 12h-2.4M4.4 12H2M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7 17 17M7 7 5.3 5.3" />
            </g>
          </svg>
          <div className="nightday__copy">
            <span className="mini-tag">By day</span>
            <p>{dayText}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
