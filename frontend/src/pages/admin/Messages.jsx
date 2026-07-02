import { useEffect, useState } from 'react';
import { getContactMessages, markMessageRead, deleteContactMessage } from '../../api';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getContactMessages().then(setMessages).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleRead = async (id) => {
    await markMessageRead(id);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    await deleteContactMessage(id);
    load();
  };

  return (
    <>
      <div className="admin__header">
        <div>
          <h1>Messages</h1>
          <p>Submissions from the site's contact form.</p>
        </div>
      </div>

      {loading ? (
        <p className="state-message">Loading&hellip;</p>
      ) : messages.length === 0 ? (
        <div className="admin-empty">No messages yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map((m) => (
            <div key={m.id} className="card" style={{ padding: 20, opacity: m.is_read ? 0.7 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <strong>{m.name}</strong>{' '}
                  {!m.is_read && <span className="badge" style={{ marginLeft: 8 }}>New</span>}
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {[m.phone, m.email].filter(Boolean).join(' · ')} &middot;{' '}
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {!m.is_read && (
                    <button className="btn btn--outline btn--sm" onClick={() => handleRead(m.id)}>Mark read</button>
                  )}
                  <button className="btn btn--danger btn--sm" onClick={() => handleDelete(m.id)}>Delete</button>
                </div>
              </div>
              <p style={{ marginTop: 12, marginBottom: 0, color: 'var(--text)' }}>{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
