import sys
import os

# Add backend to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.admin import Admin
from app.models.case import Case, CaseSection, Evidence, CaseVideo, CaseGalleryImage, CaseNote, Clue, CasePageContent
from app.models.product import Product, ProductImage
from app.models.kit import CaseKit, KitImage, SignatureEvidence
from app.models.setting import SiteSetting

def seed_database():
    print("--- Initializing Database Tables ---")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Admin User
        admin_email = "admin@detectiveszone.co"
        admin = db.query(Admin).filter((Admin.email == admin_email) | (Admin.email == "admin@detectivezone.co")).first()
        if not admin:
            admin = Admin(
                email=admin_email,
                username="admin",
                full_name="Lead Detective Investigator",
                hashed_password=get_password_hash("detective2026"),
                role="superadmin",
                is_active=True
            )
            db.add(admin)
            print(f"[OK] Created default admin: {admin_email} / detective2026")
        else:
            admin.email = admin_email
            admin.hashed_password = get_password_hash("detective2026")
            db.commit()
            print(f"[OK] Admin {admin_email} active with passcode: detective2026")

        # 2. Seed All 6 Exact Real Cases
        cases_data = [
            {
                "case_number": "001",
                "slug": "001",
                "title": "The Last Voicemail",
                "subtitle": "A successful businessman found dead in his study",
                "cover_image": "/src/assets/case-voicemail.png",
                "hero_image": "/src/assets/case-voicemail.png",
                "tagline": "Some voices never truly fade into the background.",
                "intro_text": "A successful businessman found dead in his study. No forced entry. No clear motive. Just a voicemail… and a lot of questions.",
                "status": "UNSOLVED",
                "difficulty": "HARD",
                "estimated_duration": "3–5 HOURS",
                "rating": 5.0,
                "short_description": "A successful businessman found dead in his study. No forced entry. Just a voicemail and a lot of questions.",
                "featured": True,
                "display_order": 1,
            },
            {
                "case_number": "002",
                "slug": "002",
                "title": "The Silent Witness",
                "subtitle": "A reclusive writer found dead in a locked room",
                "cover_image": "/src/assets/case-witness.png",
                "hero_image": "/src/assets/case-witness.png",
                "tagline": "The witness that never spoke... but saw everything.",
                "intro_text": "A reclusive writer found dead in a locked room. The pages of the final manuscript hold the key to a truth buried in silence.",
                "status": "UNSOLVED",
                "difficulty": "HARD",
                "estimated_duration": "3–6 HOURS",
                "rating": 4.9,
                "short_description": "A reclusive writer found dead in a locked room. A witness that never spoke... but saw everything.",
                "featured": True,
                "display_order": 2,
            },
            {
                "case_number": "003",
                "slug": "003",
                "title": "Blood in the Letter",
                "subtitle": "A threatening letter. A missing girl. A trail of blood.",
                "cover_image": "/src/assets/case-letter.png",
                "hero_image": "/src/assets/case-letter.png",
                "tagline": "The shadows are speaking.",
                "intro_text": "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
                "status": "COMING SOON",
                "difficulty": "MEDIUM",
                "estimated_duration": "COMING SOON",
                "rating": 4.8,
                "short_description": "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
                "featured": False,
                "display_order": 3,
            },
            {
                "case_number": "004",
                "slug": "004",
                "title": "The Vanished One",
                "subtitle": "A disappearance that made no noise at all",
                "cover_image": "/src/assets/case-heir.png",
                "hero_image": "/src/assets/case-heir.png",
                "tagline": "They were here one day, gone the next.",
                "intro_text": "They were here one day, gone the next. A disappearance that made no noise at all.",
                "status": "COMING SOON",
                "difficulty": "MEDIUM",
                "estimated_duration": "COMING SOON",
                "rating": 4.7,
                "short_description": "They were here one day, gone the next. A disappearance that made no noise at all.",
                "featured": False,
                "display_order": 4,
            },
            {
                "case_number": "005",
                "slug": "005",
                "title": "The Final Experiment",
                "subtitle": "Now the cure is the disease",
                "cover_image": "/src/assets/case-experiment.png",
                "hero_image": "/src/assets/case-experiment.png",
                "tagline": "A scientist's last experiment was never meant to be found.",
                "intro_text": "A scientist's last experiment was never meant to be found. Now the cure is the disease.",
                "status": "COMING SOON",
                "difficulty": "HARD",
                "estimated_duration": "COMING SOON",
                "rating": 4.9,
                "short_description": "A scientist's last experiment was never meant to be found. Now the cure is the disease.",
                "featured": False,
                "display_order": 5,
            },
            {
                "case_number": "006",
                "slug": "006",
                "title": "Shadows of Betrayal",
                "subtitle": "A man caught between loyalty and truth",
                "cover_image": "/src/assets/case-betrayal.png",
                "hero_image": "/src/assets/case-betrayal.png",
                "tagline": "One choice changed everything.",
                "intro_text": "A man caught between loyalty and truth. One choice changed everything.",
                "status": "COMING SOON",
                "difficulty": "HARD",
                "estimated_duration": "COMING SOON",
                "rating": 5.0,
                "short_description": "A man caught between loyalty and truth. One choice changed everything.",
                "featured": False,
                "display_order": 6,
            }
        ]

        for c_data in cases_data:
            existing = db.query(Case).filter((Case.case_number == c_data["case_number"]) | (Case.slug == c_data["slug"])).first()
            if not existing:
                case = Case(**c_data)
                db.add(case)
                db.commit()
                db.refresh(case)
            else:
                for k, v in c_data.items():
                    setattr(existing, k, v)
                db.commit()
                case = existing

            # Seed sample evidence & clues for Case 001
            if case.case_number == "001":
                if not case.sections:
                    db.add(CaseSection(
                        case_id=case.id,
                        section_type="briefing",
                        title="Incident Overview",
                        content_markdown="At 23:47 hours, Metropolitan Dispatch received a silent alarm from the victim's study. No sign of forced entry. The study doors were locked from the inside.",
                        sort_order=1
                    ))
                if not case.evidence:
                    db.add(Evidence(
                        case_id=case.id,
                        title="Voicemail - 3:47 AM",
                        type="audio",
                        file_url="/src/assets/evidencce/e-01.jpg",
                        description="3:47 AM. 'It's already done. Don't look for me.'",
                        date_recorded="15 July, 03:47 AM",
                        sort_order=1
                    ))
                    db.add(Evidence(
                        case_id=case.id,
                        title="Business Card",
                        type="image",
                        file_url="/src/assets/evidencce/e-02.jpg",
                        description="Found under the desk. Dated the night before.",
                        date_recorded="15 July, 09:00 AM",
                        sort_order=2
                    ))
                    db.add(Evidence(
                        case_id=case.id,
                        title="Dinner Receipt",
                        type="image",
                        file_url="/src/assets/evidencce/e-03.jpg",
                        description="Dinner for two. Not his wife's handwriting.",
                        date_recorded="14 July, 08:30 PM",
                        sort_order=3
                    ))
                    db.add(Evidence(
                        case_id=case.id,
                        title="Door Key",
                        type="image",
                        file_url="/src/assets/evidencce/e-04.jpg",
                        description="Unmatched to any lock in the house.",
                        date_recorded="15 July, 10:15 AM",
                        sort_order=4
                    ))
                if not case.clues:
                    db.add(Clue(
                        case_id=case.id,
                        title="The Timekeeper's Riddle",
                        description="Which object is hidden inside the coat?",
                        correct_answer="watch,pocket watch,pocketwatch",
                        hint="It keeps time it no longer owns.",
                        sort_order=1
                    ))
                    db.add(Clue(
                        case_id=case.id,
                        title="The Hotel Key Code",
                        description="What number is attached to the hotel key?",
                        correct_answer="104,room 104",
                        hint="One floor above the lobby.",
                        sort_order=2
                    ))

                # Seed CasePageContent for Case 001
                if not db.query(CasePageContent).filter(CasePageContent.case_id == case.id).first():
                    db.add(CasePageContent(
                        case_id=case.id,
                        hero_video_url="",
                        hero_subtitle="A successful businessman found dead in his study. No forced entry. No clear motive. Just a voicemail… and a lot of questions.",
                        hero_badge_text="Case File",
                        evidence_wall_bg_url="",
                        case_type="Homicide",
                        date_of_incident="15 July 2027",
                        location="Varma Residence",
                        quote_text="The voicemail wasn't a confession. It was a warning.",
                        quote_author="Detective Varma · Lead Investigator",
                        evidence_pins=[
                            {"id": "vm", "x": 14, "y": 22, "label": "Voicemail", "note": "3:47 AM. \"It's already done. Don't look for me.\"", "image_url": "", "links": [[0, 1]]},
                            {"id": "card", "x": 45, "y": 24, "label": "Business Card", "note": "Found under the desk. Dated the night before.", "image_url": "", "links": [[1, 2]]},
                            {"id": "receipt", "x": 78, "y": 24, "label": "Receipt", "note": "Dinner for two. Not his wife's handwriting.", "image_url": "", "links": []},
                            {"id": "key", "x": 16, "y": 68, "label": "Door Key", "note": "Unmatched to any lock in the house.", "image_url": "", "links": [[3, 4]]},
                            {"id": "note", "x": 48, "y": 68, "label": "Blackmail Note", "note": "Torn paper. Threatens exposure of offshore accounts.", "image_url": "", "links": [[4, 5]]},
                            {"id": "report", "x": 80, "y": 68, "label": "Forensic Report", "note": "Traces of digitalis found in the whiskey glass.", "image_url": "", "links": []}
                        ],
                        investigation_modules=[
                            {"icon": "Users", "heading": "Unravel the Suspect Matrix", "body": "Cross-examine 5 distinct persons of interest. Read police interview transcripts, cross-reference their alibis against surveillance timestamps, and isolate the contradictions."},
                            {"icon": "FolderSearch", "heading": "Analyze Crime Scene Evidence", "body": "Examine high-resolution forensic photographs, toxicology lab results, torn handwritten notes, and physical key evidence with interactive zoom inspection."},
                            {"icon": "Terminal", "heading": "Decode Encrypted Files", "body": "Access restricted police databases, crack password-protected mobile burner records, and reconstruct deleted voicemail logs to expose the final conspiracy."}
                        ]
                    ))

            if case.case_number == "002":
                if not db.query(CasePageContent).filter(CasePageContent.case_id == case.id).first():
                    db.add(CasePageContent(
                        case_id=case.id,
                        hero_video_url="",
                        hero_subtitle="A reclusive writer found dead in a locked room. A witness that never spoke... but saw everything.",
                        hero_badge_text="Case File",
                        evidence_wall_bg_url="",
                        case_type="Locked Room Mystery",
                        date_of_incident="22 October 2027",
                        location="Blackwood Manor",
                        quote_text="Every room has a secret. Some take a lifetime to unlock.",
                        quote_author="Inspector Chen · Senior Examiner",
                        evidence_pins=[
                            {"id": "manuscript", "x": 15, "y": 22, "label": "Final Manuscript", "note": "Last chapter missing. Blood spatter on page 142.", "image_url": "", "links": [[0, 1]]},
                            {"id": "watch", "x": 50, "y": 22, "label": "Broken Watch", "note": "Stopped at 11:47 PM. Impact fracture.", "image_url": "", "links": [[1, 2]]},
                            {"id": "ribbon", "x": 82, "y": 22, "label": "Typewriter Ribbon", "note": "Contains impressions of unsent threatening letter.", "image_url": "", "links": []},
                            {"id": "tape", "x": 18, "y": 68, "label": "Interview Tape", "note": "\"Someone was in the hallway at 11:30...\"", "image_url": "", "links": [[3, 4]]},
                            {"id": "print", "x": 52, "y": 68, "label": "Partial Print", "note": "Found on study window latch. Unidentified.", "image_url": "", "links": [[4, 5]]},
                            {"id": "autopsy", "x": 84, "y": 68, "label": "Toxicology Report", "note": "Rare paralytic agent. No injection marks.", "image_url": "", "links": []}
                        ],
                        investigation_modules=[
                            {"icon": "Users", "heading": "Reconstruct the Timeline", "body": "Map the victim's final 24 hours using CCTV feeds, staff logs, and telephone records."},
                            {"icon": "FolderSearch", "heading": "Inspect Physical Clues", "body": "Handle simulated physical crime artifacts: burnt letters, broken clockwork, and secret compartment blueprints."},
                            {"icon": "Terminal", "heading": "Crack the Manuscript Cipher", "body": "Solve cryptic riddles embedded in the novelist's unpublished draft to identify the killer."}
                        ]
                    ))

                db.commit()
            print(f"[OK] Seeded Case #{case.case_number}: {case.title}")


        # 3. Seed Real Store Products
        products_data = [
            {
                "name": "The Last Voicemail — Hybrid Case Kit",
                "slug": "p1",
                "price": 999.00,
                "sale_price": None,
                "sku": "DZ-KIT-001",
                "category": "Hybrid Case Kits",
                "stock_quantity": 12,
                "cover_image": "/src/assets/case-voicemail.png",
                "short_description": "A successful businessman found dead in his study. No forced entry. Just a voicemail… and a lot of questions.",
                "availability_status": "available",
                "sort_order": 1
            },
            {
                "name": "The Silent Witness — Investigation Dossier",
                "slug": "p2",
                "price": 999.00,
                "sale_price": None,
                "sku": "DZ-KIT-002",
                "category": "Hybrid Case Kits",
                "stock_quantity": 8,
                "cover_image": "/src/assets/case-witness.png",
                "short_description": "A reclusive writer found dead in a locked room. A witness that never spoke… but saw everything.",
                "availability_status": "available",
                "sort_order": 2
            },
            {
                "name": "Blood in the Letter — Physical File",
                "slug": "p3",
                "price": 1199.00,
                "sale_price": None,
                "sku": "DZ-KIT-003",
                "category": "Physical Case Kits",
                "stock_quantity": 15,
                "cover_image": "/src/assets/case-letter.png",
                "short_description": "A threatening letter. A missing girl. A trail of blood. The shadows are speaking.",
                "availability_status": "available",
                "sort_order": 3
            },
            {
                "name": "The Vanished One — Cold Case Dossier",
                "slug": "p4",
                "price": 999.00,
                "sale_price": None,
                "sku": "DZ-KIT-004",
                "category": "Physical Case Kits",
                "stock_quantity": 10,
                "cover_image": "/src/assets/case-heir.png",
                "short_description": "They were here one day, gone the next. A disappearance that made no noise at all.",
                "availability_status": "available",
                "sort_order": 4
            },
            {
                "name": "The Final Experiment — Classified Case",
                "slug": "p5",
                "price": 1299.00,
                "sale_price": None,
                "sku": "DZ-KIT-005",
                "category": "Physical Case Kits",
                "stock_quantity": 6,
                "cover_image": "/src/assets/case-experiment.png",
                "short_description": "A scientist's last experiment was never meant to be found. Now the cure is the disease.",
                "availability_status": "available",
                "sort_order": 5
            },
            {
                "name": "Shadows of Betrayal — Premium Collector Kit",
                "slug": "p6",
                "price": 1499.00,
                "sale_price": None,
                "sku": "DZ-KIT-006",
                "category": "Collector Editions",
                "stock_quantity": 5,
                "cover_image": "/src/assets/case-betrayal.png",
                "short_description": "A man caught between loyalty and truth. One choice changed everything.",
                "availability_status": "available",
                "sort_order": 6
            }
        ]

        for p_data in products_data:
            existing = db.query(Product).filter((Product.slug == p_data["slug"]) | (Product.sku == p_data["sku"])).first()
            if not existing:
                db.add(Product(**p_data))
            else:
                for k, v in p_data.items():
                    setattr(existing, k, v)
            print(f"[OK] Seeded Product: {p_data['name']}")
        db.commit()

        # 4. Seed Signature Evidence Items
        sig_data = [
            {"label": "Audio Intercept Wiretap", "image_url": "/src/assets/signature/audio.png", "description": "High-frequency audio recording captured from harbor surveillance."},
            {"label": "Surveillance Camera Still", "image_url": "/src/assets/signature/camera.png", "description": "35mm camera frame timestamped at 11:47 PM."},
            {"label": "Redacted Police Files", "image_url": "/src/assets/signature/files.png", "description": "Original precinct incident report with confidential witness details."},
            {"label": "Encrypted Mobile Device", "image_url": "/src/assets/signature/mobile.png", "description": "Recovered burner phone with encrypted SMS records."},
            {"label": "Cipher Puzzle Disc", "image_url": "/src/assets/signature/puzzle.png", "description": "Rotating brass cipher tool used to decrypt victim's diary."},
            {"label": "Stopped Pocket Watch", "image_url": "/src/assets/signature/time.png", "description": "Forensic proof of exact timestamp of study breach."},
            {"label": "Master Evidence Case Box", "image_url": "/src/assets/case kits/image.png", "description": "Custom rigid evidence locker with seal integrity stickers."},
        ]
        for s in sig_data:
            existing = db.query(SignatureEvidence).filter(SignatureEvidence.label == s["label"]).first()
            if not existing:
                db.add(SignatureEvidence(**s))
        db.commit()
        print("[OK] Seeded Signature Evidence Clues")

        # 5. Seed Site Settings
        settings_data = {
            "site_name": "Detectives Zone",
            "hero_title": "Detectives Zone",
            "hero_subtitle": "An Archive of Unfinished Truths",
            "contact_email": "files@detectiveszone.co",
            "contact_phone": "+1 (212) 555-0147",
            "office_address": "114 W 41st Street, New York, NY 10036",
            "shipping_flat_rate": "12.00",
            "free_shipping_threshold": "75.00",
        }
        for k, v in settings_data.items():
            existing = db.query(SiteSetting).filter(SiteSetting.key == k).first()
            if not existing:
                db.add(SiteSetting(key=k, value=v))
            else:
                existing.value = v
        db.commit()
        print("[OK] Seeded Site Settings: Detectives Zone")

        print("--- Database Seeding Complete! ---")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
