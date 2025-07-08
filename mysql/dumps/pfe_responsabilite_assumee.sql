-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pfe
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `responsabilite_assumee`
--

DROP TABLE IF EXISTS `responsabilite_assumee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `responsabilite_assumee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `id_professeur` int NOT NULL,
  `id_responsabilite` int NOT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `grade_obtenu_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKl473tjk6laek0owqwxsdn18kf` (`id_professeur`),
  KEY `FK5ytilopf2o1udw7hd0xnb5vfa` (`id_responsabilite`),
  KEY `FKqi9muxlewnev0d4s4uss37i7j` (`grade_obtenu_id`),
  CONSTRAINT `FK5ytilopf2o1udw7hd0xnb5vfa` FOREIGN KEY (`id_responsabilite`) REFERENCES `responsabilite` (`id`),
  CONSTRAINT `FKl473tjk6laek0owqwxsdn18kf` FOREIGN KEY (`id_professeur`) REFERENCES `professeur` (`personne_id`),
  CONSTRAINT `FKqi9muxlewnev0d4s4uss37i7j` FOREIGN KEY (`grade_obtenu_id`) REFERENCES `grade_obtenu` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `responsabilite_assumee`
--

LOCK TABLES `responsabilite_assumee` WRITE;
/*!40000 ALTER TABLE `responsabilite_assumee` DISABLE KEYS */;
INSERT INTO `responsabilite_assumee` VALUES (4,_binary '',903,3,'2025-06-01','2025-06-21',2),(6,_binary '',903,2,'2025-06-02','2025-06-22',6),(8,_binary '',903,2,'2025-04-30','2025-05-24',6),(9,_binary '\0',903,2,'2025-06-23',NULL,7),(14,_binary '\0',1002,3,'2025-03-20',NULL,10),(16,_binary '\0',903,4,'2025-06-23',NULL,7);
/*!40000 ALTER TABLE `responsabilite_assumee` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-24  1:55:41
