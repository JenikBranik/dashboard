"""Centralised error handlers.

Catches domain exceptions raised in the Core layer and converts them
into consistent JSON error responses.  This keeps controllers free of
try/except boilerplate.
"""

from flask import Flask, jsonify

from app.core.exceptions import AppException


def register_error_handlers(app: Flask) -> None:
    """Attach error handlers to the Flask application."""

    @app.errorhandler(AppException)
    def handle_app_exception(error: AppException):
        """Transform any AppException subclass into a JSON response."""
        return jsonify({"error": error.message}), error.status_code

    @app.errorhandler(404)
    def handle_not_found(_error):
        return jsonify({"error": "The requested resource was not found."}), 404

    @app.errorhandler(405)
    def handle_method_not_allowed(_error):
        return jsonify({"error": "Method not allowed."}), 405

    @app.errorhandler(500)
    def handle_internal_error(_error):
        return jsonify({"error": "Internal server error."}), 500
