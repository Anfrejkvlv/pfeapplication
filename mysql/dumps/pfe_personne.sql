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
-- Table structure for table `personne`
--

DROP TABLE IF EXISTS `personne`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personne` (
  `id` int NOT NULL,
  `cin` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `sexe` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `date_naissance` date NOT NULL,
  `version` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKe92eictsfwefesbruisdyexqw` (`cin`),
  UNIQUE KEY `UKlif11ug7pqkdimuk0beonbfng` (`email`),
  UNIQUE KEY `UK64eile2du6iicp7tul3gh6w8y` (`telephone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personne`
--

LOCK TABLES `personne` WRITE;
/*!40000 ALTER TABLE `personne` DISABLE KEYS */;
INSERT INTO `personne` VALUES (102,'ERTKF3SD','eloubahasra@gmail.com','LOUBAHASRA','CHRIST EMMANUEL','Masculin','0775218731','2025-05-29',0),(104,'5REJDGRY','christ@ehgt.cjd','CHRIST EMMANUEL','LOUBAHASRA','Masculin','775218731','2025-05-28',0),(153,'RELMGIF3','F5Y7HH@FR','FRTC','DWER','Masculin','56467','2025-05-29',0),(202,'463JDEJB','JKNFE@KJFE','JKCS','OIJKFEWL','Masculin','75218731','2025-05-30',0),(302,'OKJME','OKMLED@KMCD','IJKMVD','OKMLCDS','Féminin','218731','2025-05-19',0),(303,'DNJE34','IJOKFE@FMK.CHF','KMC',' NVD','Féminin','5218731','2025-05-21',0),(304,'JFREUN','KMFE@JNVR','FNDVT','KMEDN','Masculin','005945','2025-05-24',0),(311,'KVRKNM42','KNVR@NJVR.VJ','KONMVF','OKNOFWE','Masculin','2187313','2025-05-20',0),(312,'MKCEIN','KMNFEFE@FKMR','NKMCW','OJNEFE','Masculin','05218731','2004-09-24',0),(313,'IJF7E4','MCDE@JFRI','NCDKMFE','LMFLE','Masculin','774832','2004-03-04',0),(314,'JJFRUT','JOKFE@NJFR','LKVDO','LKLFRO','Féminin','44231','2012-05-03',0),(903,'CINRJDRT','professeur1@gmail.com','Professor1','PROF PROF1','Féminin','03775218731','2025-05-20',1),(1002,'ETREGTR5','professeur2@gmail.com','Professor2','PROF PROF2','Masculin','752187','2025-05-27',2),(1852,'DERGTY','christloubah@gmail.com','LOUBAH','EMMA','Masculin','8859403855','2025-06-05',0),(2602,'JFUB64','kilingm19@gmail.com','ADMIN','SUPER ADMIN','Féminin','6375329949','2020-05-04',169),(2653,'GTEUYT','gest@gmail.com','GESTIONNAIRE ','GESTIONNAIRE ','Féminin','4321647','1973-03-17',8),(2702,'YTSRE65W','chimie@gmail.com','PROF3','PROF3 CHIMIE','Masculin','76432912','1978-01-24',0),(2752,'HFIE76E','profmath@gmail.com','HHHHDTS','NJCDJDF','Masculin','984365452','2025-06-09',0),(2753,'HRDUDW','jury@gmail.com','JURY','JURY1','Masculin','5473954002','2025-06-08',9);
/*!40000 ALTER TABLE `personne` ENABLE KEYS */;
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
