import iotine as IOTINE
import random
import time
import requests as req


print(IOTINE.CONNECT())

val = 30

def on_message(client, userdata, message):
    msg = str(message.payload.decode("utf-8"))
    print(message.topic, "/",msg)

time.sleep(5)
timess = 0
while True:
    IOTINE.doDefaults()
    IOTINE.publish([
        {
            "name":"tempo",
            "value": random.randint(0, 100),
            "callback": ''
        },
        {
            "name":"humido",
            "value": random.randint(0, 100),
            "callback": ''
        },
        {
            "name":"avg",
            "value": random.randint(0, 100),
            "callback": ''
        },
        ])
    time.sleep(1)