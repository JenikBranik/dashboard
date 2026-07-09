"""Event entity — framework-agnostic data representation."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class EventEntity:
    """Pure domain representation of a calendar event.

    Repositories convert ORM rows ↔ EventEntity.
    """

    id: str
    user_id: str
    title: str
    start: datetime
    end: Optional[datetime] = None
    all_day: bool = False
    color: Optional[str] = None
    created_at: Optional[datetime] = None

    def to_dict(self) -> dict:
        """Return a JSON-safe dictionary for the frontend / FullCalendar."""
        result = {
            "id": self.id,
            "title": self.title,
            "start": self.start.isoformat(),
            "allDay": self.all_day,
        }
        if self.end:
            result["end"] = self.end.isoformat()
        if self.color:
            result["color"] = self.color
        return result
