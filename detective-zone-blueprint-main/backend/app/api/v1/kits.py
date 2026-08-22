from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.admin import Admin
from app.models.kit import CaseKit, KitImage, SignatureEvidence
from app.schemas.kit import (
    CaseKitCreate, CaseKitUpdate, CaseKitOut,
    SignatureEvidenceCreate, SignatureEvidenceUpdate, SignatureEvidenceOut
)
from app.services.audit import log_admin_action

router = APIRouter(prefix="/kits", tags=["Case Kits & Signatures"])

@router.get("", response_model=List[CaseKitOut])
def list_kits(
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CaseKit).filter(CaseKit.is_published == True)
    if search:
        query = query.filter(CaseKit.name.ilike(f"%{search}%"))
    return query.order_by(CaseKit.sort_order.asc(), CaseKit.created_at.desc()).all()

@router.get("/signatures", response_model=List[SignatureEvidenceOut])
def list_all_signatures(db: Session = Depends(get_db)):
    return db.query(SignatureEvidence).order_by(SignatureEvidence.sort_order.asc()).all()

@router.get("/{slug_or_id}", response_model=CaseKitOut)
def get_kit(
    slug_or_id: str,
    db: Session = Depends(get_db)
):
    kit = None
    if slug_or_id.isdigit():
        kit = db.query(CaseKit).filter(CaseKit.id == int(slug_or_id)).first()
    if not kit:
        kit = db.query(CaseKit).filter(
            (CaseKit.slug == slug_or_id) | (CaseKit.kit_code == slug_or_id)
        ).first()
    if not kit:
        raise HTTPException(status_code=404, detail="Case kit not found")
    return kit

# Admin CRUD
@router.post("", response_model=CaseKitOut, status_code=status.HTTP_201_CREATED)
def create_kit(
    req: CaseKitCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(CaseKit).filter(
        (CaseKit.slug == req.slug) | (CaseKit.kit_code == req.kit_code)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Kit code or slug already exists")
    
    gallery_images = req.gallery_images or []
    signatures = req.signatures or []
    kit_data = req.dict(exclude={"gallery_images", "signatures"})
    
    kit = CaseKit(**kit_data)
    db.add(kit)
    db.commit()
    db.refresh(kit)
    
    for img in gallery_images:
        db.add(KitImage(kit_id=kit.id, **img.dict()))
    for sig in signatures:
        db.add(SignatureEvidence(kit_id=kit.id, **sig.dict(exclude={"kit_id"})))
    db.commit()
    db.refresh(kit)
    
    log_admin_action(db, "CREATE", "Kit", str(kit.id), f"Created case kit: {kit.name}", current_admin)
    return kit

@router.put("/{kit_id}", response_model=CaseKitOut)
def update_kit(
    kit_id: int,
    req: CaseKitUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    kit = db.query(CaseKit).filter(CaseKit.id == kit_id).first()
    if not kit:
        raise HTTPException(status_code=404, detail="Kit not found")
    for key, val in req.dict(exclude_unset=True).items():
        setattr(kit, key, val)
    db.commit()
    db.refresh(kit)
    log_admin_action(db, "UPDATE", "Kit", str(kit.id), f"Updated case kit: {kit.name}", current_admin)
    return kit

@router.delete("/{kit_id}")
def delete_kit(
    kit_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    kit = db.query(CaseKit).filter(CaseKit.id == kit_id).first()
    if not kit:
        raise HTTPException(status_code=404, detail="Kit not found")
    name = kit.name
    db.delete(kit)
    db.commit()
    log_admin_action(db, "DELETE", "Kit", str(kit_id), f"Deleted kit: {name}", current_admin)
    return {"message": "Kit deleted successfully"}

# Signature CRUD
@router.post("/signatures", response_model=SignatureEvidenceOut)
def create_signature(
    req: SignatureEvidenceCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    sig = SignatureEvidence(**req.dict())
    db.add(sig)
    db.commit()
    db.refresh(sig)
    return sig

@router.put("/signatures/{signature_id}", response_model=SignatureEvidenceOut)
def update_signature(
    signature_id: int,
    req: SignatureEvidenceUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    sig = db.query(SignatureEvidence).filter(SignatureEvidence.id == signature_id).first()
    if not sig:
        raise HTTPException(status_code=404, detail="Signature not found")
    for key, val in req.dict(exclude_unset=True).items():
        setattr(sig, key, val)
    db.commit()
    db.refresh(sig)
    return sig

@router.delete("/signatures/{signature_id}")
def delete_signature(
    signature_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    sig = db.query(SignatureEvidence).filter(SignatureEvidence.id == signature_id).first()
    if not sig:
        raise HTTPException(status_code=404, detail="Signature not found")
    db.delete(sig)
    db.commit()
    return {"message": "Signature deleted"}
