import iotine as IOTINE
import random
import time
import requests as req


print(IOTINE.CONNECT())

def on_dc(smthng):
    print("disconnected")

time.sleep(2)


while True:
    IOTINE.doDefaults()
    IOTINE.publish([
        {
            "name":"ENGINE_OIL",
            "value": str(random.randint(0, 200))+"/Ltrs",
            "callback": ""
        },
        {
            "name":"CORE_TEMP",
            "value": str(random.randint(1, 100))+"/C",
            "callback": ""
        },
        {
            "name":"02_TYRE_PRESSURE",
            "value": str(random.randint(0, 200))+"/PSI",
            "callback": ""
        },
        {
            "name":"CORE_HUMID",
            "value": str(random.randint(1, 100))+"/",
            "callback": ""
        },
        {
            "name":"ENGINE_TEMPERATURE",
            "value": str(random.randint(0, 200))+"/C",
            "callback": ""
        },
        {
            "name":"TYRE_PRESSURE_AVG",
            "value": str(random.randint(1, 100))+"/psi",
            "callback": ""
        }
    ])

    time.sleep(2)