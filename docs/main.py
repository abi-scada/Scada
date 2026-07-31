from fastapi import Depends,FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.responses import StreamingResponse, FileResponse
from models import Users, Machines, TurbineData, LoginRequest,EmailRequest
import dbModel
import asyncio
import os
import csv
from io import StringIO
from gen import generate_turbine_data
from database import engine, SL
from sqlalchemy.orm import Session 
from sqlalchemy import join, select, text, outerjoin, func, and_
from datetime import datetime,timedelta
from security.password import verify_password,hash_password
from security.auth import create_access_token, get_user_id
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import FastMail, MessageSchema, MessageType
from emailConfig import conf
from email_service import send_welcome_email
from dbModel import Alarm


#wdpk vwcq cjkk bfwd

#pdff
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
import tempfile

app = FastAPI()

PRODUCTION_RETENTION_DAYS = int(os.getenv("PRODUCTION_RETENTION_DAYS", "100"))


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"], #origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

dbModel.Base.metadata.create_all(bind=engine)

def get_db():
    db = SL()
    try:
        yield db
    finally:
        db.close()




def update_daily_production(td: dbModel.TurbineData, db: Session) -> None:
    created_at = td.created_at or datetime.utcnow()
    day = created_at.date()
    day_start = datetime.combine(day, datetime.min.time())

    row = db.query(dbModel.DailyProduction).filter(
        dbModel.DailyProduction.mc_id == td.mcId,
        dbModel.DailyProduction.day == day
    ).first()

    if not row:
        prev = db.query(dbModel.TurbineData).filter(
            dbModel.TurbineData.mcId == td.mcId,
            dbModel.TurbineData.created_at < day_start
        ).order_by(dbModel.TurbineData.created_at.desc()).first()

        if prev:
            base_g1_kw = prev.g1_kw
            base_g2_kw = prev.g2_kw
            base_total_kw = prev.total_kw
            base_g1_hrs = prev.g1_hrs
            base_g2_hrs = prev.g2_hrs
            base_total_hrs = prev.total_hrs
        else:
            # No previous day data; treat first reading as baseline (daily = 0 at start).
            base_g1_kw = td.g1_kw
            base_g2_kw = td.g2_kw
            base_total_kw = td.total_kw
            base_g1_hrs = td.g1_hrs
            base_g2_hrs = td.g2_hrs
            base_total_hrs = td.total_hrs

        row = dbModel.DailyProduction(
            mc_id=td.mcId,
            day=day,
            base_g1_kw=base_g1_kw,
            base_g2_kw=base_g2_kw,
            base_total_kw=base_total_kw,
            base_g1_hrs=base_g1_hrs,
            base_g2_hrs=base_g2_hrs,
            base_total_hrs=base_total_hrs,
        )
        db.add(row)

    row.g1_kw = max(0, td.g1_kw - row.base_g1_kw)
    row.g2_kw = max(0, td.g2_kw - row.base_g2_kw)
    row.total_kw = max(0, td.total_kw - row.base_total_kw)
    row.g1_hrs = max(0, td.g1_hrs - row.base_g1_hrs)
    row.g2_hrs = max(0, td.g2_hrs - row.base_g2_hrs)
    row.total_hrs = max(0, td.total_hrs - row.base_total_hrs)
    row.updated_at = created_at

    if PRODUCTION_RETENTION_DAYS > 0:
        cutoff = day - timedelta(days=PRODUCTION_RETENTION_DAYS)
        db.query(dbModel.DailyProduction).filter(
            dbModel.DailyProduction.day < cutoff
        ).delete(synchronize_session=False)

    db.commit()



