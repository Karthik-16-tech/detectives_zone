from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.admin import Admin
from app.models.case import Case, CaseSection, Evidence, CaseVideo, CaseGalleryImage, CaseNote, Clue, CasePageContent
from app.schemas.case import (
    CaseCreate, CaseUpdate, CaseOut, CaseDetailOut,
    CaseSectionCreate, CaseSectionUpdate, CaseSectionOut,
    EvidenceCreate, EvidenceUpdate, EvidenceOut,
    CaseVideoCreate, CaseVideoUpdate, CaseVideoOut,
    CaseGalleryImageCreate, CaseGalleryImageUpdate, CaseGalleryImageOut,
    CaseNoteCreate, CaseNoteUpdate, CaseNoteOut,
    ClueCreate, ClueUpdate, ClueOut, ClueVerify, ClueVerifyResult,
    ReorderRequest,
    CasePageContentCreate, CasePageContentUpdate, CasePageContentOut
)
from app.services.audit import log_admin_action

router = APIRouter(prefix="/cases", tags=["Cases Management & CMS"])

# ==================== PUBLIC ENDPOINTS ====================

@router.get("", response_model=List[CaseOut])
def list_cases(
    status_filter: Optional[str] = Query(None, alias="status"),
    featured_only: Optional[bool] = False,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Case).filter(Case.is_published == True)
    
    if status_filter and status_filter.upper() != "ALL":
        query = query.filter(Case.status.ilike(f"%{status_filter}%"))
    if featured_only:
        query = query.filter(Case.featured == True)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Case.title.ilike(search_pattern)) |
            (Case.case_number.ilike(search_pattern)) |
            (Case.short_description.ilike(search_pattern))
        )
    
    return query.order_by(Case.display_order.asc(), Case.created_at.desc()).all()

@router.get("/{slug_or_id}", response_model=CaseDetailOut)
def get_case_by_slug_or_id(
    slug_or_id: str,
    db: Session = Depends(get_db)
):
    case = None
    if slug_or_id.isdigit():
        case = db.query(Case).filter(Case.id == int(slug_or_id)).first()
    if not case:
        case = db.query(Case).filter(
            (Case.slug == slug_or_id) | 
            (Case.case_number == slug_or_id) |
            (Case.case_number == f"CASE {slug_or_id}")
        ).first()
    
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.post("/{case_id}/clues/{clue_id}/verify", response_model=ClueVerifyResult)
def verify_clue_answer(
    case_id: int,
    clue_id: int,
    req: ClueVerify,
    db: Session = Depends(get_db)
):
    clue = db.query(Clue).filter(Clue.id == clue_id, Clue.case_id == case_id).first()
    if not clue:
        raise HTTPException(status_code=404, detail="Clue not found")
    
    clean_user = req.answer.strip().lower()
    clean_correct = [ans.strip().lower() for ans in clue.correct_answer.split(",")]
    
    is_correct = clean_user in clean_correct
    return ClueVerifyResult(
        correct=is_correct,
        message="✓ Verified. Clue logged to case archive." if is_correct else "✗ Access denied. Try again."
    )

# ==================== ADMIN ENDPOINTS ====================

@router.get("/admin/all", response_model=List[CaseOut])
def admin_list_all_cases(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Case).order_by(Case.display_order.asc(), Case.created_at.desc()).all()

