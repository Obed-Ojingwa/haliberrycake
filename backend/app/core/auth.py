# C:\Users\Melody\Documents\haliberrycake\backend\app\core\auth.py
from datetime import datetime, timedelta, timezone
from typing import Optional

import bcrypt
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from app.core.config import settings
from app.schemas.auth import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


# ── Password helpers (using bcrypt directly — avoids passlib compat issues) ──

def hash_password(password: str) -> str:
    """Hash a plain text password using bcrypt."""
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plain text password against a bcrypt hash."""
    try:
        return bcrypt.checkpw(
            plain.encode("utf-8"),
            hashed.encode("utf-8")
        )
    except Exception:
        return False


# ── Token helpers ─────────────────────────────────────────────────

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
    )
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.algorithm]
        )
        email: str | None = payload.get("sub")
        if email is None:
            raise credentials_exception
        return TokenData(email=email)
    except JWTError:
        raise credentials_exception


def get_current_admin(token: str = Depends(oauth2_scheme)) -> TokenData:
    """Protect admin-only endpoints with this dependency."""
    return decode_token(token)



# # C:\Users\Melody\Documents\haliberrycake\backend\app\core\auth.py
# from datetime import datetime, timedelta, timezone
# from typing import Optional

# from jose import JWTError, jwt
# from passlib.context import CryptContext
# from fastapi import Depends, HTTPException, status
# from fastapi.security import OAuth2PasswordBearer

# from app.core.config import settings
# from app.schemas.auth import TokenData

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


# # ── Password helpers ──────────────────────────────────────────────

# def verify_password(plain: str, hashed: str) -> bool:
#     return pwd_context.verify(plain, hashed)


# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)


# # ── Token helpers ─────────────────────────────────────────────────

# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
#     to_encode = data.copy()
#     expire = datetime.now(timezone.utc) + (
#         expires_delta or timedelta(minutes=settings.access_token_expire_minutes)
#     )
#     to_encode.update({"exp": expire})
#     return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)



# def decode_token(token: str) -> TokenData:
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )

#     try:
#         payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
#         email: str | None = payload.get("sub")
#         if email is None:
#             raise credentials_exception
#         return TokenData(email=email)
#     except JWTError:
#         raise credentials_exception


# # ── FastAPI dependency ────────────────────────────────────────────

# def get_current_admin(token: str = Depends(oauth2_scheme)) -> TokenData:
#     """Protect any admin-only endpoint with this dependency."""
#     return decode_token(token)