"""User entity — framework-agnostic data representation."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional


@dataclass
class UserEntity:
    """Pure domain representation of a user.

    This object is passed between layers and never touches the ORM
    directly.  Repositories convert ORM rows ↔ UserEntity.
    """

    id: str
    username: str
    email: str
    role: str = "user"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    # password_hash is intentionally excluded from __repr__ / to_dict
    password_hash: str = field(default="", repr=False)

    def to_dict(self) -> dict:
        """Return a JSON-safe dictionary of *public* user fields."""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
