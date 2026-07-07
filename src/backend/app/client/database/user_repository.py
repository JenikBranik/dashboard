"""User repository — all database operations for the User entity.

This is the *only* place in the codebase that imports the ORM model
and executes queries.  Every other layer works with :class:`UserEntity`.
"""

from __future__ import annotations

from typing import Optional

from app.client.database.models import UserModel
from app.core.entities.user import UserEntity
from app.extensions import db


class UserRepository:
    """Repository pattern implementation for User persistence."""

    # ── Queries ─────────────────────────────────────────────────

    @staticmethod
    def find_by_email(email: str) -> Optional[UserEntity]:
        """Return a UserEntity if the email exists, else ``None``."""
        row = UserModel.query.filter_by(email=email).first()
        return UserRepository._to_entity(row) if row else None

    @staticmethod
    def find_by_id(user_id: str) -> Optional[UserEntity]:
        """Return a UserEntity by primary key, or ``None``."""
        import uuid
        try:
            user_uuid = uuid.UUID(user_id)
        except ValueError:
            return None
        row = UserModel.query.filter_by(id=user_uuid).first()
        return UserRepository._to_entity(row) if row else None

    # ── Commands ────────────────────────────────────────────────

    @staticmethod
    def create(username: str, email: str, password_hash: str) -> UserEntity:
        """Persist a new user and return the created entity."""
        row = UserModel(
            username=username,
            email=email,
            password_hash=password_hash,
        )
        db.session.add(row)
        db.session.commit()
        return UserRepository._to_entity(row)

    # ── Mapping ─────────────────────────────────────────────────

    @staticmethod
    def _to_entity(row: UserModel) -> UserEntity:
        """Convert an ORM row into a domain entity."""
        return UserEntity(
            id=str(row.id),
            username=row.username,
            email=row.email,
            password_hash=row.password_hash,
            role=row.role,
            created_at=row.created_at,
            updated_at=row.updated_at,
        )
