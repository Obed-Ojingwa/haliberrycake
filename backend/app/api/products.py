# C:\Users\Melody\Documents\haliberrycake\backend\app\api\products.py
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductListResponse
from app.core.auth import get_current_admin
from app.services.storage import upload_image

router = APIRouter(prefix="/products", tags=["Products"])


# ── Public endpoints ──────────────────────────────────────────────

@router.get("", response_model=ProductListResponse)
def list_products(
    db: Session = Depends(get_db),
    category: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    show_all: bool = Query(False),  # admin passes show_all=true to see all products
):
    q = db.query(Product)

    # Public API hides out-of-stock; admin passes show_all=true to bypass
    if not show_all:
        q = q.filter(Product.in_stock == True)

    if category:
        q = q.filter(Product.category == category)
    if featured is not None:
        q = q.filter(Product.featured == featured)
    if search:
        q = q.filter(Product.name.ilike(f"%{search}%"))

    total = q.count()
    items = q.order_by(Product.featured.desc(), Product.created_at.desc()) \
             .offset((page - 1) * page_size).limit(page_size).all()

    return ProductListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# ── Admin endpoints ───────────────────────────────────────────────

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()


@router.post("/{product_id}/image", response_model=ProductResponse)
async def upload_product_image(
    product_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    url = await upload_image(file, folder="products")
    product.image_url = url
    db.commit()
    db.refresh(product)
    return product


# # C:\Users\Melody\Documents\haliberrycake\backend\app\api\products.py
# from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
# from sqlalchemy.orm import Session
# from typing import Optional

# from app.database.session import get_db
# from app.models.product import Product
# from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductListResponse
# from app.core.auth import get_current_admin
# from app.services.storage import upload_image

# router = APIRouter(prefix="/products", tags=["Products"])


# # ── Public endpoints ──────────────────────────────────────────────

# @router.get("", response_model=ProductListResponse)
# def list_products(
#     db: Session = Depends(get_db),
#     category: Optional[str] = Query(None),
#     featured: Optional[bool] = Query(None),
#     search: Optional[str] = Query(None),
#     page: int = Query(1, ge=1),
#     page_size: int = Query(12, ge=1, le=50),
# ):
#     q = db.query(Product).filter(Product.in_stock == True)

#     if category:
#         q = q.filter(Product.category == category)
#     if featured is not None:
#         q = q.filter(Product.featured == featured)
#     if search:
#         q = q.filter(Product.name.ilike(f"%{search}%"))

#     total = q.count()
#     items = q.order_by(Product.featured.desc(), Product.created_at.desc()) \
#              .offset((page - 1) * page_size).limit(page_size).all()

#     return ProductListResponse(items=items, total=total, page=page, page_size=page_size)


# @router.get("/{product_id}", response_model=ProductResponse)
# def get_product(product_id: str, db: Session = Depends(get_db)):
#     product = db.query(Product).filter(Product.id == product_id).first()
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")
#     return product


# # ── Admin endpoints ───────────────────────────────────────────────

# @router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
# def create_product(
#     payload: ProductCreate,
#     db: Session = Depends(get_db),
#     _: str = Depends(get_current_admin),
# ):
#     product = Product(**payload.model_dump())
#     db.add(product)
#     db.commit()
#     db.refresh(product)
#     return product


# @router.patch("/{product_id}", response_model=ProductResponse)
# def update_product(
#     product_id: str,
#     payload: ProductUpdate,
#     db: Session = Depends(get_db),
#     _: str = Depends(get_current_admin),
# ):
#     product = db.query(Product).filter(Product.id == product_id).first()
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")

#     for field, value in payload.model_dump(exclude_none=True).items():
#         setattr(product, field, value)

#     db.commit()
#     db.refresh(product)
#     return product


# @router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
# def delete_product(
#     product_id: str,
#     db: Session = Depends(get_db),
#     _: str = Depends(get_current_admin),
# ):
#     product = db.query(Product).filter(Product.id == product_id).first()
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")
#     db.delete(product)
#     db.commit()


# @router.post("/{product_id}/image", response_model=ProductResponse)
# async def upload_product_image(
#     product_id: str,
#     file: UploadFile = File(...),
#     db: Session = Depends(get_db),
#     _: str = Depends(get_current_admin),
# ):
#     product = db.query(Product).filter(Product.id == product_id).first()
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")

#     url = await upload_image(file, folder="products")
#     product.image_url = url
#     db.commit()
#     db.refresh(product)
#     return product