async def send_daily_production_report(user, db: Session) -> None:
    if not conf.MAIL_SERVER or not conf.MAIL_USERNAME or not conf.MAIL_PASSWORD:
        print("daily report skipped: email config missing (MAIL_SERVER/MAIL_USERNAME/MAIL_PASSWORD).")
        return

    today = datetime.now().date()

    j = outerjoin(
        dbModel.Machines,
        dbModel.DailyProduction,
        and_(
            dbModel.DailyProduction.mc_id == dbModel.Machines.mid,
            dbModel.DailyProduction.day == today
        )
    )

    rows = db.query(
        dbModel.Machines.mid,
        dbModel.Machines.mname,
        func.coalesce(dbModel.DailyProduction.g1_kw, 0),
        func.coalesce(dbModel.DailyProduction.g2_kw, 0),
        func.coalesce(dbModel.DailyProduction.total_kw, 0),
        func.coalesce(dbModel.DailyProduction.g1_hrs, 0),
        func.coalesce(dbModel.DailyProduction.g2_hrs, 0),
        func.coalesce(dbModel.DailyProduction.total_hrs, 0),
    ).select_from(j).filter(
        dbModel.Machines.user_id == user.id
    ).order_by(dbModel.Machines.mid).all()

    if not rows:
        return

    file_path = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf").name
    doc = SimpleDocTemplate(
        file_path,
        pagesize=A4,
        title="Daily Production Report",
        auther="Abi Scada",
        subject="Daily Production"
    )

    elements = []
    styles = getSampleStyleSheet()

    elements.append(Paragraph(
        f"Daily Production Report<br/>User: {user.name}<br/>Date: {today}",
        styles["Title"]
    ))

    table_data = [[
        "Machine ID", "Name", "G1 kW", "G2 kW", "Total kW", "G1 Hrs", "G2 Hrs", "Total Hrs"
    ]]

    for r in rows:
        table_data.append([
            r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7]
        ])

    table = Table(table_data, repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.blue),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.darkblue),
        ("ALIGN", (1, 1), (-1, -1), "CENTER"),
    ]))

    elements.append(table)
    doc.build(elements)

    message = MessageSchema(
        subject="Daily Production Report",
        recipients=[user.email],
        body=f"Daily production report for {today} is attached.",
        subtype=MessageType.plain,
        attachments=[{
            "file": file_path,
            "filename": f"daily_production_{today}.pdf",
            "content_type": "application/pdf"
        }]
    )

    fm = FastMail(conf)
    await fm.send_message(message)

    try:
        os.remove(file_path)
    except Exception:
        pass


async def daily_report_scheduler() -> None:
    while True:
        now = datetime.now()
        next_run = now.replace(hour=0, minute=1, second=0, microsecond=0)
        if now >= next_run:
            next_run = next_run + timedelta(days=1)

        wait_seconds = (next_run - now).total_seconds()
        await asyncio.sleep(wait_seconds)

        db = SL()
        try:
            users = db.query(dbModel.Users).all()
            for user in users:
                try:
                    print("daily gen report sheduled!!!")
                    await send_daily_production_report(user, db)
                except Exception as e:
                    msg = str(e)
                    if "getaddrinfo failed" in msg:
                        print(
                            "daily report error:",
                            e,
                            f"(DNS lookup failed for {conf.MAIL_SERVER}. Check network/DNS or MAIL_SERVER.)"
                        )
                    else:
                        print("daily report error:", e)
        finally:
            db.close()


def handle_alarm(mc_id: int, status: str, db: Session):
    alarm = db.query(Alarm).filter(Alarm.mc_id == mc_id).first()

    is_error = status.upper() != "RUN"

    # 🚨 NO ALARM EXISTS
    if not alarm:
        if is_error:
            alarm = Alarm(
                mc_id=mc_id,
                active=True,
                acknowledged=False,
                last_status=status,
                created_at=datetime.utcnow()
            )
            db.add(alarm)
            db.commit()
        return

    # 🔁 STATUS CHANGED
    if alarm.last_status != status:
        alarm.last_status = status

        if is_error:
            # 🔔 NEW ERROR → REARM ALARM
            alarm.active = True
            alarm.acknowledged = False
            alarm.created_at = datetime.utcnow()
            alarm.cleared_at = None
        else:
            # ✅ BACK TO RUN
            alarm.active = False
            alarm.cleared_at = datetime.utcnow()

        db.commit()


