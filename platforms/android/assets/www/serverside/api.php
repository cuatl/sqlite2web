<?php
   /*
   Ejemplo de api que recibe datos de una DB de SQLITE 
   https://github.com/cuatl/sqlite2web
   Jorge Martínez Mauricio
   jorgem@gmail.com
   */
   $msg = new stdclass;
   function __() { @$a=func_get_arg(0); return (!empty($a)) ? addslashes(strip_tags($a)) : null; }
   if(isset($_POST['ping'])) {
      $msg->pong = time();
   } elseif(isset($_POST['sqlite'])) {
      if(!isset($_POST['me']) && !empty($_POST['me']) && preg_match("/0000/",$_POST['me'])) {
         $msg->error = 'No parece tener un IMEI válido, pruebe con un dispositivo real.';
      } else {
         $sql = new MySQLi("server","user","password","db");
         $sql->Query("SET NAMES 'utf8'");
         $d = json_decode($_POST['sqlite']); //recibimos en formato JSON
         $msg->remotes = array();
         if(!empty($d) && is_object($d)) {
            foreach($d AS $k) {
               if(empty($k->correo)) continue;
               //verificamos si existe
               $e = $sql->Query("SELECT id FROM sqlite WHERE localid='".__($k->id)."' AND imei='".__($_POST['me'])."'");
               if($e->num_rows>0) {
                  $e = $e->fetch_object();
                  $msg->remotes[__($k->id)] = $e->id;
               } else {
                  $q = "INSERT INTO sqlite (id,localid,imei,correo,cumple) VALUES(null,'".__($k->id)."','".__($_POST['me'])."', '".__($k->correo)."', '".__($k->nacimiento)."')";
                  $sql->Query($q);
                  if($sql->error && !empty($sql->error)) $msg->error = $sql->error;
                  $msg->remotes[__($k->id)] = $sql->insert_id;
               }
            }
         }
         $sql->Close();
      }
   }
   echo json_encode($msg);
?>
