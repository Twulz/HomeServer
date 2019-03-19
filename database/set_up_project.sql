ALTER USER 'root'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'smartPass';

USE `smart_home`;

DROP TABLE IF EXISTS `smart_home.temperature`;
DROP TABLE IF EXISTS `smart_home.access_link`;
DROP TABLE IF EXISTS `smart_home.package`;
DROP TABLE IF EXISTS `smart_home.access_fob_card`;

DROP SCHEMA IF EXISTS `smart_home`;

CREATE SCHEMA IF NOT EXISTS `smart_home` ;

USE `smart_home`;

CREATE TABLE `temperature` (
  `timestamp` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `temperature` float NOT NULL,
  PRIMARY KEY (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `package` (
  `packageId` int(11) NOT NULL AUTO_INCREMENT,
  `packageDesc` varchar(45) DEFAULT NULL,
  `keypadCode` varchar(6) NOT NULL,
  `packageInBox` tinyint(4) NOT NULL DEFAULT '0',
  `pickedUpBy` varchar(45) DEFAULT NULL,
  `pickedUpDate` datetime DEFAULT NULL,
  PRIMARY KEY (`packageId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `access_fob_card` (
  `accessFobCardId` int(11) NOT NULL AUTO_INCREMENT,
  `fobCardCode` varchar(8) NOT NULL,
  PRIMARY KEY (`accessFobCardId`),
  UNIQUE KEY `fobCardCode_UNIQUE` (`fobCardCode`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `access_link` (
  `packageId` int(11) NOT NULL,
  `fobCardId` int(11) NOT NULL,
  PRIMARY KEY (`packageId`,`fobCardId`),
  KEY `fobCardId_idx` (`fobCardId`),
  CONSTRAINT `fobCardId` FOREIGN KEY (`fobCardId`) REFERENCES `access_fob_card` (`accessfobcardid`),
  CONSTRAINT `packageId` FOREIGN KEY (`packageId`) REFERENCES `package` (`packageid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO temperature (temperature) VALUES (20.0);
SELECT SLEEP(1);
INSERT INTO temperature (temperature) VALUES (21);
SELECT SLEEP(1);
INSERT INTO temperature (temperature) VALUES (20.3);
SELECT SLEEP(1);
INSERT INTO temperature (temperature) VALUES (20.7);
SELECT SLEEP(1);
INSERT INTO temperature (temperature) VALUES (20.8);
SELECT SLEEP(1);
INSERT INTO temperature (temperature) VALUES (20.9);

SELECT * FROM temperature;

INSERT INTO package (packageDesc, keypadCode) VALUES ("Arduino", "123456");
INSERT INTO package (packageDesc, keypadCode) VALUES ("Keypad", "7A3454");

SELECT * FROM package;

INSERT INTO access_fob_card (fobCardCode) VALUES ("3644385E");
INSERT INTO access_fob_card (fobCardCode) VALUES ("20B6F9A3");

SELECT * FROM access_fob_card;

INSERT INTO access_link (packageId, fobCardId) VALUES (6, 3);
INSERT INTO access_link (packageId, fobCardId) VALUES (7, 4);

SELECT * FROM access_link;

SELECT package.packageDesc, package.keypadCode, access_fob_card.fobCardCode
	FROM package 
		INNER JOIN access_link
			ON package.packageId = access_link.packageId
		INNER JOIN access_fob_card
			ON access_link.fobCardId = access_fob_card.accessFobCardId
	WHERE package.packageInBox = 1;
    
UPDATE package SET packageInBox = "1" WHERE packageId < 10;
            
UPDATE package SET packageInBox = 0, pickedUpBy = "keypad", pickedUpDate = NOW() WHERE packageId=1;

/* ALTER TABLE access_fob_card MODIFY fobCardCode VARCHAR(8); */
