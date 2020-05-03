import iotine

print(iotine.__VERSION)

led = iotine.led

def on_sub(topic, msg):
  iotine.listenToSystemCommands(topic, msg)
  print(topic+" / "+msg)

def on_pub(s):
  print("message Sent")


while True:

    iotine.subscribe("CONT_TEMP", on_sub)
    iotine.publish("CONT_TEMP", iotine.rand(), on_pub)
    iotine.time.sleep(3)