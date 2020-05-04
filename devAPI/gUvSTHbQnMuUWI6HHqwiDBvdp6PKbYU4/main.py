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


iotine.subscribe("CONT_TEMP", on_sub)

while True:
    iotine.checkMsg()
    if button.value() == 0:
        #iotine.publish("CONT_HUMID", iotine.rand(),on_pub)
        iotine.publish([
            {
              "name": "CORE_TEMP",
              "value": esp32.raw_temperature()
            },
            {
              "name": "CORE_HALL",
              "value": esp32.hall_sensor()
            }
          ]
          , on_pub)
    time.sleep(2)
