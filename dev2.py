import iotine as IOTINE
import random
import time
import requests as req

IOTINE.setConnString("B8Xp9BxmS8LcIGnF66RDNOCFYt6DiGle")
print(IOTINE.setDevice("B8Xp9BxmS8LcIGnF66RDNOCFYt6DiGle"))
IOTINE.setUser("GZBIC1oqQN") 

print(IOTINE.CONNECT())

val = 30

def on_message(client, userdata, message):
    msg = str(message.payload.decode("utf-8"))
    print(message.topic, "/",msg)

while True:
    time.sleep(4)
    IOTINE.publish("tempo", str(random.randint(0, 200)), '')
    IOTINE.publish("humido", str(random.randint(0, 100)), '')

    IOTINE.publish("avg", str(random.randint(-100, 100)), '')
    time.sleep(1)