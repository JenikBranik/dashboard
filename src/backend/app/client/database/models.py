"""SQLAlchemy ORM models.

These are *infrastructure* objects tied to the database schema.
The rest of the application communicates via entity dataclasses —
repositories handle the conversion.
"""

import uuid
from datetime import datetime, timezone

import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID as PG_UUID

from app.extensions import db


# ── Dialect-aware UUID column type ──────────────────────────────
# Uses native PostgreSQL UUID in production, CHAR(36) on SQLite.

class GUID(sa.types.TypeDecorator):
    """Platform-independent UUID type."""
    impl = sa.types.CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        return dialect.type_descriptor(sa.types.CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if dialect.name == "postgresql":
            return value if isinstance(value, uuid.UUID) else uuid.UUID(value)
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if not isinstance(value, uuid.UUID):
            return uuid.UUID(value)
        return value


class UserModel(db.Model):
    """Persistent representation of a user."""

    __tablename__ = "users"

    id = db.Column(GUID(), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="user")
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    events = db.relationship("EventModel", backref="owner", lazy="dynamic")

    def __repr__(self) -> str:
        return f"<UserModel {self.username!r}>"


class EventModel(db.Model):
    """Persistent representation of a calendar event."""

    __tablename__ = "events"

    id = db.Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(GUID(), db.ForeignKey("users.id"), nullable=False, index=True)
    title = db.Column(db.String(200), nullable=False)
    start = db.Column(db.DateTime(timezone=True), nullable=False)
    end = db.Column(db.DateTime(timezone=True), nullable=True)
    all_day = db.Column(db.Boolean, default=False)
    color = db.Column(db.String(20), nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    def __repr__(self) -> str:
        return f"<EventModel {self.title!r}>"

