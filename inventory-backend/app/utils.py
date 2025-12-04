# from .crud import check_expired_items
from sqlalchemy.orm import Session
import smtplib
from email.mime.text import MIMEText
import asyncio
import resend


def send_notification(item_name: str):
    print(f"Notification: Item '{item_name}' has expired!")  # replace with email/push later






