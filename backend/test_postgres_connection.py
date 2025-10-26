"""Utility script to verify PostgreSQL connectivity for the Café Fausse backend."""
from __future__ import annotations

import os
import sys


import psycopg2
from psycopg2 import OperationalError

DEFAULT_DATABASE_URL = (
    "postgresql+psycopg2://moshax:skdmKAdhdaLAK05@127.0.0.1:5432/cafe_fausse"
)


def normalise_database_url(raw_url: str) -> str:
    """Convert SQLAlchemy URLs to a format psycopg2 understands."""
    if raw_url.startswith("postgresql+psycopg2://"):
        return raw_url.replace("postgresql+psycopg2://", "postgresql://", 1)
    if raw_url.startswith("postgres://"):
        return raw_url.replace("postgres://", "postgresql://", 1)
    return raw_url


def get_database_url() -> str:
    """Determine the database URL from the environment with a sensible default."""
    raw_url = os.environ.get("DATABASE_URL", DEFAULT_DATABASE_URL)
    return normalise_database_url(raw_url)


def main() -> int:
    database_url = get_database_url()
    version: tuple[str, ...] | None = None

    try:
        with psycopg2.connect(database_url) as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT version();")
                version = cursor.fetchone()
    except OperationalError as exc:  # pragma: no cover - manual utility
        print("Failed to connect to PostgreSQL:")
        print(exc)
        return 1

    print("Successfully connected to PostgreSQL.")
    if version:
        print(f"Server version: {version[0]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
