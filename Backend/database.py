from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url = "mysql+pymysql://root:BKcdOWtIYeYRzXKwUzKcyJsUcMYXMYMD@turntable.proxy.rlwy.net:25795/scada"
engine = create_engine(db_url)
SL = sessionmaker(autocommit=False, autoflush=False,bind = engine)
