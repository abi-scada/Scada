from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv
from pathlib import Path
import os 


ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(ENV_PATH)  # Load .env file from Backend folder

db_url = f"mysql://avnadmin:{os.getenv("DB_PASSWORD")}@mysql-abiscada-abiscada143.c.aivencloud.com:12742/defaultdb"

engine = create_engine(db_url)
SL = sessionmaker(autocommit=False, autoflush=False,bind = engine)
