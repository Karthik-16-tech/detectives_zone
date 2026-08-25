import logging
from app.core.database import SessionLocal
from app.models.order import Order
from app.services.email import send_payment_confirmed_email
from app.services.whatsapp import send_whatsapp_order_confirmation

logger = logging.getLogger("detective_zone.notifications")


def dispatch_async_order_notifications(order_id: int):
    """
    Background worker task to dispatch Email and WhatsApp confirmation notifications.
    Operates in its own DB session so failures never interfere with payment transactions.
    """
    db = SessionLocal()
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            logger.warning(f"[NOTIFICATIONS] Order #{order_id} not found for dispatch.")
            return

        # 1. Email notification
        try:
            if not order.payment_success_email_sent:
                logger.info(f"[NOTIFICATIONS: EMAIL] Sending confirmation email for #{order.order_number}")
                send_payment_confirmed_email(order)
                order.payment_success_email_sent = True
                order.email_status = "SENT"
                db.commit()
        except Exception as e:
            logger.error(f"[NOTIFICATIONS: EMAIL_ERROR] Failed sending email for #{order.order_number}: {e}")

        # 2. WhatsApp notification
        try:
            logger.info(f"[NOTIFICATIONS: WHATSAPP] Sending WhatsApp confirmation for #{order.order_number}")
            send_whatsapp_order_confirmation(order)
        except Exception as e:
            logger.error(f"[NOTIFICATIONS: WHATSAPP_ERROR] Failed sending WhatsApp for #{order.order_number}: {e}")

    except Exception as e:
        logger.error(f"[NOTIFICATIONS: CRITICAL] Error in background notification task: {e}")
    finally:
        db.close()
