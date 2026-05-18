# C:\Users\Melody\Documents\haliberrycake\backend\seed.py
"""
Run once after `alembic upgrade head` to create the initial admin user.

    cd backend
    python seed.py

The admin email and password are read from your .env file via Settings.
"""
import sys
import os

# Make sure app is importable from this script's location
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy.exc import IntegrityError
from app.database.session import SessionLocal, engine, Base
from app.models.user import User
from app.core.auth import hash_password
from app.core.config import settings

# ── Create tables if they don't exist yet (dev convenience) ──────
Base.metadata.create_all(bind=engine)


def seed_admin() -> None:
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == settings.admin_email).first()
        if existing:
            print(f"✅  Admin user already exists: {settings.admin_email}")
            return

        admin = User(
            email=settings.admin_email,
            hashed_password=hash_password(settings.admin_password),
            full_name="Haliberry Admin",
            is_admin=True,
            is_active=True,
        )
        db.add(admin)
        db.commit()
        print(f"🎂  Admin user created successfully!")
        print(f"    Email:    {settings.admin_email}")
        print(f"    Password: {settings.admin_password}")
        print(f"\n    ⚠️  Change this password immediately after first login.")

    except IntegrityError:
        db.rollback()
        print(f"⚠️  Could not create admin — email already exists.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()