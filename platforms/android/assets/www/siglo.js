swf = {}
swf.app = 20150526;
swf.tamano=0;
swf.url = 'http://tar.mx/demos/api.php'; //cambia esto a tu servidor!
swf.red=0;
/*
*  Carga inicial, en cuanto se carga el html (main.html)
*/
function cargaInicial() {
   $("#inicio").css('opacity',1);
   console.log('iniciamos :-)');
   document.addEventListener("deviceready", onDeviceReady, false);
   document.addEventListener("resume", onResume, false);
   document.addEventListener("backbutton", menuback, false);
   //tenemos red?
   setTimeout(function() {
      console.log('RED: '+navigator.connection.type);
   },20*1000);
   //
   $(function() { FastClick.attach(document.body); });
}
var menuback = function() {
   console.log('menuback');
};
var onResume = function() {
   console.log('onResume');
};
/* menus {{ */
var elmenus = function(e) {
   $(".secciones").css('opacity',0);
   $('#'+e).css('opacity',1);
};
/* }}} */
/* cuando el dispositivo está listo {{{ */
function onDeviceReady() {
   console.log('aaa');
}
/* }}} */
