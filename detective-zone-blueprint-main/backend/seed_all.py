import sys
import os

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.database import SessionLocal, Base, engine
from app.models.admin import Admin
from app.models.case import Case, CaseSection, Clue
from app.models.product import Product
from app.models.kit import CaseKit, SignatureEvidence
from app.models.setting import SiteSetting
from app.core.security import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Admin User
    admin = db.query(Admin).filter((Admin.email == 'admin@detectiveszone.co') | (Admin.username == 'admin')).first()
    pwd_hash = get_password_hash('detective2026')
    if not admin:
        admin = Admin(
            email='admin@detectiveszone.co',
            username='admin',
            full_name='Lead Detective Investigator',
            hashed_password=pwd_hash,
            role='superadmin',
            is_active=True
        )
        db.add(admin)
    else:
        admin.email = 'admin@detectiveszone.co'
        admin.username = 'admin'
        admin.hashed_password = pwd_hash
        admin.is_active = True
    db.commit()

    # 2. Case Files
    cases_data = [
        {
            "case_number": "001",
            "slug": "the-last-voicemail",
            "title": "The Last Voicemail",
            "subtitle": "A 47-second recording that someone tried very hard to delete.",
            "tagline": "The line went dead at 02:41 AM.",
            "intro_text": "A high-profile real estate tycoon is found dead in his penthouse. The only lead is a garbled voicemail timestamped minutes before the power grid was cut.",
            "status": "UNSOLVED",
            "difficulty": "HARD",
            "estimated_duration": "3–5 HOURS",
            "rating": 5.0,
            "cover_image": "/src/assets/case-voicemail.png",
            "hero_image": "/src/assets/noir-street.jpg",
            "is_published": True,
            "featured": True
        },
        {
            "case_number": "002",
            "slug": "the-silent-witness",
            "title": "The Silent Witness",
            "subtitle": "The only person who saw the murder hasn't spoken a word in eight years.",
            "tagline": "Some secrets are kept not by choice, but by survival.",
            "intro_text": "A gallery curator is poisoned during an invite-only private auction. A mute assistant holds the sketchpad containing the killer's likeness.",
            "status": "UNSOLVED",
            "difficulty": "HARD",
            "estimated_duration": "3–6 HOURS",
            "rating": 5.0,
            "cover_image": "/src/assets/case-witness.png",
            "hero_image": "/src/assets/evidence-room.jpg",
            "is_published": True,
            "featured": False
        },
        {
            "case_number": "003",
            "slug": "blood-in-the-letter",
            "title": "Blood in the Letter",
            "subtitle": "Thirteen letters delivered to thirteen addresses. Twelve recipients are dead.",
            "tagline": "The final envelope has your name on it.",
            "intro_text": "A serial cipher killer targets the city's top magistrates using calligraphy envelopes sealed with dried human blood.",
            "status": "UNSOLVED",
            "difficulty": "MEDIUM",
            "estimated_duration": "2–4 HOURS",
            "rating": 4.8,
            "cover_image": "/src/assets/case-letter.png",
            "hero_image": "/src/assets/evidence-wall.jpg",
            "is_published": True,
            "featured": False
        },
        {
            "case_number": "004",
            "slug": "shadows-of-betrayal",
            "title": "Shadows of Betrayal",
            "subtitle": "A double agent inside the precinct. Four detectives under suspicion.",
            "tagline": "Trust is a liability in Precinct 7.",
            "intro_text": "An undercover detective is executed before his trial testimony. All evidence points to someone with badge access.",
            "status": "UNSOLVED",
            "difficulty": "EXPERT",
            "estimated_duration": "4–7 HOURS",
            "rating": 5.0,
            "cover_image": "/src/assets/case-betrayal.png",
            "hero_image": "/src/assets/noir-street.jpg",
            "is_published": True,
            "featured": True
        },
        {
            "case_number": "005",
            "slug": "the-vanished-one",
            "title": "The Vanished One",
            "subtitle": "A locked room. No blood. No body. Just a grandfather clock ticking backward.",
            "tagline": "Vanished in plain sight.",
            "intro_text": "An eccentric watchmaker disappears from a locked basement laboratory with thirty witnesses outside the only exit.",
            "status": "COMING SOON",
            "difficulty": "MEDIUM",
            "estimated_duration": "3–5 HOURS",
            "rating": 4.7,
            "cover_image": "/src/assets/case-heir.png",
            "hero_image": "/src/assets/evidence-room.jpg",
            "is_published": True,
            "featured": False
        },
        {
            "case_number": "006",
            "slug": "the-final-experiment",
            "title": "The Final Experiment",
            "subtitle": "A biological weapons scientist found locked inside his own cryogenic unit.",
            "tagline": "The antidote was never formulated.",
            "intro_text": "A private bio-tech bunker suffers total containment breach. The lead researcher is frozen with a cryptic formula carved into the frost.",
            "status": "COMPLETED",
            "difficulty": "HARD",
            "estimated_duration": "4–6 HOURS",
            "rating": 4.9,
            "cover_image": "/src/assets/case-experiment.png",
            "hero_image": "/src/assets/evidence-wall.jpg",
            "is_published": True,
            "featured": False
        },
    ]

    for c in cases_data:
        existing = db.query(Case).filter(Case.case_number == c["case_number"]).first()
        if not existing:
            new_case = Case(**c)
            db.add(new_case)
        else:
            for k, v in c.items():
                setattr(existing, k, v)
    db.commit()

    # 3. Store Products
    products_data = [
        {
            "name": "Case 001: The Last Voicemail — Hybrid Evidence Box",
            "slug": "p1",
            "sku": "DZ-KIT-001",
            "price": 999.0,
            "sale_price": None,
            "category": "Hybrid Evidence Package",
            "stock_quantity": 12,
            "cover_image": "/src/assets/case-voicemail.png",
            "short_description": "A successful businessman found dead in his study. No forced entry. Just a voicemail… and a lot of questions.",
            "availability_status": "available",
            "is_published": True
        },
        {
            "name": "Case 002: The Silent Witness — Investigation Dossier",
            "slug": "p2",
            "sku": "DZ-KIT-002",
            "price": 999.0,
            "sale_price": None,
            "category": "Hybrid Evidence Package",
            "stock_quantity": 8,
            "cover_image": "/src/assets/case-witness.png",
            "short_description": "A reclusive writer found dead in a locked room. A witness that never spoke… but saw everything.",
            "availability_status": "available",
            "is_published": True
        },
        {
            "name": "Case 003: Blood in the Letter — Physical File",
            "slug": "p3",
            "sku": "DZ-KIT-003",
            "price": 999.0,
            "sale_price": None,
            "category": "Physical Case Box",
            "stock_quantity": 24,
            "cover_image": "/src/assets/case-letter.png",
            "short_description": "A threatening letter. A missing girl. A trail of blood. The shadows are speaking. Follow the crimson ink.",
            "availability_status": "available",
            "is_published": True
        },
        {
            "name": "Case 004: Shadows of Betrayal — Premium Collector Kit",
            "slug": "p4",
            "sku": "DZ-KIT-004",
            "price": 999.0,
            "sale_price": None,
            "category": "Hybrid Evidence Package",
            "stock_quantity": 5,
            "cover_image": "/src/assets/case-betrayal.png",
            "short_description": "A man caught between loyalty and truth. One choice changed everything. Trust no one.",
            "availability_status": "available",
            "is_published": True
        },
        {
            "name": "Case 005: The Vanished One — Cold Case Dossier",
            "slug": "p5",
            "sku": "DZ-KIT-005",
            "price": 999.0,
            "sale_price": None,
            "category": "Physical Case Box",
            "stock_quantity": 15,
            "cover_image": "/src/assets/case-heir.png",
            "short_description": "They were here one day, gone the next. A disappearance that made no noise at all.",
            "availability_status": "available",
            "is_published": True
        },
        {
            "name": "Case 006: The Final Experiment — Classified Case",
            "slug": "p6",
            "sku": "DZ-KIT-006",
            "price": 999.0,
            "sale_price": None,
            "category": "Hybrid Evidence Package",
            "stock_quantity": 9,
            "cover_image": "/src/assets/case-experiment.png",
            "short_description": "A scientist's last experiment was never meant to be found. Now the cure is the disease.",
            "availability_status": "available",
            "is_published": True
        },
    ]

    for p in products_data:
        existing = db.query(Product).filter(Product.slug == p["slug"]).first()
        if not existing:
            new_p = Product(**p)
            db.add(new_p)
        else:
            for k, v in p.items():
                setattr(existing, k, v)
    db.commit()

    # 4. Case Kits
    kits_data = [
        {
            "name": "DZ-001: The Last Voicemail Featured Case Kit",
            "kit_code": "DZ-001",
            "slug": "dz-001-featured",
            "price": 999.0,
            "difficulty": "HARD",
            "estimated_time": "3–4 HOURS",
            "availability": "In Stock",
            "description": "A sealed case. A missing voice. Thirty pieces of evidence standing between you and the truth.",
            "cover_image": "/src/assets/case kits/image.png"
        },
        {
            "name": "The Signature Collection",
            "kit_code": "KIT-SIG-01",
            "slug": "the-signature-collection",
            "price": 3499.0,
            "difficulty": "EXPERT",
            "estimated_time": "15–20 HOURS",
            "availability": "In Stock",
            "description": "The complete archive. Every flagship case, every clue, one evidence locker.",
            "cover_image": "/src/assets/evidence-room.jpg"
        }
    ]

    for k in kits_data:
        existing = db.query(CaseKit).filter(CaseKit.kit_code == k["kit_code"]).first()
        if not existing:
            new_k = CaseKit(**k)
            db.add(new_k)
        else:
            for key, v in k.items():
                setattr(existing, key, v)
    db.commit()

    # 5. Settings
    default_settings = {
        "featured_kit_code": "DZ-001",
        "featured_kit_title": "The Last Voicemail",
        "featured_kit_hover_title": "The Case Is Open.",
        "featured_kit_quote": "A sealed case. A missing voice. Thirty pieces of evidence standing between you and the truth.",
        "featured_kit_price": "999",
        "featured_kit_duration": "3–4",
        "featured_kit_level": "Expert",
        "featured_kit_image": "/src/assets/case kits/image.png",
    }
    for k, v in default_settings.items():
        s = db.query(SiteSetting).filter(SiteSetting.key == k).first()
        if not s:
            db.add(SiteSetting(key=k, value=v, group="store"))
        else:
            s.value = v
    db.commit()

    print("=== SEEDING COMPLETED SUCCESSFULLY ===")
    print(f"Admins: {db.query(Admin).count()}")
    print(f"Cases: {db.query(Case).count()}")
    print(f"Products: {db.query(Product).count()}")
    print(f"Kits: {db.query(CaseKit).count()}")
    print(f"Settings: {db.query(SiteSetting).count()}")

if __name__ == "__main__":
    seed_database()
