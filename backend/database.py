import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Altere usuario, senha e porta conforme seu MySQL local
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:sua_senha@localhost:3306/petsco_db"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()