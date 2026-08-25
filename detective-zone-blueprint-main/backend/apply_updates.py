import os
import sys

# Updates to backend/app/api/v1/payments.py
payments_file = os.path.join('backend', 'app', 'api', 'v1', 'payments.py')
with open(payments_file, 'r', encoding='utf-8') as f_in:
    code = f_in.read()

# Make sure get_payment_status returns seconds_remaining, is_expired, payment_created_at, payment_expires_at
# And checks PhonePe status API accurately

print('Current payments.py length:', len(code))
