import time
import machine
import micropython
import network
import esp
esp.osdebug(None)
import gc
gc.collect()

print("WELCOME TO THE WORLD OF IOT :()")
ssid = 'home_wifi'
password = 'dig22569'
#EXAMPLE IP ADDRESS
#mqtt_server = '192.168.1.144'


station = network.WLAN(network.STA_IF)

station.active(True)
station.connect(ssid, password)

while station.isconnected() == False:
  pass

print('Connection successful')
print(station.ifconfig())