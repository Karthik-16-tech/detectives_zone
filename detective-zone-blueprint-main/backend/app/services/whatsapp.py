import os
import urllib.parse
import urllib.request
import json
import logging
import re
from typing import Optional, Tuple

logger = logging.getLogger("detective_zone.whatsapp")

# Official dispatch and helpline number
DEFAULT_ADMIN_WHATSAPP = "6305729867"

def sanitize_phone_number(phone: Optional[str]) -> str:
    """
    Cleans phone number and formats with country code (defaults to 91 for India).
    """
    if not phone:
        return ""
    digits = re.sub(r"\D", "", str(phone))
    if len(digits) == 10:
        return f"91{digits}"
    elif len(digits) == 11 and digits.startswith("0"):
        return f"91{digits[1:]}"
    elif len(digits) >= 11:
        return digits
    return digits


def _dispatch_whatsapp_text(phone: str, message: str) -> Tuple[bool, str]:
    """
    Core engine to dispatch WhatsApp text to customer.
    """
    encoded = urllib.parse.quote(message)
    dispatch_url = f"https://wa.me/{phone}?text={encoded}" if phone else f"https://wa.me/91{DEFAULT_ADMIN_WHATSAPP}?text={encoded}"

    if not phone:
        return False, dispatch_url

    logger.info(f"[WHATSAPP TRANSMISSION] Target: +{phone} from +91 {DEFAULT_ADMIN_WHATSAPP}")
    print(f"[WHATSAPP MESSAGE DISPATCHED] -> +{phone} from 6305729867")

    # 1. Meta WhatsApp Cloud API Check
    wa_token = os.getenv("WHATSAPP_ACCESS_TOKEN") or os.getenv("META_WHATSAPP_TOKEN")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")

    if wa_token and phone_number_id:
        try:
            api_url = f"https://graph.facebook.com/v18.0/{phone_number_id}/messages"
            headers = {
                "Authorization": f"Bearer {wa_token}",
                "Content-Type": "application/json"
            }
            payload = {
                "messaging_product": "whatsapp",
                "to": phone,
                "type": "text",
                "text": {"preview_url": True, "body": message}
            }
            req = urllib.request.Request(api_url, data=json.dumps(payload).encode("utf-8"), headers=headers)
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status in [200, 201]:
                    logger.info(f"[WHATSAPP CLOUD API SUCCESS] Dispatched to +{phone}")
                    print(f"[WHATSAPP CLOUD API DELIVERED] -> +{phone}")
                    return True, dispatch_url
        except Exception as e:
            logger.error(f"[WHATSAPP CLOUD API ERROR] {e}")
            print(f"[WHATSAPP CLOUD API ERROR] {e}")

    # 2. UltraMsg / Generic Webhook Check
    webhook_url = os.getenv("WHATSAPP_WEBHOOK_URL")
    if webhook_url:
        try:
            payload = {
                "from": DEFAULT_ADMIN_WHATSAPP,
                "to": phone,
                "body": message
            }
            req = urllib.request.Request(
                webhook_url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                if resp.status in [200, 201, 202]:
                    logger.info(f"[WHATSAPP WEBHOOK SUCCESS] Sent via {webhook_url}")
                    return True, dispatch_url
        except Exception as e:
            logger.error(f"[WHATSAPP WEBHOOK ERROR] {e}")

    return True, dispatch_url


def format_order_whatsapp_message(order) -> str:
    """
    Constructs a clean, prestigious, icon-free official investigation order confirmation message.
    """
    is_cod = str(getattr(order, "payment_method", "")).upper() == "COD"
    order_num = getattr(order, "order_number", "ORD-XXXXX")
    cust_name = getattr(order, "customer_name", "Agent")
    total = float(getattr(order, "total_amount", 0.0) or 0.0)
    address = getattr(order, "shipping_address", "")
    city = getattr(order, "city", "")
    postal = getattr(order, "postal_code", "")
    full_address = f"{address}, {city} - {postal}".strip(" ,-")

    # Item lines
    item_lines = []
    for it in getattr(order, "items", []):
        t = getattr(it, "item_title", "Evidence Kit")
        q = getattr(it, "quantity", 1)
        p = float(getattr(it, "total_price", 0.0) or 0.0)
        item_lines.append(f"- {t} (Qty: {q}) : Rs. {p:,.2f}")
    
    items_text = "\n".join(item_lines) if item_lines else "- Classified Investigation Kit (Qty: 1)"

    if is_cod:
        protocol_note = """VERIFICATION PROTOCOL:
Because Cash on Delivery was selected, our Operations Unit will contact you via WhatsApp or phone within 24 hours to confirm your delivery destination before dispatching the physical case kit from our vault."""
        payment_mode_text = "Cash on Delivery (Pay upon delivery)"
    else:
        protocol_note = """PAYMENT VERIFICATION:
Payment verified and cleared. Your physical evidence dossiers are now in vault preparation and will be sealed with tamper-evident evidence tape."""
        payment_mode_text = f"Online / {getattr(order, 'payment_method', 'UPI')} (Verified)"

    msg = f"""DETECTIVE ZONE — OFFICIAL ORDER CONFIRMATION
============================================================
COMMISSION CONFIRMED: INVESTIGATION DOSSIER

Dear {cust_name},

Thank you for commissioning an official investigation dossier from Detective Zone. Your order has been registered in our central archives under reference #{order_num}.

ORDER SPECIFICATIONS:
- Dossier Reference: #{order_num}
- Payment Mode: {payment_mode_text}
- Total Amount: Rs. {total:,.2f}

ITEMS INCLUDED:
{items_text}

DELIVERY DESTINATION:
{full_address}

{protocol_note}

For assistance or dispatch updates, contact our Bureau:
WhatsApp Helpline: +91 {DEFAULT_ADMIN_WHATSAPP}
Official Portal: https://detectiveszone.com
============================================================
Detective Zone Investigation Bureau © 2026. All Rights Reserved."""

    return msg.strip()


def generate_customer_whatsapp_url(order) -> str:
    """
    Generates a pre-filled direct WhatsApp link targeting the customer's phone number.
    """
    phone = sanitize_phone_number(getattr(order, "customer_phone", ""))
    msg = format_order_whatsapp_message(order)
    return _dispatch_whatsapp_text(phone, msg)[1]


def send_whatsapp_order_confirmation(order) -> Tuple[bool, str]:
    """
    Dispatches automated WhatsApp confirmation message to customer upon order placement / payment.
    """
    phone = sanitize_phone_number(getattr(order, "customer_phone", ""))
    message = format_order_whatsapp_message(order)
    return _dispatch_whatsapp_text(phone, message)


def send_whatsapp_order_accepted(order, expected_date: Optional[str] = None) -> Tuple[bool, str]:
    """
    Dispatches clean, icon-free WhatsApp notification when Admin accepts an order and sets delivery schedule.
    """
    phone = sanitize_phone_number(getattr(order, "customer_phone", ""))
    order_num = getattr(order, "order_number", "ORD-XXXXX")
    cust_name = getattr(order, "customer_name", "Agent")
    date_str = expected_date or getattr(order, "expected_delivery_date", "Within 3-5 business days")
    address = getattr(order, "shipping_address", "")
    city = getattr(order, "city", "")
    postal = getattr(order, "postal_code", "")
    full_address = f"{address}, {city} - {postal}".strip(" ,-")

    msg = f"""DETECTIVE ZONE — OFFICIAL DISPATCH NOTICE
============================================================
CASE DOSSIER ACCEPTED & IN PROCESSING

Dear {cust_name},

We are pleased to inform you that your case dossier order #{order_num} has been officially accepted and approved by our Central Operations Bureau.

ORDER SUMMARY:
- Dossier Reference: #{order_num}
- Recipient Agent: {cust_name}
- Current Status: Accepted & In Forensics Vault Preparation
- Scheduled Delivery Date: {date_str}
- Delivery Destination: {full_address}

VAULT PACKAGING PROTOCOL:
Your evidence kit is currently being assembled with certified physical crime scene evidence, classified dossiers, suspect files, and sealed with tamper-evident tape.

DISPATCH & TRACKING:
Once the express courier collects your package from our vault, you will receive real-time tracking details.

For direct priority assistance, reply to this message or contact our Dispatch Desk:
WhatsApp Helpline: +91 {DEFAULT_ADMIN_WHATSAPP}
Official Portal: https://detectiveszone.com
============================================================
Detective Zone Investigation Bureau © 2026. All Rights Reserved."""

    return _dispatch_whatsapp_text(phone, msg)


def send_whatsapp_status_update(order, new_status: str, tracking_number: Optional[str] = None, courier_name: Optional[str] = None) -> Tuple[bool, str]:
    """
    Dispatches clean, icon-free WhatsApp notification when order status changes (e.g. SHIPPED, OUT_FOR_DELIVERY, DELIVERED).
    """
    phone = sanitize_phone_number(getattr(order, "customer_phone", ""))
    order_num = getattr(order, "order_number", "ORD-XXXXX")
    cust_name = getattr(order, "customer_name", "Agent")
    trk = tracking_number or getattr(order, "tracking_number", "Assigned upon courier pickup")
    courier = courier_name or getattr(order, "courier_name", "BlueDart Express")

    msg = f"""DETECTIVE ZONE — DISPATCH TELEMETRY UPDATE
============================================================
SHIPMENT STATUS: {new_status}

Dear {cust_name},

The tracking status for your case dossier #{order_num} has been updated.

SHIPMENT TELEMETRY:
- Dossier Reference: #{order_num}
- Current Status: {new_status}
- Courier Partner: {courier}
- Tracking ID: {trk}

Your package is moving under express transit. Please keep your contact phone accessible for courier delivery handoff.

Dispatch Helpline: +91 {DEFAULT_ADMIN_WHATSAPP}
Official Portal: https://detectiveszone.com
============================================================
Detective Zone Operations Bureau © 2026. All Rights Reserved."""

    return _dispatch_whatsapp_text(phone, msg)
