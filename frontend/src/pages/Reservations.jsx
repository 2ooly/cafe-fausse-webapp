import { useState } from 'react';
import axios from 'axios';

const createInitialForm = () => ({
  timeSlot: '',
  guests: 2,
  name: '',
  email: '',
  phone: ''
});

export default function Reservations() {
  const [form, setForm] = useState(createInitialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const { data } = await axios.post('/api/reservations', {
        timeSlot: form.timeSlot,
        guests: Number(form.guests),
        name: form.name,
        email: form.email,
        phone: form.phone
      });
      setStatus({ type: 'success', message: data.message });
      setForm(createInitialForm());
    } catch (error) {
      const message = error.response?.data?.message || 'This time slot is no longer available.';
      setStatus({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page reservations">
      <header className="page-header">
        <h1>Reserve Your Evening</h1>
        <p>Secure an unforgettable dining experience with Café Fausse.</p>
      </header>

      <form className="reservation-form" onSubmit={handleSubmit}>
        <label>
          Time Slot
          <input
            type="datetime-local"
            name="timeSlot"
            value={form.timeSlot}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Number of Guests
          <input
            type="number"
            name="guests"
            min="1"
            max="10"
            value={form.guests}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Name
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Phone (optional)
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} />
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Checking availability…' : 'Book Table'}
        </button>
      </form>

      {status.message && (
        <p className={status.type === 'success' ? 'status-success' : 'status-error'}>{status.message}</p>
      )}
    </div>
  );
}
