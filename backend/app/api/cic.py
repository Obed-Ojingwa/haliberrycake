# C:\Users\Melody\Documents\haliberrycake\backend\app\api\cic.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.cic import CICProgram
from app.schemas.gallery import CICProgramCreate, CICProgramUpdate, CICProgramResponse
from app.core.auth import get_current_admin

router = APIRouter(prefix="/cic", tags=["CIC Programs"])


@router.get("", response_model=list[CICProgramResponse])
def list_programs(db: Session = Depends(get_db)):
    return db.query(CICProgram).filter(CICProgram.is_active == True) \
             .order_by(CICProgram.sort_order.asc()).all()


@router.post("", response_model=CICProgramResponse, status_code=201)
def create_program(
    payload: CICProgramCreate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    prog = CICProgram(**payload.model_dump())
    db.add(prog)
    db.commit()
    db.refresh(prog)
    return prog


@router.patch("/{program_id}", response_model=CICProgramResponse)
def update_program(
    program_id: str,
    payload: CICProgramUpdate,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    prog = db.query(CICProgram).filter(CICProgram.id == program_id).first()
    if not prog:
        raise HTTPException(status_code=404, detail="Program not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(prog, field, value)
    db.commit()
    db.refresh(prog)
    return prog


@router.delete("/{program_id}", status_code=204)
def delete_program(
    program_id: str,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_admin),
):
    prog = db.query(CICProgram).filter(CICProgram.id == program_id).first()
    if not prog:
        raise HTTPException(status_code=404, detail="Program not found")
    db.delete(prog)
    db.commit()