def get_turbine_by_date_range(
    machine_id: int,
    start_date: datetime = Query(..., description="YYYY-MM-DDTHH:MM:SS"),
    end_date: datetime = Query(..., description="YYYY-MM-DDTHH:MM:SS"),
    db: Session = Depends(get_db)
):
    
    data = db.query(dbModel.TurbineData).filter(
        dbModel.TurbineData.mcId == machine_id,
        #dbModel.TurbineData.created_at.between(start_date, end_date),
        dbModel.TurbineData.created_at >= start_date,
        dbModel.TurbineData.created_at <= end_date
    ).all()
    #print("length of Response : ",len(data))
    return data

@app.post("/send-email")
async def send_email(data: EmailRequest):
    message = MessageSchema(
        subject=data.subject,
        recipients=[data.email],
        body=data.message,
        subtype=MessageType.plain
    )

    fm = FastMail(conf)
    await fm.send_message(message)

    return {"status": "Email sent successfully"}

#mute one machines alarm
@app.post("/alarm/ack/{mc_id}")
def ack_alarm(mc_id: int, db: Session = Depends(get_db)):
    db.query(dbModel.Alarm).filter(
        dbModel.Alarm.mc_id == mc_id,
        dbModel.Alarm.active == 1
    ).update({"acknowledged": 1})
    db.commit()
    return {"message": "Alarm muted"}



@app.get('/turbine/week')
async def get_week_data(
    machine_id: int,
    offset: int = 0,
    limit: int = 300,
    #start: datetime = Query(..., description="YYYY-MM-DDTHH:MM:SS"),
    #end: datetime = Query(..., description="YYYY-MM-DDTHH:MM:SS"),
    db : Session = Depends(get_db)
):
    start =  datetime.now().isoformat(timespec="seconds").strip()
    end = (datetime.now() - timedelta(days = 3)).isoformat(timespec="seconds").strip()
    #print(start, end)
    # query = text("""SELECT * FROM turbine_data WHERE mcId = :machine_id AND created_at BETWEEN :start AND :end ORDER BY created_at LIMIT :limit OFFSET :offset""")
    
    # data = db.execute(query,{
    #     "machine_id":machine_id,
    #     "start":start,
    #     "end":end,
    #     "limit":limit,
    #     "offset":offset
    # })
    # data = (db.query(dbModel.TurbineData).filter(
    #     dbModel.TurbineData.mcId == machine_id
    #     #dbModel.TurbineData.created_at.between(start, end)
    # )
    # .filter(dbModel.TurbineData.created_at >= start)
    # .filter(dbModel.TurbineData.created_at <= end)
    # #.order_by(dbModel.TurbineData.created_at)
    data = db.query(dbModel.TurbineData).filter(
        dbModel.TurbineData.mcId == machine_id,
        #dbModel.TurbineData.created_at.between(start_date, end_date),
        dbModel.TurbineData.created_at >= end,
        dbModel.TurbineData.created_at <= start
    ).order_by(dbModel.TurbineData.created_at.desc()).offset(offset).limit(limit).all()
    #print("length of Response : ",len(data))
    
    return data

