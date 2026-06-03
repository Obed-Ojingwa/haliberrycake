# C:\Users\Melody\Documents\haliberrycake\backend\app\main.py
import logging
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.database.session import engine, Base
from app.api import auth, products, cake_classes, gallery, testimonials, inquiries, cic
from app.api import site_settings 
 

# ── Logging ──────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("haliberry")

LOCAL_UPLOAD_DIR = Path("/tmp/haliberry-uploads")


# ── Lifespan ─────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting Haliberry Cake API — env: {settings.app_env}")
    logger.info(f"CORS origins: {settings.cors_origins}")
    try:
        if settings.app_env != "production":
            Base.metadata.create_all(bind=engine)
            LOCAL_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
            logger.info("Dev: tables ensured, upload dir ready")
        else:
            import sqlalchemy
            with engine.connect() as conn:
                conn.execute(sqlalchemy.text("SELECT 1"))
            logger.info("Production: database connection OK")
    except Exception as e:
        logger.error(f"STARTUP ERROR: {e}")
        raise
    yield
    logger.info("Shutdown complete")


# ── App ───────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Haliberry Cake API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs" if settings.app_env != "production" else None,
    redoc_url="/api/redoc" if settings.app_env != "production" else None,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# ── CORS (added ONCE) ─────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static files (dev only) ───────────────────────────────────────
if settings.app_env != "production":
    LOCAL_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    app.mount(
        "/static/uploads",
        StaticFiles(directory=str(LOCAL_UPLOAD_DIR)),
        name="uploads",
    )

# ── Routers ───────────────────────────────────────────────────────
API_PREFIX = "/api/v1"

app.include_router(auth.router,         prefix=API_PREFIX)
app.include_router(products.router,     prefix=API_PREFIX)
app.include_router(cake_classes.router, prefix=API_PREFIX)
app.include_router(gallery.router,      prefix=API_PREFIX)
app.include_router(testimonials.router, prefix=API_PREFIX)
app.include_router(inquiries.router,    prefix=API_PREFIX)
app.include_router(cic.router,          prefix=API_PREFIX)
app.include_router(site_settings.router, prefix="/api/v1")


# ── Health check ─────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "Haliberry Cake API",
        "env": settings.app_env,
        "cors_origins": settings.cors_origins,
    }

# import logging
# from pathlib import Path
# from contextlib import asynccontextmanager

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from slowapi import Limiter
# from slowapi.util import get_remote_address
# from slowapi.errors import RateLimitExceeded
# from slowapi import _rate_limit_exceeded_handler

# from app.core.config import settings
# from app.database.session import engine, Base
# from app.api import auth, products, cake_classes, gallery, testimonials, inquiries, cic

# # ── Logging ─────────────────────────────
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger("haliberry")

# LOCAL_UPLOAD_DIR = Path("/tmp/haliberry-uploads")

# # ── Rate limiter ────────────────────────
# limiter = Limiter(key_func=get_remote_address)

# # ── Lifespan (ONLY ONCE) ────────────────
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     logger.info(f"Starting API: {settings.app_env}")

#     try:
#         if settings.app_env != "production":
#             Base.metadata.create_all(bind=engine)
#             LOCAL_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
#         else:
#             with engine.connect() as conn:
#                 conn.execute(__import__("sqlalchemy").text("SELECT 1"))

#         logger.info("Database OK")
#     except Exception as e:
#         logger.error(f"Startup error: {e}")
#         raise

#     yield
#     logger.info("Shutdown complete")

# # ── App (ONLY ONCE) ─────────────────────
# app = FastAPI(
#     title="Haliberry Cake API",
#     version="1.0.0",
#     lifespan=lifespan,
#     docs_url="/api/docs" if settings.app_env != "production" else None,
#     redoc_url="/api/redoc" if settings.app_env != "production" else None,
# )

# # ── Middleware ──────────────────────────
# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=settings.cors_origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ── Static files ────────────────────────
# if settings.app_env != "production":
#     app.mount(
#         "/static/uploads",
#         StaticFiles(directory=str(LOCAL_UPLOAD_DIR)),
#         name="uploads",
#     )

# # ── Routers ─────────────────────────────
# API_PREFIX = "/api/v1"

# app.include_router(auth.router, prefix=API_PREFIX)
# app.include_router(products.router, prefix=API_PREFIX)
# app.include_router(cake_classes.router, prefix=API_PREFIX)
# app.include_router(gallery.router, prefix=API_PREFIX)
# app.include_router(testimonials.router, prefix=API_PREFIX)
# app.include_router(inquiries.router, prefix=API_PREFIX)
# app.include_router(cic.router, prefix=API_PREFIX)

