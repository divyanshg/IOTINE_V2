import urllib.request as urllib
import cv2
import numpy as np
from matplotlib import pyplot as plt
import os, ssl
import flask
from flask import request, jsonify
from flask import send_file

if (not os.environ.get('PYTHONHTTPSVERIFY', '') and getattr(ssl, '_create_unverified_context', None)):
    ssl._create_default_https_context = ssl._create_unverified_context

app = flask.Flask(__name__)
app.config["DEBUG"] = True

@app.route('/', methods=["GET"])
def home():
    url = ''
    if 'url' in request.args:
        url = request.args['url']

        url_response = urllib.urlopen(url) 
        img_array = np.array(bytearray(url_response.read()), dtype=np.uint8)
        img = cv2.imdecode(img_array, -1)

        img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) 
        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB) 

        eye_data = cv2.CascadeClassifier('haarcascade_eye.xml') 
  
        found = eye_data.detectMultiScale(img_gray,  
                                   minSize =(20, 20)) 
  
        amount_found = len(found) 
  
        if amount_found != 0: 
      
            for (x, y, width, height) in found: 
                details = [{"coordinates": str((x, y)), "dimensions": str((x + height, y + width))}]
                cv2.rectangle(img, (x, y),(x + height, y + width),(0, 255, 0), 5) 
            
            cv2.imwrite('result.jpg', img)
            return send_file('result.jpg', mimetype='image/jpg') #jsonify(details)

        #plt.subplot(1, 1, 1) 
        #plt.imshow(img_rgb) 
        #plt.show() 
    else:
        return "Error: No url field provided. Please specify an url."

    #url = "https://iotine.zapto.org/app/imgStore/iub54i6bibu64/gsftanba"

app.run()
