import iotine
import machine
import esp32
from machine import Pin, ADC

PINX = 32   # needs to be a pin that supports ADC
PINY = 33   # needs to be a pin that supports ADC
PINSW = 0

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
    return max(6, min(180, int(adc.read()/32)))


def on_sub(topic, msg):
  iotine.listenToSystemCommands(topic, msg)
  if topic.decode() == iotine.device_id+'/ESP_X/NON':
      moveServo(int(msg.decode()))
  elif topic.decode() == iotine.device_id+"/ESP_INT_LED/NON":
      if msg.decode() == 'ON':
        iotine.led.value(1)
      else:
        iotine.led.value(0)  

def on_pub(s):
  #print("message Sent")
  return 1


iotine.subscribe("ESP_X", on_sub)
iotine.subscribe("ESP_INT_LED", on_sub)

def main_loop():
  if sw.value() == 0:
      button_pressed()
  
  if iotine.pubstop == False:    
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
      iotine.checkMsg()   
  else:
    moveServo(joystick(adcx))

iotine.loop(main_loop)
    
