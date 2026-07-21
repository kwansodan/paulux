"""Platform subscription billing.

Provider-agnostic: plans are defined here, org subscription *state* lives on the
Organization (status/plan/subscription_id/current_period_end), and a webhook is
the source of truth for state changes. The actual checkout call is abstracted so
Stripe or Paystack can be dropped in without touching the state machine.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone

from app.errors import ApiError
from app.models.organization import Organization, OrgStatus

MAX_TRIAL_EXTENSIONS = 2
TRIAL_EXTENSION_DAYS = 15

# Prices in the platform's billing currency (minor units at charge time).
PLANS: dict[str, dict] = {
    "starter": {"name": "Starter", "price": 0, "bookings_per_month": 100,
                "features": ["Online booking", "Payments", "1 location"]},
    "pro": {"name": "Pro", "price": 250, "bookings_per_month": None,
            "features": ["Everything in Starter", "Gift cards", "Reports", "Unlimited bookings", "Staff roles"]},
    "elite": {"name": "Elite", "price": 600, "bookings_per_month": None,
              "features": ["Everything in Pro", "Google Calendar sync", "Priority support", "Custom branding"]},
}

# Access is allowed in these states; SUSPENDED is blocked.
ACTIVE_STATES = {OrgStatus.TRIAL, OrgStatus.ACTIVE, OrgStatus.PAST_DUE}


def plan_or_default(plan: str | None) -> dict:
    return PLANS.get(plan or "starter", PLANS["starter"])


def is_trial_expired(org: Organization) -> bool:
    if org.status != OrgStatus.TRIAL or org.trial_ends_at is None:
        return False
    ends = org.trial_ends_at
    if ends.tzinfo is None:
        ends = ends.replace(tzinfo=timezone.utc)
    return datetime.now(timezone.utc) >= ends


def can_extend_trial(org: Organization) -> bool:
    return org.status == OrgStatus.TRIAL and org.trial_extensions_used < MAX_TRIAL_EXTENSIONS


def extend_trial(org: Organization) -> None:
    """Self-service trial extension: +15 days, up to twice. Extends from the
    later of now / current end so it works both before and after expiry."""
    if org.status != OrgStatus.TRIAL:
        raise ApiError("Only trial workspaces can extend a trial", status=422, code="NOT_ON_TRIAL")
    if org.trial_extensions_used >= MAX_TRIAL_EXTENSIONS:
        raise ApiError(
            "You've used all trial extensions. Please choose a plan to continue.",
            status=422, code="NO_EXTENSIONS_LEFT",
        )
    now = datetime.now(timezone.utc)
    base = org.trial_ends_at
    if base is None:
        base = now
    elif base.tzinfo is None:
        base = base.replace(tzinfo=timezone.utc)
    org.trial_ends_at = max(now, base) + timedelta(days=TRIAL_EXTENSION_DAYS)
    org.trial_extensions_used += 1


def subscription_view(org: Organization) -> dict:
    plan = plan_or_default(org.plan)
    trial_days_left = None
    if org.status == OrgStatus.TRIAL and org.trial_ends_at is not None:
        ends = org.trial_ends_at
        if ends.tzinfo is None:
            ends = ends.replace(tzinfo=timezone.utc)
        trial_days_left = max(0, (ends - datetime.now(timezone.utc)).days)
    return {
        "plan": org.plan or "starter",
        "planName": plan["name"],
        "status": org.status.value,
        "trialDaysLeft": trial_days_left,
        "trialExpired": is_trial_expired(org),
        "trialExtensionsUsed": org.trial_extensions_used,
        "trialExtensionsRemaining": max(0, MAX_TRIAL_EXTENSIONS - org.trial_extensions_used),
        "canExtendTrial": can_extend_trial(org),
        "currentPeriodEnd": org.current_period_end.isoformat() if org.current_period_end else None,
    }


def apply_subscription_event(org: Organization, *, event: str, plan: str | None = None,
                             subscription_id: str | None = None,
                             period_end: datetime | None = None) -> None:
    """Move an org's subscription state from a (verified) billing event."""
    if event in ("subscription.activated", "invoice.paid"):
        org.status = OrgStatus.ACTIVE
        if plan:
            org.plan = plan
        if subscription_id:
            org.subscription_id = subscription_id
        if period_end:
            org.current_period_end = period_end
    elif event == "invoice.payment_failed":
        org.status = OrgStatus.PAST_DUE
    elif event in ("subscription.cancelled", "subscription.suspended"):
        org.status = OrgStatus.SUSPENDED
