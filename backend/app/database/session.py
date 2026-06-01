# C:\Users\Melody\Documents\haliberrycake\backend\app\database\session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.core.config import settings

# Supabase free tier allows max ~15 direct connections.
# pool_size=2 + max_overflow=3 = max 5 total — safe for free tier.
# NullPool is safer for serverless/Render free tier which may kill idle workers.
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=2,
    max_overflow=3,
    pool_timeout=30,
    pool_recycle=1800,   # recycle connections every 30 min
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """All SQLAlchemy models inherit from this."""
    pass


# ── FastAPI dependency ────────────────────────────────────────────

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# # C:\Users\Melody\Documents\haliberrycake\backend\app\database\session.py
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker, DeclarativeBase

# from app.core.config import settings

# engine = create_engine(
#     settings.database_url,
#     pool_pre_ping=True,          # reconnect on stale connections
#     pool_size=5,
#     max_overflow=10,
# )

# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# class Base(DeclarativeBase):
#     """All SQLAlchemy models inherit from this."""
#     pass


# # ── FastAPI dependency ────────────────────────────────────────────

# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()