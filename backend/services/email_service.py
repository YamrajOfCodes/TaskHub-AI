import os
import resend

from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv(
    "RESEND_API_KEY"
)


def send_email(
    to_email,
    subject,
    message
):

    resend.Emails.send({

        "from": "onboarding@resend.dev",

        "to": to_email,

        "subject": subject,

        "html": f"""
        <h2>TaskHub Notification</h2>
        <p>{message}</p>
        """
    })