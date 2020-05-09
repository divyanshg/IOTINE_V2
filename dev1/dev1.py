import iotine as IOTINE
import random
import time
import requests as req


print(IOTINE.CONNECT())

val = 30

def on_message(client, userdata, message):
    msg = str(message.payload.decode("utf-8"))
    topic = message.topic.split("/")
    if topic[1] == "CORE_TEMP":
        print("Ofooo")

time.sleep(5)
timess = 0

IOTINE.subscribe("CORE_TEMP", on_message)

while True:
    IOTINE.publish("ENGINE_OIL", str(random.randint(0, 200)), '')
    IOTINE.publish("ENGINE_TEMPERATURE", str(random.randint(0, 100)), '') 
    IOTINE.doDefaults()
    IOTINE.publish("CONT_TEMP", str(random.randint(1, 100)), '')
    IOTINE.publish("CORE_TEMP", str(random.randint(1, 100)), '')
    IOTINE.publish("TYRE_PRESSURE_AVG", str(random.randint(1, 100)), '')
    time.sleep(1)