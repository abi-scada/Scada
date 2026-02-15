import random
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from models import TurbineData

def generate_turbine_data(machine_id: int):
    g1_kw = random.randint(200, 400)
    g2_kw = random.randint(200, 400)

    return TurbineData(
        mcId=machine_id,

        grpm=random.randint(100, 900),
        rrpm=random.randint(20, 24), 
        status=random.choice(["stop", "yaw motor overload","grid drop","stop", "yaw motor overload","grid drop","run","run","run","run"]),
        #status=random.choice(["stop","run","run","run","run","run","run","run","run","run","run","run","run","run","run","run"]),

        hyd_press=random.randint(120, 200),
        nac_pos=random.randint(0, 360),

        wind=round(random.uniform(1.0, 30.0), 2),
        power=round(random.uniform(300, 800), 2),

        pf=round(random.uniform(0.85, 0.99), 2),
        fq=round(random.uniform(49.5, 50.5), 2),

        l1=random.randint(380, 420),
        l2=random.randint(380, 420),
        l3=random.randint(380, 420),

        i1=random.randint(100, 300),
        i2=random.randint(100, 300),
        i3=random.randint(100, 300),

        amb_temp=random.randint(20, 45),
        nac_temp=random.randint(30, 60),
        gb_temp=random.randint(40, 90),
        go_temp=random.randint(40, 85),

        g1_temp=random.randint(40, 95),
        g2_temp=random.randint(40, 95),
        thy_temp=random.randint(35, 85),
        main_temp=random.randint(40, 90),

        g1_kw=g1_kw,
        g2_kw=g2_kw,
        total_kw=g1_kw + g2_kw,

        g1_hrs=random.randint(1000, 9000),
        g2_hrs=random.randint(1000, 9000),
        total_hrs=random.randint(2000, 18000),

        created_at=datetime.now(ZoneInfo("Asia/Kolkata"))
    )
