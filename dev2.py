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
    IOTINE.publish("tempo", str(random.randint(0, 200)), '')
    IOTINE.publish("humido", str(random.randint(0, 100)), '') 
    IOTINE.doDefaults()
    IOTINE.publish("avg", str(random.randint(1, 100)))
    time.sleep(1)