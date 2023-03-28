# file=open("data.txt",'w')
# file.write("hello world")
# file.close()
import sys
filename=sys.argv[1]
key=sys.argv[2]
print(filename)

FILE_NAME="" #setup the filename here

def encrypt_file(filename,key):
    file=open(filename,"rb")
    filedata=file.read()
    print(key)
    key=bytes(key,'utf-8')
    encrypted_data=bytearray()
    for i in range(len(filedata)):
        encrypted_data.append((filedata[i]+key[i%len(key)])%256)
    file.close()
    file=open(f"assets/{FILE_NAME}/data/{FILE_NAME}.dat","wb")
    file.write(encrypted_data)
    file.close()

encrypt_file(filename,key)