@router.post("", response_model=CaseOut, status_code=status.HTTP_201_CREATED)
def create_case(
    req: CaseCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Case).filter(
        (Case.case_number == req.case_number) | (Case.slug == req.slug)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Case number or slug already exists")
    
    case = Case(**req.dict())
    db.add(case)
    db.commit()
    db.refresh(case)
    
    log_admin_action(db, "CREATE", "Case", str(case.id), f"Created case #{case.case_number}: {case.title}", current_admin)
    return case

@router.put("/{case_id}", response_model=CaseOut)
def update_case(
    case_id: int,
    req: CaseUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    update_data = req.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(case, key, value)
    
    db.commit()
    db.refresh(case)
    
    log_admin_action(db, "UPDATE", "Case", str(case.id), f"Updated case #{case.case_number}", current_admin)
    return case

@router.delete("/{case_id}")
def delete_case(
    case_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    case_number = case.case_number
    db.delete(case)
    db.commit()
    
    log_admin_action(db, "DELETE", "Case", str(case_id), f"Deleted case #{case_number}", current_admin)
    return {"message": "Case deleted successfully"}

@router.post("/reorder")
def reorder_cases(
    req: ReorderRequest,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    for item in req.items:
        db.query(Case).filter(Case.id == item.id).update({"display_order": item.sort_order})
    db.commit()
    return {"message": "Cases reordered successfully"}

# ----------------- Sub-resource: Sections -----------------
@router.post("/{case_id}/sections", response_model=CaseSectionOut)
def add_case_section(
    case_id: int,
    req: CaseSectionCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    section = CaseSection(case_id=case_id, **req.dict(exclude={"case_id"}))
    db.add(section)
    db.commit()
    db.refresh(section)
    return section

@router.put("/sections/{section_id}", response_model=CaseSectionOut)
def update_case_section(
    section_id: int,
    req: CaseSectionUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    section = db.query(CaseSection).filter(CaseSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    
    for key, val in req.dict(exclude_unset=True).items():
        setattr(section, key, val)
    db.commit()
    db.refresh(section)
    return section

@router.delete("/sections/{section_id}")
def delete_case_section(
    section_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    section = db.query(CaseSection).filter(CaseSection.id == section_id).first()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found")
    db.delete(section)
    db.commit()
    return {"message": "Section deleted"}

# ----------------- Sub-resource: Evidence -----------------
@router.post("/{case_id}/evidence", response_model=EvidenceOut)
def add_case_evidence(
    case_id: int,
    req: EvidenceCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    item = Evidence(case_id=case_id, **req.dict(exclude={"case_id"}))
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.put("/evidence/{evidence_id}", response_model=EvidenceOut)
def update_case_evidence(
    evidence_id: int,
    req: EvidenceUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    item = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Evidence not found")
    for key, val in req.dict(exclude_unset=True).items():
        setattr(item, key, val)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/evidence/{evidence_id}")
def delete_case_evidence(
    evidence_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    item = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Evidence not found")
    db.delete(item)
    db.commit()
    return {"message": "Evidence deleted"}

# ----------------- Sub-resource: Clues -----------------
@router.post("/{case_id}/clues", response_model=ClueOut)
def add_case_clue(
    case_id: int,
    req: ClueCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    clue = Clue(case_id=case_id, **req.dict(exclude={"case_id"}))
    db.add(clue)
    db.commit()
    db.refresh(clue)
    return clue

@router.put("/clues/{clue_id}", response_model=ClueOut)
def update_case_clue(
    clue_id: int,
    req: ClueUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    clue = db.query(Clue).filter(Clue.id == clue_id).first()
    if not clue:
        raise HTTPException(status_code=404, detail="Clue not found")
    for key, val in req.dict(exclude_unset=True).items():
        setattr(clue, key, val)
    db.commit()
    db.refresh(clue)
    return clue

@router.delete("/clues/{clue_id}")
def delete_case_clue(
    clue_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    clue = db.query(Clue).filter(Clue.id == clue_id).first()
    if not clue:
        raise HTTPException(status_code=404, detail="Clue not found")
    db.delete(clue)
    db.commit()
    return {"message": "Clue deleted"}

# ----------------- Sub-resource: Notes -----------------
@router.post("/{case_id}/notes", response_model=CaseNoteOut)
def add_case_note(
    case_id: int,
    req: CaseNoteCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    note = CaseNote(case_id=case_id, **req.dict(exclude={"case_id"}))
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.delete("/notes/{note_id}")
def delete_case_note(
    note_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    note = db.query(CaseNote).filter(CaseNote.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return {"message": "Note deleted"}


# ----------------- Sub-resource: Page Content (CMS) -----------------
@router.get("/{slug_or_id}/page", response_model=Optional[CasePageContentOut])
def get_case_page_content(
    slug_or_id: str,
    db: Session = Depends(get_db)
):
    case = None
    if slug_or_id.isdigit():
        case = db.query(Case).filter(Case.id == int(slug_or_id)).first()
    if not case:
        case = db.query(Case).filter(
            (Case.slug == slug_or_id) | 
            (Case.case_number == slug_or_id) |
            (Case.case_number == f"CASE {slug_or_id}")
        ).first()
    
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    page = db.query(CasePageContent).filter(CasePageContent.case_id == case.id).first()
    if not page:
        # Return default initialized structure if not yet customized
        return CasePageContentOut(
            id=0,
            case_id=case.id,
            hero_video_url=case.hero_video or "",
            hero_subtitle=case.subtitle or "",
            hero_badge_text="Case File",
            evidence_wall_bg_url="",
            evidence_pins=[],
            investigation_modules=[],
            quote_text="",
            quote_author="",
            case_type="Homicide",
            date_of_incident="15 July 2027",
            location="Varma Residence"
        )
    return page


@router.put("/{case_id}/page", response_model=CasePageContentOut)
def update_case_page_content(
    case_id: int,
    req: CasePageContentUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    page = db.query(CasePageContent).filter(CasePageContent.case_id == case_id).first()
    data = req.dict(exclude_unset=True)
    
    # Convert nested models to dicts if needed for JSON fields
    if "evidence_pins" in data and data["evidence_pins"] is not None:
        data["evidence_pins"] = [p if isinstance(p, dict) else (p.dict() if hasattr(p, "dict") else p) for p in data["evidence_pins"]]
    if "investigation_modules" in data and data["investigation_modules"] is not None:
        data["investigation_modules"] = [m if isinstance(m, dict) else (m.dict() if hasattr(m, "dict") else m) for m in data["investigation_modules"]]

    if not page:
        page = CasePageContent(case_id=case_id, **data)
        db.add(page)
    else:
        for k, v in data.items():
            setattr(page, k, v)
    
    db.commit()
    db.refresh(page)
    log_admin_action(db, current_admin.id, "UPDATE", "CASE_PAGE", f"Updated page CMS content for case ID {case_id}")
    return page
