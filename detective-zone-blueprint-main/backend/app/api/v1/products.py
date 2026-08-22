from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.admin import Admin
from app.models.product import Product, ProductImage
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut, ProductImageCreate, ProductImageOut
from app.services.audit import log_admin_action

router = APIRouter(prefix="/products", tags=["Store Products"])

@router.get("", response_model=List[ProductOut])
def list_products(
    category: Optional[str] = None,
    availability: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_published == True)
    if category and category.upper() != "ALL":
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if availability:
        query = query.filter(Product.availability_status == availability)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    return query.order_by(Product.sort_order.asc(), Product.created_at.desc()).all()

@router.get("/{slug_or_id}", response_model=ProductOut)
def get_product(
    slug_or_id: str,
    db: Session = Depends(get_db)
):
    product = None
    if slug_or_id.isdigit():
        product = db.query(Product).filter(Product.id == int(slug_or_id)).first()
    if not product:
        product = db.query(Product).filter(Product.slug == slug_or_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Admin endpoints
@router.get("/admin/all", response_model=List[ProductOut])
def admin_list_all_products(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(Product).order_by(Product.sort_order.asc(), Product.created_at.desc()).all()

@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product(
    req: ProductCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    existing = db.query(Product).filter(Product.slug == req.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product with this slug already exists")
    
    gallery_images = req.gallery_images or []
    product_data = req.dict(exclude={"gallery_images"})
    product = Product(**product_data)
    db.add(product)
    db.commit()
    db.refresh(product)
    
    for img in gallery_images:
        db_img = ProductImage(product_id=product.id, **img.dict())
        db.add(db_img)
    db.commit()
    db.refresh(product)
    
    log_admin_action(db, "CREATE", "Product", str(product.id), f"Created product: {product.name}", current_admin)
    return product

@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    req: ProductUpdate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for key, val in req.dict(exclude_unset=True).items():
        setattr(product, key, val)
    db.commit()
    db.refresh(product)
    
    log_admin_action(db, "UPDATE", "Product", str(product.id), f"Updated product: {product.name}", current_admin)
    return product

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    name = product.name
    db.delete(product)
    db.commit()
    log_admin_action(db, "DELETE", "Product", str(product_id), f"Deleted product: {name}", current_admin)
    return {"message": "Product deleted successfully"}
