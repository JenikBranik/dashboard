"""Authentication service — orchestrates registration, login, and profile retrieval.

This module contains pure business logic.  It depends on a repository
(Client layer) for persistence and raises domain exceptions that the
Server layer translates into HTTP responses.
"""

from __future__ import annotations

import bcrypt

from app.core.entities.user import UserEntity
from app.core.exceptions import (
    DuplicateEmailError,
    InvalidCredentialsError,
    NotFoundError,
    ValidationError,
)


class AuthService:
    """Stateless service — receives a repository via constructor injection."""

    def __init__(self, user_repository):
        self._repo = user_repository

    # ── Registration ────────────────────────────────────────────

    def register(self, username: str, email: str, password: str) -> UserEntity:
        """Validate inputs, hash password, persist a new user."""
        username = username.strip()
        email = email.strip().lower()

        if not username or not email or not password:
            raise ValidationError("Username, email, and password are required.")

        if len(password) < 6:
            raise ValidationError("Password must be at least 6 characters.")

        if self._repo.find_by_email(email) is not None:
            raise DuplicateEmailError()

        password_hash = self._hash_password(password)
        return self._repo.create(
            username=username,
            email=email,
            password_hash=password_hash,
        )

    # ── Login ───────────────────────────────────────────────────

    def login(self, email: str, password: str) -> UserEntity:
        """Verify credentials and return the authenticated user entity."""
        email = email.strip().lower()

        if not email or not password:
            raise ValidationError("Email and password are required.")

        user = self._repo.find_by_email(email)

        if user is None or not self._check_password(password, user.password_hash):
            raise InvalidCredentialsError()

        return user

    # ── Profile ─────────────────────────────────────────────────

    def get_profile(self, user_id: str) -> UserEntity:
        """Retrieve a user by ID."""
        user = self._repo.find_by_id(user_id)
        if user is None:
            raise NotFoundError("User not found.")
        return user

    # ── Password helpers (private) ──────────────────────────────

    @staticmethod
    def _hash_password(plain: str) -> str:
        return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    @staticmethod
    def _check_password(plain: str, hashed: str) -> bool:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
