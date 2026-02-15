from sqlalchemy import Column, Integer, Boolean, Float, Text, String, ForeignKey, Date, Time, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, nullable=False, index= True, autoincrement = True)
    name = Column(String(100), nullable=False, index=True)
    email = Column(String(150), nullable=False)
    password = Column(Text, nullable=False)
    
    machines = relationship("Machines",
                            back_populates="users",
                            passive_deletes=True
                            )
    
class Machines(Base):
    __tablename__= "machines"
    mid = Column(Integer, primary_key=True, index=True, autoincrement = True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE") )
    htsc = Column(String(20))
    mname = Column(String(100))
    location = Column(String(100))
    capacity = Column(Integer)
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    users = relationship("Users",
                         back_populates="machines",
                         passive_deletes=True
                         )
    data = relationship("TurbineData",
                        back_populates="machine",
                        cascade="all, delete-orphan", 
                        passive_deletes=True
                        )
    alarms = relationship(
        "Alarm",
        back_populates="mac",
        cascade="all, delete-orphan",
        passive_deletes=True  
    )
    
class TurbineData(Base):
    
    __tablename__ = "turbine_data"
    tid = Column(Integer, primary_key=True, index=True, autoincrement = True)
    mcId = Column(Integer, ForeignKey("machines.mid", ondelete="CASCADE"), index=True, nullable=False)
    grpm = Column(Integer, nullable=False)
    rrpm = Column(Integer, nullable=False)
    status = Column(String(100), nullable=False)
    hyd_press = Column(Integer, nullable=False)
    nac_pos = Column(Integer, nullable=False)
    wind = Column(Float, nullable=False)
    power = Column(Float, nullable=False)
    pf = Column(Float, nullable=False)
    fq = Column(Float, nullable=False)
    l1 = Column(Integer, nullable=False)
    l2 = Column(Integer, nullable=False)
    l3 = Column(Integer, nullable=False)
    i1 = Column(Integer, nullable=False)
    i2 = Column(Integer, nullable=False)
    i3 = Column(Integer, nullable=False)
    amb_temp = Column(Integer, nullable=False)
    nac_temp = Column(Integer, nullable=False)
    gb_temp = Column(Integer, nullable=False)
    go_temp = Column(Integer, nullable=False)
    g1_temp = Column(Integer, nullable=False)
    g2_temp = Column(Integer, nullable=False)
    thy_temp = Column(Integer, nullable=False)
    main_temp = Column(Integer, nullable=False)
    g1_kw = Column(Integer, nullable=False)
    g2_kw = Column(Integer, nullable=False)
    total_kw = Column(Integer, nullable=False)
    g1_hrs = Column(Integer, nullable=False)
    g2_hrs = Column(Integer, nullable=False)
    total_hrs = Column(Integer, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    
    machine = relationship(
        "Machines",
        back_populates="data",
        passive_deletes=True
        )
    
class Alarm(Base):
    __tablename__ = "alarms"

    id = Column(Integer, primary_key=True)
    mc_id = Column(Integer, ForeignKey("machines.mid", ondelete="CASCADE"))
    active = Column(Boolean, default=True)
    acknowledged = Column(Boolean, default=False)
    last_status = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    cleared_at = Column(DateTime, nullable=True)
    
    mac = relationship(
        "Machines",
        back_populates="alarms",
        passive_deletes=True
        )

    