import iotine as IOTINE
from iotine import GPIO
import random
import time
import requests as req

IOTINE.CONNSTRING = "1DtMWsD16ro07wlECZdrMirXm0qEoHBi"
IOTINE.DEVICENAME = "1DtMWsD16ro07wlECZdrMirXm0qEoHBi"
IOTINE.USER = "GZBIC1oqQN" 

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

while True:
    #IOTINE.publish("retg54", random.randint(-30, 30), '')
    #IOTINE.publish("Web_Sensor", random.randint(-3, 3), '')
    #IOTINE.subscribe("retg54", on_message)
    IOTINE.publish("tempo", str(random.randint(0, 100)), '')
    IOTINE.publish("humido", str(random.randint(0, 100)), '')
    time.sleep(3)