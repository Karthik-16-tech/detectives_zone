import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.database import SessionLocal, Base, engine
from app.models.admin import Admin
from app.core.security import hash_password

def create_admin(
    email: str = "admin@detectiveszone.co",
    username: str = "admin",
    password: str = "detective2026",
    role: str = "superadmin",
    full_name: str = "Lead Detective Investigator"
):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    try:
        admin = db.query(Admin).filter(
            (Admin.email == email) | (Admin.username == username)
        ).first()
        
        pwd_hash = hash_password(password)
        
        if not admin:
            admin = Admin(
                email=email,
                username=username,
                full_name=full_name,
                hashed_password=pwd_hash,
                role=role,
                is_active=True
            )
            db.add(admin)
            print(f"[+] Created Super Admin: {email} ({username})")
        else:
            admin.email = email
            admin.username = username
            admin.hashed_password = pwd_hash
            admin.is_active = True
            admin.role = role
            print(f"[+] Updated Super Admin: {email} ({username})")
            
        db.commit()
        db.refresh(admin)
        print(f"[OK] Admin credentials verified successfully on database: {engine.url}")
        print(f"     Email:    {admin.email}")
        print(f"     Username: {admin.username}")
        print(f"     Password: {password}")
        print(f"     Role:     {admin.role}")
        print(f"     Active:   {admin.is_active}")
        return admin
    finally:
        db.close()

if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else "admin@detectiveszone.co"
    password = sys.argv[2] if len(sys.argv) > 2 else "detective2026"
    create_admin(email=email, password=password)
