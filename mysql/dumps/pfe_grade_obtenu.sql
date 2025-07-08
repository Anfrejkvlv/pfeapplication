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
-- Table structure for table `grade_obtenu`
--

DROP TABLE IF EXISTS `grade_obtenu`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade_obtenu` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date_obtention` date DEFAULT NULL,
  `id_grade` int NOT NULL,
  `id_professeur` int NOT NULL,
  `actif` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmckhq23jq1kgjwv4i6a81xlcy` (`id_grade`),
  KEY `FK1eqn0u6glojssxuu8f29h87ki` (`id_professeur`),
  CONSTRAINT `FK1eqn0u6glojssxuu8f29h87ki` FOREIGN KEY (`id_professeur`) REFERENCES `professeur` (`personne_id`),
  CONSTRAINT `FKmckhq23jq1kgjwv4i6a81xlcy` FOREIGN KEY (`id_grade`) REFERENCES `grade` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade_obtenu`
--

LOCK TABLES `grade_obtenu` WRITE;
/*!40000 ALTER TABLE `grade_obtenu` DISABLE KEYS */;
INSERT INTO `grade_obtenu` VALUES (2,'2025-05-31',1,903,_binary ''),(6,'2025-06-02',2,903,_binary ''),(7,'2025-06-22',3,903,_binary ''),(10,'2025-02-20',1,1002,_binary '');
/*!40000 ALTER TABLE `grade_obtenu` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-24  1:55:42
