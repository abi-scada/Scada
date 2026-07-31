from fastapi_mail import ConnectionConfig
from dotenv import load_dotenv
from pathlib import Path
import os

ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(ENV_PATH)  # Load .env file from Backend folder


def _clean(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    if (value.startswith('"') and value.endswith('"')) or (
        value.startswith("'") and value.endswith("'")
    ):
        value = value[1:-1].strip()
    return value


def _to_bool(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


MAIL_USERNAME = _clean(os.getenv("MAIL_USERNAME"))
MAIL_PASSWORD = _clean(os.getenv("MAIL_PASSWORD"))
MAIL_FROM = _clean(os.getenv("MAIL_FROM")) or MAIL_USERNAME
MAIL_PORT = int(_clean(os.getenv("MAIL_PORT")) or "587")
MAIL_SERVER = _clean(os.getenv("MAIL_SERVER")) or "smtp.gmail.com"
MAIL_FROM_NAME = _clean(os.getenv("MAIL_FROM_NAME")) or "SCADA System"
MAIL_STARTTLS = _to_bool(os.getenv("MAIL_STARTTLS"), True)
MAIL_SSL_TLS = _to_bool(os.getenv("MAIL_SSL_TLS"), False)

conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_FROM,
    MAIL_PORT=MAIL_PORT,
    MAIL_SERVER=MAIL_SERVER,
    MAIL_FROM_NAME=MAIL_FROM_NAME,
    MAIL_STARTTLS=MAIL_STARTTLS,
    MAIL_SSL_TLS=MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)
