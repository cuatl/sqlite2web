swf = {}
swf.app = 20150526;
swf.tamano=0;
swf.url = 'http://tar.mx/demos/api.php'; //cambia esto a tu servidor!
swf.red=0;
swf.mensaje=0; //mensajes en pantalla
swf.donde=0;
var db; //variable que tendrá la base de datos.
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
   //prevenimos que se salgan de la app al dar botón back
   if(swf.donde==0) {
      swf.donde=-1;
      mensajes('Pulse el botón una vez más para salir',2);
   } else if(swf.donde==-1) {
      mensajes('Te vamos a extrañar',2);
      setTimeout(function() { navigator.app.exitApp(); },2000); 
   }
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
   db = window.sqlitePlugin.openDatabase({name: "database.db", location: 1});
   //creamos la tabla1
   db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS tabla1 (id integer primary key, nombre varchar(64) , correo varchar(64), nacimiento date)');
      cuentame();
   });
}
/* }}} */
var almacena = function() {
   //datos
   var name = $("input[name='nombre']").val();
   var email= $("input[name='email']").val();
   var nace=  $("input[name='nacimiento']").val();
   //comprobación básica de que llene datos
   if(email==''||email.length<10) {
      mensajes('Debe escribir su correo electrónico',3);
      return false;
   }
   //vamos a almacenar
   db.transaction(function(tx) {
      tx.executeSql("INSERT INTO tabla1 (id,nombre,correo,nacimiento) VALUES (null,?,?,?)", [name, email,nace], function(tx, res) {
         mensajes( (res.rowsAffected && res.rowsAffected == 1) ? 'Se almacenó el registro #'+res.insertId: 'No se pudo almacenar :(',5);
         $("input").val(''); //limpiamos
         cuentame();
      });
   });
};
/* cuenta registros en la db local */
var cuentame() {
   db.transaction(function(tx) {
      tx.executeSql("select count(id) as no from tabla1", [], function(tx, res) {
         $(".cuantos").html((res.rows.item(0).no && res.rows.item(0).no > 0)? 'Hay '+res.rows.item(0).no+' registros almacenados :)':' no tiene ninguno :(');
      });
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
