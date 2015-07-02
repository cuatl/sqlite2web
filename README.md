# sqlite2web

Ejemplo de aplicación para capturar información, almacenarla en una base de datos SQlite y enviarla a un servidor.

Esta aplicación está hecha en Apache Cordova (Phonegap) 5.1.1

[Aplicación principal](platforms/android/assets/www/)


El ejemplo es totalmente funcional, se incluye en www/serverside un ejemplo de como recibir la información a MySQL. ¿Te gustaría probarlo? aquí [tenemos el APK](http://tar.mx/demos/sqlite2web.apk)

![Demo](sqlite2web.png?raw=true "Demo")


Requiere por lo menos estos plugins:

cordova-plugin-network-information 1.0.1 "Network Information" # para ver estatus de red
cordova-plugin-whitelist 1.0.0 "Whitelist" # por defecto
cordova-sqlite-storage 0.7.9 "Cordova sqlite storage plugin" # https://github.com/litehelpers/Cordova-sqlite-storage


<preference name="KeyboardDisplayRequiresUserAction" value="false"/> en android/res/xml/config.xml para que se pueda hacer "focus" a un input desde javascript.

