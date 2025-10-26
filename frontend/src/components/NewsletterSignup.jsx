import { useState } from 'react';
import api from '../lib/api';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!email) {
      setStatus({ type: 'error', message: 'Please enter your email address.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/newsletter', { email });
      setStatus({ type: 'success', message: 'You are on the list! Expect refined experiences soon.' });
      setEmail('');
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to complete sign up. Please try again later.';
      setStatus({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="newsletter">
      <h2>Join Our Inner Circle</h2>
      <p>Receive seasonal menus, wine pairings, and exclusive tasting events directly in your inbox.</p>
      <form onSubmit={handleSubmit} className="newsletter-form">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-label="Email address"
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Notify Me'}
        </button>
      </form>
      {status.message && (
        <p className={status.type === 'success' ? 'status-success' : 'status-error'}>{status.message}</p>
      )}
    </section>
  );
}
