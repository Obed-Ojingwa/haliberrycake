# test_db.py

from sqlalchemy import text
from app.database.session import engine

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT NOW()"))
        print("✅ Database connected")
        print(result.scalar())
except Exception as e:
    print("❌ Database connection failed")
    print(str(e))