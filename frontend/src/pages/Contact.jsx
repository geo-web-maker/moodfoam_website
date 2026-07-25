import { useState } from 'react';
import { sendContactMessage } from '../api';
import WhatsAppButton from '../components/WhatsAppButton';
import './Contact.css';

const initialForm = { name: '', phone: '', email: '', message: '' };

// NOTE: these answers are placeholder copy carried over from the design
// reference (delivery windows, warranty years, payment methods) -- confirm
// the real figures before this goes live. See REPLACE-GUIDE.md §5.
const FAQ = [
  { q: 'How long does delivery take?', a: '2\u20134 days within Kampala, 5\u20138 days upcountry. Bulk hotel orders are scheduled after a site visit.', defaultOpen: true },
  { q: 'Can I get a custom size?', a: "Yes \u2014 send your exact dimensions on WhatsApp and we'll confirm price before you order." },
  { q: 'Do you offer a warranty?', a: 'Yes, warranty length depends on the model \u2014 details are on each product page.' },
  { q: 'How do I pay?', a: 'Mobile money, bank transfer, or cash on delivery for orders within Kampala.' },
];

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await sendContactMessage(form);
      setStatus('sent');
      setForm(initialForm);
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <section className="page-head">
        <div className="container">
          <span className="eyebrow">Get in touch</span>
          <h1>Questions about sizes, firmness, or bulk orders?</h1>
          <p>Most people reach us on WhatsApp for a same-day quote. For anything else, use the form or the details below.</p>
        </div>
      </section>

      <section className="contact">
        <div className="container contact__grid">
          <div>
            <div className="contact__cards">
              <a className="contact__card" href="tel:+256743053096">
                <span className="contact__card-label">Call / WhatsApp</span>
                <strong>0743 053096</strong>
              </a>
              <a className="contact__card" href="tel:+256764573341">
                <span className="contact__card-label">Alt. Phone</span>
                <strong>0764 573341</strong>
              </a>
              <a className="contact__card contact__card--wide" href="mailto:busujjuindustries@gmail.com">
                <span className="contact__card-label">Email</span>
                <strong>busujjuindustries@gmail.com</strong>
              </a>
              <div className="contact__card contact__card--wide">
                <span className="contact__card-label">Factory &amp; Showroom</span>
                <strong>Nalugazi LC, Naama Central, Mityana District, Uganda</strong>
              </div>
            </div>

            <div className="contact__map">
              <iframe
                title="Mood Foam Mattresses location"
                src="https://www.google.com/maps?q=Busujju+Industries+Ltd-Mood+Foam+Mattresses,0.4156404,31.986321&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="contact__whatsapp">
              <strong>Fastest way to reach us</strong>
              <p>Send your room size and preferred firmness \u2014 we&rsquo;ll reply with pricing and delivery time the same day.</p>
              <WhatsAppButton
                className="btn btn--gold btn--block"
                message="Hi Mood Foam, I have a question."
              >
                Message us on WhatsApp
              </WhatsAppButton>
            </div>
          </div>

          <div>
            <form className="contact__form" onSubmit={handleSubmit}>
              <h2>Send a message</h2>
              <label>
                Name
                <input name="name" required placeholder="Your full name" value={form.name} onChange={handleChange} />
              </label>
              <label>
                Phone
                <input name="phone" placeholder="07XX XXX XXX" value={form.phone} onChange={handleChange} />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  required
                  placeholder="Tell us the room size, firmness preference, or your question."
                  value={form.message}
                  onChange={handleChange}
                />
                <span className="hint">For urgent orders, WhatsApp is faster than this form.</span>
              </label>

              <button className="btn btn--coral btn--block" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending\u2026' : 'Send message'}
              </button>

              {status === 'sent' && <p className="contact__status contact__status--ok">Message sent \u2014 we&rsquo;ll be in touch soon.</p>}
              {status === 'error' && <p className="contact__status contact__status--error">Something went wrong. Please try WhatsApp or call us instead.</p>}
            </form>

            <div className="faq">
              {FAQ.map(({ q, a, defaultOpen }) => (
                <details key={q} open={defaultOpen || undefined}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
