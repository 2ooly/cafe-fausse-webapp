# Café Fausse Web Application

This repository implements the Café Fausse web experience defined in the software requirements specification. It contains a React single-page application for the guest-facing website and a Flask API that powers reservations and newsletter sign ups.

## Project Structure

```
.
├── backend/              # Flask application and database models
├── frontend/             # Vite + React client
├── WebApplicationPresentation.pdf
└── MSEE_Web_Application_and_Interface_Design_Cafe_Fausse_SRS.pdf
```

> Original image assets referenced in the brief are not committed to this repository to comply with binary-file restrictions. The
> React client instead sources descriptive placeholder imagery from [placehold.co](https://placehold.co/).

## Features

- Elegant, responsive layout with dedicated views for Home, Menu, Reservations, About Us, and Gallery pages.
- Menu content, awards, and critic reviews that match the specification.
- Reservation form with validation, random table assignment, and overbooking protection.
- Newsletter registration persisted via the API.
- Lightbox gallery featuring descriptive placeholder imagery when the original assets are unavailable.

## Getting Started

### Prerequisites

- **Node.js** (v18 or newer) and **npm** for the front-end.
- **Python 3.11+** for the back-end.
- **PostgreSQL 14+** (a local instance is sufficient).

> If PostgreSQL is not available, you can temporarily point the `DATABASE_URL` to a SQLite file for development. The schema and SQLAlchemy models are fully compatible.

### Environment Variables

Create a `.env` file in the `backend/` directory (or export the variables in your shell) with your database connection string:

```
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/cafe_fausse
FLASK_ENV=development
```

### Back-end Setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
flask --app backend.app:app run
```

The server starts on [http://localhost:5000](http://localhost:5000) and exposes the following endpoints:

- `POST /api/reservations` — create a reservation, assigning one of 30 tables at random when available.
- `POST /api/newsletter` — add an email address to the marketing list.
- `GET /api/health` — quick status check used by deployment tooling.

### Front-end Setup

```bash
cd frontend
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to explore the application. During development, API calls are proxied to the Flask server automatically.

### Database Schema

Two core tables are used to satisfy the requirements:

- `customers` — Stores guest contact information and newsletter preferences.
- `reservations` — Tracks bookings, linked to `customers` with a unique constraint on time slot and table number.

A supporting `newsletter_subscriptions` table captures marketing opt-ins that arrive outside of the reservation flow.

To initialise the schema manually you can run the Flask app once or execute the following snippet in a Python shell:

```python
from backend.database import init_db
init_db()
```

## Testing the API Quickly

With the servers running, you can use `curl` to verify behaviour:

```bash
curl -X POST http://localhost:5000/api/newsletter \
  -H 'Content-Type: application/json' \
  -d '{"email": "guest@example.com"}'

curl -X POST http://localhost:5000/api/reservations \
  -H 'Content-Type: application/json' \
  -d '{"timeSlot": "2025-12-01T18:00", "guests": 2, "name": "Guest", "email": "guest@example.com"}'
```

## Accessibility & Responsiveness

- Semantic HTML and accessible roles for the gallery lightbox.
- Keyboard-friendly interactions and prominent focus states.
- Layout built with responsive CSS grid and flex utilities tested down to 375px viewport widths.

## Deployment Notes

1. Set the `DATABASE_URL` environment variable in your hosting platform.
2. Install dependencies using `pip install -r backend/requirements.txt`.
3. Serve the Flask app (e.g., via Gunicorn or a platform worker process).
4. Build the React site with `npm run build` and serve the generated static assets (`frontend/dist/`).
5. Configure the front-end host to proxy `/api/*` requests to the Flask app or update the API base URL in the React code for production builds.

## License

The provided PDF documents remain the property of the course authors. Application code is released for educational purposes.
