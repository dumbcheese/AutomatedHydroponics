#!/usr/bin/python

import io
import sys
import fcntl
import time
import copy
import string
import threading
import requests
import schedule
import RPi.GPIO as GPIO
from AtlasI2C import (
	 AtlasI2C
)
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from datetime import datetime
from flask import Flask
from flask import requests
from pymongo import MongoClient
from threading import Timer

mongo = pymongo.MongoClient('mongodb+srv://dammirh:[password]@hydroponyDatabase-gktww.gcp.mongodb.net/admin', maxPoolSize=50, connect=False)

db = pymongo.database.Database(mongo, 'hydroponyDatase')
desiredParams = pymongo.collection.Collection(db, 'parameters')
sensorReadouts = pymongo.collection.Collection(db, 'readouts')

app = Flask(__name__)


GPIO.setmode(GPIO.BOARD)


GPIO.setup(29, GPIO.IN)     #ecSenzor
GPIO.setup(31, GPIO.IN)     #temperatura
GPIO.setup(33, GPIO.IN)     #pH
GPIO.setup(35, GPIO.IN)     #float switch glavni tank
GPIO.setup(37, GPIO.IN)     #float switch DWC


GPIO.setup(8, GPIO.OUT)         #grijač GT
GPIO.setup(10, GPIO.OUT)        #zračna pumpa GT
GPIO.setup(12, GPIO.OUT)        #vodena pumpa GT
GPIO.setup(16, GPIO.OUT)        #pumpa voda
GPIO.setup(18, GPIO.OUT)        #pumpa ec
GPIO.setup(22, GPIO.OUT)        #solenoid EBB
GPIO.setup(24, GPIO.OUT)        #pumpa EBB
GPIO.setup(36, GPIO.OUT)        #grijač DWC
GPIO.setup(38, GPIO.OUT)        #zračna pumpa DWC
GPIO.setup(40, GPIO.OUT)        #vodena pumpa DWC    


#Credentials
cred = credentials.Certificate("/home/pi/Raspberry-Pi-sample-code/firebaseAuth.json")
firebase_admin.initialize_app(cred)

def setInterval(func,time):
    e = threading.Event()
    while not e.wait(time):
        func()

def print_devices(device_list, device):
    for i in device_list:
        if(i == device):
            print("--> " + i.get_device_info())
        else:
            print(" - " + i.get_device_info())
    #print("")

def return_devices(device_list, device):
    device_array = []
    for i in device_list:
        if(i != device):
            device_array.append(i.get_device_info())
    return device_array
    
def get_devices():
    device = AtlasI2C()
    device_address_list = device.list_i2c_devices()
    device_list = []
    
    for i in device_address_list:
        device.set_i2c_address(i)
        response = device.query("I")
        moduletype = response.split(",")[1] 
        response = device.query("name,?").split(",")[1]
        device_list.append(AtlasI2C(address = i, moduletype = moduletype, name = response))
    return device_list 
       

def sendDeviceData(device_list, device):
    all_devices = return_devices(device_list, device)
    for device in all_devices: 
        doc_ref = db.collection(u'Devices').document()
        doc_ref.set({
            u'Device': device,
        })


    
def main():

    desired_parameters = None
           
    device_list = get_devices()
        
    device = device_list[0]
    
    print_help_text()

    print_devices(device_list, device)
    
    real_raw_input = vars(__builtins__).get('raw_input', input)

    #sendReadingData()

    def readout_all():
        # url = "https://192.1:xxxxx"
        for dev in device_list:
            dev.write("R")
                # figure out how long to wait before reading the response
        timeout = device_list[0].get_command_timeout("R".strip())
                # if we dont have a timeout, dont try to read, since it means we issued a sleep command
        if(timeout):
            time.sleep(timeout)
            for dev in device_list:
                print(dev.read())

    def return_all():
        for dev in device_list:
            dev.write("R")
                # figure out how long to wait before reading the response
        timeout = device_list[0].get_command_timeout("R".strip())
                # if we dont have a timeout, dont try to read, since it means we issued a sleep command
        readings = []
        if(timeout):
            time.sleep(timeout)
            for dev in device_list:
                readingTemp = {
                    u"Value": dev.getReading().value,
                    u"Device": dev.getReading().device,
                    u"Time": datetime.now()
                }
                readings.append(readingTemp)
        return readings

    def getDesiredParametersFromDb():
        desiredParameters = requests.get("http://127.0.0.1:5000/desiredParams")

    def sendReadingData():
        dataToSend = return_all()
        print(dataToSend)
        response = requests.post("http://127.0.0.1:5000/readouts", json=dataToSend)
   
    setInterval(sendReadingData, 300)   
    setInterval(getDesiredParametersFromDb, 120)   

    sendReadingData()

    getDesiredParametersFromDb()

    def modulateEC():
        ECReading = return_all().Readings.ec
        if desired_paramaters.ECLow > ECReading:
            GPIO.output(12, GPIO.LOW)
        t = Timer(3.0, GPIO.output(12, GPIO.HIGH))
        t.start()
        

    @app.route('/params', methods:["POST"])
        desired_paramaters = request.json
        return desired_paramaters

    #while True
    while False:
        user_cmd = ("ALL:R")
        #user_cmd = real_raw_input(">> Enter command: ")
    
        # show all the available devices
        if user_cmd.upper().strip().startswith("LIST"):
            print_devices(device_list, device)
            
        # print the help text 
        elif user_cmd.upper().startswith("HELP"):
            print_help_text()
            
        # continuous polling command automatically polls the board
        elif user_cmd.upper().strip().startswith("POLL"):
            cmd_list = user_cmd.split(',')
            if len(cmd_list) > 1:
                delaytime = float(cmd_list[1])
            else:
                delaytime = device.long_timeout

            # check for polling time being too short, change it to the minimum timeout if too short
            if delaytime < device.long_timeout:
                print("Polling time is shorter than timeout, setting polling time to %0.2f" % device.long_timeout)
                delaytime = device.long_timeout
            try:
                while True:
                    print("-------press ctrl-c to stop the polling")
                    for dev in device_list:
                        dev.write("R")
                    time.sleep(delaytime)
                    for dev in device_list:
                        print(dev.read())
                
            except KeyboardInterrupt:       # catches the ctrl-c command, which breaks the loop above
                print("Continuous polling stopped")
                print_devices(device_list, device)
                
        # send a command to all the available devices
        elif user_cmd.upper().strip().startswith("ALL:"):
            cmd_list = user_cmd.split(":")
            for dev in device_list:
                dev.write(cmd_list[1])
            
            # figure out how long to wait before reading the response
            timeout = device_list[0].get_command_timeout(cmd_list[1].strip())
            # if we dont have a timeout, dont try to read, since it means we issued a sleep command
            if(timeout):
                time.sleep(timeout)
                for dev in device_list:
                    print(dev.getReading().value + " " + dev.getReading().device)
                   
            
        # if not a special keyword, see if we change the address, and communicate with that device
        else:
            try:
                cmd_list = user_cmd.split(":")
                if(len(cmd_list) > 1):
                    addr = cmd_list[0]
                    
                    # go through the devices to figure out if its available
                    # and swith to it if it is
                    switched = False
                    for i in device_list:
                        if(i.address == int(addr)):
                            device = i
                            switched = True
                    if(switched):
                        print(device.query(cmd_list[1]))
                    else:
                        print("No device found at address " + addr)
                else:
                    # if no address change, just send the command to the device
                    print(device.query(user_cmd))
            except IOError:
                print("Query failed \n - Address may be invalid, use list command to see available addresses")


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
