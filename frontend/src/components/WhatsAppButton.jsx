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

function WhatsAppIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.47 14.38c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.2.29-.76.94-.93 1.14-.17.2-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.76-1.44-1.7-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.08-.15-.66-1.59-.9-2.18-.24-.57-.48-.5-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43 0 1.44 1.05 2.83 1.19 3.02.15.2 2.06 3.15 5 4.42.7.3 1.24.48 1.67.61.7.22 1.34.19 1.84.12.56-.08 1.73-.71 1.98-1.39.24-.68.24-1.27.17-1.39-.07-.13-.27-.2-.56-.35z" />
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.5 0 .17 5.33.17 11.9c0 2.1.55 4.14 1.6 5.94L0 24l6.32-1.65a11.87 11.87 0 0 0 5.71 1.45h.01c6.53 0 11.86-5.33 11.86-11.9 0-3.18-1.24-6.16-3.38-8.42zM12.04 21.78h-.01a9.85 9.85 0 0 1-5.03-1.38l-.36-.21-3.75.98 1-3.65-.23-.38a9.86 9.86 0 0 1-1.51-5.24c0-5.46 4.45-9.9 9.92-9.9 2.65 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 6.99c0 5.47-4.45 9.9-9.93 9.9z" />
    </svg>
  );
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
      <WhatsappIcon />
      {children || 'Order on WhatsApp'}
    </a>
  );
}
