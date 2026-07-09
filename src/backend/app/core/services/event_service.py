"""Event service — business logic for calendar events."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from app.client.database.event_repository import EventRepository
from app.core.entities.event import EventEntity


class EventService:
    """Orchestrates event operations between controller and repository."""

    def __init__(self, event_repository: EventRepository | None = None):
        self._repo = event_repository or EventRepository()

    def list_events(self, user_id: str, start: Optional[str] = None,
                    end: Optional[str] = None) -> list[EventEntity]:
        """Return all events for a user, optionally within a date range."""
        return self._repo.find_by_user(user_id, start=start, end=end)

    def create_event(self, user_id: str, title: str, start: str,
                     end: Optional[str] = None, all_day: bool = False,
                     color: Optional[str] = None) -> EventEntity:
        """Validate and create a new event."""
        if not title or not title.strip():
            raise ValueError("Event title is required.")
        if not start:
            raise ValueError("Event start date is required.")

        start_dt = datetime.fromisoformat(start)
        end_dt = datetime.fromisoformat(end) if end else None

        return self._repo.create(
            user_id=user_id,
            title=title.strip(),
            start=start_dt,
            end=end_dt,
            all_day=all_day,
            color=color,
        )

    def update_event(self, event_id: str, user_id: str, **kwargs) -> EventEntity:
        """Update an event after verifying ownership."""
        event = self._repo.find_by_id(event_id)
        if not event:
            raise ValueError("Event not found.")
        if event.user_id != user_id:
            raise PermissionError("You do not own this event.")

        # Convert ISO strings to datetime objects if present
        update_data = {}
        for key, value in kwargs.items():
            if key in ("start", "end") and value:
                update_data[key] = datetime.fromisoformat(value)
            elif value is not None:
                update_data[key] = value

        updated = self._repo.update(event_id, **update_data)
        if not updated:
            raise ValueError("Failed to update event.")
        return updated

    def delete_event(self, event_id: str, user_id: str) -> None:
        """Delete an event after verifying ownership."""
        event = self._repo.find_by_id(event_id)
        if not event:
            raise ValueError("Event not found.")
        if event.user_id != user_id:
            raise PermissionError("You do not own this event.")

        deleted = self._repo.delete(event_id, user_id)
        if not deleted:
            raise ValueError("Failed to delete event.")
