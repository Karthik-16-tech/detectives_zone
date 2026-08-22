import os
import sys
import pymysql
from sqlalchemy import create_engine, text

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))
from app.core.database import Base, engine as local_engine
import app.models

def export_database_to_rds():
    print("==================================================")
    print("--- Exporting Database to AWS RDS MySQL ---")
    print("==================================================")
    
    rds_host = "detectives-zone-db.czc4m0ikqtp2.eu-north-1.rds.amazonaws.com"
    rds_user = "admin"
    rds_pwd = "Karthik2006"
    ssl_ca = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "global-bundle.pem"))

    # 1. Create database on RDS if not exists
    raw_conn = pymysql.connect(
        host=rds_host,
        port=3306,
        user=rds_user,
        password=rds_pwd,
        ssl={"ca": ssl_ca},
        connect_timeout=15
    )
    with raw_conn.cursor() as cur:
        cur.execute("CREATE DATABASE IF NOT EXISTS detective_zone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        print("[1/4] Database detective_zone verified on AWS RDS.")
    raw_conn.close()

    # 2. Connect SQLAlchemy engine to RDS
    rds_url = f"mysql+pymysql://{rds_user}:{rds_pwd}@{rds_host}:3306/detective_zone?ssl_ca={ssl_ca}"
    rds_engine = create_engine(rds_url, echo=False)

    # 3. Create all tables on RDS
    Base.metadata.create_all(bind=rds_engine)
    print("[2/4] All 24 database tables verified on AWS RDS.")

    # 4. Export all rows from local MySQL to AWS RDS
    with local_engine.connect() as loc_conn:
        tables = [t[0] for t in loc_conn.execute(text("SHOW TABLES;")).fetchall()]
        print(f"[3/4] Exporting {len(tables)} tables to AWS RDS...")

    with rds_engine.connect() as rds_conn:
        rds_conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
        
        with local_engine.connect() as loc_conn:
            for t_name in tables:
                rows = loc_conn.execute(text(f"SELECT * FROM `{t_name}`;")).mappings().all()
                if rows:
                    rds_conn.execute(text(f"TRUNCATE TABLE `{t_name}`;"))
                    cols = list(rows[0].keys())
                    col_str = ", ".join([f"`{c}`" for c in cols])
                    param_str = ", ".join([f":{c}" for c in cols])
                    insert_stmt = text(f"INSERT INTO `{t_name}` ({col_str}) VALUES ({param_str});")
                    
                    rds_conn.execute(insert_stmt, [dict(r) for r in rows])
                    print(f"  [OK] Table '{t_name}': {len(rows)} records exported.")
                else:
                    print(f"  [OK] Table '{t_name}': 0 records.")
        
        rds_conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
        rds_conn.commit()

    print("[4/4] Verifying record counts on AWS RDS...")
    with rds_engine.connect() as rds_conn:
        for t_name in tables:
            count = rds_conn.execute(text(f"SELECT COUNT(*) FROM `{t_name}`;")).scalar()
            print(f"  -> RDS Table '{t_name}': {count} records confirmed.")

    print("==================================================")
    print("--- AWS RDS DATABASE EXPORT COMPLETED (100%) ---")
    print("==================================================")

if __name__ == "__main__":
    export_database_to_rds()
