"""Model package. Import every model here so ``db.metadata`` is complete for
Alembic autogenerate and app startup.
"""
from app.models.booking import (
    Booking,
    BookingProductItem,
    BookingServiceItem,
    BookingStatus,
    BookingType,
    PaymentStatus,
)
from app.models.catalog import Service, ServiceCategory, ServicePackage
from app.models.gift_card import (
    GiftCard,
    GiftCardDeliveryMethod,
    GiftCardItem,
    GiftCardItemType,
    GiftCardRedemption,
    GiftCardStatus,
)
from app.models.invoice import Invoice
from app.models.marketing import DiscountType, PromoCode
from app.models.schedule import BlockedDate, BusinessHour, SystemSetting
from app.models.style_image import StyleImage
from app.models.payment import (
    ManualPaymentMethod,
    Payment,
    PaymentAuditLog,
    PaymentProvider,
)
from app.models.inventory import (
    Product,
    ProductCategory,
    ProductStockMovement,
    StockMovementType,
)
from app.models.organization import Organization, OrgStatus
from app.models.user import (
    PasswordResetToken,
    Role,
    Session,
    User,
    UserRole,
)

__all__ = [
    "Organization",
    "OrgStatus",
    "Role",
    "User",
    "UserRole",
    "Session",
    "PasswordResetToken",
    "ServiceCategory",
    "Service",
    "ServicePackage",
    "ProductCategory",
    "Product",
    "ProductStockMovement",
    "StockMovementType",
    "PromoCode",
    "DiscountType",
    "Booking",
    "BookingServiceItem",
    "BookingProductItem",
    "BookingStatus",
    "BookingType",
    "PaymentStatus",
    "Payment",
    "PaymentProvider",
    "ManualPaymentMethod",
    "PaymentAuditLog",
    "GiftCard",
    "GiftCardItem",
    "GiftCardRedemption",
    "GiftCardStatus",
    "GiftCardDeliveryMethod",
    "GiftCardItemType",
    "BusinessHour",
    "BlockedDate",
    "SystemSetting",
    "Invoice",
    "StyleImage",
]
