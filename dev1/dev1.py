import iotine as IOTINE
import random
import time
import requests as req


print(IOTINE.CONNECT())

time.sleep(5)

while True:
    IOTINE.publish([
        {
            "name":"ENGINE_OIL",
            "value": str(random.randint(0, 200)),
            "callback": ''
        },
        {
            "name": "ENGINE_TEMPERATURE",
            "value": str(random.randint(0, 100)),
            "callback": ''
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
    #IOTINE.publish("ENGINE_OIL", str(random.randint(0, 200)), '')
    #IOTINE.publish("ENGINE_TEMPERATURE", str(random.randint(0, 100)), '') 
    #IOTINE.doDefaults()
    #IOTINE.publish("CONT_TEMP", str(random.randint(1, 100)), '')
    #IOTINE.publish("CORE_TEMP", str(random.randint(1, 100)), '')
    #IOTINE.publish("TYRE_PRESSURE_AVG", str(random.randint(1, 100)), '')
    time.sleep(1)