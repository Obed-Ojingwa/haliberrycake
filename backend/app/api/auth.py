# C:\Users\Melody\Documents\haliberrycake\backend\app\api\auth.py
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, Token
from app.core.auth import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


# @router.post("/login", response_model=Token)
# def login(payload: LoginRequest, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.email == payload.email, User.is_active == True).first()

#     if not user or not verify_password(payload.password, user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect email or password",
#         )

#     # Update last login
#     user.last_login = datetime.now(timezone.utc)
#     db.commit()

#     token = create_access_token({"sub": user.email})
#     return Token(access_token=token)

@router.post("/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):

    print("EMAIL RAW:", repr(payload.email))

    user = db.query(User).filter(User.email == payload.email).first()

    print("USER FOUND:", user)

    if not user:
        raise HTTPException(401, "User not found")

    print("PASSWORD CHECK:", verify_password(payload.password, user.hashed_password))

    if not verify_password(payload.password, user.hashed_password):
        raise HTTPException(401, "Wrong password")

    return {"ok": True}