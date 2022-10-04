# Backend general

_Backend desarrollado por Aidea S.A.S em node JS, enfocado en el uso de grapqhl, acualmente para usar con MONGO DB._

# Para mongo:
Crear carpeta en data en C:// para windows :
```
C://data/db
```

## Configurar la seguridad de mongo:

1. Abrir shell con :
```
mongo
```
2. Introducir el siguiente código:
```
use admin
db.createUser(
  {
    user: "admin",
    pwd: "admin123",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)
```
3. Despues iniciar mongo con : 
```
mongod --auth
```

4. Ir a :
```
<Directorio de instalación>/bin/mongod.cfg
```
5. Agregar :

```
security:
  authorization: "enabled"
```



_ Link de referencia : _

```
https://ciphertrick.com/setup-mongodb-authentication-connect-using-mongoose/
```

# Usar redis en windows:

1. Ir al link :
```
https://github.com/microsoftarchive/redis/releases
```
2. Descargar ejecutable (.MSI) o zip 

3. Dentro de la carpeta base usar redis-server.exe para iniciar servidor

## Para pruebas del cliente usar redis-cli.exe


# Utilidades para windows
_ Para buscar puerto : _
```
netstat -aon
```
 _ Para eliminar proceso : _

 ```
 taskkill /F /PID nro_pid
 ```




# Para instalador de detector de caras
_ Open CV: _
pip install opencv-python==4.5.1.48
sudo apt-get update
sudo apt-get install ffmpeg libsm6 libxext6  -y

_ DLib : _
sudo apt-get update
sudo apt-get install build-essential cmake
sudo apt-get install libopenblas-dev liblapack-dev 
sudo apt-get install libx11-dev libgtk-3-dev
sudo apt-get install python3 python3-dev python3-pip
pip3 install numpy
pip3 install dlib


# Para mrz :
instalar node_modules de carpeta MRZ