import iotine as IOTINE
import random
import time
import requests as req

IOTINE.CONNSTRING = "B8Xp9BxmS8LcIGnF66RDNOCFYt6DiGle"
IOTINE.DEVICENAME = "B8Xp9BxmS8LcIGnF66RDNOCFYt6DiGle"
IOTINE.USER = "GZBIC1oqQN" 

print(IOTINE.CONNECT())

val = 30

def on_message(client, userdata, message):
    msg = str(message.payload.decode("utf-8"))
    print(message.topic, "/",msg)

while True:
    IOTINE.publish("tempo", str(random.randint(0, 200)), '')
    IOTINE.publish("humido", str(random.randint(0, 100)), '')

    IOTINE.publish("avg", str(random.randint(-100, 100)), '')
    time.sleep(1)