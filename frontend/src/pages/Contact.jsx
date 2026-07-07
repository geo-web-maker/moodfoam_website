import { useState } from 'react';
import { sendContactMessage } from '../api';
import WhatsAppButton from '../components/WhatsAppButton';
import './Contact.css';

const initialForm = { name: '', phone: '', email: '', message: '' };

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
    <section className="section contact">
      <div className="container contact__grid">
        <div className="contact__intro">
          <span className="eyebrow">Get In Touch</span>
          <h1>Contact Us</h1>
          <p>
            Have a question about sizes, bulk orders, or delivery? We're happy to help.
          </p>
        </div>
        
        <div className="contact__details">
          <div className="contact__cards">
            <a className="contact__card" href="tel:+256743053096">
              <span className="contact__card-label">Call / WhatsApp</span>
              <strong>0743 053096</strong>
            </a>
            <a className="contact__card" href="tel:+256764573341">
              <span className="contact__card-label">Alt. Phone</span>
              <strong>0764 573341</strong>
            </a>
            <a className="contact__card" href="mailto:busujjuindustries@gmail.com">
              <span className="contact__card-label">Email</span>
              <strong>busujjuindustries@gmail.com</strong>
            </a>
            <div className="contact__card">
              <span className="contact__card-label">Factory & Showroom</span>
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
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          <h2>Send a message</h2>
          <label>
            Name
            <input name="name" required value={form.name} onChange={handleChange} />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </label>
          <label>
            Message
            <textarea name="message" required rows={5} value={form.message} onChange={handleChange} />
          </label>

          <button className="btn btn--coral btn--block" type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send Message'}
          </button>

          {status === 'sent' && <p className="contact__status contact__status--ok">Message sent -- we'll be in touch soon.</p>}
          {status === 'error' && <p className="contact__status contact__status--error">Something went wrong. Please try WhatsApp or call us instead.</p>}

          <WhatsAppButton
            className="btn btn--coral contact__whatsapp"
            message="Hi Mood Foam, I have a question."
          >
            Chat on WhatsApp instead
          </WhatsAppButton>
        </form>
      </div>
    </section>
  );
}
