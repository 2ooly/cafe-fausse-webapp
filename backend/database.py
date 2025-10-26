import os
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base


DATABASE_URL = os.environ.get('DATABASE_URL') or 'postgresql+psycopg2://moshax:skdmKAdhdaLAK05@localhost:5432/cafe_fausse'
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql+psycopg2://', 1)
print(DATABASE_URL)
connect_args: dict[str, object] = {}
if DATABASE_URL.startswith('sqlite'):
    connect_args['check_same_thread'] = False

engine = create_engine(DATABASE_URL, future=True, pool_pre_ping=True, connect_args=connect_args)
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True))
Base = declarative_base()


def init_db() -> None:
    from . import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
