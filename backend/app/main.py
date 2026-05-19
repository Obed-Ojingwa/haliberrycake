from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, cake_classes, cic, gallery, inquiries, products, testimonials

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(cake_classes.router, prefix=f"{settings.API_V1_STR}/cake-classes", tags=["cake-classes"])
app.include_router(cic.router, prefix=f"{settings.API_V1_STR}/cic", tags=["cic"])
app.include_router(gallery.router, prefix=f"{settings.API_V1_STR}/gallery", tags=["gallery"])
app.include_router(inquiries.router, prefix=f"{settings.API_V1_STR}/inquiries", tags=["inquiries"])
app.include_router(products.router, prefix=f"{settings.API_V1_STR}/products", tags=["products"])
app.include_router(testimonials.router, prefix=f"{settings.API_V1_STR}/testimonials", tags=["testimonials"])

@app.get("/")
def root():
    return {"message": "Welcome to HaliberryCake API"}
