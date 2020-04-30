import iotine as IOTINE
from iotine import GPIO
import random
import time
import requests as req

IOTINE.CONNSTRING = "B8Xp9BxmS8LcIGnF66RDNOCFYt6DiGle"
IOTINE.DEVICENAME = "B8Xp9BxmS8LcIGnF66RDNOCFYt6DiGle"
IOTINE.USER = "GZBIC1oqQN" 

print(IOTINE.CONNECT())

val = 30

GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.OUT)

def on_message(client, userdata, message):
    msg = str(message.payload.decode("utf-8"))
    print(message.topic, "/",msg)

while True:
    IOTINE.publish("tempo", str(random.randint(0, 200)), '')
    IOTINE.publish("humido", str(random.randint(0, 100)), '')
    time.sleep(1)