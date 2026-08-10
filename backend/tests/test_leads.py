"""Standalone-interest lead capture (apex, no tenant): persist + notify ops."""
from __future__ import annotations

from app.extensions import db
from app.models.marketing import Lead
from app.notifications.providers import outbox

APEX = "lvh.me"


def _csrf(client):
    return client.get("/api/auth/csrf", headers={"Host": APEX}).get_json()["data"]["csrfToken"]


def _post(client, token, body, extra=None):
    headers = {"Host": APEX, "X-CSRF-Token": token}
    if extra:
        headers.update(extra)
    return client.post("/api/leads", json=body, headers=headers)


def test_lead_persists_and_notifies_ops(app):
    client = app.test_client()
    app.config["OPS_EMAIL"] = "ops@paulux.example.com"
    outbox.clear()

    token = _csrf(client)
    r = _post(client, token, {
        "name": "Ama Owusu", "businessName": "Glow Standalone",
        "email": "ama@glow.example.com", "phone": "+233200000000",
        "city": "Accra", "teamSize": 4, "message": "Want our own domain.",
    })
    assert r.status_code == 201, r.get_json()
    assert r.get_json()["data"]["received"] is True

    with app.app_context():
        lead = db.session.execute(
            db.select(Lead).filter_by(email="ama@glow.example.com")
        ).scalar_one()
        assert lead.business_name == "Glow Standalone"
        assert lead.team_size == 4 and lead.status == "new"

    # Ops was emailed via the in-memory backend.
    assert any(e.kind == "ops_lead" and e.to == "ops@paulux.example.com"
               for e in outbox.emails)


def test_lead_saved_even_without_ops_email(app):
    client = app.test_client()
    app.config["OPS_EMAIL"] = ""  # unset => no email, but lead still saved
    outbox.clear()

    token = _csrf(client)
    r = _post(client, token, {
        "name": "No Ops", "businessName": "Quiet Salon",
        "email": "quiet@salon.example.com",
    })
    assert r.status_code == 201
    with app.app_context():
        assert db.session.execute(
            db.select(Lead).filter_by(email="quiet@salon.example.com")
        ).scalar_one_or_none() is not None
    assert not any(e.kind == "ops_lead" for e in outbox.emails)


def test_lead_validation_rejects_bad_input(app):
    client = app.test_client()
    token = _csrf(client)
    # Missing required businessName + invalid email.
    r = _post(client, token, {"name": "X", "email": "not-an-email"})
    assert r.status_code == 400
    assert r.get_json()["error"]["code"] == "VALIDATION_ERROR"


def test_lead_requires_csrf(app):
    client = app.test_client()
    # No X-CSRF-Token header -> rejected.
    r = client.post("/api/leads", json={
        "name": "No CSRF", "businessName": "Salon", "email": "a@b.example.com",
    }, headers={"Host": APEX})
    assert r.status_code == 403
