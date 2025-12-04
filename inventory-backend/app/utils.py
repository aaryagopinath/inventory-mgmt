# from .crud import check_expired_items
from sqlalchemy.orm import Session
import smtplib
from email.mime.text import MIMEText
import asyncio
import resend


def send_notification(item_name: str):
    print(f"Notification: Item '{item_name}' has expired!")  # replace with email/push later

# def notify_and_delete_expired(db: Session):
#     expired_items = check_expired_items(db)
#     for item in expired_items:
#         if not item.notified:
#             send_notification(item.name)
#             item.notified = True
# #             db.delete(item)
#             db.commit()


def send_email(to_email: str, subject: str, body: str):
    sender_email = "aarya.gopinath210@gmail.com"
    sender_password = "cplusplus21"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:  # Example: Gmail SMTP
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)


# utils.py

resend.api_key = "re_GCYUVu12_29yWpKqxs59wBQgVJFeDvsNn"

def notify_out_of_stock(item_name: str):
    try:
        resend.Emails.send({
            "from": "aarya.gopinath210@gmail.com",
            "to": "aarya.gopinath210@gmail.com",
            "subject": "Stock Alert",
            "html": f"<p><strong>{item_name}</strong> is now OUT OF STOCK.</p>"
        })

        print(f"Email sent for {item_name}")
    except Exception as e:
        print("Email sending failed:", str(e))