# # ── Health check ────────────────────────
# @app.get("/health")
# def health():
#     return {
#         "status": "ok",
#         "service": "Haliberry API",
#         "env": settings.app_env,
#         "message": "Health check updated after debugging"
#     }


# # C:\Users\Melody\Documents\haliberrycake\backend\app\main.py
# import logging
# from pathlib import Path
# from contextlib import asynccontextmanager

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from slowapi import Limiter, _rate_limit_exceeded_handler
# from slowapi.util import get_remote_address
# from slowapi.errors import RateLimitExceeded

# from app.core.config import settings
# from app.database.session import engine, Base
# from app.api import auth, products, cake_classes, gallery, testimonials, inquiries, cic

# # ── Logging — prints to Render log stream ────────────────────────
# logging.basicConfig(
#     level=logging.INFO,
#     format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
# )
# logger = logging.getLogger("haliberry")

# LOCAL_UPLOAD_DIR = Path("/tmp/haliberry-uploads")


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     logger.info(f"Starting Haliberry Cake API — environment: {settings.app_env}")
#     try:
#         # In dev, auto-create tables. In production, always use Alembic migrations.
#         if settings.app_env != "production":
#             Base.metadata.create_all(bind=engine)
#             LOCAL_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
#             logger.info("Dev mode: tables ensured, local upload dir ready.")
#         else:
#             # Test the DB connection on startup so we fail fast with a clear error
#             with engine.connect() as conn:
#                 conn.execute(__import__("sqlalchemy").text("SELECT 1"))
#             logger.info("Production: database connection verified.")
#     except Exception as e:
#         logger.error(f"STARTUP ERROR: {e}")
#         raise  # re-raise so Render shows the real error in logs
#     yield
#     logger.info("Haliberry Cake API shutting down.")


# limiter = Limiter(key_func=get_remote_address)

# app = FastAPI(
#     title="Haliberry Cake API",
#     version="1.0.0",
#     description="Backend API for Haliberry Cake luxury bakery platform.",
#     lifespan=lifespan,
#     docs_url="/api/docs"  if settings.app_env != "production" else None,
#     redoc_url="/api/redoc" if settings.app_env != "production" else None,
# )

# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# # ── CORS ──────────────────────────────────────────────────────────
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=settings.cors_origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ── Static file serving (dev only) ───────────────────────────────
# if settings.app_env != "production":
#     LOCAL_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
#     app.mount(
#         "/static/uploads",
#         StaticFiles(directory=str(LOCAL_UPLOAD_DIR)),
#         name="uploads",
#     )

# # ── API Routers ───────────────────────────────────────────────────
# API_PREFIX = "/api/v1"

# app.include_router(auth.router,         prefix=API_PREFIX)
# app.include_router(products.router,     prefix=API_PREFIX)
# app.include_router(cake_classes.router, prefix=API_PREFIX)
# app.include_router(gallery.router,      prefix=API_PREFIX)
# app.include_router(testimonials.router, prefix=API_PREFIX)
# app.include_router(inquiries.router,    prefix=API_PREFIX)
# app.include_router(cic.router,          prefix=API_PREFIX)


# # ── Health check ──────────────────────────────────────────────────
# @app.get("/health", tags=["Health"])
# def health():
#     return {
#         "status": "ok",
#         "service": "Haliberry Cake API",
#         "environment": settings.app_env,
#     }



# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Create tables on startup in dev (use Alembic in production)
#     Base.metadata.create_all(bind=engine)
#     # Ensure local upload dir exists in dev
#     if settings.app_env != "production":
#         LOCAL_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
#     yield


# limiter = Limiter(key_func=get_remote_address)

# app = FastAPI(
#     title="Haliberry Cake API",
#     version="1.0.0",
#     description="Backend API for Haliberry Cake luxury bakery platform.",
#     lifespan=lifespan,
#     # Swagger only available in debug/dev mode
#     docs_url="/api/docs"  if settings.app_env != "production" else None,
#     redoc_url="/api/redoc" if settings.app_env != "production" else None,
# )

# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# # ── CORS ──────────────────────────────────────────────────────────
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=settings.cors_origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ── Serve local uploads in dev mode ───────────────────────────────
# if settings.app_env != "production":
#     LOCAL_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
#     app.mount(
#         "/static/uploads",
#         StaticFiles(directory=str(LOCAL_UPLOAD_DIR)),
#         name="uploads",
#     )

