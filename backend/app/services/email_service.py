import requests

from app.core.config import settings


def send_reset_email(
    email: str,
    full_name: str,
    reset_link: str,
):

    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
    }

    body = {
        "sender": {
            "name": settings.MAIL_FROM_NAME,
            "email": settings.MAIL_FROM_EMAIL,
        },
        "to": [
            {
                "email": email,
                "name": full_name,
            }
        ],
        "subject": "Reset Your Password",
        "htmlContent": f"""
        <html>

        <body>

        <h2>Hello {full_name},</h2>

        <p>
        We received a request to reset your password.
        </p>

        <p>

        <a href="{reset_link}"
           style="
           background:#0E4B8E;
           color:white;
           padding:12px 22px;
           text-decoration:none;
           border-radius:8px;">

           Reset Password

        </a>

        </p>

        <p>

        This link expires in 30 minutes.

        </p>

        <p>

        If you didn't request this, ignore this email.

        </p>

        </body>

        </html>
        """,
    }

    response = requests.post(
        url,
        headers=headers,
        json=body,
        timeout=30,
    )

    response.raise_for_status()