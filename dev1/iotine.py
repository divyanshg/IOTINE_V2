import paho.mqtt.client as mqtt #import the client1
import os
import time
import random
#import RPi.GPIO as GPIO
import math
import json
import string
import sys
import datetime

import base64
import hashlib
from Crypto.Cipher import AES
from Crypto import Random
import jwt

#GPIO = GPIO
IOTINE_HOST="iotine.ddns.net"
CONNSTRING = '_wlPFr8mNWRFZcUgbxbK08Oh79uCBcuoc'
DEVICENAME = '_wlPFr8mNWRFZcUgbxbK08Oh79uCBcuoc'
USER = 'iub54i6bibu64'
pubstop = False

JWTalgorithm = 'HS512'

if IOTINE_HOST != "iotine.ddns.net":
    print("CUSTOM HOST IS NOT SUPPORTED!/nSITCHING BACK TO IOTINE_HOST")
    IOTINE_HOST = "iotine.ddns.net"

def listenToSystemCommands(client, userdata, message):
    msg = str(message.payload.decode("utf-8"))
    topic = message.topic.split("/")
    global pubstop
    print(msg)
    if topic[1] == "$SYS" and topic[2] == "COMMANDS" and topic[0] == CONNSTRING:
        if msg == "RST":
            os.execl(sys.executable, sys.executable, *sys.argv)
        elif msg == "PUB_STOP":
            pubstop = True   
        if msg == "PUB_START":
            pubstop = False      

def on_connect(client, userdata, flags, rc):
    if rc==0:
        print("Connection Authorized")
    else:
        print("Connection Rejected")
########################################
client = mqtt.Client(DEVICENAME) #create new instance
print(DEVICENAME)

def publicKey():
    with open("key.pem") as key:
        key = key.read()
        return key

password = jwt.encode({'some': 'payload', "iat":datetime.datetime.utcnow(), "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=5)}, publicKey(), algorithm=JWTalgorithm)   

def CONNECT():
    client.on_message = listenToSystemCommands
    client.on_connect = on_connect
    client.username_pw_set(CONNSTRING, password)
    client.connect_async(IOTINE_HOST) #connect to broker
    client.loop_start() #start the loop

    #return json.dumps({"status": "Connected"})

def will(topic, payload=None, qos=0, retain=False):
    client.will_set(topic, payload=payload, qos=qos, retain=retain)

def publish(data):
    if pubstop == False:
        for i in range(len(data)): 

            feed = data[i]["name"]
            val = data[i]["value"]
            callback = data[i]["callback"]

            if callback == '':
                client.publish(str(jwt.encode({'topic': CONNSTRING+"/"+feed+"/"+USER, 'value': str(val), "iat":datetime.datetime.utcnow(), "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=5)}, publicKey(), algorithm=JWTalgorithm)), '')
            else:    
                client.publish(str(jwt.encode({'topic': CONNSTRING+"/"+feed+"/"+USER, 'value': str(val), "iat":datetime.datetime.utcnow(), "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=5)}, publicKey(), algorithm=JWTalgorithm)), '', callback=callback)

def subscribe(feed, callback=None):
    if callback == "":
        client.on_message = listenToSystemCommands
        return client.subscribe(CONNSTRING+"/"+feed+"/NON")
    else:
        client.on_message = callback
        client.subscribe(CONNSTRING+"/"+feed+"/NON")

def is_published(topic):
    return topic.is_published()

def wait_for_publish(topic):
    return topic.wait_for_publish()

def UNSUBSCRIBE(topic, callback=None):
    if callback == '':
        client.unsubscribe(topic)
    else:
        callback(client.unsubscribe(topic))
        
def DISCONNECT(callback):
    if callback == '':
        client.disconnect()
    else:
        callback(client.disconnect())
              
def doDefaults():
    subscribe("$SYS/COMMANDS", '')   
    publish([{"name":"$__VERSION","value": "1.7.2","callback": ''}])           