"""Dashboard controller — protected demo endpoints."""

from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api")


@dashboard_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    """Return placeholder dashboard data for the authenticated user."""
    user_id = get_jwt_identity()

    return jsonify({
        "message": "Welcome to your dashboard!",
        "user_id": user_id,
        "widgets": [
            {"id": 1, "title": "Total Users",   "value": "—", "type": "stat"},
            {"id": 2, "title": "Active Now",    "value": "—", "type": "stat"},
            {"id": 3, "title": "Revenue (CZK)", "value": "—", "type": "stat"},
        ],
    }), 200
