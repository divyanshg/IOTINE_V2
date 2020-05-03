import time
import machine
import micropython
import network
import esp
import json

esp.osdebug(None)
import gc
gc.collect()

print("WELCOME TO THE WORLD OF Internet Of Things :)")
#EXAMPLE IP ADDRESS
#mqtt_server = '192.168.1.144'
def connectWifi():
  with open("wifiConfig.json") as f:
      data = json.load(f)
      ssid, password = data['ssid'], data['pass']
      station = network.WLAN(network.STA_IF)

      station.active(True)
      station.connect(ssid, password)

      while station.isconnected() == False:
          pass

      print('Connection successful')
      print(station.ifconfig())

connectWifi()

