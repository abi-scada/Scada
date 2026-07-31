from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

db_url = "mysql://avnadmin:AVNS_qplbrG0Ox0nm1j4ZIg-@mysql-abiscada-abiscada143.c.aivencloud.com:12742/defaultdb"

engine = create_engine(db_url)
SL = sessionmaker(autocommit=False, autoflush=False,bind = engine)
