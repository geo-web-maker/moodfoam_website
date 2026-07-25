import { Link } from 'react-router-dom';
import FirmnessBar from './FirmnessBar';

/**
 * MattressCard
 *
 * Props:
 *  - name           product/room title
 *  - image          image src (already resolved, e.g. via imageUrl() from api.js)
 *  - imageAlt        alt text
 *  - tag             small floating label, top-left (e.g. "Pocket spring · Firm")
 *  - description     one or two line summary
 *  - price           display string, e.g. "From UGX 780,000" (pass free text)
 *  - firmnessPercent  optional 0-100, renders the firmness bar when present
 *  - linkTo          internal route (react-router) -- use this for real products
 *  - href            external/absolute link -- use instead of linkTo when needed
 *  - linkLabel       defaults to "View details →"
 */
export default function MattressCard({
  name,
  image,
  imageAlt,
  tag,
  description,
  price,
  firmnessPercent,
  linkTo,
  href,
  linkLabel = 'View details →',
}) {
  const LinkTag = linkTo ? Link : 'a';
  const linkProps = linkTo ? { to: linkTo } : { href };

  return (
    <div className="mcard">
      <div className="ph">
        {image ? <img src={image} alt={imageAlt || name} /> : null}
      </div>
      {tag && <span className="tag">{tag}</span>}
      <div className="info">
        <h3>{name}</h3>
        {firmnessPercent !== undefined && <FirmnessBar percent={firmnessPercent} />}
        {description && <p>{description}</p>}
        {price && <span className="price">{price}</span>}
        {(linkTo || href) && (
          <>
            <br />
            <LinkTag className="rowlink" {...linkProps}>{linkLabel}</LinkTag>
          </>
        )}
      </div>
    </div>
  );
}
