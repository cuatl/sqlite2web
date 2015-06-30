swf = {}
swf.app = 20150526;
swf.tamano=0;
swf.url = 'http://tar.mx/demos/api.php'; //cambia esto a tu servidor!
swf.red=0;
swf.mensaje=0; //mensajes en pantalla
/*
*  Carga inicial, en cuanto se carga el html (main.html)
*/
function cargaInicial() {
   $("#inicio").show();
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
   $(".secciones").hide();
   $('#'+e).show();
};
/* }}} */
/* cuando el dispositivo está listo {{ */
function onDeviceReady() {
   var db = window.sqlitePlugin.openDatabase({name: "database.db", location: 1});
   //creamos la tabla1
   db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tabla1 (id integer primary key, nombre varchar(64) , correo varchar(64), genero integer, nacimiento date)');
      db.transaction(function(tx) {
         tx.executeSql("select count(id) as no from tabla1", [], function(tx, res) {
            console.log(JSON.stringify(res));
            console.log("res.rows.length: " + res.rows.length + " -- should be 1");
         });
      });
   });
}
/* }}} */
var almacena = function() {
   //verificamos que llene algunos datos a fuerza...
   var dd = $("input[name='nombre']");
   var d = dd.val()||null;
   if(d === null || d.length < 5) {
      mensajes('Por favor escriba su nombre completo ··_',3);
      dd.focus();
      return false;
   }
   var dd =$("input[name='email']");
   d = dd.val()||null;
   if(d === null || d.length < 5) { mensajes('Por favor escriba su correo electrónico',3); dd.focus(); return false; }
   //ahora si almacenamos. Vamos a leer los datos tal como están (todos)
   $.each( $("input"),function(i,item) {
      console.log(item);
   });
};
/* muestra un mensaje en pantalla .wait {{{ */
function mensajes(ms,duracion) {
   if(ms == 0) {
      if(swf.mensaje) clearTimeout(swf.mensaje);
      $("#estado").css('opacity',0).hide();
      return false;
   }
   if(swf.mensaje) { clearTimeout(swf.mensaje); }
   if(duracion === null || duracion === undefined) duracion=1;
   if( $("#estado").css('opacity')  == '1') { $("#estado").css('opacity',0).hide(); }
   $("#estado").html(ms).show().animate({'opacity':1},300);
   swf.mensaje = setTimeout(function() {
      $("#estado").animate({'opacity':0},300,'ease-in',function() {
         $("#estado").hide();
      }); 
   },duracion*1000);
}; /* }}} */
