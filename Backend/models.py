from pydantic import BaseModel,EmailStr
from datetime import datetime
from typing import Optional


class GoogleToken(BaseModel):
    credential:str
    
class EmailRequest(BaseModel):
    email: EmailStr
    subject: str
    message: str

class Users(BaseModel):
#    id: int 
    name: str 
    email: str
    password: str

class LoginRequest(BaseModel):
    name: str
    password : str
    
class Machines(BaseModel):
    mid : int
    user_id : int
    htsc : str
    mname : str
    location : str
    capacity : int
    
    latitude: float
    longitude: float
    class Config:
        from_attributes = True

class TurbineData(BaseModel):
#    tid : int
    mcId : int
    grpm : int
    rrpm : int
    status : str
    hyd_press : int
    nac_pos : int
    wind : float
    power : float
    pf : float
    fq : float
    l1 : int
    l2 : int
    l3 : int
    i1 : int
    i2 : int
    i3 : int
    amb_temp : int
    nac_temp : int
    gb_temp : int
    go_temp : int
    g1_temp : int
    g2_temp : int
    thy_temp : int
    main_temp : int
    g1_kw : int
    g2_kw : int
    total_kw : int
    g1_hrs : int
    g2_hrs : int
    total_hrs : int
    created_at : Optional[datetime] = None
    
    