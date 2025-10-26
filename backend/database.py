import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base
from dotenv import load_dotenv, find_dotenv


# Load environment from the nearest .env if present (works with flask run and systemd)
_found = find_dotenv(usecwd=True)
if _found:
    load_dotenv(_found)

# Also attempt backend/.env relative to this file for robustness
_backend_env = Path(__file__).resolve().parent / '.env'
if _backend_env.exists():
    load_dotenv(_backend_env.as_posix(), override=False)

# Fallback DSN uses IPv4 loopback to avoid localhost/IPv6/socket surprises
DATABASE_URL = os.environ.get('DATABASE_URL') or 'postgresql+psycopg2://postgres:moshax@127.0.0.1:5432/cafe_fausse'
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql+psycopg2://', 1)
connect_args: dict[str, object] = {}
if DATABASE_URL.startswith('sqlite'):
    connect_args['check_same_thread'] = False

engine = create_engine(DATABASE_URL, future=True, pool_pre_ping=True, connect_args=connect_args)
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True))
Base = declarative_base()


def init_db() -> None:
    from . import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