@app.get('/turbine/pdf')
def download_pdf(
    machine_id: int,
    start_date: datetime = Query(..., description="YYYY-MM-DDTHH:MM:SS"),
    end_date: datetime = Query(..., description="YYYY-MM-DDTHH:MM:SS"),
    db: Session = Depends(get_db)
):
    data = db.query(dbModel.TurbineData).filter(
        dbModel.TurbineData.mcId == machine_id,
        #dbModel.TurbineData.created_at.between(start_date, end_date),
        dbModel.TurbineData.created_at >= start_date,
        dbModel.TurbineData.created_at <= end_date
    ).all()
    #print("length of Response : ",len(data))
    
    file_path = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf").name
    doc = SimpleDocTemplate(
        file_path,
        pagesize=A4,
        title="Abi Scada Report",
        auther="Abinesh",
        subject="Turbine Report"
        
        )

    elements = []
    styles = getSampleStyleSheet()

    elements.append(Paragraph(
        f"Turbine Report<br/>Machine ID: {machine_id}<br/>"
        f"Period: {start_date} to {end_date}",
        styles["Title"]
    ))
    table_data = [[
        "Time", "Wind","Hyd. Press", "Power", "RPM", "Status", "Total kW"
    ]]

    for r in data:
        table_data.append([
            str(r.created_at),
            r.wind,
            r.hyd_press,
            r.power,
            r.grpm,
            r.status,
            r.total_kw
            
        ])

    table = Table(table_data, repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.blue),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.darkblue),
        ("ALIGN", (1, 1), (-1, -1), "CENTER"),
    ]))

    elements.append(table)
    doc.build(elements)

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="turbine_report.pdf"
    )
    

@app.get('/turbine/csv')
def download_csv(
    machine_id: int,
    start_date: datetime = Query(..., description="YYYY-MM-DDTHH:MM:SS"),
    end_date: datetime = Query(..., description="YYYY-MM-DDTHH:MM:SS"),
    db: Session = Depends(get_db)
):
    
    data = db.query(dbModel.TurbineData).filter(
        dbModel.TurbineData.mcId == machine_id,
        #dbModel.TurbineData.created_at.between(start_date, end_date),
        dbModel.TurbineData.created_at >= start_date,
        dbModel.TurbineData.created_at <= end_date
    ).all()
    print("length of Response : ",len(data))
    output = StringIO()
    writer = csv.writer(output)
    
    writer.writerow(["Time", "Wind", "Power", "Status"])
    for row in data:
        writer.writerow([
            row.created_at,
            row.wind,
            row.power,
            row.status
        ])
    output.flush()
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Context-Disposition":"attachment; filename=report.csv"
        }
    )

# async def turbine_simulator(machine_id: int,db: Session = Depends(get_db)):
#     while True:
#         data = generate_turbine_data(machine_id)
#         db = SL()
#         td_row = dbModel.TurbineData(**data.model_dump())
#         db.add(td_row)
#         db.commit()
#         update_daily_production(td_row, db)
#         handle_alarm(
#         mc_id=data.mcId,
#         status=data.status,
#         db=db
#         )
#         db.close()
        

#     #return {"ok": True}
#         await asyncio.sleep(30)


# @app.on_event("startup")
# async def start_simulator():
#     machine_ids = [302,303, 304, 305]

#     for mid in machine_ids:
#         asyncio.create_task(turbine_simulator(mid))
#     print("simulator running!!!")
    


@app.on_event("startup")
async def start_daily_reports():
    asyncio.create_task(daily_report_scheduler())


@app.get('/')
def index():
    return{"Message":"Hello World!!!, Welcome to Abi's Scada "}

@app.get('/get-usr/{uid}')
def get_usr_by_id(uid: int, db: Session = Depends(get_db)):
    res = db.query(dbModel.Users).filter(dbModel.Users.id == uid).first()
    
    return res.name

@app.get('/gun/{un}')
def get_user_by_un(un: str,db: Session = Depends(get_db)):
    un = un.strip().lower()
    return db.query(dbModel.Users).filter(dbModel.Users.name == un).first()
    

#Login
@app.post('/login')
def login(data: LoginRequest, db: Session = Depends(get_db)):
    print(data.name, data.password)
    usr = get_user_by_un(data.name, db)
    if not usr or not verify_password(data.password, usr.password):
        raise HTTPException(status_code=401, detail = "Invalid Credentials!!!")
    token = create_access_token({
        "id":usr.id,
        "email":usr.email
    })
    return {
        "message":"Login Successful!!!",
        "access_token":token,
        "id":usr.id,
        "token_type":"bearer"
    }

