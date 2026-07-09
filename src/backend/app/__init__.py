"""Flask application factory.

Wires together all three architectural layers:
    Server  →  Core  →  Client
"""

from flask import Flask

from app.config import Config
from app.extensions import cors, db, jwt


def create_app() -> Flask:
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # ── Initialise extensions ───────────────────────────────────
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(
        app,
        origins=app.config["CORS_ORIGINS"],
        supports_credentials=True,
    )

    # ── Register server-layer blueprints ────────────────────────
    from app.server.controllers.auth_controller import auth_bp
    from app.server.controllers.dashboard_controller import dashboard_bp
    from app.server.controllers.event_controller import event_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(event_bp)

    # ── Register centralised error handlers ─────────────────────
    from app.server.middleware.error_handlers import register_error_handlers

    register_error_handlers(app)

    # ── Create database tables (bootstrap) ──────────────────────
    with app.app_context():
        from app.client.database.models import UserModel, EventModel  # noqa: F401
        db.create_all()

    # ── Health-check ────────────────────────────────────────────
    @app.route("/health")
    def health():
        return {"status": "ok"}

    return app
