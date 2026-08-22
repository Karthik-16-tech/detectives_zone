import os
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional

from app.core.config import settings

logger = logging.getLogger("detective_zone.email")

# Official branding logo asset from AWS S3 CDN
LOGO_URL = "https://detectives-zone-media.s3.eu-north-1.amazonaws.com/logo.png"
DEFAULT_WHATSAPP = "6305729867"

def mask_email(email: str) -> str:
    """Safely masks email for logs and UI display without leaking private user data."""
    if not email or "@" not in email:
        return "***"
    parts = email.strip().split("@", 1)
    name = parts[0]
    domain = parts[1]
    masked_name = name[:2] + "***" if len(name) > 2 else name[:1] + "***"
    return f"{masked_name}@{domain}"


def send_smtp_email(recipient: str, subject: str, html_body: str, plain_text_body: str) -> bool:
    """
    Dispatches an email using SMTP.
    Returns True ONLY if the SMTP provider accepts the message.
    Returns False if credentials are missing or SMTP handshake/dispatch fails.
    """
    recipient = (recipient or "").strip()
    if not recipient or "@" not in recipient:
        logger.warning(f"[EMAIL_SEND: ABORTED_INVALID_RECIPIENT] Invalid email address: {recipient}")
        return False

    masked = mask_email(recipient)
    logger.info(f"[EMAIL_SEND: STARTED] To: {masked}, Subject: {subject}")

    # Check if SMTP credentials exist
    if not settings.SMTP_HOST or not settings.SMTP_PASSWORD:
        logger.warning(f"[EMAIL_SEND: FAILED_NO_CREDENTIALS] SMTP_PASSWORD is not configured in backend/.env. Real emails cannot be delivered to provider until credentials are set.")
        print(f"[SMTP CREDENTIALS MISSING] Cannot deliver email to {masked}. Set SMTP_PASSWORD in backend/.env")
        return False

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        sender_email = settings.SMTP_FROM_EMAIL or settings.SMTP_USER
        msg["From"] = f"{settings.SMTP_FROM_NAME} <{sender_email}>"
        msg["To"] = recipient

        # Attach plain text and HTML versions
        part1 = MIMEText(plain_text_body, "plain", "utf-8")
        part2 = MIMEText(html_body, "html", "utf-8")
        msg.attach(part1)
        msg.attach(part2)

        logger.info(f"[EMAIL_SEND: CONNECTING] Host: {settings.SMTP_HOST}:{settings.SMTP_PORT}, User: {mask_email(settings.SMTP_USER)}, TLS={settings.SMTP_USE_TLS}, SSL={settings.SMTP_USE_SSL}")

        if settings.SMTP_USE_SSL or settings.SMTP_PORT == 465:
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=20) as server:
                logger.info(f"[EMAIL_SEND: AUTHENTICATING] User: {mask_email(settings.SMTP_USER)}")
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                logger.info(f"[EMAIL_SEND: TRANSMITTING] Recipient: {masked}")
                server.sendmail(sender_email, [recipient], msg.as_string())
        else:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=20) as server:
                if settings.SMTP_USE_TLS:
                    server.starttls()
                logger.info(f"[EMAIL_SEND: AUTHENTICATING] User: {mask_email(settings.SMTP_USER)}")
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                logger.info(f"[EMAIL_SEND: TRANSMITTING] Recipient: {masked}")
                server.sendmail(sender_email, [recipient], msg.as_string())

        logger.info(f"[EMAIL_SEND: PROVIDER_ACCEPTED] Successfully accepted by {settings.SMTP_HOST} for {masked}")
        logger.info(f"[EMAIL_SEND: COMPLETED] Email delivered to queue for {masked}")
        print(f"[SMTP EMAIL DELIVERED] -> {masked}")
        return True
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"[EMAIL_SEND: AUTH_FAILED] Invalid SMTP Username or Password for {mask_email(settings.SMTP_USER)}. Error: {e}")
        print(f"[SMTP AUTH FAILED] Google/Provider rejected credentials for {mask_email(settings.SMTP_USER)}: {e}")
        return False
    except Exception as e:
        logger.error(f"[EMAIL_SEND: FAILED] Error for {masked}: {e}")
        print(f"[SMTP ERROR] Could not dispatch to {masked}: {e}")
        return False