@app.get('/mine')
def get_auth_id(user_id:str = Depends(get_user_id)):
    print("uid : ",user_id) 
    return {"user_id",user_id}
    

#create Api for card details 


@app.get("/card/{user_id}")
def get_card_details(user_id: int, db: Session = Depends(get_db)):

    j = outerjoin(
        dbModel.Machines,
        dbModel.TurbineData,
        dbModel.Machines.mid == dbModel.TurbineData.mcId
    )

    j2 = outerjoin(
        j,
        dbModel.Alarm,
        dbModel.Alarm.mc_id == dbModel.Machines.mid
    )

    q = select(
        dbModel.Machines.mid.label("mc_id"),
        dbModel.Machines.mname.label("mc_name"),
        dbModel.Machines.location.label("mc_loc"),
        dbModel.Machines.htsc.label("mc_htsc"),
        dbModel.Machines.capacity.label("mc_cap"),
        dbModel.Machines.latitude.label("mc_lat"),
        dbModel.Machines.longitude.label("mc_long"),
        

        func.coalesce(dbModel.TurbineData.status, "STOP").label("status"),
        func.coalesce(dbModel.TurbineData.wind, 0).label("wind"),
        func.coalesce(dbModel.TurbineData.power, 0).label("power"),
        dbModel.TurbineData.created_at.label("dt"),

        func.coalesce(dbModel.Alarm.active, False).label("alarm_active"),
        func.coalesce(dbModel.Alarm.acknowledged, False).label("alarm_ack"),
    ).select_from(j2)\
     .where(dbModel.Machines.user_id == user_id)\
     .order_by(dbModel.Machines.mid, dbModel.TurbineData.created_at.desc())

    result = db.execute(q).all()

    machines = {}
    for r in result:
        if r.mc_id not in machines:
            machines[r.mc_id] = dict(r._mapping)
    
    

    return list(machines.values())


@app.get('/production/summary/{user_id}')
def get_daily_production_summary(user_id: int, db: Session = Depends(get_db)):
    today = datetime.now().date()

    j = join(
        dbModel.DailyProduction,
        dbModel.Machines,
        dbModel.DailyProduction.mc_id == dbModel.Machines.mid
    )

    total_kw = db.query(
        func.coalesce(func.sum(dbModel.DailyProduction.total_kw), 0)
    ).select_from(j).filter(
        dbModel.Machines.user_id == user_id,
        dbModel.DailyProduction.day == today
    ).scalar()

    hero_row = db.query(
        dbModel.DailyProduction,
        dbModel.Machines
    ).select_from(j).filter(
        dbModel.Machines.user_id == user_id,
        dbModel.DailyProduction.day == today
    ).order_by(dbModel.DailyProduction.total_kw.desc()).first()

    hero = None
    if hero_row:
        dp, mc = hero_row
        hero = {
            "mc_id": mc.mid,
            "mc_name": mc.mname,
            "total_kw": dp.total_kw
        }

    return {
        "day": str(today),
        "total_kw": int(total_kw or 0),
        "hero": hero
    }




@app.get('/production/hero/{user_id}')
def get_hero_production(user_id: int, db: Session = Depends(get_db)):
    today = datetime.now().date()

    j = join(
        dbModel.DailyProduction,
        dbModel.Machines,
        dbModel.DailyProduction.mc_id == dbModel.Machines.mid
    )

    hero_row = db.query(
        dbModel.DailyProduction,
        dbModel.Machines
    ).select_from(j).filter(
        dbModel.Machines.user_id == user_id,
        dbModel.DailyProduction.day == today
    ).order_by(dbModel.DailyProduction.total_kw.desc()).first()

    if not hero_row:
        return {"day": str(today), "hero": None}

    dp, mc = hero_row
    return {
        "day": str(today),
        "hero": {
            "mc_id": mc.mid,
            "mc_name": mc.mname,
            "total_kw": dp.total_kw
        }
    }


