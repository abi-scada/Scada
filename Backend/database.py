from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from dotenv import load_dotenv
from pathlib import Path
import os 

ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(ENV_PATH) 

db_url = f"mysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"


engine = create_engine(db_url)
SL = sessionmaker(autocommit=False, autoflush=False,bind = engine)
