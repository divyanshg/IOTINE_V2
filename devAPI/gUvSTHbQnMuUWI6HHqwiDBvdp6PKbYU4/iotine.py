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
import socket



machine = machine
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

mqtt_server = 'iotine.zapto.org'
connected = False

client_id = "ESP32_"+ubinascii.hexlify(network.WLAN().config('mac'),':').decode()

device_id = deviceConfig()['deviceId']
user_id = deviceConfig()['userId']
__VERSION = deviceConfig()['__version']
pubstop = False

def listenToSystemCommands(topic, msg):          
  if topic.decode() == device_id+'/$SYS/COMMANDS/NON':
    if  msg == b"RST":
        led.value(1)
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
  elif topic.decode() == device_id+"/$SYS/COMMANDS/IO_STATE/NON":
    print("CHANGING STATE OF I/O PIN: "+msg.decode())  
    statepin = Pin(int(msg.decode()), Pin.OUT)
    statepin.value(not statepin.value())
    print(statepin.value())
  elif topic.decode() == device_id+'/$SYS/COMMANDS/UPDATE/NON':
      print("\n")
      print("*_#_" * 20) 
      led.value(1)
      print("DOWNLOADING FIRMWARE UPDATE...")  
      getUpdate()
  elif topic.decode() == device_id+'/$SYS/COMMANDS/NEWFILE/NON':
      getFile(msg.decode())   



def connect():
  global device_id, mqtt_server, connected, client
  client = MQTTClient(client_id, mqtt_server, 1883, device_id, b'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzb21lIjoicGF5bG9hZCJ9.UJxr678lFNPfhg9vBVw2AUstoxtzfPmcygBHPLu65Z8')
  client.set_callback(listenToSystemCommands)
  try:
      client.connect()
  except OSError as e:
      print("cannot connect to IOTINE.\nRebooting in 15s.")
      time.sleep(15)
      restart_and_reconnect()    


  client.subscribe(device_id+'/$SYS/COMMANDS/NON')
  client.subscribe(device_id+'/$SYS/COMMANDS/IO_STATE/NON')
  client.subscribe(device_id+'/$SYS/COMMANDS/UPDATE/NON')
  client.subscribe(device_id+'/$SYS/COMMANDS/NEWFILE/NON')


  client.publish(device_id+'/$__VERSION/'+user_id, str(__VERSION))
  client.publish(device_id+'/FSYS/'+user_id, str(os.listdir()))

  print('Connected to IOTINE')
  return client

def restart_and_reconnect():
  machine.reset()


def getFile(file): 
  s = file.split("/")
  print("\n")
  print("*_#_" * 20)  
  print("DOWNLOADING "+s[len(s)-1]+" FROM "+file)  
  url = file
  r = requests.get(url)  
  open(s[len(s)-1], 'wb').write(r.text)
  print(s[len(s)-1]+" IS SUCCESSFULLY DOWNLOADED FROM "+file)

  print("\n")
  print("*_#_"* 20 )

def getUpdate():
  url = 'https://iotine.zapto.org/IOTINE_V2/devAPI/'+device_id+'/main.py'
  r = requests.get(url)   

  with open("main.py", 'r+') as f:
    data = f.read()
    f.seek(0)
    f.write(r.text)
    f.close()

  url = 'https://iotine.zapto.org/IOTINE_V2/devAPI/'+device_id+'/boot.py'
  r = requests.get(url)   

  
  with open("boot.py", 'r++') as f:
    data = f.read()
    f.seek(0)
    f.write(r.text)  
    f.close()

  url = 'https://iotine.zapto.org/IOTINE_V2/devAPI/'+device_id+'/iotine.py'
  r = requests.get(url) 

  with open("iotine.py", 'r++') as f:
    data = f.read()
    f.seek(0)
    f.write(r.text)  
    f.close()

  

  url = 'https://iotine.zapto.org/IOTINE_V2/devAPI/'+device_id+'/deviceConfig.json'
  r = requests.get(url)
  data = json.loads(r.text)
  with open("deviceConfig.json", "w") as f:
    json.dump(data, f) 

  url = 'https://iotine.zapto.org/IOTINE_V2/devAPI/'+device_id+'/wifiConfig.json'
  r = requests.get(url)
  data = json.loads(r.text)
  with open("wifiConfig.json", "w") as f:
    json.dump(data, f)    

  print("UPDATE DOWNLOADED SUCCESSFULLY. \n REBOOTING IN 3s.")
  print("\n")
  print("*_#_"* 20 )  
  time.sleep(3)
  machine.reset()


def rand(min=0, max=100):
    return random.randint(min, max)

def subscribe(topic, callback=None):
    client.subscribe(device_id+"/"+topic+"/NON")
    if callback == None:
        return
    else:    
        client.set_callback(callback) 


def waitMsg():
  client.wait_msg()

def checkMsg():
    client.check_msg()

def publish(payload, callback=None):
    checkMsg()
    if pubstop == False:
        try:
          client.publish(device_id+'/$__VERSION/'+user_id, str(__VERSION))
          client.publish(device_id+'/FSYS/'+user_id, str(os.listdir()))
          for i in range(len(payload)):
            if callback == None:
                client.publish(str(device_id+"/"+payload[i]['name']+"/"+user_id), str(payload[i]['value']))
                #print("\nPUBLISH_STATUS OF "+payload[i]['name']+" : YES\n")
            else:
                callback(client.publish(device_id+"/"+payload[i]['name']+"/"+user_id, str(payload[i]['value'])))
                #print("\nPUBLISH_STATUS OF "+payload[i]['name']+" : YES\n")
                
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

def loop(callback):
  while True:
    try:
      client.check_msg()
      callback()
    except OSError as e:
      print("An error has occurred!!\nRebooting in 5s.")
      time.sleep(5)
      restart_and_reconnect()          