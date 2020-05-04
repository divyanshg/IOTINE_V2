import time
import machine
import micropython

import esp
esp.osdebug(None)
import gc
import json
import iotine

gc.collect()


print(iotine.__VERSION)

iotine.connectWIFI()    

iotine.connect()

print("WELCOME TO THE WORLD OF IOT :)")

