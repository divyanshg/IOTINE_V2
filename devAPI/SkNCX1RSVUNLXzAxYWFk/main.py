from machine import Pin
from time import sleep
from umqttsimple import MQTTClient
import json
import ubinascii
import random
import urequests as requests
import os

__VERSION = '2.2.8'

print(__VERSION)
mqtt_server = '192.168.31.249'
client_id = "SkNCX1RSVUNLXzAxYWFk"
topic_sub = b'SkNCX1RSVUNLXzAxYWFk/CONT_TEMP/NON'
topic_pub = b'SkNCX1RSVUNLXzAxYWFk/ENGINE_TEMPERATURE/iub54i6bibu64'
pubstop = False

last_message = 0
message_interval = 2
counter = 0
led = Pin(2, Pin.OUT)

def sub_cb(topic, msg):
  if topic == b'SkNCX1RSVUNLXzAxYWFk/CONT_TEMP/NON':
    print(str(msg)) 
  elif topic == b'SkNCX1RSVUNLXzAxYWFk/$SYS/COMMANDS/NON':
    if  msg == b"RST":
        machine.reset()
    elif msg == b"PUB_STOP":
        global pubstop
        pubstop = True 
    elif msg == b"PUB_START":
        global pubstop
        pubstop = False
  elif topic == b"SkNCX1RSVUNLXzAxYWFk/$SYS/COMMANDS/IO_STATE/NON":
    statepin = Pin(int(msg), Pin.OUT)
    statepin.value(not statepin.value())
    print(statepin.value())
  elif topic == b'SkNCX1RSVUNLXzAxYWFk/$SYS/COMMANDS/UPDATE/NON':  
      getUpdate()
  elif topic == b'SkNCX1RSVUNLXzAxYWFk/$SYS/COMMANDS/NEWFILE/NON':
      getFile(msg.decode())   
      

def getFile(file):
  url = file
  r = requests.get(url)   
  s = file.split("/")
  open(s[len(s)-1], 'wb').write(r.text)
  print(s[len(s)-1])

def getUpdate():
  url = 'http://192.168.31.249/IOTINE_V2/devAPI/'+client_id+'/main.py'
  r = requests.get(url)   

  with open("main.py", 'w') as f:
    data = f.read()
    f.seek(0)
    f.write(r.text)
    f.close()

  url = 'http://192.168.31.249/IOTINE_V2/devAPI/'+client_id+'/boot.py'
  r = requests.get(url)   

  with open("boot.py", 'w') as f:
    data = f.read()
    f.seek(0)
    f.write(r.text)  
    f.close()
  machine.reset()

def connect_and_subscribe():
  global client_id, mqtt_server, topic_sub
  client = MQTTClient(client_id, mqtt_server, 1883, "SkNCX1RSVUNLXzAxYWFk", '')
  client.set_callback(sub_cb)
  client.connect()

  client.subscribe(topic_sub)

  client.subscribe(b'SkNCX1RSVUNLXzAxYWFk/$SYS/COMMANDS/NON')
  client.subscribe(b'SkNCX1RSVUNLXzAxYWFk/$SYS/COMMANDS/IO_STATE/NON')
  client.subscribe(b'SkNCX1RSVUNLXzAxYWFk/$SYS/COMMANDS/UPDATE/NON')
  client.subscribe(b'SkNCX1RSVUNLXzAxYWFk/$SYS/COMMANDS/NEWFILE/NON')
  client.subscribe(b'SkNCX1RSVUNLXzAxYWFk/$SYS/COMMANDS/LISTDIR/NON')

  print('Connected to %s MQTT broker, subscribed to %s topic' % (mqtt_server, topic_sub))
  return client

def restart_and_reconnect():
  print('Failed to connect to MQTT broker. Reconnecting...')
  time.sleep(10)
  machine.reset()

try:
  client = connect_and_subscribe()
except OSError as e:
      print("Error connecting")
      restart_and_reconnect()

timepub = 0
while True:
  try:
    if pubstop == False:
        client.check_msg()
        if (time.time() - last_message) > message_interval:
          msg = b'%d' % counter
          if timepub >= 5:
              client.publish("SkNCX1RSVUNLXzAxYWFk/FSYS/iub54i6bibu64", str(os.listdir()))
              client.publish(topic_pub, msg)
              client.publish('SkNCX1RSVUNLXzAxYWFk/$__VERSION/iub54i6bibu64', str(__VERSION))
              client.publish("SkNCX1RSVUNLXzAxYWFk/CONT_TEMP/iub54i6bibu64", str(random.randint(-100, 100)))
              client.publish("SkNCX1RSVUNLXzAxYWFk/TYRE_PRESSURE_AVG/iub54i6bibu64", str(random.randint(-100, 100)))
              client.publish("SkNCX1RSVUNLXzAxYWFk/ENGINE_OIL/iub54i6bibu64", str(random.randint(10, 50)))

              led.value(not led.value())
              sleep(0.2)
              led.value(not led.value())
          timepub += 10  
          last_message = time.time()
          counter += 1
  except OSError as e:
      print("Error connecting")
      restart_and_reconnect() 