# # ── Routers ───────────────────────────────────────────────────────
# API_PREFIX = "/api/v1"

# app.include_router(auth.router,         prefix=API_PREFIX)
# app.include_router(products.router,     prefix=API_PREFIX)
# app.include_router(cake_classes.router, prefix=API_PREFIX)
# app.include_router(gallery.router,      prefix=API_PREFIX)
# app.include_router(testimonials.router, prefix=API_PREFIX)
# app.include_router(inquiries.router,    prefix=API_PREFIX)
# app.include_router(cic.router,          prefix=API_PREFIX)


# # ── Health check ──────────────────────────────────────────────────
# @app.get("/health", tags=["Health"])
# def health():
#     return {
#         "status": "ok",
#         "service": "Haliberry Cake API",
#         "environment": settings.app_env,
#     }


# # C:\Users\Melody\Documents\haliberrycake\backend\app\main.py
# from pathlib import Path
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from slowapi import Limiter, _rate_limit_exceeded_handler
# from slowapi.util import get_remote_address
# from slowapi.errors import RateLimitExceeded
# from contextlib import asynccontextmanager

# from app.core.config import settings
# from app.database.session import engine, Base
# from app.api import auth, products, cake_classes, gallery, testimonials, inquiries, cic

# LOCAL_UPLOAD_DIR = Path("/tmp/haliberry-uploads")


# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # Create tables on startup in dev (use Alembic in production)
#     Base.metadata.create_all(bind=engine)
#     # Ensure local upload dir exists in dev
#     if settings.app_env != "production":
#         LOCAL_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
#     yield


# limiter = Limiter(key_func=get_remote_address)

# app = FastAPI(
#     title="Haliberry Cake API",
#     version="1.0.0",
#     description="Backend API for Haliberry Cake luxury bakery platform.",
#     lifespan=lifespan,
#     # Swagger only available in debug/dev mode
#     docs_url="/api/docs"  if settings.app_env != "production" else None,
#     redoc_url="/api/redoc" if settings.app_env != "production" else None,
# )

# app.state.limiter = limiter
# app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# # ── CORS ──────────────────────────────────────────────────────────
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=settings.cors_origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ── Serve local uploads in dev mode ───────────────────────────────
# if settings.app_env != "production":
#     LOCAL_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
#     app.mount(
#         "/static/uploads",
#         StaticFiles(directory=str(LOCAL_UPLOAD_DIR)),
#         name="uploads",
#     )

# # ── Routers ───────────────────────────────────────────────────────
# API_PREFIX = "/api/v1"

# app.include_router(auth.router,         prefix=API_PREFIX)
# app.include_router(products.router,     prefix=API_PREFIX)
# app.include_router(cake_classes.router, prefix=API_PREFIX)
# app.include_router(gallery.router,      prefix=API_PREFIX)
# app.include_router(testimonials.router, prefix=API_PREFIX)
# app.include_router(inquiries.router,    prefix=API_PREFIX)
# app.include_router(cic.router,          prefix=API_PREFIX)


# # ── Health check ──────────────────────────────────────────────────
# @app.get("/health", tags=["Health"])
# def health():
#     return {
#         "status": "ok",
#         "service": "Haliberry Cake API",
#         "environment": settings.app_env,
#     }


# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from app.core.config import settings
# from app.api import auth, cake_classes, cic, gallery, inquiries, products, testimonials

# app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

# # Set all CORS enabled origins
# if settings.BACKEND_CORS_ORIGINS:
#     app.add_middleware(
#         CORSMiddleware,
#         allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
#         allow_credentials=True,
#         allow_methods=["*"],
#         allow_headers=["*"],
#     )

# # Include routers
# app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
# app.include_router(cake_classes.router, prefix=f"{settings.API_V1_STR}/cake-classes", tags=["cake-classes"])
# app.include_router(cic.router, prefix=f"{settings.API_V1_STR}/cic", tags=["cic"])
# app.include_router(gallery.router, prefix=f"{settings.API_V1_STR}/gallery", tags=["gallery"])
# app.include_router(inquiries.router, prefix=f"{settings.API_V1_STR}/inquiries", tags=["inquiries"])
# app.include_router(products.router, prefix=f"{settings.API_V1_STR}/products", tags=["products"])
# app.include_router(testimonials.router, prefix=f"{settings.API_V1_STR}/testimonials", tags=["testimonials"])

# @app.get("/")
# def root():
#     return {"message": "Welcome to HaliberryCake API"}