@app.get('/cards/{user_id}')
def get_card_details(user_id:int, db:Session=Depends(get_db)):
    j = join(dbModel.Machines, dbModel.TurbineData,
             dbModel.Machines.mid == dbModel.TurbineData.mcId)
    q = select(
        dbModel.Machines.mid,
        dbModel.Machines.mname,
        dbModel.Machines.location,
        dbModel.Machines.htsc,
        dbModel.Machines.capacity,
        dbModel.TurbineData.status,
        dbModel.TurbineData.wind,
        dbModel.TurbineData.power,
        dbModel.TurbineData.created_at,
    ).select_from(j).where(dbModel.Machines.user_id == user_id).order_by(dbModel.TurbineData.tid.desc())
    result = db.execute(q).all()
    rows = [
        {
            "mc_id" : res.mid,
            "mc_name" : res.mname,
            "mc_loc" : res.location,
            "mc_htsc" : res.htsc,
            "mc_cap" : res.capacity,
            "status" : res.status,
            "wind" : res.wind,
            "power" : res.power,
            "dt" : res.created_at,
        }
        for res in result
    ]
    mcs = []
    for row in rows:
        if not any(d['mc_id'] == row['mc_id'] for d in mcs):
            mcs.append(row)
    #print(mcs)
    

    return mcs
    


# Find Machines by id 
@app.get('/my-machines/{uid}')
def my_machines(uid:int, db: Session = Depends(get_db)):
    return db.query(dbModel.Machines).filter(dbModel.Machines.user_id == uid).all()

# Find Machines by name
@app.get('/my-machines/{user_name}')
def my_machines(user_name:str, db: Session = Depends(get_db)):
    return db.query(dbModel.Machines).join(dbModel.Users).filter(dbModel.Users.name == user_name).all()

# User Related APIs
@app.get('/users')
def get_users(db: Session = Depends(get_db)):
    return db.query(dbModel.Users).all()

@app.get('/get-user/{uid}')
def get_user(uid: int, db: Session = Depends(get_db)):
    find_user = db.query(dbModel.Users).filter(dbModel.Users.id == uid).first()
    if find_user:
        return find_user
    else:
        return "User Not Found!!!"

