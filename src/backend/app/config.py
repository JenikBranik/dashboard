"""Application configuration loaded from environment variables."""

import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration — reads everything from env vars with safe defaults."""

    # ── Flask core ──────────────────────────────────────────────
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-fallback-secret")

    # ── Database ────────────────────────────────────────────────
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://dashboard_user:change_me@db:5432/dashboard",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ── JWT (HttpOnly cookie mode) ──────────────────────────────
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-dev-fallback")
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_SECURE = os.getenv("FLASK_ENV") == "production"  # HTTPS only in prod
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_COOKIE_CSRF_PROTECT = False  # Simplified — enable when adding CSRF tokens
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)

    # ── CORS ────────────────────────────────────────────────────
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
