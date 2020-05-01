import paho.mqtt.client as mqtt #import the client1
import os
import time
import random
import RPi.GPIO as GPIO
import math
import json
import string

GPIO = GPIO
IOTINE_HOST="192.168.31.249"
CONNSTRING = 'virtual_B8Xp9BxmS8LcIGnF66RDNOCFYt6DiGle'
DEVICENAME = 'virtual_B8Xp9BxmS8LcIGnF66RDNOCFYt6DiGle'
USER = 'iub54i6bibu64'

if IOTINE_HOST != "192.168.31.249":
    print("CUSTOM HOST IS NOT SUPPORTED!/nSITCHING BACK TO IOTINE_HOST")
    IOTINE_HOST = "192.168.31.249"

def on_message(client, userdata, message):
    msg = str(message.payload.decode("utf-8"))
    topic = message.topic.split("/")
    print(msg)
    if topic[0] == "$SYS" and topic[1] == "COMMANDS" and topic[2] == CONNSTRING:
        print("SYSTEM COMMAND: "+msg)

def on_connect(client, userdata, flags, rc):
    if rc==0:
        print("Connection Authorized")
    else:
        print("Connection Rejected")
########################################
client = mqtt.Client(DEVICENAME) #create new instance
print(DEVICENAME)
def CONNECT():
    client.on_message = on_message
    client.on_connect = on_connect
    client.username_pw_set(CONNSTRING)
    client.connect_async(IOTINE_HOST) #connect to broker
    client.loop_start() #start the loop
    
    client.subscribe("$SYS/COMMANDS/"+CONNSTRING) 
    #return json.dumps({"status": "Connected"})

def will(topic, payload=None, qos=0, retain=False):
    client.will_set(topic, payload=payload, qos=qos, retain=retain)

def publish(feed, val, callback=None):
    if callback == '':
        client.publish(CONNSTRING+"/"+feed+"/"+USER, str(val))
    else:    
        client.publish(CONNSTRING+"/"+feed+"/"+USER, str(val), callback=callback)

def subscribe(feed, callback=None):
    if callback == "":
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
        client.disconnect()
              
def makerest():
    client.publish('$SYS/COMMANDS', "RESET")              