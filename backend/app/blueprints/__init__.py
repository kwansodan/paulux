"""Blueprint registration. Each domain area registers its own blueprint here."""
from __future__ import annotations

from flask import Flask


def register_blueprints(app: Flask) -> None:
    from app.blueprints.auth import bp as auth_bp
    from app.blueprints.billing import bp as billing_bp
    from app.blueprints.bookings import bp as bookings_bp
    from app.blueprints.catalog import bp as catalog_bp
    from app.blueprints.gift_cards import bp as gift_cards_bp
    from app.blueprints.health import bp as health_bp
    from app.blueprints.inventory import bp as inventory_bp
    from app.blueprints.leads import bp as leads_bp
    from app.blueprints.org_settings import bp as org_settings_bp
    from app.blueprints.payments import bp as payments_bp
    from app.blueprints.promo_codes import bp as promo_codes_bp
    from app.blueprints.reports import bp as reports_bp
    from app.blueprints.schedule import bp as schedule_bp
    from app.blueprints.signup import bp as signup_bp
    from app.blueprints.staff import bp as staff_bp
    from app.blueprints.style_images import bp as style_images_bp
    from app.blueprints.uploads import bp as uploads_bp

    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(catalog_bp)
    app.register_blueprint(inventory_bp)
    app.register_blueprint(promo_codes_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(gift_cards_bp)
    app.register_blueprint(schedule_bp)
    app.register_blueprint(staff_bp)
    app.register_blueprint(org_settings_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(uploads_bp)
    app.register_blueprint(style_images_bp)
    app.register_blueprint(signup_bp)
    app.register_blueprint(billing_bp)
    app.register_blueprint(leads_bp)
