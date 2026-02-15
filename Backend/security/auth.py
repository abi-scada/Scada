from datetime import datetime, timedelta
from jose import jwt 
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends


SECRET_KEY = "ABINESH@SCADA"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow()
    timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

oauth = OAuth2PasswordBearer(tokenUrl="login")

def get_user_id(token:str = Depends(oauth)):
    #print("Rec Token: ",token)
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM] )
    #print(payload)
    user_id = payload.get('id')
    #us = jwt.get_unverified_claims(token)
    #print("us : ", us)
    #print("user id decoded :", user_id)
    return user_id