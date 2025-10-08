from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from .database import Base


class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Customer(Base, TimestampMixin):
    __tablename__ = 'customers'

    id = Column(Integer, primary_key=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    phone = Column(String(40))
    newsletter_signup = Column(Boolean, default=False)

    reservations = relationship('Reservation', back_populates='customer', cascade='all, delete-orphan')


class Reservation(Base, TimestampMixin):
    __tablename__ = 'reservations'
    __table_args__ = (UniqueConstraint('time_slot', 'table_number', name='uq_time_slot_table'),)

    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False)
    time_slot = Column(DateTime, nullable=False)
    guests = Column(Integer, nullable=False)
    table_number = Column(Integer, nullable=False)

    customer = relationship('Customer', back_populates='reservations')


class NewsletterSubscription(Base, TimestampMixin):
    __tablename__ = 'newsletter_subscriptions'

    id = Column(Integer, primary_key=True)
    email = Column(String(255), nullable=False, unique=True)
