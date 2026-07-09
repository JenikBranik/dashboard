"""Event repository — all database operations for calendar events.

This is the *only* place that imports EventModel and executes queries.
Every other layer works with :class:`EventEntity`.
"""

from __future__ import annotations

from typing import Optional
from datetime import datetime

from app.client.database.models import EventModel
from app.core.entities.event import EventEntity
from app.extensions import db


class EventRepository:
    """Repository pattern implementation for Event persistence."""

    # ── Queries ─────────────────────────────────────────────────

    @staticmethod
    def find_by_user(user_id: str, start: Optional[str] = None, end: Optional[str] = None) -> list[EventEntity]:
        """Return all events for a specific user, optionally filtered by date range."""
        import uuid
        try:
            user_uuid = uuid.UUID(user_id)
        except ValueError:
            return []

        query = EventModel.query.filter_by(user_id=user_uuid)

        if start:
            query = query.filter(EventModel.start >= datetime.fromisoformat(start))
        if end:
            query = query.filter(EventModel.start <= datetime.fromisoformat(end))

        rows = query.order_by(EventModel.start).all()
        return [EventRepository._to_entity(row) for row in rows]

    @staticmethod
    def find_by_id(event_id: str) -> Optional[EventEntity]:
        """Return a single event by primary key, or None."""
        import uuid
        try:
            event_uuid = uuid.UUID(event_id)
        except ValueError:
            return None
        row = EventModel.query.filter_by(id=event_uuid).first()
        return EventRepository._to_entity(row) if row else None

    # ── Commands ────────────────────────────────────────────────

    @staticmethod
    def create(user_id: str, title: str, start: datetime,
               end: Optional[datetime] = None, all_day: bool = False,
               color: Optional[str] = None) -> EventEntity:
        """Persist a new event and return the created entity."""
        import uuid
        row = EventModel(
            user_id=uuid.UUID(user_id),
            title=title,
            start=start,
            end=end,
            all_day=all_day,
            color=color,
        )
        db.session.add(row)
        db.session.commit()
        return EventRepository._to_entity(row)

    @staticmethod
    def update(event_id: str, **kwargs) -> Optional[EventEntity]:
        """Update an existing event. Returns updated entity or None."""
        import uuid
        try:
            event_uuid = uuid.UUID(event_id)
        except ValueError:
            return None
        row = EventModel.query.filter_by(id=event_uuid).first()
        if not row:
            return None

        for key, value in kwargs.items():
            if hasattr(row, key) and value is not None:
                setattr(row, key, value)

        db.session.commit()
        return EventRepository._to_entity(row)

    @staticmethod
    def delete(event_id: str, user_id: str) -> bool:
        """Delete an event. Returns True if deleted, False otherwise."""
        import uuid
        try:
            event_uuid = uuid.UUID(event_id)
            user_uuid = uuid.UUID(user_id)
        except ValueError:
            return False
        row = EventModel.query.filter_by(id=event_uuid, user_id=user_uuid).first()
        if not row:
            return False
        db.session.delete(row)
        db.session.commit()
        return True

    # ── Mapping ─────────────────────────────────────────────────

    @staticmethod
    def _to_entity(row: EventModel) -> EventEntity:
        """Convert an ORM row into a domain entity."""
        return EventEntity(
            id=str(row.id),
            user_id=str(row.user_id),
            title=row.title,
            start=row.start,
            end=row.end,
            all_day=row.all_day,
            color=row.color,
            created_at=row.created_at,
        )
