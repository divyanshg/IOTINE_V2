import iotine
import machine
import esp32
from machine import Pin, ADC

PINX = 32   # needs to be a pin that supports ADC
PINY = 33   # needs to be a pin that supports ADC
PINSW = 15

p4 = machine.Pin(4)
servo = machine.PWM(p4,freq=50)
adcx = ADC(Pin(PINX))
adcx.atten(ADC.ATTN_11DB)
adcy = ADC(Pin(PINY))
adcy.atten(ADC.ATTN_11DB)
sw = Pin(PINSW, Pin.IN, Pin.PULL_UP)

def moveServo(dty):
  servo.duty(dty)
  return dty

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
    return max(0, min(180, int(adc.read()/32)))


def on_sub(topic, msg):
  iotine.listenToSystemCommands(topic, msg)
  print(topic)
  if topic.decode() == iotine.device_id+"/ESP_X/NON":
      #moveServo(int(msg.decode()))  
      print(msg)

def on_pub(s):
  print("message Sent")


iotine.subscribe("ESP_X", on_sub)

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
    
