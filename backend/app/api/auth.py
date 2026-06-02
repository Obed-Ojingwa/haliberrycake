# C:\Users\Melody\Documents\haliberrycake\backend\app\api\auth.py
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import logging

from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, Token
from app.core.auth import verify_password, create_access_token, hash_password
from app.core.config import settings

logger = logging.getLogger("haliberry.auth")
router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    try:
        logger.info(f"Login attempt for: {payload.email}")

        user = db.query(User).filter(
            User.email == payload.email,
            User.is_active == True
        ).first()

        if not user:
            logger.warning(f"Login failed — user not found: {payload.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        logger.info(f"User found: {user.email}, hash prefix: {user.hashed_password[:10]}")

        try:
            password_ok = verify_password(payload.password, user.hashed_password)
            logger.info(f"Password check result: {password_ok}")
        except Exception as e:
            logger.error(f"Error in verify_password: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Password verification error: {str(e)}",
            )

        if not password_ok:
            logger.warning(f"Login failed — wrong password for: {payload.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        try:
            user.last_login = datetime.now(timezone.utc)
            db.commit()
            logger.info(f"Updated last login for: {user.email}")
        except Exception as e:
            logger.error(f"Error updating last login: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database update error: {str(e)}",
            )

        try:
            token = create_access_token({"sub": user.email})
            logger.info(f"Login successful: {user.email}")
            return Token(access_token=token)
        except Exception as e:
            logger.error(f"Error creating access token: {e}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Token creation error: {str(e)}",
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in login: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}",
        )


@router.get("/debug-users")
def debug_users(db: Session = Depends(get_db)):
    """
    TEMPORARY debug endpoint — shows all users in DB (no passwords).
    Visit: https://haliberrycake.onrender.com/api/v1/auth/debug-users
    DELETE this endpoint once login is working.
    """
    users = db.query(User).all()
    return {
        "count": len(users),
        "users": [
            {
                "id": str(u.id),
                "email": u.email,
                "full_name": u.full_name,
                "is_admin": u.is_admin,
                "is_active": u.is_active,
                "hash_prefix": u.hashed_password[:7] if u.hashed_password else None,
                "hash_length": len(u.hashed_password) if u.hashed_password else 0,
                "created_at": str(u.created_at),
            }
            for u in users
        ]
    }


@router.post("/reset-admin-password")
def reset_admin_password(
    email: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    """
    TEMPORARY endpoint — resets a user's password directly.
    Use once to fix the password, then DELETE this endpoint.

    Call via curl:
    curl -X POST "https://haliberrycake.onrender.com/api/v1/auth/reset-admin-password?email=admin44@haliberrycake.co.uk&new_password=YourNewPassword123"
    """
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return {"error": f"User not found: {email}"}

        user.hashed_password = hash_password(new_password)
        db.commit()
        return {
            "success": True,
            "message": f"Password reset for {email}",
            "new_hash_prefix": user.hashed_password[:7],
        }
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__}


@router.get("/test-hash")
def test_hash():
    try:
        from app.core.auth import hash_password
        hashed = hash_password("test123")
        return {"input": "test123", "hash": hashed, "length": len(hashed)}
    except Exception as e:
        return {"error": str(e), "type": type(e).__name__}


# # C:\Users\Melody\Documents\haliberrycake\backend\app\api\auth.py
# from datetime import datetime, timezone
# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session

# from app.database.session import get_db
# from app.models.user import User
# from app.schemas.auth import LoginRequest, Token
# from app.core.auth import verify_password, create_access_token

# router = APIRouter(prefix="/auth", tags=["Authentication"])


# # @router.post("/login", response_model=Token)
# # def login(payload: LoginRequest, db: Session = Depends(get_db)):
# #     user = db.query(User).filter(User.email == payload.email, User.is_active == True).first()

# #     if not user or not verify_password(payload.password, user.hashed_password):
# #         raise HTTPException(
# #             status_code=status.HTTP_401_UNAUTHORIZED,
# #             detail="Incorrect email or password",
# #         )

# #     # Update last login
# #     user.last_login = datetime.now(timezone.utc)
# #     db.commit()

# #     token = create_access_token({"sub": user.email})
# #     return Token(access_token=token)

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