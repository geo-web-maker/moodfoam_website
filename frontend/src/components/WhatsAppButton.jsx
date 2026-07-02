import { useEffect, useState } from 'react';
import { getConfig } from '../api';

let cachedNumber = null;

export function useWhatsAppNumber() {
  const [number, setNumber] = useState(cachedNumber);

  useEffect(() => {
    if (cachedNumber) return;
    getConfig()
      .then((cfg) => {
        cachedNumber = cfg.whatsapp_number;
        setNumber(cfg.whatsapp_number);
      })
      .catch(() => setNumber('256743053096'));
  }, []);

  return number;
}

export function whatsAppLink(number, message) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export default function WhatsAppButton({ message, className = 'btn btn--coral', children }) {
  const number = useWhatsAppNumber();
  if (!number) return null;
  return (
    <a
      className={className}
      href={whatsAppLink(number, message)}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children || 'Order on WhatsApp'}
    </a>
  );
}
