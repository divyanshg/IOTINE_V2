import machine
from machine import Pin
import time
from umqttsimple import MQTTClient
import json
import ubinascii
import random
import urequests as requests
import os
import random


import network


led = Pin(2, Pin.OUT)

def connectWIFI():
  with open("wifiConfig.json") as f:
    data = json.load(f)
    ssid = data['ssid']
    password = data['password']


    station = network.WLAN(network.STA_IF)

    station.active(True)
    station.connect(ssid, password)

    while station.isconnected() == False:
      pass

    print('Connection successful')
    print(station.ifconfig())
    led.value(1)
    time.sleep(1)
    led.value(0)
    time.sleep(0.25)
    led.value(1)
    time.sleep(0.25)
    led.value(0)
    time.sleep(0.25)
    led.value(1)
    time.sleep(0.25)
    led.value(0)


def deviceConfig():
    with open("deviceConfig.json") as f:
      data = json.load(f)
      return data

mqtt_server = '192.168.31.249'
connected = False

client_id = deviceConfig()['deviceId']
user_id = deviceConfig()['userId']
__VERSION = deviceConfig()['__version']
pubstop = False

def listenToSystemCommands(topic, msg):          
  if topic.decode() == client_id+'/$SYS/COMMANDS/NON':
    if  msg == b"RST":
        print("RESET COMMAND RECIEVED")
        machine.reset()
    elif msg == b"PUB_STOP":
        global pubstop
        print("PUBLISHING IS STOPPED BY IOTINE")
        pubstop = True 
    elif msg == b"PUB_START":
        global pubstop
        print("PUBLISHING IS STARTED AGAIN BY IOTINE")
        pubstop = False
  elif topic.decode() == client_id+"/$SYS/COMMANDS/IO_STATE/NON":
    print("CHANGING STATE OF I/O PIN: "+msg)  
    statepin = Pin(int(msg), Pin.OUT)
    statepin.value(not statepin.value())
    print(statepin.value())
  elif topic.decode() == client_id+'/$SYS/COMMANDS/UPDATE/NON':
      print("DOWNLOADING FIRMWARE UPDATE...")  
      getUpdate()
  elif topic.decode() == client_id+'/$SYS/COMMANDS/NEWFILE/NON':
      getFile(msg.decode())   
  else:
      print(topic, " : ", msg)


def connect():
  global client_id, mqtt_server, connected, client
  client = MQTTClient(client_id, mqtt_server, 1883, client_id, '')
  client.set_callback(listenToSystemCommands)
  try:
      client.connect()
  except OSError as e:
      print("cannot connect to IOTINE.\nRebooting in 5s.")
      time.sleep(5)
      restart_and_reconnect()    


  client.subscribe(client_id+'/$SYS/COMMANDS/NON')
  client.subscribe(client_id+'/$SYS/COMMANDS/IO_STATE/NON')
  client.subscribe(client_id+'/$SYS/COMMANDS/UPDATE/NON')
  client.subscribe(client_id+'/$SYS/COMMANDS/NEWFILE/NON')


  client.publish(client_id+'/$__VERSION/'+user_id, str(__VERSION))
  client.publish(client_id+'/FSYS/'+user_id, str(os.listdir()))

  print('Connected to IOTINE')
  return client

def restart_and_reconnect():
  machine.reset()


def getFile(file): 
  s = file.split("/")
  print("DOWNLOADING "+s[len(s)-1]+" FROM "+file)  
  url = file
  r = requests.get(url)  
  open(s[len(s)-1], 'wb').write(r.text)
  print(s[len(s)-1]+" IS SUCCESSFULLY DOWNLOADED FROM "+file)

def getUpdate():
  url = 'http://192.168.31.249/IOTINE_V2/devAPI/'+client_id+'/main.py'
  r = requests.get(url)   

  with open("main.py", 'r+') as f:
    data = f.read()
    f.seek(0)
    f.write(r.text)
    f.close()

  url = 'http://192.168.31.249/IOTINE_V2/devAPI/'+client_id+'/boot.py'
  r = requests.get(url)   

  with open("boot.py", 'r++') as f:
    data = f.read()
    f.seek(0)
    f.write(r.text)  
    f.close()

  with open("iotine.py", 'r++') as f:
    data = f.read()
    f.seek(0)
    f.write(r.text)  
    f.close()

  with open("deviceConfig.json", 'r++') as f:
    data = f.read()
    f.seek(0)
    f.write(r.text)  
    f.close()  

  with open("wifiConfig.json", 'r++') as f:
    data = f.read()
    f.seek(0)
    f.write(r.text)  
    f.close()

  print("UPDATE DOWNLOADED SUCCESSFULLY. \n REBOOTING IN 3s.")
  time.sleep(3)  
  machine.reset()


def rand(min=0, max=100):
    return random.randint(min, max)

def subscribe(topic, callback=None):
    client.subscribe(client_id+"/"+topic+"/NON")
    if callback == None:
        return
    else:    
        client.set_callback(callback) 


def publish(topic, msg, callback=None):
    if pubstop == False:
        try:
            if callback == None:
                client.publish(str(client_id+"/"+topic+"/"+user_id), str(msg))
                print("PUBLISH_STATUS OF "+topic+" : YES")
                led.value(1)
                time.sleep(0.25)
                led.value(0)
                time.sleep(0.25)
                led.value(1)
                time.sleep(0.25)
                led.value(0) 
            else:
                callback(client.publish(client_id+"/"+topic+"/"+user_id, str(msg)))
                print("PUBLISH_STATUS OF "+topic+" : YES")
                led.value(1)
                time.sleep(0.25)
                led.value(0)
                time.sleep(0.25)
                led.value(1)
                time.sleep(0.25)
                led.value(0)        
        except OSError as e:
            print("Connection lost to IOTINE... Rebooting in 15s. ", e)
            time.sleep(15)
            restart_and_reconnect()   
    else:
        return    