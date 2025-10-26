import { useEffect, useState } from 'react';
import api from '../lib/api';

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
  const [availability, setAvailability] = useState({
    guests: null,
    tables: null,
    isLoading: false,
    message: ''
  });
  const [reservationDetails, setReservationDetails] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    const requestedGuests = Number(form.guests);

    if (availability.guests !== null && requestedGuests > availability.guests) {
      setStatus({
        type: 'error',
        message: `We only have availability for ${availability.guests} guests at this time.`
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await api.post('/api/reservations', {
        timeSlot: form.timeSlot,
        guests: requestedGuests,
        name: form.name,
        email: form.email,
        phone: form.phone
      });
      setReservationDetails(data);
      setStatus({ type: 'success', message: data.message });
      setForm(createInitialForm());
    } catch (error) {
      const message = error.response?.data?.message || 'This time slot is no longer available.';
      setStatus({ type: 'error', message });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let isSubscribed = true;

    if (!form.timeSlot) {
      setAvailability({ guests: null, tables: null, isLoading: false, message: '' });
      return undefined;
    }

    setAvailability((prev) => ({ ...prev, isLoading: true, message: '' }));

    api
      .get('/api/reservations/availability', {
        params: { timeSlot: form.timeSlot }
      })
      .then(({ data }) => {
        if (!isSubscribed) {
          return;
        }

        setAvailability({
          guests: data.availableGuests,
          tables: data.availableTables,
          isLoading: false,
          message: ''
        });
      })
      .catch((error) => {
        if (!isSubscribed) {
          return;
        }

        const message =
          error.response?.data?.message || 'We could not determine availability. Please try again.';

        setAvailability({ guests: null, tables: null, isLoading: false, message });
      });

    return () => {
      isSubscribed = false;
    };
  }, [form.timeSlot]);

  return (
    <div className="page reservations">
      <header className="page-header">
        <h1>Reserve Your Evening</h1>
        <p>Secure an unforgettable dining experience with Café Fausse.</p>
      </header>

      {!reservationDetails && (
        <form className="reservation-form" onSubmit={handleSubmit}>
          {status.type === 'error' && <p className="status-error">{status.message}</p>}

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

          {availability.isLoading && <p className="status-info">Checking availability…</p>}
          {availability.guests !== null && !availability.isLoading && (
            <p className="status-info">
              Available for up to <strong>{availability.guests}</strong> guests (
              {availability.tables} {availability.tables === 1 ? 'table' : 'tables'} remaining)
            </p>
          )}
          {availability.message && !availability.isLoading && (
            <p className="status-error">{availability.message}</p>
          )}

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
          {availability.guests !== null && Number(form.guests) > availability.guests && (
            <p className="status-error">
              Please reduce your party size to {availability.guests} guests or choose another time.
            </p>
          )}

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
      )}

      {reservationDetails && (
        <section className="reservation-confirmation">
          <h2>Reservation Confirmed</h2>
          <p className="status-success">{reservationDetails.message}</p>
          <ul>
            <li>
              <strong>Reservation ID:</strong> {reservationDetails.reservationId}
            </li>
            <li>
              <strong>Name:</strong> {reservationDetails.name}
            </li>
            <li>
              <strong>Email:</strong> {reservationDetails.email}
            </li>
            {reservationDetails.phone && (
              <li>
                <strong>Phone:</strong> {reservationDetails.phone}
              </li>
            )}
            <li>
              <strong>Time:</strong>{' '}
              {reservationDetails.timeSlot
                ? new Date(reservationDetails.timeSlot).toLocaleString()
                : ''}
            </li>
            <li>
              <strong>Guests:</strong> {reservationDetails.guests}
            </li>
            <li>
              <strong>Table Number:</strong> {reservationDetails.tableNumber}
            </li>
          </ul>
        </section>
      )}
    </div>
  );
}
