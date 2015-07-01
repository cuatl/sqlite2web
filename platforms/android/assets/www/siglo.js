swf = {}
swf.app = 20150526;
swf.tamano=0;
//el envío está habilitado pero limitado a 100 registros por IMEI.
swf.url = 'http://tar.mx/demos/api.php';//cambia esto a tu servidor!
swf.red=0;
swf.mensaje=0; //mensajes en pantalla
swf.donde=0;
swf.me = ''; //mi imei. Aquí lo debe obtener con el plugin.
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
   setTimeout(function() { console.log('RED: '+navigator.connection.type); },20*1000);
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
   if(e == 'consulta') { 
      $("#consulta DIV").empty(); //limpiamos la tabla
      consultadb();
   } else if(e == 'sincroniza') {
      sincroniza();
   }
};
/* }}} */
var sincroniza = function() {
   if(swf.me==0||swf.me===null||swf.me===undefined||swf.me=='null') {
      mensajes('Debe tener un IMEI (dispositivo Android) para usar este ejemplo',5);
      return false;
   }
   //contamos los no sincronizados
   db.transaction(function(tx) {
      tx.executeSql("select count(id) as no from tabla1 WHERE remoteid < 1", [], function(tx, res) {
         $(".cuantosin").html((res.rows.item(0).no && res.rows.item(0).no > 0)? 'Hay '+res.rows.item(0).no+' registros almacenados sin sincronizar':'No tiene registros sin sincronizar');
         $(".cuantosin").attr('alt', res.rows.item(0).no);
      });
   });
};
//envía al servidor ¡por fin!
var sincronizaMe = function() {
   if(swf.me==0||swf.me===null||swf.me===undefined||swf.me=='null') {
      mensajes('No puedo enviar datos sin IMEI (debe estar instalado en dispositivo físico)',5);
      return false;
   }
   //el servidor que aquí 
   if(!swf.red) mensajes('Aparentemente no tienes internet, lo sentimos.',10);
   //vamos a obtener los datos de la db y enviarlos..
   else {
      var faltan = parseInt( $('.cuantosin').attr('alt') );
      mensajes('Estamos tratando de enviar '+faltan+' registros...',60); //un minuto! 
      if(faltan < 1) {
         mensajes('Aparentemente no faltan registros por sincronizar',3);
         return false;
      }
      //vamos a leer los datos (máximo 10 en el ejemplo)
      db.transaction(function(tx) {
         tx.executeSql("SELECT * from tabla1 WHERE remoteid < 1 LIMIT 10", [], function(tx, res) {
            if(res!==null&&res.rows!==null&&res.rows!==undefined&&res.rows.length) {
               //console.log(JSON.stringify(res));
               $.post(swf.url,{sqlite:JSON.stringify(res)},function(m) {
                  var datos = {};
                  for (var i = 0; i < res.rows.length; i++) {
                     var row = res.rows.item(i);
                     datos[i] = row;
                  };
                  //esperamos 3 segundos para enviar al servidor...
                  setTimeout(function() {
                     console.log('enviamos... ');
                     $.post(swf.url,{sqlite:JSON.stringify(datos),me:swf.me},function(m) {
                        mensajes('Datos enviados, ahora vamos a actualizar localmente…',60);
                        sincronizaLocal(m);
                     },'json');
                  },3000);
               });
            };
         });
      });
   }
};
var sincronizaLocal = function(e) {
   if(e.remotes && e.remotes !== undefined && e.remotes !== null) {
      db.transaction(function(tx) {
         $.each(e.remotes, function(local,remote) {
            tx.executeSql('UPDATE tabla1 SET remoteid=? WHERE id = ?', [remote,local]);
         });
      });
      setTimeout(function() { sincroniza(); mensajes('¡Hemos sincronizado!',3); },3000);
   }
};
/* estamos conectados? */
var tengoInternet = function() {
   $.post(swf.url,{ping:swf.me},function(m) { swf.red = 1; },'json');
}
var consultadb = function()  {
   db.transaction(function(tx) {
      //últimos 100 registros
      tx.executeSql("SELECT * from tabla1 ORDER BY id DESC", [], function(tx, res) {
         if(res!==null&&res.rows!==null&&res.rows!==undefined&&res.rows.length) {
            for (var i = 0; i < res.rows.length; i++) {
               var row = res.rows.item(i);
               var time = (100+(i*10));
               $("#consulta DIV").append('<p>Local id#'+row.id+' remote id#'+row.remoteid+'<br />'+row.correo+'<br />'+row.nacimiento+'</p>');
            };
         };
      },function(e) {
         console.log('ERROR='+e);
      });
   },function(e) { console.log('error: '+e);
   });
};
/* cuando el dispositivo está listo {{ */
function onDeviceReady() {
   db = window.sqlitePlugin.openDatabase({name: "database.db", location: 1});
   //creamos la tabla1
   db.transaction(function(tx) {
      //tx.executeSql('DROP TABLE tabla1'); //elimina tabla
      tx.executeSql('CREATE TABLE IF NOT EXISTS tabla1 (id integer primary key, remoteid integer , correo varchar(64), nacimiento date)');
      cuentame();
   });
   var t = cordova.require("cordova/plugin/telephonenumber");
   t.get(function(result) {
      var da = result.split('|');
      if(da[0] == '') { mensajes('No se pudo obtener el IMEI :(',10); }
      else { swf.me = da[0]; }
   });
   tengoInternet();
}
/* }}} */
/* almacena registro {{{ */
var almacena = function() {
   //datos
   var email= $("input[name='email']").val();
   var nace=  $("input[name='nacimiento']").val();
   //comprobación básica de que llene datos
   if(email==''||email.length<10) {
      mensajes('Debe escribir su correo electrónico',3);
      return false;
   }
   //vamos a almacenar
   db.transaction(function(tx) {
      tx.executeSql("INSERT INTO tabla1 (id,remoteid,correo,nacimiento) VALUES (null,0,?,?)", [email,nace], function(tx, res) {
         mensajes( (res.rowsAffected && res.rowsAffected == 1) ? 'Se almacenó el registro #'+res.insertId: 'No se pudo almacenar :(',5);
         $("input").val(''); //limpiamos
         cuentame();
      });
   });
};
/* }}} */
/* cuenta registros en la db local {{{ */
var cuentame = function() {
   db.transaction(function(tx) {
      tx.executeSql("select count(id) as no from tabla1", [], function(tx, res) {
         $(".cuantos").html((res.rows.item(0).no && res.rows.item(0).no > 0)? 'Hay '+res.rows.item(0).no+' registros almacenados en total':'Sin registros almacenados.');
      });
   });
};
/* }}} */
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
