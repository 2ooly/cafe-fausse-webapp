from datetime import datetime
import random
from typing import Optional
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError

from .database import SessionLocal, init_db
from .models import Customer, Reservation, NewsletterSubscription


TABLE_COUNT = 30
MAX_GUESTS_PER_TABLE = 10


def _parse_time_slot(raw_time_slot: str) -> datetime:
    """Parse a time slot value from the client."""
    if not raw_time_slot:
        raise ValueError("A reservation time is required.")

    try:
        return datetime.fromisoformat(raw_time_slot)
    except ValueError as exc:  # pragma: no cover - defensive branch
        raise ValueError("Please provide a valid date and time.") from exc


def _calculate_availability(session, time_slot: datetime) -> dict[str, int]:
    existing_bookings = session.execute(
        select(func.count(Reservation.id)).where(Reservation.time_slot == time_slot)
    ).scalar_one()

    available_tables = max(TABLE_COUNT - existing_bookings, 0)
    available_guests = available_tables * MAX_GUESTS_PER_TABLE

    return {"tables": available_tables, "guests": available_guests}


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    init_db()

    @app.teardown_appcontext
    def remove_session(exception: Optional[Exception] = None) -> None:  # pragma: no cover - cleanup
        SessionLocal.remove()

    @app.get('/api/health')
    def health_check():
        return jsonify({"status": "ok"})

    @app.post('/api/newsletter')
    def subscribe_newsletter():
        payload = request.get_json(silent=True) or {}
        email = (payload.get('email') or '').strip()

        if not email:
            return jsonify({"message": "Email address is required."}), 400

        session = SessionLocal()
        try:
            subscription = session.execute(
                select(NewsletterSubscription).where(NewsletterSubscription.email == email)
            ).scalar_one_or_none()

            if subscription is None:
                subscription = NewsletterSubscription(email=email)
                session.add(subscription)

            customer = session.execute(select(Customer).where(Customer.email == email)).scalar_one_or_none()
            if customer:
                customer.newsletter_signup = True

            session.commit()
            return jsonify({"message": "Subscription confirmed."}), 201
        except IntegrityError:
            session.rollback()
            return jsonify({"message": "You are already part of our newsletter."}), 200

    @app.post('/api/reservations')
    def create_reservation():
        payload = request.get_json(silent=True) or {}

        required_fields = {
            'timeSlot': 'A reservation time is required.',
            'guests': 'Please tell us how many guests will join.',
            'name': 'Please share the name for the reservation.',
            'email': 'An email address is required so we can confirm.'
        }

        for field, error_message in required_fields.items():
            if not payload.get(field):
                return jsonify({"message": error_message}), 400

        try:
            time_slot = _parse_time_slot(payload['timeSlot'])
        except ValueError as error:
            return jsonify({"message": str(error)}), 400

        if time_slot < datetime.utcnow():
            return jsonify({"message": "Reservations must be scheduled for a future time."}), 400

        guests = payload.get('guests')
        try:
            guests = int(guests)
        except (TypeError, ValueError):
            return jsonify({"message": "Please include the number of guests."}), 400

        if guests <= 0:
            return jsonify({"message": "The number of guests must be at least one."}), 400

        if guests > MAX_GUESTS_PER_TABLE:
            return jsonify({"message": f"We can host up to {MAX_GUESTS_PER_TABLE} guests per reservation."}), 400

        email = payload['email'].strip()
        name = payload['name'].strip()
        phone = (payload.get('phone') or '').strip()

        session = SessionLocal()
        try:
            availability = _calculate_availability(session, time_slot)

            if availability["tables"] <= 0:
                return jsonify({"message": "We are fully booked for that time."}), 409

            if guests > availability["guests"]:
                return (
                    jsonify(
                        {
                            "message": (
                                "We only have availability for "
                                f"{availability['guests']} guests at that time."
                            )
                        }
                    ),
                    409,
                )

            booked_tables = set(
                session.scalars(select(Reservation.table_number).where(Reservation.time_slot == time_slot)).all()
            )
            available_tables = [table for table in range(1, TABLE_COUNT + 1) if table not in booked_tables]

            if not available_tables:
                return jsonify({"message": "We are fully booked for that time."}), 409

            table_number = random.choice(available_tables)

            customer = session.execute(select(Customer).where(Customer.email == email)).scalar_one_or_none()
            if customer is None:
                customer = Customer(name=name, email=email, phone=phone, newsletter_signup=False)
                session.add(customer)
            else:
                customer.name = name
                customer.phone = phone or customer.phone

            reservation = Reservation(
                customer=customer,
                time_slot=time_slot,
                guests=guests,
                table_number=table_number
            )
            session.add(reservation)
            session.commit()

            return (
                jsonify(
                    {
                        "message": f"Your table is reserved! You will be seated at table {table_number}.",
                        "tableNumber": table_number,
                        "reservationId": reservation.id,
                        "timeSlot": reservation.time_slot.isoformat(),
                        "guests": reservation.guests,
                        "name": customer.name,
                        "email": customer.email,
                        "phone": customer.phone,
                    }
                ),
                201,
            )
        except IntegrityError:
            session.rollback()
            return jsonify({"message": "We are fully booked for that time."}), 409

    @app.get('/api/reservations/availability')
    def reservation_availability():
        raw_time_slot = request.args.get('timeSlot', '')

        try:
            time_slot = _parse_time_slot(raw_time_slot)
        except ValueError as error:
            return jsonify({"message": str(error)}), 400

        session = SessionLocal()

        availability = _calculate_availability(session, time_slot)

        return jsonify(
            {
                "availableGuests": availability["guests"],
                "availableTables": availability["tables"],
                "timeSlot": time_slot.isoformat(),
            }
        )

    return app


app = create_app()


if __name__ == '__main__':
    app.run(debug=True)
