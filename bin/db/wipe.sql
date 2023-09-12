--	setup_wipe.sql
--	MySQL Database setup for PhiLambdaPhi.org
--	WARNING: THIS DESTROYS YOUR CURRENT DB

--
--	Database: `prod`
--

DROP DATABASE IF EXISTS `prod`;
CREATE DATABASE IF NOT EXISTS `prod`;
USE prod;