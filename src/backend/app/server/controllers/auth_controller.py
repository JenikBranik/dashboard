"""Auth controller — thin HTTP handlers that delegate to AuthService.

Each function:
1. Parses the incoming request
2. Calls the appropriate service method
3. Formats and returns the HTTP response

NO business logic lives here.
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
)

from app.client.database.user_repository import UserRepository
from app.core.services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

# Dependency injection — wire repository into service
_service = AuthService(user_repository=UserRepository())


# ── POST /api/auth/register ────────────────────────────────────

@auth_bp.route("/register", methods=["POST"])
def register():
    """Create a new user account."""
    data = request.get_json(silent=True) or {}

    user = _service.register(
        username=data.get("username", ""),
        email=data.get("email", ""),
        password=data.get("password", ""),
    )

    return jsonify({"message": "Account created successfully.", "user": user.to_dict()}), 201


# ── POST /api/auth/login ───────────────────────────────────────

@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate a user and set an HttpOnly JWT cookie."""
    data = request.get_json(silent=True) or {}

    user = _service.login(
        email=data.get("email", ""),
        password=data.get("password", ""),
    )

    access_token = create_access_token(identity=user.id)
    response = jsonify({"message": "Logged in.", "user": user.to_dict()})
    set_access_cookies(response, access_token)
    return response, 200


# ── POST /api/auth/logout ──────────────────────────────────────

@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Clear the JWT cookie."""
    response = jsonify({"message": "Logged out."})
    unset_jwt_cookies(response)
    return response, 200


# ── GET /api/auth/me ────────────────────────────────────────────

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    """Return the currently authenticated user's profile."""
    user_id = get_jwt_identity()
    user = _service.get_profile(user_id)
    return jsonify({"user": user.to_dict()}), 200
