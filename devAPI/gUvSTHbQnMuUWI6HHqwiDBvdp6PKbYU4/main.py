import iotine
import machine
import esp32
from machine import Pin, ADC

PINX = 32   # needs to be a pin that supports ADC
PINY = 33   # needs to be a pin that supports ADC
PINSW = 15

adcx = ADC(Pin(PINX))
adcx.atten(ADC.ATTN_11DB)
adcy = ADC(Pin(PINY))
adcy.atten(ADC.ATTN_11DB)
sw = Pin(PINSW, Pin.IN, Pin.PULL_UP)


def button_pressed():
  iotine.publish([
      {
          "name": "CORE_TEMP_ESP",
          "value": esp32.raw_temperature()
      },
      {
          "name": "CORE_HALL",
          "value": esp32.hall_sensor()
      }            
    ]
  , on_pub)  

led = iotine.led

def joystick(adc):
    return max(6, min(120, int(adc.read()/32)))


def on_sub(topic, msg):
  iotine.listenToSystemCommands(topic, msg)
  print(topic+" / "+msg)

def on_pub(s):
  print("message Sent")


iotine.subscribe("CORE_TEMP", on_sub)

def main_loop():
  if sw.value() == 0:
      button_pressed()
      
  iotine.publish(
    [
      {
        "name": "ESP_X",
        "value": joystick(adcx)
      },
      {
        "name":"ESP_Y",
        "value": joystick(adcy)
      }
    ]
  , on_pub)            

iotine.loop(main_loop)
    
