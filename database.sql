-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: localhost    Database: Whatsapp
-- ------------------------------------------------------
-- Server version	5.7.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `conversations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_a` int(11) NOT NULL,
  `user_b` int(11) NOT NULL,
  `user_a_unread` int(11) NOT NULL DEFAULT '0',
  `user_b_unread` int(11) NOT NULL DEFAULT '0',
  `last_msg` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
INSERT INTO `conversations` VALUES (23,1,3,0,1,227),(24,1,2,0,1,228);
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conversation` int(11) NOT NULL,
  `sender` int(11) NOT NULL,
  `content` longtext NOT NULL,
  `send_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=229 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (198,23,1,'hihihi','2017-05-17 21:15:07',2),(199,23,1,'hihi','2017-05-17 21:15:57',2),(200,23,3,'hihihi','2017-05-17 21:16:02',2),(201,23,3,'hihihihi','2017-05-17 21:16:12',2),(202,23,1,'rthrt','2017-05-17 21:18:35',2),(203,23,1,'qertqt','2017-05-17 21:18:37',2),(204,23,1,'sdgherth','2017-05-17 21:18:38',2),(205,23,1,'q4t3t4','2017-05-17 21:18:39',2),(206,23,1,'asgwer','2017-05-17 21:18:40',2),(207,23,1,'sdgwrt','2017-05-17 21:18:42',2),(208,23,1,'qwetrqt','2017-05-17 21:18:44',2),(209,23,3,'wrtwt','2017-05-17 21:21:45',2),(210,23,3,'qerq','2017-05-17 21:21:47',2),(211,23,3,'wrgwrt','2017-05-17 21:21:59',2),(212,23,3,'rtwtg','2017-05-17 21:22:13',2),(213,23,3,'qwerqwe','2017-05-17 21:22:15',2),(214,23,3,'dfghet','2017-05-17 21:22:16',2),(215,23,3,'qwerqe','2017-05-17 21:22:17',2),(216,23,1,'wrthet','2017-05-17 21:22:19',2),(217,23,1,'aeregqer','2017-05-17 21:22:21',2),(218,23,1,'eth','2017-05-17 21:22:22',2),(219,23,1,'werq','2017-05-17 21:22:23',2),(220,23,1,'dyhert','2017-05-17 21:22:25',2),(221,23,3,'werg','2017-05-17 21:22:27',2),(222,23,3,'wefq','2017-05-17 21:22:29',2),(223,23,3,'asdgf','2017-05-17 21:22:30',2),(224,23,1,'wrtg','2017-05-17 21:22:33',2),(225,23,1,'qer','2017-05-17 21:22:35',2),(226,23,1,'avsdv','2017-05-17 21:22:38',2),(227,23,1,'wretwrt','2017-05-17 21:51:59',1),(228,24,1,'qwerg','2017-05-17 21:52:35',1);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `profile_pic` varchar(1024) NOT NULL DEFAULT 'https://openclipart.org/download/247319/abstract-user-flat-3.svg',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Calvin','https://openclipart.org/download/247319/abstract-user-flat-3.svg'),(2,'Vincent','https://openclipart.org/download/247319/abstract-user-flat-3.svg'),(3,'Ben','https://openclipart.org/download/247319/abstract-user-flat-3.svg'),(4,'Anna','https://openclipart.org/download/247319/abstract-user-flat-3.svg'),(5,'Jasmine','https://openclipart.org/download/247319/abstract-user-flat-3.svg'),(6,'Teresa','https://openclipart.org/download/247319/abstract-user-flat-3.svg'),(7,'Peter','https://openclipart.org/download/247319/abstract-user-flat-3.svg');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-17 21:53:37
