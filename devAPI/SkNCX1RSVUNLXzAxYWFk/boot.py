import time
import machine
import micropython

import esp
import network
esp.osdebug(None)
import gc
import iotine
import json

gc.collect()

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

connectWIFI()    

print("WELCOME TO THE WORLD OF IOT :)")

