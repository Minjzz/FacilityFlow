-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 30, 2025 at 05:25 AM
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
-- Database: `ifacility`
--

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `capacity` int(11) DEFAULT NULL,
  `occupation` int(11) NOT NULL DEFAULT 0,
  `status` enum('Available','Unavailable','Maintenance','Occupied') DEFAULT 'Available',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `name`, `type`, `capacity`, `occupation`, `status`, `created_at`) VALUES
(1, 'Computer Lab 7', 'Laboratory', 40, 0, 'Available', '2025-10-29 23:50:10'),
(2, 'Computer Lab 6', 'Laboratory', 40, 1, 'Available', '2025-10-30 00:08:07'),
(3, 'Library', 'Library', 75, 1, 'Available', '2025-10-30 00:08:20'),
(4, 'Study Room A', 'Study Room', 40, 1, 'Available', '2025-10-30 00:08:45'),
(5, 'Study Room B', 'Study Room', 40, 0, 'Available', '2025-10-30 00:09:04'),
(6, 'Computer Lab 4', 'Laboratory', 40, 0, 'Available', '2025-10-30 03:55:12');

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
(1, 4, 4, 'Excellent', 'Excellent', 'nice', 'wala', '2025-10-30 00:10:58'),
(2, 1, 3, 'Excellent', 'Average', 'asd', '213', '2025-10-30 03:27:22'),
(3, 4, 5, 'Excellent', 'Excellent', 'nami', 'tani mas tugnaw pa ', '2025-10-30 03:54:23'),
(4, 4, 2, 'Average', 'Poor', 'hindi tugnaw', 'padamuon ang aircon', '2025-10-30 04:16:37');

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `facility_id` int(11) NOT NULL,
  `request_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('Pending','Approved','Rejected','Cancelled','Completed') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `facility_id`, `request_id`, `name`, `type`, `date`, `start_time`, `end_time`, `status`, `created_at`) VALUES
(1, 1, 1, 'REQ-XX9A2PT5', 'Computer Lab 7', 'Laboratory', '2025-10-30', '08:00:00', '11:00:00', 'Completed', '2025-10-30 02:54:00'),
(2, 1, 1, 'REQ-5W4TF46V', 'Computer Lab 7', 'Laboratory', '2025-10-30', '13:00:00', '15:00:00', 'Completed', '2025-10-30 03:04:19'),
(3, 1, 2, 'REQ-U1PAWEYB', 'Computer Lab 6', 'Laboratory', '2025-10-30', '08:00:00', '11:00:00', 'Completed', '2025-10-30 03:21:25'),
(4, 1, 2, 'REQ-JLE99IVL', 'Computer Lab 6', 'Laboratory', '2025-10-30', '13:00:00', '15:00:00', 'Approved', '2025-10-30 03:21:35'),
(5, 1, 3, 'REQ-UPERB9CI', 'Library', 'Library', '2025-10-30', '13:00:00', '15:00:00', 'Approved', '2025-10-30 03:22:59'),
(6, 1, 4, 'REQ-AG00MQY9', 'Study Room A', 'Study Room', '2025-10-30', '08:00:00', '11:00:00', 'Completed', '2025-10-30 03:23:18'),
(7, 1, 4, 'REQ-WM8KWSYX', 'Study Room A', 'Study Room', '2025-10-30', '13:00:00', '15:00:00', 'Approved', '2025-10-30 03:23:38'),
(8, 1, 5, 'REQ-H11WYVEN', 'Study Room B', 'Study Room', '2025-10-30', '13:00:00', '15:00:00', 'Completed', '2025-10-30 03:27:34'),
(9, 4, 1, 'REQ-SSBFSOY5', 'Computer Lab 7', 'Laboratory', '2025-10-30', '13:00:00', '15:00:00', 'Completed', '2025-10-30 03:49:02'),
(11, 4, 1, 'REQ-A6ZL7G8P', 'Computer Lab 7', 'Laboratory', '2025-10-30', '08:00:00', '11:00:00', 'Completed', '2025-10-30 04:11:53'),
(12, 4, 5, 'REQ-ELTL4H0S', 'Study Room B', 'Study Room', '2025-10-30', '13:00:00', '15:00:00', 'Completed', '2025-10-30 04:12:28'),
(13, 4, 6, 'REQ-7K4YETWC', 'Computer Lab 4', 'Laboratory', '2025-10-30', '13:00:00', '15:00:00', 'Completed', '2025-10-30 04:15:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `id_num` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `year` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Student','Admin') DEFAULT 'Student',
  `status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `id_num`, `name`, `year`, `email`, `password`, `role`, `status`, `created_at`) VALUES
(1, '04-2324-033562', 'Sonny Wagas', '3rd Year', 'sonny@phinmaed.com', 'sonny123', 'Student', 'Active', '2025-10-29 23:38:31'),
(3, '', 'Marlon Pogi', '', 'marlon@phinmaed.com', 'marlon123', 'Admin', 'Active', '2025-10-29 23:38:31'),
(4, '04-2324-033562', 'Sean Peniero', '1st Year', 'sean@phinmaed.com', 'sean123', 'Student', 'Active', '2025-10-29 23:59:03'),
(6, '04-2324-033562', 'Kurth Zereso', '3rd Year', 'kurth@gmail.com', 'kurth123', 'Student', 'Active', '2025-10-30 04:05:31');

--
-- Indexes for dumped tables
--

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
  ADD KEY `user_id` (`user_id`),
  ADD KEY `facility_id` (`facility_id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `facilities`
--
ALTER TABLE `facilities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`facility_id`) REFERENCES `facilities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
