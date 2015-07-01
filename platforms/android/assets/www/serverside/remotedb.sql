CREATE DATABASE `demo` /*!40100 DEFAULT CHARACTER SET utf8 */;
CREATE TABLE `sqlite` (
   `id` int(11) NOT NULL AUTO_INCREMENT,
   `localid` int(11) NOT NULL,
   `imei` varchar(16) NOT NULL,
   `correo` varchar(64) DEFAULT NULL,
   `cumple` date DEFAULT NULL,
   PRIMARY KEY (`id`),
   KEY `localid` (`localid`),
   KEY `imei` (`imei`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
