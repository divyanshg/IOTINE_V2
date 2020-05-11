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
            "name":"CORE_TEMP",
            "value": str(random.randint(1, 100)),
            "callback": ""
        }
    ])

    time.sleep(0.2)