@app.post('/add-user')
def users(user: Users, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    new_user = Users(
        name=user.name.strip().lower(), 
        email=user.email.strip().lower(), 
        password=hash_password(user.password).strip()
    )
    db.add(dbModel.Users(**new_user.model_dump()))
    db.commit()
    background_tasks.add_task(
        send_welcome_email,
        email=user.email,
        username=user.name,
        password=user.password
    )
    print (f'New user {user.name} Added Successfuly!!!')
    return get_users(db)

@app.put('/update-user/{uid}')
def update_user(uid: int, user: Users, db: Session = Depends(get_db)):
    find_user = db.query(dbModel.Users).filter(dbModel.Users.id == uid).first()
    if find_user:
        find_user.name = user.name.lower().strip()
        find_user.email = user.email.strip().lower()
        find_user.password = user.password.strip()
        db.commit()
        return "User Updated!!!"
    else:
        return "User Not Found!!!"

@app.delete('/remove-user/{uid}')
def remove_user(uid: int, db: Session = Depends(get_db)):
    find_user = db.query(dbModel.Users).filter(dbModel.Users.id == uid).first() 
    if find_user:
        uname = find_user.name
        db.delete(find_user)
        db.commit()
        print(f'User {uname} Removed')
        return f'User Removed'
    else:
        return "User Not Found"
    
# Machine Related API's
@app.post('/add-machine')
def add_machine(machine: Machines, db: Session = Depends(get_db)):
    new_machine = Machines(mid = machine.mid, user_id = machine.user_id, mname = machine.mname, htsc = machine.htsc, location = machine.location, capacity = machine.capacity, latitude=machine.latitude, longitude=machine.longitude )
    db.add(dbModel.Machines(**new_machine.model_dump()))  
    db.commit()
    print("Machine Added Successfuly!!!")
    return new_machine  

@app.get('/machines')
def get_machines(db: Session = Depends(get_db)):
    return db.query(dbModel.Machines).all()

@app.put('/update-machine/{mc_id}')
def update_machine(mc_id : int, machine: Machines, db: Session = Depends(get_db)):
    find_machine = db.query(dbModel.Machines).filter(dbModel.Machines.mid == mc_id).first()
    if find_machine:
        find_machine.mid = machine.mid
        find_machine.user_id = machine.user_id
        find_machine.mname = machine.mname
        find_machine.htsc = machine.htsc
        find_machine.location = machine.location
        find_machine.capacity = machine.capacity
        db.commit()
        print("Machine Updated Successfuly")
        return "Machine Updated Successfuly"
    else:
        return "Machine Not Found!!!"
    
@app.delete('/remove-machine/{mc_id}')
def remove_machine(mc_id: int, db: Session = Depends(get_db)):
    find_machine = db.query(dbModel.Machines).filter(dbModel.Machines.mid == mc_id).first()
    print("Machine Found!")
    if find_machine:
        mc_name = find_machine.mname
        db.delete(find_machine)
        db.commit()
        return f'Machine {mc_name} Deleted Successfuly'
    else:
        return "Machine Not Found!!!"
    
@app.post('/turbine_data')
def add_turbine_data(td: TurbineData, db: Session = Depends(get_db)):
    new_data = TurbineData(
        mcId = td.mcId,
        grpm = td.grpm,
        rrpm = td.rrpm,
        status = td.status,
        hyd_press = td.hyd_press,
        nac_pos = td.nac_pos,
        wind = td.wind,
        power = td.power,
        pf = td.pf,
        fq = td.fq,
        l1 = td.l1,
        l2 = td.l2,
        l3 = td.l3,
        i1 = td.i1,
        i2 = td.i2,
        i3 = td.i3,
        amb_temp = td.amb_temp,
        nac_temp = td.nac_temp,
        gb_temp = td.gb_temp,
        go_temp = td.go_temp,
        g1_temp = td.g1_temp,
        g2_temp = td.g2_temp,
        thy_temp = td.thy_temp,
        main_temp = td.main_temp,
        g1_kw = td.g1_kw,
        g2_kw = td.g2_kw,
        total_kw = td.total_kw,
        g1_hrs = td.g1_hrs,
        g2_hrs = td.g2_hrs,
        total_hrs = td.total_hrs,
        created_at = td.created_at or datetime.utcnow()
    )
    td_row = dbModel.TurbineData(**new_data.model_dump())
    db.add(td_row)
    db.commit()
    update_daily_production(td_row, db)
    handle_alarm(
        mc_id=new_data.mc_id,
        status=new_data.status,
        db=db
    )

    #return {"ok": True}    
    
    return new_data


@app.get('/turbine-datum')
def get_turbine_datum(db: Session = Depends(get_db)):
    return db.query(dbModel.TurbineData).all()

#Get Turbine data by using the machine id
@app.get('/turbine-data/{mid}')
def get_turbine_data_by_id(mid: int, db: Session = Depends(get_db)):
    return db.query(dbModel.TurbineData).filter(dbModel.TurbineData.mcId == mid).order_by(dbModel.TurbineData.tid.desc()).limit(10).all()

@app.get('/turbine-pw/{mid}')
def get_turbine_data_by_id(mid: int, db: Session = Depends(get_db)):
    return db.query(dbModel.TurbineData).filter(dbModel.TurbineData.mcId == mid).order_by(dbModel.TurbineData.tid.desc()).limit(10).all()

    
    
