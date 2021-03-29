-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 29, 2021 at 01:34 PM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rms`
--

-- --------------------------------------------------------

--
-- Table structure for table `landlords`
--

CREATE TABLE `landlords` (
  `id` int(11) UNSIGNED NOT NULL,
  `username` int(11) DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idno` int(255) DEFAULT NULL,
  `phone` int(255) DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `aboutMe` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `landlords`
--

INSERT INTO `landlords` (`id`, `username`, `email`, `idno`, `phone`, `password`, `aboutMe`, `city`, `country`, `gender`) VALUES
(50, NULL, 'roctiv001@gmail.com', NULL, NULL, '$2a$10$ZfZu4eQQOuZoN8UkRhNQ0uerv.idGKGJyhZe1PErTGAPpzzWqc0My', NULL, NULL, NULL, NULL),
(51, 0, 'ngaruiya001@gmail.com', NULL, NULL, '$2a$10$rXSH99LjsCOFPcddv9vJ7.nZ7g3CVUnZKv4vgHyykKV9seFcyzFmC', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` int(11) UNSIGNED NOT NULL,
  `listedBy` int(11) DEFAULT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idNo` int(10) UNSIGNED DEFAULT NULL,
  `county` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propertyName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propertyType` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propertyLocation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `roomTypes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rent` decimal(13,2) DEFAULT NULL,
  `socialAmenities` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `propertyStatus` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `leaseStart` date DEFAULT NULL,
  `leaseEnd` date DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`id`, `listedBy`, `phoneNumber`, `idNo`, `county`, `country`, `gender`, `propertyName`, `propertyType`, `propertyLocation`, `bedrooms`, `bathrooms`, `roomTypes`, `description`, `rent`, `socialAmenities`, `propertyStatus`, `leaseStart`, `leaseEnd`, `created_at`, `email`) VALUES
(1, 0, NULL, NULL, 'mombasa', 'kenya', NULL, 'FortJesus', NULL, NULL, NULL, NULL, NULL, 'Mi casa su casa', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tenants`
--

CREATE TABLE `tenants` (
  `firstname` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` char(60) NOT NULL,
  `isOwner` varchar(1) DEFAULT NULL,
  `phone` int(45) DEFAULT NULL,
  `idno` int(45) DEFAULT NULL,
  `gender` varchar(45) DEFAULT NULL,
  `aboutMe` varchar(255) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `rent` decimal(13,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tenants`
--

INSERT INTO `tenants` (`firstname`, `lastname`, `email`, `password`, `isOwner`, `phone`, `idno`, `gender`, `aboutMe`, `city`, `country`, `rent`) VALUES
('roctiv', 'maina', 'roctiv@gmail.com', '$2a$10$Ouq15aJQQxWl6jn6SOkhROXP4tvupSy0zp8kU9u4.mGyjozAUgSMO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0.00'),
('maina', 'vic', 'mzae@gmail.com', '$2a$10$ER2/So9SxRileI0nUCnHU.S5BGtXQJQCmoYc3KDLHKDs7WOwF1UU6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '0.00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `landlords`
--
ALTER TABLE `landlords`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `landlords`
--
ALTER TABLE `landlords`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
