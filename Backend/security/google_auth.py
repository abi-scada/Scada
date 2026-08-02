from google.oauth2 import id_token
from google.auth.transport import requests
from dotenv import load_dotenv
from fastapi import HTTPException
import os

load_dotenv()

G_CLIENT_ID = os.getenv("G_CLIENT_ID")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")

def verify_admin(credential:str):
    try:
        user = id_token.verify_oauth2_token(
            credential,
            requests.Request(),
            G_CLIENT_ID,
            clock_skew_in_seconds=30
        )
        print("token verified")
        print(user)
        
    except Exception as e:
        import traceback
        traceback.print_exc()      # <-- important
        print("ERROR:", repr(e))   # <-- important

        raise HTTPException(
            status_code=401,
            detail=str(e)
        )
    if not user.get("email_verified", False):
        raise HTTPException(
            status_code=401,
            detail = "Email not verified"
        )
    if user["email"].lower() != ADMIN_EMAIL.lower():
        raise HTTPException(
            status_code=403,
            detail = "Access Denied"
        )
        
    return user

