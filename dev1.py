import iotine as IOTINE
from iotine import GPIO
import random
import time
import requests as req

IOTINE.CONNSTRING = "SkNCX1RSVUNLXzAxYWFk"
IOTINE.DEVICENAME = "SkNCX1RSVUNLXzAxYWFk"
IOTINE.USER = "iub54i6bibu64" 

print(IOTINE.CONNECT())

val = 30

GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.OUT)

def on_message(client, userdata, message):
    msg = str(message.payload.decode("utf-8"))
    if message.topic.split("/")[1] == "else":
        r = req.get("http://192.168.31.212:8080/ptz?zoom="+msg)
    elif message.topic.split("/")[1] == "etg54":    
        if msg == "ON":
            r = req.get('http://192.168.31.212:8080/enabletorch')
            print(r.text)[0:300]
        #GPIO.output(17, GPIO.HIGH)
        elif msg == "OFF":
            r = req.get('http://192.168.31.212:8080/disabletorch')
            print(r.text)[0:300]    
    elif message.topic.split("/")[1] == "retg54":    
        if msg == "ON":
            GPIO.output(17, GPIO.HIGH)
        elif msg == "OFF":
            GPIO.output(17, GPIO.LOW)  
    print(message.topic, "/",msg)

timess = 0

while True:

    IOTINE.publish("04_TYRE_PRESSURE", random.randint(-30, 30), '')
    IOTINE.publish("CONT_TEMP", random.randint(-30, 30), '')
    IOTINE.publish("CONT_HUMID", random.randint(-3, 3), '')
    IOTINE.subscribe("CONT_TEMP", on_message)
    IOTINE.publish("TYRE_PRESSURE_AVG", random.randint(-30, 30), '')
    if timess == 15:
        IOTINE.publish("$SYS/COMMANDS", "RESET", '')
        raise SyntaxError('MUHAHA THIS IS A ERROR')
    #IOTINE.publish("ENGINE_TEMPERATURE", str(random.randint(0, 200)), '')
    IOTINE.publish("ENGINE_OIL", str(random.randint(0, 100)), '')
    time.sleep(3)
    timess += 1