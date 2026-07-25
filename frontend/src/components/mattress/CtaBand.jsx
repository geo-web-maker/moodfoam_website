import { Link } from 'react-router-dom';

/**
 * CtaBand
 * The ink-deep + gold-hairline closing CTA block. Never use --plum here --
 * see DESIGN-GUIDE §3.
 *
 * Props:
 *  - heading     required, the CTA headline
 *  - body        optional supporting line
 *  - ctaLabel    button text
 *  - linkTo      internal route (react-router) -- use for real product/contact links
 *  - href        external/absolute link -- use instead of linkTo when needed
 *  - variant     'gold' (default) or 'outline-light' for the button style
 */
export default function CtaBand({ heading, body, ctaLabel, linkTo, href, variant = 'gold' }) {
  const LinkTag = linkTo ? Link : 'a';
  const linkProps = linkTo ? { to: linkTo } : { href };
  const btnClass = variant === 'outline-light' ? 'btn btn--outline-light' : 'btn btn--gold';

  return (
    <div className="cta-band">
      <div>
        <h2>{heading}</h2>
        {body && <p>{body}</p>}
      </div>
      {ctaLabel && (linkTo || href) && (
        <LinkTag className={btnClass} {...linkProps}>{ctaLabel}</LinkTag>
      )}
    </div>
  );
}
