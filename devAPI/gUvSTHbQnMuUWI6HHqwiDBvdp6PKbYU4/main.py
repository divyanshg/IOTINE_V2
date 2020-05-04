import iotine
import machine
import esp32


led = iotine.led
button = machine.Pin(0, machine.Pin.IN, machine.Pin.PULL_UP)


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

iotine.loop(main_loop)
    
