import iotine as IOTINE
import random
import time
import requests as req


print(IOTINE.CONNECT())

def on_dc(smthng):
    print("disconnected")

time.sleep(3)

while True:

    IOTINE.publish([
        {
            "name":"ENGINE_OIL",
            "value": str(random.randint(0, 200)),
            "callback": ""
        },
        {
            "name": "ENGINE_TEMPERATURE",
            "value": str(random.randint(0, 100)),
            "callback": ""
        },
        {
            "name":"CONT_TEMP",
            "value": str(random.randint(1, 100)),
            "callback": ""
        },
        {
            "name":"CORE_TEMP",
            "value": str(random.randint(1, 100)),
            "callback": ""
        },
        {
            "name":"TYRE_PRESSURE_AVG",
            "value": str(random.randint(1, 100)),
            "callback": ""
        }
    ])

    time.sleep(3)