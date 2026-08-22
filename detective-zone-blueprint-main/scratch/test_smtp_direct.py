import smtplib
from app.core.config import settings

print("Checking SMTP settings...")
print("SMTP_HOST:", settings.SMTP_HOST)
print("SMTP_PORT:", settings.SMTP_PORT)
print("SMTP_USER:", settings.SMTP_USER)
print("SMTP_FROM_EMAIL:", settings.SMTP_FROM_EMAIL)
print("SMTP_PASSWORD Set:", bool(settings.SMTP_PASSWORD))

if not settings.SMTP_PASSWORD:
    print("\n[EXPLANATION] SMTP_PASSWORD is currently empty in backend/.env.")
    print("Google Gmail SMTP requires a 16-character App Password to connect to smtp.gmail.com:587 and deliver real emails to users.")
    print("All email dispatches are generated, logged and ready, but Gmail rejects unauthenticated SMTP connections until the App Password is provided.")