def send_payment_confirmed_email(order) -> bool:
    """
    Sends official luxury red-and-black order confirmation email to customer upon order placement / payment.
    """
    if getattr(order, "payment_success_email_sent", False):
        logger.info(f"[EMAIL SKIP] Confirmation email already sent for order #{order.order_number}")
        return True

    recipient = order.customer_email
    is_cod = str(order.payment_method).upper() == "COD"
    whatsapp_num = DEFAULT_WHATSAPP
    whatsapp_link = f"https://wa.me/91{whatsapp_num}?text=Hi%20Detective%20Zone,%20I%20am%20inquiring%20about%20Order%20%23{order.order_number}"

    # Build items summary rows
    items_rows_html = ""
    items_text_list = ""
    for item in getattr(order, "items", []):
        unit_p = getattr(item, "unit_price", 0.0)
        qty = getattr(item, "quantity", 1)
        tot = getattr(item, "total_price", unit_p * qty)
        title = getattr(item, "item_title", "Evidence Case Kit")
        items_rows_html += f"""
        <tr style="border-bottom: 1px solid #1c1c1c;">
            <td style="padding: 14px 0; color: #f4f4f5; font-size: 13.5px; font-weight: 600;">{title}</td>
            <td style="padding: 14px 0; text-align: center; color: #a1a1aa; font-family: 'Courier New', Courier, monospace; font-size: 13px;">{qty}</td>
            <td style="padding: 14px 0; text-align: right; color: #C81D24; font-weight: 700; font-family: 'Courier New', Courier, monospace; font-size: 14px;">Rs. {tot:,.2f}</td>
        </tr>
        """
        items_text_list += f" - {title} (Qty: {qty}) : Rs. {tot:,.2f}\n"

    if is_cod:
        subject = f"Order Registered & Verification Notice — #{order.order_number} [Detective Zone]"
        
        plain_text = f"""
DETECTIVE ZONE — CLASSIFIED DOSSIER ARCHIVE
============================================================
ORDER NUMBER: #{order.order_number}
PAYMENT METHOD: CASH ON DELIVERY (COD)
VERIFICATION TIMELINE: WITHIN 24 HOURS

Hello {order.customer_name},

Thank you for commissioning an official investigation dossier from Detective Zone.

CLASSIFIED DISPATCH NOTICE:
Your order has been registered in our central archives.
Because this dossier was selected for Cash on Delivery, our dispatch unit will contact you via WhatsApp or Phone ({order.customer_phone or 'your registered number'}) to confirm your exact delivery destination before releasing the physical case kit from our vault.

ORDER SUMMARY:
------------------------------------------------------------
Reference Number: #{order.order_number}
Payment Mode: Cash on Delivery (Pay upon arrival)
Total Amount Payable: Rs. {order.total_amount:,.2f}
Recipient: {order.customer_name}
Delivery Address: {order.shipping_address}, {order.city or ''} {order.state or ''} - {order.postal_code or ''}
Contact Phone: {order.customer_phone or 'N/A'}

ITEMS INCLUDED:
{items_text_list}

NEED INSTANT DISPATCH SUPPORT?
WhatsApp Dispatch Desk: https://wa.me/91{whatsapp_num}?text=Hi%20Detective%20Zone%2C%20Order%20%23{order.order_number}

Kind regards,
Detective Zone Operations Bureau
https://detectiveszone.com
============================================================
"""

        html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030303; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e4e4e7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #030303; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Luxury Card -->
        <table width="620" cellpadding="0" cellspacing="0" style="background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.95);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #000000; padding: 36px 30px 28px 30px; text-align: center; border-bottom: 2px solid #C81D24;">
              <img src="{LOGO_URL}" alt="Detective Zone" width="160" style="display: block; margin: 0 auto 14px auto; max-width: 160px; height: auto;" />
              <div style="font-size: 10px; color: #C81D24; text-transform: uppercase; letter-spacing: 3px; font-weight: 800; font-family: 'Courier New', Courier, monospace;">
                CONFIDENTIAL CASE ARCHIVE & EVIDENCE DISPATCH
              </div>
            </td>
          </tr>

          <!-- COD Classification Notice (Black & Red Luxury) -->
          <tr>
            <td style="padding: 30px 36px 15px 36px;">
              <div style="background-color: #0d0405; border: 1px solid #7f1d1d; border-left: 4px solid #C81D24; border-radius: 8px; padding: 20px 24px;">
                <div style="font-size: 10px; color: #ef4444; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-family: 'Courier New', Courier, monospace; margin-bottom: 6px;">
                  [ CASH ON DELIVERY · 24-HOUR DISPATCH PROTOCOL ]
                </div>
                <h2 style="margin: 0 0 6px 0; color: #ffffff; font-size: 17px; font-weight: 800; letter-spacing: 0.5px;">
                  Your Order Will Be Confirmed Within 24 Hours
                </h2>
                <p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.6;">
                  Our operations team will reach out via <strong>WhatsApp / Phone ({order.customer_phone or 'your contact number'})</strong> to verify your delivery address before shipment.
                </p>
              </div>
            </td>
          </tr>

          <!-- Dossier Details Content -->
          <tr>
            <td style="padding: 15px 36px 35px 36px;">
              <p style="font-size: 15px; color: #ffffff; margin-top: 10px; font-weight: 600;">
                Dear {order.customer_name},
              </p>
              <p style="font-size: 13.5px; color: #a1a1aa; line-height: 1.7; margin-bottom: 22px;">
                Your case file registration has been successfully cataloged under classified reference <strong style="color: #C81D24; font-family: 'Courier New', Courier, monospace; font-size: 15px;">#{order.order_number}</strong>.
              </p>

              <!-- Order Metadata Panel -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; border: 1px solid #1f1f23; border-radius: 8px; padding: 18px 20px; font-size: 13px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 7px 0; color: #71717a; font-family: 'Courier New', Courier, monospace; font-size: 12px; text-transform: uppercase;">Dossier Reference:</td>
                  <td style="padding: 7px 0; text-align: right; color: #ffffff; font-weight: 700; font-family: 'Courier New', Courier, monospace; font-size: 13px;">#{order.order_number}</td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; color: #71717a; font-family: 'Courier New', Courier, monospace; font-size: 12px; text-transform: uppercase;">Payment Mode:</td>
                  <td style="padding: 7px 0; text-align: right; color: #ef4444; font-weight: 700; font-size: 13px;">Cash on Delivery</td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; color: #71717a; font-family: 'Courier New', Courier, monospace; font-size: 12px; text-transform: uppercase;">Recipient Agent:</td>
                  <td style="padding: 7px 0; text-align: right; color: #ffffff; font-weight: 600;">{order.customer_name}</td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; color: #71717a; font-family: 'Courier New', Courier, monospace; font-size: 12px; text-transform: uppercase;">Contact Telephony:</td>
                  <td style="padding: 7px 0; text-align: right; color: #ffffff; font-family: 'Courier New', Courier, monospace;">{order.customer_phone or 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 7px 0; color: #71717a; font-family: 'Courier New', Courier, monospace; font-size: 12px; text-transform: uppercase;">Dispatch Destination:</td>
                  <td style="padding: 7px 0; text-align: right; color: #e4e4e7; max-width: 280px; line-height: 1.4;">{order.shipping_address}, {order.city or ''} {order.state or ''} - {order.postal_code or ''}</td>
                </tr>
              </table>

              <!-- Item Breakdown Table -->
              <div style="border-bottom: 1px solid #27272a; padding-bottom: 8px; margin-bottom: 14px;">
                <span style="color: #ffffff; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; font-family: 'Courier New', Courier, monospace;">
                  ITEMS INCLUDED IN CASE DOSSIER
                </span>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px;">
                <thead>
                  <tr style="border-bottom: 1px solid #27272a; color: #71717a; font-size: 11px; text-transform: uppercase; font-family: 'Courier New', Courier, monospace;">
                    <th align="left" style="padding-bottom: 10px;">Item Title</th>
                    <th align="center" style="padding-bottom: 10px;">Qty</th>
                    <th align="right" style="padding-bottom: 10px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items_rows_html}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding-top: 18px; font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; font-family: 'Courier New', Courier, monospace;">Total Amount Payable:</td>
                    <td style="padding-top: 18px; text-align: right; font-size: 19px; font-weight: 800; color: #C81D24; font-family: 'Courier New', Courier, monospace;">Rs. {order.total_amount:,.2f}</td>
                  </tr>
                </tfoot>
              </table>

              <!-- Luxury Black & Red Call to Action -->
              <div style="margin-top: 36px; text-align: center; background-color: #000000; border: 1px solid #1f1f23; border-radius: 10px; padding: 24px 20px;">
                <p style="margin: 0 0 14px 0; color: #a1a1aa; font-size: 12.5px; line-height: 1.5;">
                  Have an urgent question regarding your shipment or order status?
                </p>
                <a href="{whatsapp_link}" style="display: inline-block; background-color: #C81D24; color: #ffffff; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 6px; box-shadow: 0 6px 25px rgba(200,29,36,0.35); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                  Connect with Dispatch Bureau
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 26px 30px; text-align: center; border-top: 1px solid #1c1c1f; font-size: 11px; color: #71717a;">
              <p style="margin: 0; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1.5px;">Detective Zone &copy; 2026</p>
              <p style="margin: 6px 0 0 0; color: #52525b; line-height: 1.5;">
                Classified Investigation Dossiers & Evidence Simulations · All Rights Reserved
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    else:
        # Standard Online / UPI Payment Confirmed Email (Luxury Red and Black)
        subject = f"Payment Received & Order Confirmed — #{order.order_number} [Detective Zone]"
        
        plain_text = f"""
DETECTIVE ZONE — CLASSIFIED DOSSIER ARCHIVE
============================================================
ORDER NUMBER: #{order.order_number}
PAYMENT STATUS: CONFIRMED / SUCCESS

Hello {order.customer_name},

Your payment of Rs. {order.total_amount:,.2f} via {order.payment_method} has been received and verified.
Transaction Reference: {order.transaction_id or 'TXN-VERIFIED'}

ORDER SUMMARY:
------------------------------------------------------------
Order Number: #{order.order_number}
Total Paid: Rs. {order.total_amount:,.2f}
Payment Status: VERIFIED & CLEARED
Delivery Address: {order.shipping_address}, {order.city or ''} {order.state or ''} - {order.postal_code or ''}

ITEMS INCLUDED:
{items_text_list}

Your physical evidence kit is being sealed in our vaults with tamper-evident evidence tape.
Courier tracking will be dispatched shortly.

Kind regards,
Detective Zone Operations Bureau
https://detectiveszone.com
============================================================
"""

        html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030303; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #030303; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Luxury Card -->
        <table width="620" cellpadding="0" cellspacing="0" style="background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.95);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #000000; padding: 36px 30px 28px 30px; text-align: center; border-bottom: 2px solid #C81D24;">
              <img src="{LOGO_URL}" alt="Detective Zone" width="160" style="display: block; margin: 0 auto 14px auto; max-width: 160px; height: auto;" />
              <div style="font-size: 10px; color: #C81D24; text-transform: uppercase; letter-spacing: 3px; font-weight: 800; font-family: 'Courier New', Courier, monospace;">
                CONFIDENTIAL CASE ARCHIVE & EVIDENCE DISPATCH
              </div>
            </td>
          </tr>

          <!-- Payment Confirmed Banner (Red & Black Luxury) -->
          <tr>
            <td style="padding: 30px 36px 15px 36px;">
              <div style="background-color: #0d0405; border: 1px solid #7f1d1d; border-left: 4px solid #C81D24; border-radius: 8px; padding: 20px 24px;">
                <div style="font-size: 10px; color: #ef4444; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-family: 'Courier New', Courier, monospace; margin-bottom: 6px;">
                  [ TRANSACTION VERIFIED · EVIDENCE PACKAGING IN PROGRESS ]
                </div>
                <h2 style="margin: 0 0 6px 0; color: #ffffff; font-size: 17px; font-weight: 800; letter-spacing: 0.5px;">
                  Payment Received & Order Confirmed
                </h2>
                <p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.6;">
                  Dossier <strong style="color: #ffffff; font-family: 'Courier New', Courier, monospace;">#{order.order_number}</strong> is now in priority preparation in our evidence vault.
                </p>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 15px 36px 35px 36px;">
              <p style="font-size: 15px; color: #ffffff; margin-top: 10px; font-weight: 600;">
                Dear {order.customer_name},
              </p>
              <p style="font-size: 13.5px; color: #a1a1aa; line-height: 1.7; margin-bottom: 22px;">
                Your payment of <strong style="color: #C81D24; font-family: 'Courier New', Courier, monospace;">Rs. {order.total_amount:,.2f}</strong> has been received via {order.payment_method} (Transaction ID: <code style="color: #ffffff; background-color: #000; padding: 2px 6px; border-radius: 4px; border: 1px solid #27272a;">{order.transaction_id or 'TXN-VERIFIED'}</code>).
              </p>

              <!-- Order Summary Table -->
              <div style="border-bottom: 1px solid #27272a; padding-bottom: 8px; margin-bottom: 14px;">
                <span style="color: #ffffff; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; font-family: 'Courier New', Courier, monospace;">
                  ORDER BREAKDOWN
                </span>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px;">
                <thead>
                  <tr style="border-bottom: 1px solid #27272a; color: #71717a; font-size: 11px; text-transform: uppercase; font-family: 'Courier New', Courier, monospace;">
                    <th align="left" style="padding-bottom: 10px;">Item Title</th>
                    <th align="center" style="padding-bottom: 10px;">Qty</th>
                    <th align="right" style="padding-bottom: 10px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items_rows_html}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding-top: 18px; font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; font-family: 'Courier New', Courier, monospace;">Total Paid:</td>
                    <td style="padding-top: 18px; text-align: right; font-size: 19px; font-weight: 800; color: #C81D24; font-family: 'Courier New', Courier, monospace;">Rs. {order.total_amount:,.2f}</td>
                  </tr>
                </tfoot>
              </table>

              <!-- Luxury Black & Red Call to Action -->
              <div style="margin-top: 36px; text-align: center; background-color: #000000; border: 1px solid #1f1f23; border-radius: 10px; padding: 24px 20px;">
                <a href="{whatsapp_link}" style="display: inline-block; background-color: #C81D24; color: #ffffff; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 6px; box-shadow: 0 6px 25px rgba(200,29,36,0.35);">
                  Dispatch & Tracking Assistance
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 26px 30px; text-align: center; border-top: 1px solid #1c1c1f; font-size: 11px; color: #71717a;">
              <p style="margin: 0; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1.5px;">Detective Zone &copy; 2026</p>
              <p style="margin: 6px 0 0 0; color: #52525b; line-height: 1.5;">
                Classified Investigation Dossiers & Evidence Simulations · All Rights Reserved
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    dispatched = send_smtp_email(recipient=recipient, subject=subject, html_body=html_body, plain_text_body=plain_text)
    if dispatched:
        order.payment_success_email_sent = True
    return dispatched


def send_order_accepted_email(order, force: bool = False) -> bool:
    """
    Sends official order confirmation & acceptance email to customer in luxury Red & Black design.
    """
    if not force and getattr(order, "order_acceptance_email_sent", False):
        logger.info(f"[EMAIL SKIP] Acceptance email already sent for order #{order.order_number}")
        return True

    recipient = order.customer_email
    delivery_date = order.expected_delivery_date or "Within 3-5 business days"
    order_date = order.created_at.strftime("%d %B %Y, %H:%M") if hasattr(order, "created_at") and order.created_at else "Today"
    subject = f"Order Accepted & Vault Sealing In Progress — #{order.order_number} [Detective Zone]"
    whatsapp_num = DEFAULT_WHATSAPP
    whatsapp_link = f"https://wa.me/91{whatsapp_num}?text=Hi%20Detective%20Zone,%20I%20am%20inquiring%20about%20Order%20%23{order.order_number}"

    # Build items summary text & html
    items_rows_html = ""
    items_text_list = ""
    for item in getattr(order, "items", []):
        unit_p = getattr(item, "unit_price", 0.0)
        qty = getattr(item, "quantity", 1)
        tot = getattr(item, "total_price", unit_p * qty)
        title = getattr(item, "item_title", "Evidence Case Kit")
        items_rows_html += f"""
        <tr style="border-bottom: 1px solid #1c1c1c;">
            <td style="padding: 14px 0; color: #f4f4f5; font-size: 13.5px; font-weight: 600;">{title}</td>
            <td style="padding: 14px 0; text-align: center; color: #a1a1aa; font-family: 'Courier New', Courier, monospace; font-size: 13px;">{qty}</td>
            <td style="padding: 14px 0; text-align: right; color: #C81D24; font-weight: 700; font-family: 'Courier New', Courier, monospace; font-size: 14px;">Rs. {tot:,.2f}</td>
        </tr>
        """
        items_text_list += f" - {title} (Qty: {qty}) : Rs. {tot:,.2f}\n"

    plain_text = f"""
DETECTIVE ZONE — CLASSIFIED DOSSIER ARCHIVE
============================================================
ORDER ACCEPTANCE CONFIRMATION
Order Number: #{order.order_number}
Order Date: {order_date}

Hello {order.customer_name},

Your investigation dossier has been accepted and is now in preparation in our evidence vault.

ORDER SUMMARY:
------------------------------------------------------------
Total Amount: Rs. {order.total_amount:,.2f}
Payment Status: Verified ({order.payment_method})
Expected Delivery: {delivery_date}
Delivery Address: {order.shipping_address}, {order.city or ''} {order.state or ''} - {order.postal_code or ''}

ITEMS INCLUDED:
{items_text_list}

Kind regards,
Detective Zone Operations Bureau
https://detectiveszone.com
============================================================
"""

    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030303; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #030303; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Luxury Card -->
        <table width="620" cellpadding="0" cellspacing="0" style="background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.95);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #000000; padding: 36px 30px 28px 30px; text-align: center; border-bottom: 2px solid #C81D24;">
              <img src="{LOGO_URL}" alt="Detective Zone" width="160" style="display: block; margin: 0 auto 14px auto; max-width: 160px; height: auto;" />
              <div style="font-size: 10px; color: #C81D24; text-transform: uppercase; letter-spacing: 3px; font-weight: 800; font-family: 'Courier New', Courier, monospace;">
                CONFIDENTIAL CASE ARCHIVE & EVIDENCE DISPATCH
              </div>
            </td>
          </tr>

          <!-- Accepted Banner (Red & Black Luxury) -->
          <tr>
            <td style="padding: 30px 36px 15px 36px;">
              <div style="background-color: #0d0405; border: 1px solid #7f1d1d; border-left: 4px solid #C81D24; border-radius: 8px; padding: 20px 24px;">
                <div style="font-size: 10px; color: #ef4444; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-family: 'Courier New', Courier, monospace; margin-bottom: 6px;">
                  [ CASE ACCEPTED · VAULT PACKAGING IN PROGRESS ]
                </div>
                <h2 style="margin: 0 0 6px 0; color: #ffffff; font-size: 17px; font-weight: 800; letter-spacing: 0.5px;">
                  Order Confirmed & Scheduled
                </h2>
                <p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.6;">
                  Your case dossier is scheduled for express courier pickup. Estimated delivery: <strong>{delivery_date}</strong>.
                </p>
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 15px 36px 35px 36px;">
              <p style="font-size: 15px; color: #ffffff; margin-top: 10px; font-weight: 600;">
                Dear {order.customer_name},
              </p>
              <p style="font-size: 13.5px; color: #a1a1aa; line-height: 1.7; margin-bottom: 22px;">
                Our forensic team has approved your evidence dossier <strong style="color: #C81D24; font-family: 'Courier New', Courier, monospace;">#{order.order_number}</strong>. All physical documents and classified sealed artifacts are being packed.
              </p>

              <!-- Order Breakdown Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; margin-top: 20px;">
                <thead>
                  <tr style="border-bottom: 1px solid #27272a; color: #71717a; font-size: 11px; text-transform: uppercase; font-family: 'Courier New', Courier, monospace;">
                    <th align="left" style="padding-bottom: 10px;">Item Title</th>
                    <th align="center" style="padding-bottom: 10px;">Qty</th>
                    <th align="right" style="padding-bottom: 10px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items_rows_html}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding-top: 18px; font-size: 14px; font-weight: 700; color: #ffffff; text-transform: uppercase; font-family: 'Courier New', Courier, monospace;">Total Amount:</td>
                    <td style="padding-top: 18px; text-align: right; font-size: 19px; font-weight: 800; color: #C81D24; font-family: 'Courier New', Courier, monospace;">Rs. {order.total_amount:,.2f}</td>
                  </tr>
                </tfoot>
              </table>

              <!-- Call to Action -->
              <div style="margin-top: 36px; text-align: center; background-color: #000000; border: 1px solid #1f1f23; border-radius: 10px; padding: 24px 20px;">
                <a href="{whatsapp_link}" style="display: inline-block; background-color: #C81D24; color: #ffffff; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 6px; box-shadow: 0 6px 25px rgba(200,29,36,0.35);">
                  Track via Dispatch Bureau
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 26px 30px; text-align: center; border-top: 1px solid #1c1c1f; font-size: 11px; color: #71717a;">
              <p style="margin: 0; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1.5px;">Detective Zone &copy; 2026</p>
              <p style="margin: 6px 0 0 0; color: #52525b; line-height: 1.5;">
                Classified Investigation Dossiers & Evidence Simulations · All Rights Reserved
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    dispatched = send_smtp_email(recipient=recipient, subject=subject, html_body=html_body, plain_text_body=plain_text)
    if dispatched:
        order.order_acceptance_email_sent = True
        order.email_status = "SENT"
    else:
        order.email_status = "FAILED"
    return dispatched


def send_delivery_date_updated_email(order, old_date: Optional[str] = None, new_date: Optional[str] = None) -> bool:
    """
    Notifies the customer when the expected delivery date is updated in luxury Red & Black design.
    """
    recipient = order.customer_email
    subject = f"Delivery Schedule Updated — #{order.order_number} [Detective Zone]"
    whatsapp_num = DEFAULT_WHATSAPP
    whatsapp_link = f"https://wa.me/91{whatsapp_num}?text=Hi%20Detective%20Zone,%20Delivery%20Date%20Update%20for%20Order%20%23{order.order_number}"

    plain_text = f"""
DETECTIVE ZONE — DISPATCH SCHEDULE UPDATE
============================================================
Order Number: #{order.order_number}
New Expected Delivery Date: {new_date or order.expected_delivery_date or 'Updated'}

Hello {order.customer_name},

Your expected delivery schedule has been updated to: {new_date or order.expected_delivery_date}.
Your evidence dossier is moving through express transit with BlueDart Express.

Kind regards,
Detective Zone Operations Bureau
https://detectiveszone.com
============================================================
"""

    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030303; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #030303; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Luxury Card -->
        <table width="620" cellpadding="0" cellspacing="0" style="background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.95);">
          <tr>
            <td style="background-color: #000000; padding: 36px 30px 28px 30px; text-align: center; border-bottom: 2px solid #C81D24;">
              <img src="{LOGO_URL}" alt="Detective Zone" width="160" style="display: block; margin: 0 auto 14px auto; max-width: 160px; height: auto;" />
              <div style="font-size: 10px; color: #C81D24; text-transform: uppercase; letter-spacing: 3px; font-weight: 800; font-family: 'Courier New', Courier, monospace;">
                DISPATCH TELEMETRY & COURIER SCHEDULE
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 36px 35px 36px;">
              <h2 style="margin: 0 0 10px 0; color: #ffffff; font-size: 18px; font-weight: 800;">
                Delivery Schedule Updated
              </h2>
              <p style="font-size: 13.5px; color: #a1a1aa; line-height: 1.6;">
                Hello <strong style="color: #ffffff;">{order.customer_name}</strong>, the expected delivery timeline for order <strong style="color: #C81D24; font-family: 'Courier New', Courier, monospace;">#{order.order_number}</strong> is now:
              </p>
              
              <div style="margin: 24px 0; background-color: #000000; border: 1px solid #1f1f23; border-radius: 8px; padding: 22px; text-align: center;">
                <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #71717a; display: block; font-family: 'Courier New', Courier, monospace;">Estimated Delivery</span>
                <span style="font-size: 20px; font-weight: 800; color: #C81D24; font-family: 'Courier New', Courier, monospace; display: block; margin-top: 6px;">{new_date or order.expected_delivery_date}</span>
              </div>

              <!-- Call to Action -->
              <div style="margin-top: 32px; text-align: center;">
                <a href="{whatsapp_link}" style="display: inline-block; background-color: #C81D24; color: #ffffff; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 6px; box-shadow: 0 6px 25px rgba(200,29,36,0.35);">
                  Inquire on WhatsApp
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #000000; padding: 26px 30px; text-align: center; border-top: 1px solid #1c1c1f; font-size: 11px; color: #71717a;">
              <p style="margin: 0; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1.5px;">Detective Zone &copy; 2026</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
    return send_smtp_email(recipient=recipient, subject=subject, html_body=html_body, plain_text_body=plain_text)


def send_order_status_update_email(order, new_status: str, tracking_number: Optional[str] = None, courier_name: Optional[str] = None) -> bool:
    """
    Dispatches professional status notification email in luxury Red & Black design.
    """
    recipient = order.customer_email
    subject = f"Order #{order.order_number} Status: {new_status} [Detective Zone]"
    whatsapp_num = DEFAULT_WHATSAPP
    whatsapp_link = f"https://wa.me/91{whatsapp_num}?text=Hi%20Detective%20Zone,%20Tracking%20Update%20for%20Order%20%23{order.order_number}"

    plain_text = f"""
DETECTIVE ZONE — DISPATCH TELEMETRY
============================================================
ORDER STATUS UPDATE: {new_status}
Order Number: #{order.order_number}

Hello {order.customer_name},

Your order status has been updated to: {new_status}.

Tracking Number: {tracking_number or order.tracking_number or 'In Courier Assignment'}
Courier Service: {courier_name or order.courier_name or 'BlueDart Express'}

Kind regards,
Detective Zone Operations Bureau
https://detectiveszone.com
============================================================
"""

    html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #030303; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e4e4e7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #030303; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Luxury Card -->
        <table width="620" cellpadding="0" cellspacing="0" style="background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.95);">
          <tr>
            <td style="background-color: #000000; padding: 36px 30px 28px 30px; text-align: center; border-bottom: 2px solid #C81D24;">
              <img src="{LOGO_URL}" alt="Detective Zone" width="160" style="display: block; margin: 0 auto 14px auto; max-width: 160px; height: auto;" />
              <div style="font-size: 10px; color: #C81D24; text-transform: uppercase; letter-spacing: 3px; font-weight: 800; font-family: 'Courier New', Courier, monospace;">
                DISPATCH TELEMETRY & TRACKING
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 36px 35px 36px;">
              <h2 style="margin: 0 0 10px 0; color: #ffffff; font-size: 18px; font-weight: 800;">
                Status Update: <span style="color: #C81D24;">{new_status}</span>
              </h2>
              <p style="font-size: 13.5px; color: #a1a1aa; line-height: 1.6;">
                Hello <strong style="color: #ffffff;">{order.customer_name}</strong>, your case dossier <strong style="color: #ffffff; font-family: 'Courier New', Courier, monospace;">#{order.order_number}</strong> is currently marked as <strong style="color: #C81D24;">{new_status}</strong>.
              </p>
              
              <div style="margin: 24px 0; background-color: #000000; border: 1px solid #1f1f23; border-radius: 8px; padding: 18px 20px; font-size: 13px;">
                <p style="margin: 5px 0; color: #71717a; font-family: 'Courier New', Courier, monospace;">Tracking ID: <strong style="color: #ffffff;">{tracking_number or order.tracking_number or 'Assigned upon courier pickup'}</strong></p>
                <p style="margin: 5px 0; color: #71717a; font-family: 'Courier New', Courier, monospace;">Courier Partner: <strong style="color: #ffffff;">{courier_name or order.courier_name or 'BlueDart Express'}</strong></p>
              </div>

              <!-- Call to Action -->
              <div style="margin-top: 32px; text-align: center;">
                <a href="{whatsapp_link}" style="display: inline-block; background-color: #C81D24; color: #ffffff; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 6px; box-shadow: 0 6px 25px rgba(200,29,36,0.35);">
                  Track on WhatsApp
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #000000; padding: 26px 30px; text-align: center; border-top: 1px solid #1c1c1f; font-size: 11px; color: #71717a;">
              <p style="margin: 0; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1.5px;">Detective Zone &copy; 2026</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
    return send_smtp_email(recipient=recipient, subject=subject, html_body=html_body, plain_text_body=plain_text)


def send_contact_notification_email(contact_msg) -> bool:
    """
    Sends notification to admin email in luxury Red & Black design when a public inquiry arrives.
    """
    recipient = settings.SMTP_FROM_EMAIL or settings.SMTP_USER
    if not recipient:
        return False

    subject = f"New Inquiry: {contact_msg.subject or 'Case Contact'} [Detective Zone]"
    plain_text = f"""
NEW CONTACT INQUIRY RECEIVED:
Name: {contact_msg.name}
Email: {contact_msg.email}
Subject: {contact_msg.subject}
Message:
{contact_msg.message}
"""
    html_body = f"""
<!DOCTYPE html>
<html>
<body style="background-color: #030303; color: #e4e4e7; font-family: sans-serif; padding: 30px 15px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.9);">
    <div style="background-color: #000000; padding: 25px; text-align: center; border-bottom: 2px solid #C81D24;">
      <img src="{LOGO_URL}" alt="Detective Zone" width="140" style="display: block; margin: 0 auto 10px auto;" />
      <div style="color: #C81D24; font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; font-family: monospace;">INBOUND CASE INQUIRY</div>
    </div>
    <div style="padding: 25px 30px;">
      <p style="margin: 6px 0; font-size: 13px;"><strong style="color: #71717a;">Name:</strong> <span style="color: #fff;">{contact_msg.name}</span></p>
      <p style="margin: 6px 0; font-size: 13px;"><strong style="color: #71717a;">Email:</strong> <span style="color: #fff;">{contact_msg.email}</span></p>
      <p style="margin: 6px 0; font-size: 13px;"><strong style="color: #71717a;">Subject:</strong> <span style="color: #fff;">{contact_msg.subject}</span></p>
      <div style="background-color: #000000; border: 1px solid #1f1f23; padding: 18px; border-radius: 8px; margin-top: 18px; font-size: 13px; line-height: 1.6; color: #d4d4d8;">
        <p style="margin: 0; white-space: pre-line;">{contact_msg.message}</p>
      </div>
    </div>
  </div>
</body>
</html>
"""
    return send_smtp_email(recipient=recipient, subject=subject, html_body=html_body, plain_text_body=plain_text)


def test_smtp_connection(to_email: Optional[str] = None) -> dict:
    """
    Diagnostics endpoint to test live SMTP credentials and send a luxury test message.
    """
    masked_user = mask_email(settings.SMTP_USER)
    diag = {
        "smtp_host": settings.SMTP_HOST,
        "smtp_port": settings.SMTP_PORT,
        "smtp_user": masked_user,
        "smtp_password_configured": bool(settings.SMTP_PASSWORD),
        "smtp_from_email": settings.SMTP_FROM_EMAIL or settings.SMTP_USER,
        "smtp_use_tls": settings.SMTP_USE_TLS,
        "smtp_use_ssl": settings.SMTP_USE_SSL,
        "status": "UNKNOWN",
        "message": ""
    }

    if not settings.SMTP_PASSWORD:
        diag["status"] = "NOT_CONFIGURED"
        diag["message"] = "SMTP_PASSWORD is missing in backend/.env"
        return diag

    target = to_email or settings.SMTP_FROM_EMAIL or settings.SMTP_USER
    subj = "Detective Zone — SMTP Verification Test"
    txt = f"SMTP Handshake Successful. Host: {settings.SMTP_HOST}:{settings.SMTP_PORT}"
    html = f"""
    <!DOCTYPE html>
    <html>
    <body style="background-color: #030303; color: #e4e4e7; font-family: sans-serif; padding: 30px 15px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #09090b; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.9);">
        <div style="background-color: #000000; padding: 25px; text-align: center; border-bottom: 2px solid #C81D24;">
          <img src="{LOGO_URL}" alt="Detective Zone" width="140" style="display: block; margin: 0 auto 10px auto;" />
          <div style="color: #C81D24; font-size: 10px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; font-family: monospace;">SMTP TELEMETRY VERIFICATION</div>
        </div>
        <div style="padding: 25px 30px; text-align: center;">
          <h3 style="color: #ffffff; margin-top: 0; font-size: 17px;">SMTP Connection Handshake Successful</h3>
          <p style="color: #a1a1aa; font-size: 13px;">Host: {settings.SMTP_HOST}:{settings.SMTP_PORT} · Dispatched to {mask_email(target)}</p>
        </div>
      </div>
    </body>
    </html>
    """
    ok = send_smtp_email(recipient=target, subject=subj, html_body=html, plain_text_body=txt)
    if ok:
        diag["status"] = "SUCCESS"
        diag["message"] = f"Test message successfully delivered to {mask_email(target)}"
        diag["error"] = None
    else:
        diag["status"] = "FAILED"
        diag["error"] = "Failed to deliver test message. Please verify Gmail App Password or provider settings."
        diag["message"] = diag["error"]
    return diag
