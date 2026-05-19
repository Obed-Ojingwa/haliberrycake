# C:\Users\Melody\Documents\haliberrycake\backend\app\api\cake_classes.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.database.session import get_db
from app.models.cake_class import CakeClass
from app.schemas.cake_class import CakeClassCreate, CakeClassUpdate, CakeClassResponse
from app.core.auth import get_current_admin

router = APIRouter(prefix="/classes", tags=["Cake Classes"])


def _to_response(obj: CakeClass) -> CakeClassResponse:
    """Serialize a CakeClass ORM object, correctly computing available_slots."""
    return CakeClassResponse.from_orm_with_slots(obj)


@router.get("", response_model=list[CakeClassResponse])
def list_classes(
    db: Session = Depends(get_db),
    upcoming_only: bool = Query(True),
    level: Optional[str] = Query(None),
):
    q = db.query(CakeClass).filter(CakeClass.is_active == True)
    if upcoming_only:
        q = q.filter(CakeClass.class_date >= date.today())
    if level:
        q = q.filter(CakeClass.level == level)
    return [_to_response(c) for c in q.order_by(CakeClass.class_date.asc()).all()]


@router.get("/{class_id}", response_model=CakeClassResponse)
def get_class(class_id: str, db: Session = Depends(get_db)):
    cls = db.query(CakeClass).filter(CakeClass.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    return _to_response(cls)


@router.post("", response_model=CakeClassResponse, status_code=status.HTTP_201_CREATED)
def create_class(
    payload: CakeClassCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    cls = CakeClass(**payload.model_dump())
    db.add(cls)
    db.commit()
    db.refresh(cls)
    return _to_response(cls)


@router.patch("/{class_id}", response_model=CakeClassResponse)
def update_class(
    class_id: str,
    payload: CakeClassUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    cls = db.query(CakeClass).filter(CakeClass.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(cls, field, value)
    db.commit()
    db.refresh(cls)
    return _to_response(cls)


@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_class(
    class_id: str,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    cls = db.query(CakeClass).filter(CakeClass.id == class_id).first()
    if not cls:
        raise HTTPException(status_code=404, detail="Class not found")
    db.delete(cls)
    db.commit()





# # C:\Users\Melody\Documents\haliberrycake\backend\app\api\cake_classes.py
# from fastapi import APIRouter, Depends, HTTPException, status, Query
# from sqlalchemy.orm import Session
# from typing import Optional
# from datetime import date

# from app.database.session import get_db
# from app.models.cake_class import CakeClass
# from app.schemas.cake_class import CakeClassCreate, CakeClassUpdate, CakeClassResponse
# from app.core.auth import get_current_admin

# router = APIRouter(prefix="/classes", tags=["Cake Classes"])


# @router.get("", response_model=list[CakeClassResponse])
# def list_classes(
#     db: Session = Depends(get_db),
#     upcoming_only: bool = Query(True),
#     level: Optional[str] = Query(None),
# ):
#     q = db.query(CakeClass).filter(CakeClass.is_active == True)
#     if upcoming_only:
#         q = q.filter(CakeClass.class_date >= date.today())
#     if level:
#         q = q.filter(CakeClass.level == level)
#     return q.order_by(CakeClass.class_date.asc()).all()


# @router.get("/{class_id}", response_model=CakeClassResponse)
# def get_class(class_id: str, db: Session = Depends(get_db)):
#     cls = db.query(CakeClass).filter(CakeClass.id == class_id).first()
#     if not cls:
#         raise HTTPException(status_code=404, detail="Class not found")
#     return cls


# @router.post("", response_model=CakeClassResponse, status_code=201)
# def create_class(
#     payload: CakeClassCreate,
#     db: Session = Depends(get_db),
#     _: str = Depends(get_current_admin),
# ):
#     cls = CakeClass(**payload.model_dump())
#     db.add(cls)
#     db.commit()
#     db.refresh(cls)
#     return cls


# @router.patch("/{class_id}", response_model=CakeClassResponse)
# def update_class(
#     class_id: str,
#     payload: CakeClassUpdate,
#     db: Session = Depends(get_db),
#     _: str = Depends(get_current_admin),
# ):
#     cls = db.query(CakeClass).filter(CakeClass.id == class_id).first()
#     if not cls:
#         raise HTTPException(status_code=404, detail="Class not found")
#     for field, value in payload.model_dump(exclude_none=True).items():
#         setattr(cls, field, value)
#     db.commit()
#     db.refresh(cls)
#     return cls


# @router.delete("/{class_id}", status_code=204)
# def delete_class(
#     class_id: str,
#     db: Session = Depends(get_db),
#     _: str = Depends(get_current_admin),
# ):
#     cls = db.query(CakeClass).filter(CakeClass.id == class_id).first()
#     if not cls:
#         raise HTTPException(status_code=404, detail="Class not found")
#     db.delete(cls)
#     db.commit()