swf = {}
swf.app = 20150526;
swf.tamano=0;
swf.url = 'http://api.elsiglo.mx/mobile/TorreonApp/newapi.php';
swf.red=0;
/*
*  Carga inicial, en cuanto se carga el html (main.html)
*/
function cargaInicial() {
   document.addEventListener("deviceready", onDeviceReady, false);
   document.addEventListener("resume", onResume, false);
   document.addEventListener("backbutton", menuback, false);
   //tenemos red?
   setTimeout(function() {
      if(window.device.model == 'x86_64') { swf.red = 1; }; //emulador
      console.log('RED: '+navigator.connection.type);
   },20*1000);
   //
   $(function() { FastClick.attach(document.body); });
}
/* cuando el dispositivo está listo {{{ */
function onDeviceReady() {
   console.log('aaa');
}
/* }}} */
