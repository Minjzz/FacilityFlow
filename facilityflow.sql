-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 28, 2025 at 06:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `facilityflow`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `id_num` varchar(25) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `course` varchar(255) NOT NULL,
  `yearLevel` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contact` int(13) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('Student','Admin') NOT NULL,
  `status` enum('Active','Inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `id_num`, `name`, `course`, `yearLevel`, `email`, `contact`, `password`, `role`, `status`) VALUES
(1, '2324-033562', 'Sonny Wagas', 'BSIT', '3rd Year', 'sonny@phinmaed.com', 447483647, 'sonny123', 'Student', 'Active'),
(2, '2324-033562', 'Marlon Villegas', '', '', 'marlon@phinmaed.com', 63, 'marlon123', 'Admin', ''),
(3, '2324-012345', 'Kurth Zereso', 'BSIT', '2nd Year', 'kuja@phinmaed.com', 2147483647, 'kurth123', 'Student', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `status` enum('Available','Unavailable') DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `name`, `type`, `capacity`, `status`, `image`) VALUES
(1, 'Computer Lab', 'Laboratory', 40, 'Available', '/images/facilities/e3403e68e5621560296d240f5b1c34f1'),
(2, 'Gymnasium', 'Sports Facility', 120, 'Available', '/images/facilities/452aa51eb23142be5184db9105561ba2'),
(3, 'Study Room A', 'Study Room', 25, 'Unavailable', '/images/facilities/2f6fbef14ba06103de6336e1eb8fe5cc'),
(4, 'Library', 'Library', 80, 'Available', '/images/facilities/7fa714cbfd85397210f199dd456f2b05'),
(5, 'Study Room B', 'Study Room', 25, 'Available', '/images/facilities/dae1dd6031e8a10181d852862a26673d'),
(6, 'Computer Lab 7', 'Laboratory', 40, 'Unavailable', '/images/facilities/4f90ef2f7174f683078a4f64568ddaa3');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL,
  `service_quality` enum('Excellent','Good','Average','Poor') NOT NULL,
  `facility_cleanliness` enum('Excellent','Good','Average','Poor') NOT NULL,
  `comments` text NOT NULL,
  `suggestions` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`id`, `user_id`, `rating`, `service_quality`, `facility_cleanliness`, `comments`, `suggestions`, `created_at`) VALUES
(1, 1, 5, 'Excellent', 'Good', 'asd', 'asd', '2025-10-28 14:35:10');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `status` enum('Pending','Approved','Rejected','Cancelled') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `type`, `date`, `time`, `status`) VALUES
(1, 1, 'Labs', '2025-10-28', '01:00:00', 'Approved'),
(2, 1, 'Library', '2025-10-28', '08:00:00', 'Approved'),
(3, 1, 'Study Room', '2025-10-28', '08:00:00', 'Approved'),
(4, 1, 'Labs', '2025-10-29', '08:00:00', 'Approved'),
(5, 1, 'Labs', '2025-10-28', '08:00:00', 'Approved'),
(6, 1, 'Labs', '2025-10-30', '08:00:00', 'Approved');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facilities`
--
ALTER TABLE `facilities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `facilities`
--
ALTER TABLE `facilities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
