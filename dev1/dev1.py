import iotine as IOTINE
import random
import time
import requests as req
import os
import sys
import json

import sounddevice as sd
import numpy as np

print(IOTINE.CONNECT())

def on_dc(smthng):
    print("disconnected")

time.sleep(2)


def resetTest(s):
    os.execl(sys.executable, sys.executable, *sys.argv)

def prt(msg):
    print(msg)

# while True:
#     IOTINE.subscribe('CORE_TEMP', prt)
#     IOTINE.doDefaults()
#     IOTINE.publish([
#         {
#             "name":"ENGINE_OIL",
#             "value":json.dumps({"user": "divyansh", "scode":"server1", "rCode":"room34", "time":"11:03", "Dev": "M20"})+"/PSI",
#             "callback": ""
#         },
#         {
#             "name":"02_TYRE_PRESSURE",
#             "value": str(random.randint(0, 200))+"/PSI",
#             "callback": ""
#         },
#         {
#             "name":"CORE_HUMID",
#             "value": str(random.randint(1, 100))+"/",
#             "callback": ""
#         },
#         {
#             "name":"ENGINE_TEMPERATURE",
#             "value": str(random.randint(0, 200))+"/C",
#             "callback": ""
#         },
#         {
#             "name":"TYRE_PRESSURE_AVG",
#             "value": str(random.randint(1, 100))+"/psi",
#             "callback": ""
#         }
#     ])
#     #IOTINE.DISCONNECT(resetTest)

#     time.sleep(2)


duration = 100 #in seconds

def audio_callback(indata, frames, time, status):
   volume_norm = np.linalg.norm(indata) * 10
   IOTINE.publish([{"name":"ENGINE_OIL", "value":str(int(volume_norm))+"/DB", "callback": ""}])
   #print(int(volume_norm))


stream = sd.InputStream(callback=audio_callback)
with stream:
   time.sleep(duration * 1000)