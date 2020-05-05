import iotine
import machine
import esp32
from machine import Pin, ADC

PINX = 12   # needs to be a pin that supports ADC
PINY = 13   # needs to be a pin that supports ADC
PINSW = 17

adcx = ADC(Pin(PINX))
adcx.atten(ADC.ATTN_11DB)
adcy = ADC(Pin(PINY))
adcy.atten(ADC.ATTN_11DB)
sw = Pin(PINSW, Pin.IN, Pin.PULL_UP)

led = iotine.led
button = machine.Pin(0, machine.Pin.IN, machine.Pin.PULL_UP)

def joystick(adc):
    return max(6, min(120, int(adc.read()/32)))

sw.irq(trigger=Pin.IRQ_FALLING, handler=button_pressed)

def button_pressed(p):
    print('Click')


def on_sub(topic, msg):
  iotine.listenToSystemCommands(topic, msg)
  print(topic+" / "+msg)

def on_pub(s):
  print("message Sent")


iotine.subscribe("CORE_TEMP", on_sub)

def main_loop():
  if button.value() == 0:
        #iotine.publish("CONT_HUMID", iotine.rand(),on_pub)
        iotine.publish([
            {
              "name": "CORE_TEMP_ESP",
              "value": esp32.raw_temperature()
            },
            {
              "name": "CORE_HALL",
              "value": esp32.hall_sensor()
            },
            {
              "name": "ESP_RANDOM",
              "value": iotine.rand()
            }
          ]
          , on_pub)
  x = joystick(adcx)
  y = joystick(adcy)
  print('%.2f\t%.2f' % (x,y))        

iotine.loop(main_loop)
    
