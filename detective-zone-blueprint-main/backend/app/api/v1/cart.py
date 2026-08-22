from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
import uuid

from app.core.database import get_db
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.models.kit import CaseKit
from app.schemas.cart import CartOut, CartItemCreate, CartItemUpdate

router = APIRouter(prefix="/cart", tags=["Shopping Cart"])

def get_or_create_cart(db: Session, session_id: Optional[str]) -> Cart:
    if not session_id:
        session_id = str(uuid.uuid4())
    
    cart = db.query(Cart).filter(Cart.session_id == session_id).first()
    if not cart:
        cart = Cart(session_id=session_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

def build_cart_out(cart: Cart) -> CartOut:
    total_items = sum(item.quantity for item in cart.items)
    total_price = sum(item.quantity * item.unit_price for item in cart.items)
    return CartOut(
        id=cart.id,
        session_id=cart.session_id,
        user_id=cart.user_id,
        items=cart.items,
        total_items=total_items,
        total_price=round(total_price, 2),
        updated_at=cart.updated_at
    )

@router.get("", response_model=CartOut)
def get_cart(
    session_id: Optional[str] = None,
    x_session_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    sid = session_id or x_session_id
    cart = get_or_create_cart(db, sid)
    return build_cart_out(cart)

@router.post("/items", response_model=CartOut)
def add_to_cart(
    req: CartItemCreate,
    session_id: Optional[str] = None,
    x_session_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    sid = session_id or x_session_id
    cart = get_or_create_cart(db, sid)
    
    # Check if item already exists in cart
    existing_item = None
    if req.product_id:
        existing_item = db.query(CartItem).filter(
            CartItem.cart_id == cart.id, CartItem.product_id == req.product_id
        ).first()
    elif req.kit_id:
        existing_item = db.query(CartItem).filter(
            CartItem.cart_id == cart.id, CartItem.kit_id == req.kit_id
        ).first()
    
    if existing_item:
        existing_item.quantity += req.quantity
    else:
        new_item = CartItem(
            cart_id=cart.id,
            product_id=req.product_id,
            kit_id=req.kit_id,
            item_title=req.item_title,
            item_image=req.item_image,
            unit_price=req.unit_price,
            quantity=req.quantity
        )
        db.add(new_item)
    
    db.commit()
    db.refresh(cart)
    return build_cart_out(cart)

@router.put("/items/{item_id}", response_model=CartOut)
def update_cart_item(
    item_id: int,
    req: CartItemUpdate,
    session_id: Optional[str] = None,
    x_session_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    sid = session_id or x_session_id
    cart = get_or_create_cart(db, sid)
    
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    if req.quantity <= 0:
        db.delete(item)
    else:
        item.quantity = req.quantity
    
    db.commit()
    db.refresh(cart)
    return build_cart_out(cart)

@router.delete("/items/{item_id}", response_model=CartOut)
def remove_from_cart(
    item_id: int,
    session_id: Optional[str] = None,
    x_session_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    sid = session_id or x_session_id
    cart = get_or_create_cart(db, sid)
    
    item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.cart_id == cart.id).first()
    if item:
        db.delete(item)
        db.commit()
        db.refresh(cart)
    return build_cart_out(cart)

@router.delete("", response_model=CartOut)
def clear_cart(
    session_id: Optional[str] = None,
    x_session_id: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    sid = session_id or x_session_id
    cart = get_or_create_cart(db, sid)
    
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(cart)
    return build_cart_out(cart)
