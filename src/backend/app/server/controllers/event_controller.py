"""Event controller — CRUD HTTP handlers for calendar events.

Each function:
1. Parses the incoming request
2. Calls the appropriate service method
3. Formats and returns the HTTP response

NO business logic lives here.
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app.client.database.event_repository import EventRepository
from app.core.services.event_service import EventService

event_bp = Blueprint("events", __name__, url_prefix="/api/events")

# Dependency injection
_service = EventService(event_repository=EventRepository())


# ── GET /api/events ────────────────────────────────────────────

@event_bp.route("", methods=["GET"])
@jwt_required()
def list_events():
    """Return all events for the authenticated user."""
    user_id = get_jwt_identity()
    start = request.args.get("start")
    end = request.args.get("end")

    events = _service.list_events(user_id, start=start, end=end)
    return jsonify([e.to_dict() for e in events]), 200


# ── POST /api/events ───────────────────────────────────────────

@event_bp.route("", methods=["POST"])
@jwt_required()
def create_event():
    """Create a new calendar event."""
    user_id = get_jwt_identity()
    data = request.get_json(silent=True) or {}

    try:
        event = _service.create_event(
            user_id=user_id,
            title=data.get("title", ""),
            start=data.get("start", ""),
            end=data.get("end"),
            all_day=data.get("allDay", False),
            color=data.get("color"),
        )
        return jsonify(event.to_dict()), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# ── PUT /api/events/<id> ───────────────────────────────────────

@event_bp.route("/<event_id>", methods=["PUT"])
@jwt_required()
def update_event(event_id):
    """Update an existing calendar event."""
    user_id = get_jwt_identity()
    data = request.get_json(silent=True) or {}

    try:
        event = _service.update_event(
            event_id=event_id,
            user_id=user_id,
            title=data.get("title"),
            start=data.get("start"),
            end=data.get("end"),
            all_day=data.get("allDay"),
            color=data.get("color"),
        )
        return jsonify(event.to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403


# ── DELETE /api/events/<id> ────────────────────────────────────

@event_bp.route("/<event_id>", methods=["DELETE"])
@jwt_required()
def delete_event(event_id):
    """Delete a calendar event."""
    user_id = get_jwt_identity()

    try:
        _service.delete_event(event_id=event_id, user_id=user_id)
        return jsonify({"message": "Event deleted."}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403
