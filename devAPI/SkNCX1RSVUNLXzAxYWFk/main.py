import iotine
import machine
import esp32


led = iotine.led
button = machine.Pin(5, machine.Pin.IN, machine.Pin.PULL_UP)
button.value(0)

def on_sub(topic, msg):
  iotine.listenToSystemCommands(topic, msg)
  print(topic+" / "+msg)

def on_pub(s):
  print("message Sent")


while True:
    if button.value() == 0:
        #iotine.publish("CONT_HUMID", iotine.rand(),on_pub)
        iotine.publish([
            {
              "name": "CORE_TEMP",
              "value": esp32.raw_temperature()
            }
          ]
          , on_pub)
    iotine.subscribe("CONT_TEMP", on_sub)
    time.sleep(2)
