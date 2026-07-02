import WhatsAppButton from '../components/WhatsAppButton';
import './About.css';

const VALUES = ['Integrity', 'Team Work', 'Quality & Consistency', 'Customer Centricity', 'Commitment'];

const GOALS = [
  { title: 'Market Leadership', body: 'Become a top mattress brand through superior products and experiences.' },
  { title: 'Customer Satisfaction', body: 'Achieve high ratings via quality products and excellent service.' },
  { title: 'Innovation', body: 'Develop and launch new products that meet evolving customer needs.' },
  { title: 'Growth', body: 'Increase revenue and expand distribution, making Mood Foam accessible to all.' },
];

const CUSTOMIZATION = [
  { title: 'Size & Dimensions', body: 'Custom sizes built to your unique requirements.' },
  { title: 'Firmness Levels', body: 'Diverse options from plush comfort to orthopedic support.' },
  { title: 'Material Composition', body: 'A choice of foam, springs and fabrics for durability, hygiene and comfort.' },
  { title: 'Special Features', body: 'Waterproofing, anti-microbial treatments, fire retardancy and enhanced ventilation.' },
];

const SECTORS = [
  { title: 'Healthcare Facilities', body: 'Hygienic, durable, comfortable mattresses for patient care.' },
  { title: 'Academic Institutions', body: 'Robust mattresses built for student dormitories.' },
  { title: 'Hospitality Establishments', body: 'Superior sleep experiences that lift guest satisfaction.' },
  { title: 'Private & Public Organizations', body: 'Bulk mattress solutions for staff accommodation or specialized needs.' },
  { title: 'Wholesalers', body: "We grow together." },
];

export default function About() {
  return (
    <>
      <section className="section about-hero">
        <div className="container about-hero__grid">
          <div>
            <span className="eyebrow">About Us</span>
            <h1>Busujju Industries Limited</h1>
            <p>
              A Ugandan manufacturing company producing high-quality mattresses under the Mood
              Foam brand. We combine advanced production technology with sustainable practices
              to deliver mattresses, beds, sofas and cushions that improve how people rest --
              built for affordability, timely delivery, and national pride.
            </p>
            <p>
              Through institutional partnerships and our "Rest for All" community programme, we
              promote sustainable practices and social impact, backed by a robust supply chain
              and a professional workforce.
            </p>
          </div>
          <div className="about-hero__stats">
            <div className="about-hero__stat">
              <strong>14+</strong>
              <span>Product lines manufactured</span>
            </div>
            <div className="about-hero__stat">
              <strong>Mityana</strong>
              <span>Uganda-based factory & showroom</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container about-foundation">
          <article className="about-foundation__card">
            <span className="eyebrow">Vision</span>
            <p>To be the leading quality foam manufacturer for every household in East and Central Africa.</p>
          </article>
          <article className="about-foundation__card">
            <span className="eyebrow">Mission</span>
            <p>
              To design and manufacture high-quality, innovative sleep solutions that provide
              comfortable, durable and affordable products -- while prioritizing environmental
              sustainability and creating value for our stakeholders and communities.
            </p>
          </article>
          <article className="about-foundation__card">
            <span className="eyebrow">Values</span>
            <ul className="about-values">
              {VALUES.map((v) => <li key={v}>{v}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Driving Excellence</span>
            <h2>Our goals</h2>
          </div>
          <div className="grid grid--cards about-goals">
            {GOALS.map((g) => (
              <div className="card about-goal" key={g.title}>
                <h3>{g.title}</h3>
                <p>{g.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow eyebrow--on-ink">For Institutions</span>
            <h2>Tailored sleep solutions for every institution</h2>
            <p>
              We manufacture every mattress type and category, perfect for healthcare, academic,
              hospitality, private and public organizations -- with full customization and
              branding.
            </p>
          </div>

          <h3 className="about-subheading">Customization options</h3>
          <div className="grid grid--cards about-institution-grid">
            {CUSTOMIZATION.map((c) => (
              <div key={c.title} className="about-institution-item">
                <h4>{c.title}</h4>
                <p>{c.body}</p>
              </div>
            ))}
          </div>

          <h3 className="about-subheading">Branding opportunities</h3>
          <p className="about-branding-copy">
            Reinforce your identity by incorporating your organization's logo, colours or design
            elements directly onto mattresses or packaging -- elevating your brand with every
            sleep experience.
          </p>

          <h3 className="about-subheading">Partnering across sectors</h3>
          <div className="grid grid--cards about-institution-grid">
            {SECTORS.map((s) => (
              <div key={s.title} className="about-institution-item">
                <h4>{s.title}</h4>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container about-cta">
          <h2>Have an institutional order in mind?</h2>
          <WhatsAppButton message="Hi Mood Foam, I'd like to discuss an institutional / bulk order.">
            Discuss Your Requirements
          </WhatsAppButton>
        </div>
      </section>
    </>
  );
}
