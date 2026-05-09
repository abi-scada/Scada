from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url = "mysql://root:wxsXoBAQEasGEEwVlsHtTTdujUOBTWpe@turntable.proxy.rlwy.net:50772/railway"
engine = create_engine(db_url)
SL = sessionmaker(autocommit=False, autoflush=False,bind = engine)
